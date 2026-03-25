package com.moa.chat.service;

import java.util.List;

import org.springframework.stereotype.Component;

import com.moa.chat.domain.ChatKnowledge;

@Component
public class ChatKnowledgeCache {

	private volatile List<ChatKnowledge> docs = List.of();

	public synchronized void reload(List<ChatKnowledge> list) {
		docs = list;
	}

	public List<ChatKnowledge> get() {
		return docs;
	}
}
