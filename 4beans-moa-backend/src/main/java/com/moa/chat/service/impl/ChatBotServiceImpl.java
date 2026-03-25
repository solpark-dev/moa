package com.moa.chat.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.moa.global.common.prompt.ChatFallbackReplies;
import com.moa.chat.repository.ChatKnowledgeDao;
import com.moa.chat.domain.ChatKnowledge;
import com.moa.chat.domain.ChatRoute;
import com.moa.chat.dto.request.ChatRequest;
import com.moa.chat.dto.response.ChatResponse;
import com.moa.chat.service.ChatBotService;
import com.moa.chat.service.ChatRoutingService;

@Service
public class ChatBotServiceImpl implements ChatBotService {

	private final ChatKnowledgeDao chatKnowledgeDao;
	private final ChatRoutingService chatRoutingService;

	public ChatBotServiceImpl(ChatKnowledgeDao chatKnowledgeDao, ChatRoutingService chatRoutingService) {
		this.chatKnowledgeDao = chatKnowledgeDao;
		this.chatRoutingService = chatRoutingService;
	}

	@Override
	public ChatResponse chat(ChatRequest request) {
		String text = request.getMessage();

		ChatRoute route = chatRoutingService.route(text);

		String keyword = route.keyword();
		if (keyword == null || keyword.isBlank()) {
			keyword = text;
		}

		List<ChatKnowledge> hits = chatKnowledgeDao.searchByKeyword(keyword);

		if (hits == null || hits.isEmpty()) {
			String fallback = ChatFallbackReplies.fallback(route.category());
			return ChatResponse.builder().reply(fallback).fromKnowledge(false).category(route.category())
					.knowledgeId(null).build();
		}

		ChatKnowledge top = hits.get(0);

		return ChatResponse.builder().reply(top.getAnswer()).fromKnowledge(true).category(top.getCategory())
				.knowledgeId(top.getId()).build();
	}
}
