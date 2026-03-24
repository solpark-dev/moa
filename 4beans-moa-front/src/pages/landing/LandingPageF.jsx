import React from "react";
import { Link } from "react-router-dom";
import { Play, Info, Plus } from "lucide-react";
import { MOCK_PARTIES } from "@/constants/constants";

export default function LandingPageF() {
    return (
        <div className="min-h-screen bg-[#141414] text-white font-sans overflow-x-hidden">
            {/* Navbar Mock (Transparent) */}
            <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-12 py-4 bg-gradient-to-b from-black/80 to-transparent">
                <div className="text-red-600 font-bold text-3xl tracking-tighter cursor-pointer">MOA</div>
                <div className="flex gap-6 text-sm font-medium text-gray-300">
                    <span className="cursor-pointer hover:text-white transition">홈</span>
                    <span className="cursor-pointer hover:text-white transition">시리즈</span>
                    <span className="cursor-pointer hover:text-white transition">영화</span>
                    <span className="cursor-pointer hover:text-white transition">NEW! 요즘 대세 콘텐츠</span>
                </div>
            </div>

            {/* Hero Banner (Netflix Style) */}
            <div className="relative h-[80vh] w-full">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
                </div>

                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 pl-4 md:pl-12 max-w-2xl w-full z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-white/20 backdrop-blur px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Originals</div>
                        <div className="text-red-600 font-bold text-sm tracking-widest">N SERIES</div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none drop-shadow-2xl">
                        함께 보는 즐거움<br />
                        <span className="text-red-600">오직 MoA에서.</span>
                    </h1>

                    <p className="text-lg text-gray-200 mb-8 font-medium drop-shadow-md max-w-lg">
                        전 세계의 다양한 드라마, 영화, 다큐멘터리를 지금 바로 시작하세요.
                        파티원들과 함께라면 부담은 줄어듭니다.
                    </p>

                    <div className="flex flex-row gap-4">
                        <Link to="/party" className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded hover:bg-white/90 transition font-bold text-lg">
                            <Play className="fill-black w-6 h-6" />
                            파티 검색
                        </Link>
                        <Link to="/party/create" className="flex items-center gap-2 bg-gray-500/70 backdrop-blur text-white px-8 py-3 rounded hover:bg-gray-500/50 transition font-bold text-lg">
                            <Info className="w-6 h-6" />
                            상세 정보
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content Rows */}
            <div className="pl-4 md:pl-12 pb-20 -mt-24 relative z-20 space-y-12">

                {/* Row 1 */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 group cursor-pointer hover:text-red-500 transition">
                        지금 뜨는 콘텐츠
                        <span className="text-xs opacity-0 group-hover:opacity-100 transition text-cyan-400 translate-x-0 group-hover:translate-x-2 duration-300">모두 보기 &gt;</span>
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide">
                        {MOCK_PARTIES.map((party, i) => (
                            <div key={i} className="flex-none w-64 aspect-video bg-gray-800 rounded-md overflow-hidden relative group cursor-pointer hover:scale-105 hover:z-30 transition duration-300 origin-center">
                                <div className={`w-full h-full ${i % 2 === 0 ? 'bg-red-900' : 'bg-blue-900'} flex items-center justify-center`}>
                                    <span className="font-bold text-2xl opacity-50">{party.platform}</span>
                                </div>

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
                                    <h3 className="font-bold text-sm mb-1">{party.title}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-green-400 font-bold">98% 일치</span>
                                        <div className="bg-white rounded-full p-1 hover:bg-gray-200">
                                            <Plus className="w-3 h-3 text-black" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Row 2 */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">시청 중인 콘텐츠</h2>
                    <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide">
                        {[1, 2, 3, 4, 5].map((item, i) => (
                            <div key={i} className="flex-none w-64 aspect-video bg-gray-800 rounded-md overflow-hidden relative cursor-pointer opacity-60 hover:opacity-100 transition">
                                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                    <span className="text-4xl">📺</span>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-600">
                                    <div className="h-full bg-red-600" style={{ width: `${Math.random() * 80 + 10}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
