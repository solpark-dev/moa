package com.moa.push.service;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.moa.push.dto.response.PushResponse;

public interface PushSseService {
	SseEmitter subscribe(String receiverId, int initialUnreadCount);

	void sendToUser(String receiverId, PushResponse push, int unreadCount);
}
