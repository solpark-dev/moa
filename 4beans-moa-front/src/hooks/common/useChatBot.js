// src/hooks/common/useChatBot.js
import { useCallback } from "react";
import { sendChatMessage } from "@/api/chatApi";
import { useChatBotStore } from "@/store/chatBotStore";

const createMessage = (role, content) => {
  const now = new Date().toISOString();
  const id = `${role}-${now}-${Math.random().toString(36).slice(2, 8)}`;
  return { id, role, content, createdAt: now };
};

export const useChatBot = () => {
  const isOpen = useChatBotStore((state) => state.isOpen);
  const messages = useChatBotStore((state) => state.messages);
  const input = useChatBotStore((state) => state.input);
  const loading = useChatBotStore((state) => state.loading);

  const toggleOpenStore = useChatBotStore((state) => state.toggleOpen);
  const setInput = useChatBotStore((state) => state.setInput);
  const pushMessage = useChatBotStore((state) => state.pushMessage);
  const setLoading = useChatBotStore((state) => state.setLoading);

  const toggleChatBot = useCallback(() => {
    const hasMessages = messages.length > 0;
    toggleOpenStore();

    if (!isOpen && !hasMessages) {
      pushMessage(
        createMessage(
          "bot",
          "안녕! 나는 MoA ChatBot이야 😊  아래 추천 질문을 눌러봐!"
        )
      );
    }
  }, [isOpen, messages.length, toggleOpenStore, pushMessage]);

  const handleInputChange = useCallback(
    (value) => {
      setInput(value);
    },
    [setInput]
  );

  const sendMessage = useCallback(
    async (forcedMessage) => {
      const text = forcedMessage ?? input.trim();
      if (!text || loading) return;

      pushMessage(createMessage("user", text));

      if (!forcedMessage) setInput("");

      setLoading(true);

      try {
        const chat = await sendChatMessage(text);
        const reply = chat?.reply ?? "응답을 가져오지 못했어!";

        pushMessage(createMessage("bot", reply));
      } catch (e) {
        pushMessage(
          createMessage("bot", "서버 오류가 발생했어. 잠시 후 다시 시도해줘!")
        );
      } finally {
        setLoading(false);
      }
    },
    [input, loading, pushMessage, setInput, setLoading]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key !== "Enter" || event.shiftKey) return;
      event.preventDefault();
      sendMessage();
    },
    [sendMessage]
  );

  return {
    isOpen,
    messages,
    input,
    loading,
    toggleChatBot,
    handleInputChange,
    handleKeyDown,
    sendMessage,
  };
};
