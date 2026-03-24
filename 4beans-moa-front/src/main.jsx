import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./assets/global.css";
import App from "./App.jsx";
import ChatBotWidget from "@/components/common/ChatBotWidget";

// fetchSession은 authStore의 onRehydrateStorage에서 자동 호출됨

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <ChatBotWidget />
  </BrowserRouter>
);
