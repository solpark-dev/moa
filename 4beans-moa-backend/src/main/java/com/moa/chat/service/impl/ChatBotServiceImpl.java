package com.moa.chat.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.moa.chat.domain.ChatKnowledge;
import com.moa.chat.domain.ChatRoute;
import com.moa.chat.dto.request.ChatRequest;
import com.moa.chat.dto.response.ChatResponse;
import com.moa.chat.repository.ChatKnowledgeDao;
import com.moa.chat.service.ChatBotService;
import com.moa.chat.service.ChatRoutingService;
import com.moa.chat.service.UserContextBuilder;
import com.moa.global.common.prompt.ChatFallbackReplies;
import com.moa.global.common.prompt.ChatPromptTemplate;
import com.moa.global.common.prompt.SystemPrompt;
import com.moa.global.service.ai.LlmChatClient;

import reactor.core.publisher.Mono;

@Service
public class ChatBotServiceImpl implements ChatBotService {

	private static final Logger log = LoggerFactory.getLogger(ChatBotServiceImpl.class);

	private final ChatKnowledgeDao chatKnowledgeDao;
	private final ChatRoutingService chatRoutingService;
	private final LlmChatClient llmChatClient;
	private final UserContextBuilder userContextBuilder;

	public ChatBotServiceImpl(ChatKnowledgeDao chatKnowledgeDao,
			ChatRoutingService chatRoutingService,
			LlmChatClient llmChatClient,
			UserContextBuilder userContextBuilder) {
		this.chatKnowledgeDao = chatKnowledgeDao;
		this.chatRoutingService = chatRoutingService;
		this.llmChatClient = llmChatClient;
		this.userContextBuilder = userContextBuilder;
	}

	@Override
	public ChatResponse chat(ChatRequest request) {
		String text = request.getMessage();
		ChatRoute route = chatRoutingService.route(text);
		String keyword = (route.keyword() == null || route.keyword().isBlank()) ? text : route.keyword();

		List<ChatKnowledge> hits = chatKnowledgeDao.searchByKeyword(keyword);

		// 로그인 유저면 실데이터 컨텍스트 생성, 비로그인이면 null
		String userContext = buildUserContext();

		// 시스템 프롬프트: 로그인 유저면 실데이터 주입, 아니면 일반 FAQ 프롬프트
		String systemPrompt = ChatPromptTemplate.buildSupportSystemPrompt(
				SystemPrompt.MOA_CHATBOT.content(), userContext);

		if (hits == null || hits.isEmpty()) {
			return chatWithoutKb(text, route, systemPrompt);
		}
		return chatWithKb(text, route, hits, systemPrompt);
	}

	// ── KB 히트 있음 ────────────────────────────────────────────────

	private ChatResponse chatWithKb(String text, ChatRoute route,
			List<ChatKnowledge> hits, String systemPrompt) {
		String kbContext = buildKbContext(hits);
		String userPrompt = ChatPromptTemplate.build(text, kbContext);
		String fallback = hits.get(0).getAnswer();

		String reply = callLlm(systemPrompt, userPrompt, fallback);

		return ChatResponse.builder()
				.reply(reply)
				.fromKnowledge(true)
				.category(hits.get(0).getCategory())
				.knowledgeId(hits.get(0).getId())
				.build();
	}

	// ── KB 히트 없음 ────────────────────────────────────────────────

	private ChatResponse chatWithoutKb(String text, ChatRoute route, String systemPrompt) {
		String userPrompt = ChatPromptTemplate.build(text, null);
		String fallback = ChatFallbackReplies.fallback(route.category());

		String reply = callLlm(systemPrompt, userPrompt, fallback);

		return ChatResponse.builder()
				.reply(reply)
				.fromKnowledge(false)
				.category(route.category())
				.knowledgeId(null)
				.build();
	}

	// ── LLM 호출 + fallback ────────────────────────────────────────

	private String callLlm(String systemPrompt, String userPrompt, String fallback) {
		return llmChatClient.chat(systemPrompt, userPrompt)
				.onErrorResume(e -> {
					log.warn("[ChatBot] LLM 호출 실패 — fallback 사용. 원인: {}", e.getMessage());
					return Mono.just(fallback);
				})
				.block();
	}

	// ── 유저 컨텍스트 (로그인 여부 판단) ──────────────────────────────

	private String buildUserContext() {
		String userId = resolveUserId();
		if (userId == null) return null;

		String context = userContextBuilder.build(userId);
		return context.isBlank() ? null : context;
	}

	private String resolveUserId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated()) return null;
		Object principal = auth.getPrincipal();
		if (principal == null || "anonymousUser".equals(principal)) return null;
		return auth.getName();
	}

	// ── KB 컨텍스트 조합 ───────────────────────────────────────────

	/** 상위 3개 KB 항목을 Q&A 형식으로 합쳐 컨텍스트 생성 */
	private String buildKbContext(List<ChatKnowledge> hits) {
		return hits.stream()
				.limit(3)
				.map(k -> "Q: " + k.getQuestion() + "\nA: " + k.getAnswer())
				.collect(Collectors.joining("\n\n"));
	}
}
