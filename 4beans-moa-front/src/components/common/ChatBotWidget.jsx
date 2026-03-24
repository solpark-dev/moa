import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useChatBot } from "@/hooks/common/useChatBot";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useThemeStore } from "@/store/themeStore";
import { MessageCircle, ChevronUp, X, Bot, User, Send } from "lucide-react";

// Theme color configurations for chatbot
const themeColors = {
  classic: {
    primary: "bg-[#635bff] hover:bg-[#5851e8]",
    header: "bg-[#635bff]",
    accent: "#635bff",
  },
  dark: {
    primary: "bg-[#635bff] hover:bg-[#5851e8]",
    header: "bg-[#635bff]",
    accent: "#635bff",
  },
  pop: {
    primary: "bg-pink-500 hover:bg-pink-600 border border-gray-200",
    header: "bg-pink-500",
    accent: "#ec4899",
  },
  christmas: {
    primary: "bg-[#c41e3a] hover:bg-[#a51830]",
    header: "bg-[#c41e3a]",
    accent: "#c41e3a",
  },
};

const ChatBotWidget = () => {
  const location = useLocation();
  const {
    isOpen,
    messages,
    input,
    loading,
    toggleChatBot,
    handleInputChange,
    handleKeyDown,
    sendMessage,
  } = useChatBot();
  const { theme } = useThemeStore();

  const bottomRef = useRef(null);

  const colors = themeColors[theme] || themeColors.classic;

  // Hide chatbot on admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  // Scroll to top visibility state
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const toggleScrollTop = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleScrollTop);
    return () => window.removeEventListener("scroll", toggleScrollTop);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Don't render on admin routes
  if (isAdminRoute) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Scroll to Top Button - Above Chatbot */}
      <AnimatePresence>
        {showScrollTop && !isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className={`w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${theme === "dark"
              ? "bg-gray-800 text-white border border-gray-600 hover:bg-gray-700"
              : theme === "pop"
                ? "bg-white text-pink-500 border border-gray-200 hover:bg-pink-50"
                : theme === "christmas"
                  ? "bg-white text-[#c41e3a] border border-gray-200 hover:bg-red-50"
                  : "bg-white text-[#635bff] border border-gray-200 hover:bg-indigo-50"
              }`}
            title="맨 위로 이동"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chatbot Card */}
      {isOpen && (
        <Card className="w-[360px] h-[520px] flex flex-col rounded-3xl shadow-xl border border-slate-200/80 bg-white/95 backdrop-blur-sm absolute bottom-20 right-0">
          <CardHeader className={`flex flex-row items-center justify-between px-4 py-3 border-b border-slate-100 rounded-t-3xl ${colors.header} text-white`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-2xl bg-white/10 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-sm font-semibold tracking-tight">
                  MoA AI ChatBot
                </CardTitle>
                <span className="text-[11px] text-emerald-50">
                  구독·결제·파티·계정 무엇이든 물어봐
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-7 h-7 text-white hover:bg-white/15 hover:text-white rounded-full"
              onClick={toggleChatBot}
              aria-label="ChatBot 닫기"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex flex-col flex-1 p-0">
            <div className="px-4 py-2 flex gap-2 flex-wrap border-b border-slate-100 bg-slate-50/80">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => sendMessage("구독상품 안내해줘")}
                className="h-7 rounded-full border-slate-200 bg-white text-[11px] text-slate-700 hover:bg-[#03c75a]/5 hover:border-[#03c75a]"
              >
                구독상품
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => sendMessage("결제 관리 알려줘")}
                className="h-7 rounded-full border-slate-200 bg-white text-[11px] text-slate-700 hover:bg-[#03c75a]/5 hover:border-[#03c75a]"
              >
                결제관리
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => sendMessage("회원 문의")}
                className="h-7 rounded-full border-slate-200 bg-white text-[11px] text-slate-700 hover:bg-[#03c75a]/5 hover:border-[#03c75a]"
              >
                회원문의
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => sendMessage("기타 문의")}
                className="h-7 rounded-full border-slate-200 bg-white text-[11px] text-slate-700 hover:bg-[#03c75a]/5 hover:border-[#03c75a]"
              >
                기타문의
              </Button>
            </div>

            <ScrollArea
              className="px-4 py-3 bg-slate-50/60"
              style={{ height: "350px" }}
            >
              <div className="flex flex-col gap-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {m.role === "bot" && (
                        <div className={`w-8 h-8 rounded-full ${colors.header} flex items-center justify-center text-white shrink-0`}>
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`px-3 py-2 text-sm leading-snug rounded-2xl shadow-sm ${m.role === "user"
                          ? `${colors.header} text-white rounded-br-sm`
                          : "bg-white text-slate-900 rounded-bl-sm border border-slate-100"
                          }`}
                      >
                        {m.content}
                      </div>

                      {m.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-slate-100 px-4 py-3 flex flex-col gap-2 bg-white rounded-b-3xl">
              <div className="flex items-center gap-2">
                <Input
                  value={input}
                  disabled={loading}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="무엇이 궁금해?"
                  aria-label="ChatBot 입력"
                  className="text-sm h-9 border-slate-200 focus-visible:ring-[#03c75a] focus-visible:ring-offset-0"
                />
                <Button
                  type="button"
                  size="icon"
                  disabled={loading || !input.trim()}
                  onClick={() => sendMessage()}
                  className={`h-9 w-9 rounded-full ${colors.primary} text-white`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-[10px] text-slate-400">
                MoA가 제공하는 자동 응답으로, 실제 약관·결제 내역과 차이가 있을
                수 있어.
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!isOpen && (
        <Button
          type="button"
          size="icon"
          className={`w-16 h-16 rounded-full shadow-xl ${colors.primary} text-white flex items-center justify-center`}
          onClick={toggleChatBot}
          aria-label="MoA ChatBot 열기"
        >
          <MessageCircle className="w-7 h-7" />
        </Button>
      )}
    </div>
  );
};

export default ChatBotWidget;
