package com.moa.chat.service;

import com.moa.chat.dto.request.ChatRequest;
import com.moa.chat.dto.response.ChatResponse;

public interface ChatBotService {
	ChatResponse chat(ChatRequest request);
}
