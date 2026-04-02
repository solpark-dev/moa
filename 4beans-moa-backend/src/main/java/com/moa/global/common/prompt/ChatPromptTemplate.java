package com.moa.global.common.prompt;

public class ChatPromptTemplate {

	/**
	 * Phase 1 — FAQ: KB 컨텍스트만 사용 (비로그인 포함).
	 */
	public static String build(String question, String kbContext) {
		if (kbContext == null || kbContext.isBlank()) {
			kbContext = "관련 지식을 찾지 못했어. 서비스 규칙과 일반적인 상식에 기반해 조심스럽게 답변해줘.";
		}

		return """
				아래는 MoA 지식베이스에서 검색된 내용이야. 신뢰할 수 있는 정보라면 이를 최우선으로 사용해.
				[지식베이스]
				%s

				[사용자 질문]
				%s

				답변 규칙:
				- 한국어로 3~5문장 안에서 간결하게 답변해.
				- 서비스 내 메뉴 경로가 있으면 '마이페이지 > 내 정보'처럼 경로를 함께 알려줘.
				- 확실하지 않은 내용은 추측하지 말고 모른다고 말한 뒤, 사용자가 어디서 더 확인할 수 있을지 안내해.
				""".formatted(kbContext, question);
	}

	/**
	 * Phase 2 — 고객 상담: KB 컨텍스트 + 유저 실데이터를 시스템 프롬프트에 주입.
	 * LlmChatClient.chat(systemPrompt, userPrompt) 중 systemPrompt에 사용.
	 */
	public static String buildSupportSystemPrompt(String baseSystemPrompt, String userContext) {
		if (userContext == null || userContext.isBlank()) {
			return baseSystemPrompt;
		}
		return baseSystemPrompt + "\n\n" + """
				아래는 현재 대화 중인 로그인 사용자의 실제 데이터야.
				사용자가 자신의 구독·결제·파티에 대해 질문하면 이 데이터를 기반으로 구체적으로 답해줘.
				데이터에 없는 내용은 절대 추측하지 마.

				[사용자 데이터]
				""" + userContext;
	}
}
