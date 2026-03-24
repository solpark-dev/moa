package com.moa.service.push;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.moa.dto.push.response.PushResponse;

public interface PushSseService {
	SseEmitter subscribe(String receiverId, int initialUnreadCount);

	void sendToUser(String receiverId, PushResponse push, int unreadCount);
}
