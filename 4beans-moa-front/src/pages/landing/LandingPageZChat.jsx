import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

/**
 * Variant M - "Chat Stream"
 * Design Direction:
 * - Familiar Mobile Messenger UI (KakaoTalk/iMessage style)
 * - Storytelling through dialogue bubbles
 * - "Typing..." indicator animation for realism
 * - Staggered message appearance
 */

// --- Chat Components ---

const TypingIndicator = () => (
    <div className="flex items-center gap-1 bg-gray-200 w-fit px-4 py-3 rounded-[1.5rem] rounded-tl-sm">
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-gray-400 rounded-full" />
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-gray-400 rounded-full" />
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-gray-400 rounded-full" />
    </div>
);

const ChatBubble = ({ msg, isLast }) => {
    const isMe = msg.sender === "me";
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 15 } },
            }}
            className={`flex flex-col ${isMe ? "items-end" : "items-start"} mb-4`}
        >
            {!isMe && msg.sender !== "system" && <span className="text-xs text-gray-500 mb-1 ml-2">{msg.sender}</span>}

            {msg.type === "text" && (
                <div className={`max-w-[80%] px-5 py-3 rounded-[1.5rem] text-[15px] leading-relaxed shadow-sm
          ${isMe
                        ? "bg-blue-500 text-white rounded-tr-sm"
                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
                    }
        `}>
                    {msg.content}
                </div>
            )}

            {msg.type === "system" && (
                <div className="flex items-center justify-center gap-2 my-4 w-full">
                    <div className="h-px bg-gray-200 flex-1" />
                    <span className="text-xs text-gray-400 font-medium px-2 flex items-center gap-1">
                        <Sparkles size={12} className="text-blue-500" /> {msg.content}
                    </span>
                    <div className="h-px bg-gray-200 flex-1" />
                </div>
            )}

            {msg.type === "action" && (
                <Link to={msg.link} className="mt-2">
                    <motion.button whileTap={{ scale: 0.95 }} className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-colors">
                        {msg.content} <ArrowRight size={16} />
                    </motion.button>
                </Link>
            )}
        </motion.div>
    );
};


const messages = [
    { id: 1, sender: "친구1", type: "text", content: "아 넷플릭스 또 가격 올랐네;; 진짜 너무 비싼 거 아님?" },
    { id: 2, sender: "친구2", type: "text", content: "인정.. 디즈니플러스랑 유튜브까지 하니까 한 달에 4만원 그냥 넘음 ㅠㅠ 끊을 수도 없고" },
    { id: 3, sender: "me", type: "text", content: "헐 아직도 다 제값 내고 봄? ㅋㅋㅋ" },
    { id: 4, sender: "친구1", type: "text", content: "? 님은 뭐 공짜로 봄?" },
    { id: 5, sender: "me", type: "text", content: "ㄴㄴ MoA 쓰셈. 나 넷플 4K 4천원에 봄." },
    { id: 6, sender: "친구2", type: "text", content: "엥 그게 됨? 사기 아님? 공유 막히지 않았음?" },
    { id: 7, sender: "me", type: "text", content: "MoA는 안전하게 파티원 모아서 합법적으로 n빵하는 거임. 먹튀 보장도 다 해줌." },
    { id: 8, sender: "system", type: "system", content: "MoA의 '에스크로 안전 결제'가 보호 중입니다." },
    { id: 9, sender: "me", type: "text", content: "그리고 결제하면 5초 만에 바로 볼 수 있음. 귀찮은 거 1도 없음." },
    { id: 10, sender: "친구1", type: "text", content: "와 대박이네... 나도 당장 갈아탄다. 어디로 가면 됨?" },
    { id: 11, sender: "me", type: "text", content: "👇 여기로 ㄱㄱ 첫 달은 더 쌈" },
    { id: 12, sender: "me", type: "action", content: "MoA 파티 구경하러 가기", link: "/party" },
];


export default function LandingPageChat() {
    const [visibleCount, setVisibleCount] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (visibleCount < messages.length) {
            const nextMsg = messages[visibleCount];
            // me(MoA)가 말할 때만 타이핑 효과 주기
            if (nextMsg.sender === 'me' && nextMsg.type === 'text') {
                setIsTyping(true);
                setTimeout(() => {
                    setIsTyping(false);
                    setVisibleCount(c => c + 1);
                }, 1000 + Math.random() * 500); // 1~1.5초 랜덤 타이핑 시간
            } else {
                // 다른 사람은 바로바로 뜸
                setTimeout(() => {
                    setVisibleCount(c => c + 1);
                }, 600);
            }
        }
    }, [visibleCount]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [visibleCount, isTyping]);

    return (
        <div className="min-h-screen bg-[#F2F4F7] font-sans flex justify-center">
            <div className="w-full max-w-md bg-[#E8EAF0] shadow-2xl md:my-10 md:rounded-[2.5rem] overflow-hidden flex flex-col relative border-8 border-white">

                {/* Header */}
                <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-black italic">M</div>
                        <div>
                            <h1 className="font-bold text-lg">💸 구독료 절약방 (3)</h1>
                            <p className="text-xs text-gray-500 flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500" /> MoA 안전 인증</p>
                        </div>
                    </div>
                    <Link to="/login" className="text-blue-500 font-bold text-sm">나가기</Link>
                </div>

                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 scroll-smooth no-scrollbar relative bg-[url('https://www.transparenttextures.com/patterns/subtle-dots.png')]">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-100/50 to-transparent pointer-events-none" />
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                        className="relative z-10"
                    >
                        {messages.slice(0, visibleCount).map((msg, i) => (
                            <ChatBubble key={msg.id} msg={msg} isLast={i === visibleCount - 1} />
                        ))}

                        <AnimatePresence>
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="flex justify-end mb-4"
                                >
                                    <TypingIndicator />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Input Area (Fake) */}
                <div className="bg-white p-4 border-t border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full text-gray-400 flex items-center justify-center font-bold">+</div>
                    <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-400">
                        지금 MoA 시작하고 75% 할인받기...
                    </div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full text-white flex items-center justify-center">↑</div>
                </div>

            </div>
        </div>
    );
}