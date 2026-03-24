package com.moa.service.push.impl;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.moa.dto.push.response.PushResponse;
import com.moa.service.push.PushSseService;

@Service
public class PushSseServiceImpl implements PushSseService {

	private final ConcurrentHashMap<String, CopyOnWriteArrayList<SseEmitter>> emitters = new ConcurrentHashMap<>();

	@Override
	public SseEmitter subscribe(String receiverId, int initialUnreadCount) {
		SseEmitter emitter = new SseEmitter(0L);

		emitters.computeIfAbsent(receiverId, k -> new CopyOnWriteArrayList<>()).add(emitter);

		emitter.onCompletion(() -> remove(receiverId, emitter));
		emitter.onTimeout(() -> remove(receiverId, emitter));
		emitter.onError((e) -> remove(receiverId, emitter));

		try {
			emitter.send(SseEmitter.event().name("connected").data(Map.of("ok", true)));
			emitter.send(SseEmitter.event().name("unread-count").data(Map.of("count", initialUnreadCount)));
		} catch (IOException e) {
			remove(receiverId, emitter);
		}

		return emitter;
	}

	@Override
	public void sendToUser(String receiverId, PushResponse push, int unreadCount) {
		CopyOnWriteArrayList<SseEmitter> list = emitters.get(receiverId);
		if (list == null || list.isEmpty())
			return;

		Iterator<SseEmitter> it = list.iterator();
		while (it.hasNext()) {
			SseEmitter emitter = it.next();
			try {
				emitter.send(SseEmitter.event().name("push").data(push));
				emitter.send(SseEmitter.event().name("unread-count").data(Map.of("count", unreadCount)));
			} catch (Exception e) {
				remove(receiverId, emitter);
			}
		}
	}

	private void remove(String receiverId, SseEmitter emitter) {
		CopyOnWriteArrayList<SseEmitter> list = emitters.get(receiverId);
		if (list == null)
			return;
		list.remove(emitter);
		if (list.isEmpty())
			emitters.remove(receiverId);
	}
}
