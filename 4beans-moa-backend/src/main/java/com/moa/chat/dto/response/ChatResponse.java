package com.moa.chat.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ChatResponse {
	private String reply;
	private boolean fromKnowledge;
	private String category;
	private Long knowledgeId;
}
