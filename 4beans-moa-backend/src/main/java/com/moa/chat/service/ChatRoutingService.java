package com.moa.chat.service;

import com.moa.chat.domain.ChatRoute;

public interface ChatRoutingService {

	ChatRoute route(String text);
}
