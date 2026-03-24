// src/api/chatApi.js
import httpClient from "./httpClient";

export const sendChatMessage = async (message) => {
  const res = await httpClient.post("/chatbot/message", { message });

  const api = res.data ?? res;
  const chat = api.data ?? api;

  return chat;
};
