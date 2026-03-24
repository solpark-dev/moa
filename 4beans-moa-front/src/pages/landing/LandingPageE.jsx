import React from "react";
import { Link } from "react-router-dom";
import { Search, Sparkles, Calendar } from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

export default function LandingPageE() {
    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">
            {/* Hero Section: Reusing PartyList Style */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-b border-slate-200/60 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-slate-200 text-sm font-semibold text-slate-600 mb-8 shadow-sm animate-fade-in-up">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span>지금 가입하면 첫 달 수수료 무료!</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                        원하는 구독, <br className="sm:hidden" />
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            딱 반값에 시작하세요
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        넷플릭스, 디즈니+, 유튜브 프리미엄.<br />
                        검증된 파티원들과 함께 안전하게 나눠 내세요.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/party"
                            className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-200"
                        >
                            파티 찾아보기
                        </Link>
                        <Link
                            to="/party/create"
                            className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all"
                        >
                            직접 파티 만들기
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mock Search Interface */}
            <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-10 mb-16">
                <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-4">
                    <Search className="w-6 h-6 text-slate-400 ml-2" />
                    <div className="flex-1 text-slate-400 text-lg">찾으시는 OTT 서비스가 있나요?</div>
                    <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition">검색</button>
                </div>
            </div>

            {/* Popular Parties Grid (Visual) */}
            <div className="max-w-7xl mx-auto px-6 mb-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">🔥 실시간 인기 파티</h2>
                    <Link to="/party" className="text-blue-600 font-semibold hover:underline">더보기</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_PARTIES.slice(0, 3).map((party, index) => (
                        <div key={index} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer">
                            {/* Card Image Area */}
                            <div className="relative h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                                <div className={`absolute inset-0 opacity-10 ${party.platform === 'NETFLIX' ? 'bg-red-500' :
                                        party.platform === 'DISNEY' ? 'bg-blue-900' : 'bg-red-600'
                                    }`}></div>
                                <span className="text-4xl font-black text-slate-300 group-hover:scale-110 transition-transform">{party.platform}</span>

                                <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                                    모집중
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{party.title}</h3>
                                <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                                    <Calendar className="w-4 h-4" />
                                    <span>오늘 시작 가능</span>
                                </div>

                                <div className="flex items-end justify-between border-t border-slate-100 pt-4">
                                    <div className="text-sm text-slate-500">
                                        <span className="text-slate-900 font-bold">{party.currentMembers}</span> / {party.maxMembers}명
                                    </div>
                                    <div>
                                        <span className="text-lg font-extrabold text-slate-900">{party.price}</span>
                                        <span className="text-sm text-slate-500 font-medium">원 / 월</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
