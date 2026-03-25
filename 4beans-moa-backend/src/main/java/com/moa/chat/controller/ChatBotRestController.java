package com.moa.chat.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moa.global.common.exception.ApiResponse;
import com.moa.chat.dto.request.ChatRequest;
import com.moa.chat.dto.response.ChatResponse;
import com.moa.chat.service.ChatBotService;

@RestController
@RequestMapping("/api/chatbot")
public class ChatBotRestController {

	private final ChatBotService chatBotService;

	public ChatBotRestController(ChatBotService chatBotService) {
		this.chatBotService = chatBotService;
	}

	@PostMapping("/message")
	public ApiResponse<ChatResponse> message(@Validated @RequestBody ChatRequest req) {
		ChatResponse reply = chatBotService.chat(req);
		return ApiResponse.success(reply);
	}
}
