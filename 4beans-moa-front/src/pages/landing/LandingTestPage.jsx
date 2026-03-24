import React from "react";
import { Link } from "react-router-dom";

export default function LandingTestPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10">
            <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-2xl w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    랜딩 페이지 A/B/C/D/E/F 테스트
                </h1>
                <p className="text-gray-600 mb-8">
                    원하는 디자인 버전을 선택하여 미리보기해 보세요.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        to="/"
                        className="block w-full py-4 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition duration-200 col-span-1 md:col-span-2"
                    >
                        오리지널 (현재)
                    </Link>

                    <Link
                        to="/landing/a"
                        className="block w-full py-6 px-6 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg shadow-md transition duration-200"
                    >
                        Variant A<br />
                        <span className="text-sm font-normal opacity-70">모던 & 볼드 (다크)</span>
                    </Link>

                    <Link
                        to="/landing/b"
                        className="block w-full py-6 px-6 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold rounded-lg shadow-md transition duration-200"
                    >
                        Variant B<br />
                        <span className="text-sm font-normal opacity-70">소프트 & 신뢰 (라이트)</span>
                    </Link>

                    <Link
                        to="/landing/c"
                        className="block w-full py-6 px-6 bg-white border-2 border-gray-200 hover:border-gray-400 text-gray-900 font-semibold rounded-lg shadow-sm transition duration-200"
                    >
                        Variant C<br />
                        <span className="text-sm font-normal opacity-70">미니멀 & 클린</span>
                    </Link>

                    <Link
                        to="/landing/d"
                        className="block w-full py-6 px-6 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-lg shadow-md border border-gray-200 transition duration-200"
                    >
                        Variant D<br />
                        <span className="text-sm font-normal opacity-70">팝 & 바이브런트</span>
                    </Link>

                    <Link
                        to="/landing/e"
                        className="block w-full py-6 px-6 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-slate-800 font-bold rounded-lg shadow-md border border-slate-200 transition duration-200"
                    >
                        Variant E<br />
                        <span className="text-sm font-normal opacity-70">파티 리스트 스타일 (앱 느낌)</span>
                    </Link>

                    <Link
                        to="/landing/f"
                        className="block w-full py-6 px-6 bg-black hover:bg-gray-900 text-red-600 font-bold rounded-lg shadow-md border border-gray-800 transition duration-200"
                    >
                        Variant F<br />
                        <span className="text-sm font-normal text-gray-400">스트리밍 서비스 스타일 (OTT)</span>
                    </Link>

                    <Link
                        to="/landing/g"
                        className="block w-full py-6 px-6 bg-slate-950 hover:bg-slate-900 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-bold rounded-lg shadow-md border border-cyan-500/30 transition duration-200"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">Variant G</span><br />
                        <span className="text-sm font-normal text-slate-400">Aurora Glassmorphism (몽환적)</span>
                    </Link>

                    <Link
                        to="/landing/h"
                        className="block w-full py-6 px-6 bg-[#fafafa] hover:bg-white text-[#0a0a0a] font-black rounded-lg shadow-md border-2 border-[#0a0a0a] transition duration-200"
                    >
                        Variant H<br />
                        <span className="text-sm font-normal text-gray-500">Editorial Magazine (고급 잡지)</span>
                    </Link>

                    <Link
                        to="/landing/i"
                        className="block w-full py-6 px-6 bg-[#0a0a0f] hover:bg-[#15151f] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400 font-black rounded-lg shadow-md border border-cyan-500/50 transition duration-200"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400">Variant I</span><br />
                        <span className="text-sm font-normal text-gray-400">Neon Cyberpunk (미래적)</span>
                    </Link>

                    <Link
                        to="/landing/j"
                        className="block w-full py-6 px-6 bg-[#faf8f5] hover:bg-white text-[#4a6741] font-bold rounded-lg shadow-md border-2 border-[#c5d9c0] transition duration-200"
                    >
                        Variant J<br />
                        <span className="text-sm font-normal text-[#6b6b6b]">Organic Nature (자연 친화적)</span>
                    </Link>

                    <Link
                        to="/landing/k"
                        className="block w-full py-6 px-6 bg-[#0f0a08] hover:bg-[#1a0f0a] text-[#c9a962] font-serif font-light rounded-lg shadow-md border border-[#c9a962]/30 transition duration-200"
                    >
                        Variant K<br />
                        <span className="text-sm font-normal text-[#a39890]">Cinematic Luxury (럭셔리)</span>
                    </Link>

                    <Link
                        to="/landing/l"
                        className="block w-full py-6 px-6 bg-white hover:bg-[#f8fafc] text-[#1a1a2e] font-bold rounded-lg shadow-md border border-[#a78bfa]/30 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-[#a78bfa] via-[#f9a8d4] to-[#6ee7b7] bg-clip-text text-transparent">Variant L</span><br />
                        <span className="text-sm font-normal text-[#64748b]">Scroll Story (스토리텔링)</span>
                    </Link>

                    <Link
                        to="/landing/m"
                        className="block w-full py-6 px-6 bg-[#0a0a0f] hover:bg-[#12121a] text-white font-bold rounded-lg shadow-md border border-blue-500/30 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Variant M</span><br />
                        <span className="text-sm font-normal text-gray-400">Bento Grid + 3D Spatial (공간감 그리드)</span>
                    </Link>

                    <Link
                        to="/landing/n"
                        className="block w-full py-6 px-6 bg-[#fffbf7] hover:bg-white text-slate-800 font-bold rounded-lg shadow-md border border-rose-200 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">Variant N</span><br />
                        <span className="text-sm font-normal text-slate-400">Dreamy Pastel (밝고 몽환적)</span>
                    </Link>

                    <Link
                        to="/landing/o"
                        className="block w-full py-6 px-6 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-lg shadow-md border border-gray-200 transition duration-200"
                        style={{ boxShadow: '4px 4px 12px rgba(0,0,0,0.08)' }}
                    >
                        Variant O<br />
                        <span className="text-sm font-normal">Neo-Brutalist Pop (팝 & 바이브런트 개선)</span>
                    </Link>

                    <Link
                        to="/landing/p"
                        className="block w-full py-6 px-6 bg-[#FFF9F5] hover:bg-white text-gray-800 font-bold rounded-lg shadow-md border border-[#E8879B]/30 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-[#E8879B] via-[#F4A574] to-[#8BC5A7] bg-clip-text text-transparent">Variant P</span><br />
                        <span className="text-sm font-normal text-gray-400">Geometric Gradient Flow (로고 색상)</span>
                    </Link>

                    <Link
                        to="/landing/q"
                        className="block w-full py-6 px-6 bg-[#0a0a0f] hover:bg-[#12121a] text-white font-bold rounded-lg shadow-md border border-purple-500/30 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Variant Q</span><br />
                        <span className="text-sm font-normal text-gray-400">Dark Glassmorphism (글래스모피즘)</span>
                    </Link>

                    <Link
                        to="/landing/r"
                        className="block w-full py-6 px-6 bg-[#08090a] hover:bg-[#101114] text-white font-bold rounded-lg shadow-md border border-pink-500/20 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Variant R</span><br />
                        <span className="text-sm font-normal text-gray-400">Linear + Raycast (3D 큐브)</span>
                    </Link>

                    <Link
                        to="/landing/s"
                        className="block w-full py-6 px-6 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-lg shadow-md border border-gray-200 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Variant S</span><br />
                        <span className="text-sm font-normal text-gray-500">Cal.com + Vercel (클린 SaaS)</span>
                    </Link>

                    <Link
                        to="/landing/t"
                        className="block w-full py-6 px-6 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-lg shadow-md border border-[#635bff]/20 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-[#635bff] to-[#00d4ff] bg-clip-text text-transparent">Variant T</span><br />
                        <span className="text-sm font-normal text-gray-500">Notion + Figma + Stripe (프리미엄 SaaS)</span>
                    </Link>

                    <Link
                        to="/landing/u"
                        className="block w-full py-6 px-6 bg-white hover:bg-purple-50 text-gray-900 font-bold rounded-lg shadow-md border border-purple-200 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Variant U</span><br />
                        <span className="text-sm font-normal text-gray-400">KWANGYA 119 Style (화이트 + 파스텔 블롭)</span>
                    </Link>

                    <Link
                        to="/landing/v"
                        className="block w-full py-6 px-6 bg-white hover:bg-gray-50 text-gray-900 font-black rounded-lg shadow-md border border-gray-200 transition duration-200"
                    >
                        Variant V <span className="text-xs font-normal bg-black text-white px-2 py-0.5 rounded-full ml-1">NEW</span><br />
                        <span className="text-sm font-normal text-gray-400">Dropbox Style (극단적 미니멀)</span>
                    </Link>

                    <Link
                        to="/landing/w"
                        className="block w-full py-6 px-6 bg-[#0B1120] hover:bg-[#1E293B] text-white font-bold rounded-lg shadow-md border border-gray-700 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-[#635bff] to-[#00d4ff] bg-clip-text text-transparent">Variant W</span>
                        <span className="text-pink-500 ml-1"> DARK</span><br />
                        <span className="text-sm font-normal text-gray-400">Premium Dark SaaS (Variant T의 다크모드)</span>
                    </Link>

                    <Link
                        to="/landing/x"
                        className="block w-full py-6 px-6 bg-[#0a0a0b] hover:bg-[#151518] text-white font-bold rounded-lg shadow-md border border-purple-500/30 transition duration-200"
                        style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)' }}
                    >
                        <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Variant X</span>
                        <span className="text-xs font-normal bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="text-sm font-normal text-gray-400">Linear/Cursor Style (다크 + 바이브런트)</span>
                    </Link>

                    <Link
                        to="/landing/y"
                        className="block w-full py-6 px-6 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg shadow-md border border-gray-200 transition duration-200"
                    >
                        <span className="text-[#0071e3]">Variant Y</span>
                        <span className="text-xs font-normal bg-[#0071e3] text-white px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="text-sm font-normal text-gray-400">Apple Style (프리미엄 미니멀)</span>
                    </Link>

                    <Link
                        to="/landing/z"
                        className="block w-full py-6 px-6 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white font-bold rounded-lg shadow-md transition duration-200"
                    >
                        <span>Variant Z</span>
                        <span className="text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="text-sm font-normal text-white/80">Framer Style (인터랙티브 플레이풀)</span>
                    </Link>

                    {/* 신규 추가 랜딩 페이지 */}
                    <div className="col-span-1 md:col-span-2 mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-4 font-medium">신규 추가</p>
                    </div>

                    <Link
                        to="/landing/hyundai"
                        className="block w-full py-6 px-6 bg-black hover:bg-neutral-900 text-white font-bold rounded-lg shadow-md transition duration-200"
                    >
                        <span className="text-[#EA002C]">Hyundai Card</span>
                        <span className="text-xs font-normal bg-[#EA002C] text-white px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="text-sm font-normal text-gray-400">Premium Minimal Black (현대카드 스타일)</span>
                    </Link>

                    <Link
                        to="/landing/o2"
                        className="block w-full py-6 px-6 bg-[#FDFBF7] hover:bg-white text-stone-900 font-bold rounded-lg shadow-md border-2 border-stone-200 transition duration-200"
                    >
                        <span className="text-rose-400">Variant O2</span>
                        <span className="text-xs font-normal bg-rose-400 text-white px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="text-sm font-normal text-stone-400">Soft Brutalism (Variant O 톤다운)</span>
                    </Link>

                    <Link
                        to="/landing/o3"
                        className="block w-full py-6 px-6 bg-slate-50 hover:bg-white text-black font-black rounded-lg shadow-md border border-gray-200 transition duration-200"
                        style={{ boxShadow: '4px 4px 12px rgba(0,0,0,0.08)' }}
                    >
                        <span className="text-pink-500">Variant O3</span>
                        <span className="text-xs font-normal bg-pink-500 text-white px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="text-sm font-normal text-gray-500">Neo-Brutalist Pop Calm (팝 + 차분한 배경)</span>
                    </Link>

                    <Link
                        to="/landing/memphis"
                        className="block w-full py-6 px-6 bg-[#FFF5E6] hover:bg-white text-black font-black rounded-lg shadow-md border border-gray-200 transition duration-200"
                        style={{ boxShadow: '4px 4px 12px rgba(0,0,0,0.08)' }}
                    >
                        <span className="text-[#FF6B6B]">Memphis</span>
                        <span className="text-xs font-normal bg-[#4ECDC4] text-black px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="text-sm font-normal text-gray-600">80s Memphis Design (복고 팝, 기하학)</span>
                    </Link>

                    <Link
                        to="/landing/collage"
                        className="block w-full py-6 px-6 bg-[#FDF6E3] hover:bg-white text-gray-800 font-bold rounded-lg shadow-md border-2 border-pink-300 transition duration-200"
                    >
                        <span className="text-pink-500">Collage</span>
                        <span className="text-xs font-normal bg-pink-400 text-white px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="text-sm font-normal text-gray-500">Scrapbook Style (다이어리, Y2K 감성)</span>
                    </Link>

                    <Link
                        to="/landing/riso"
                        className="block w-full py-6 px-6 bg-[#F5F0E6] hover:bg-white text-gray-800 font-bold rounded-lg shadow-md transition duration-200 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[#0078BF] opacity-10 translate-x-1 translate-y-1" />
                        <div className="absolute inset-0 bg-[#FF6B9D] opacity-10" />
                        <span className="relative text-[#0078BF] font-black">Risograph</span>
                        <span className="relative text-xs font-normal bg-[#FF6B9D] text-white px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="relative text-sm font-normal text-gray-500">Print Style (오버프린트, 그레인 텍스처)</span>
                    </Link>

                    <Link
                        to="/landing/riso2"
                        className="block w-full py-6 px-6 bg-[#F5F0E6] hover:bg-white text-gray-800 font-bold rounded-lg shadow-md transition duration-200 relative overflow-hidden border border-gray-200"
                    >
                        {/* Riso Preview Decoration */}
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <div className="w-16 h-16 bg-[#0078BF] rounded-full mix-blend-multiply absolute top-0 right-0 translate-x-1/4 -translate-y-1/4" />
                            <div className="w-16 h-16 bg-[#FF48B0] rounded-full mix-blend-multiply absolute top-0 right-0" />
                        </div>

                        <span className="relative text-[#0078BF] font-black mix-blend-multiply text-xl">Variant R</span>
                        <span className="relative text-xs font-normal bg-[#FF48B0] text-white px-2 py-0.5 rounded-full ml-2">NEW</span><br />
                        <span className="relative text-sm font-normal text-gray-600">Digital Risograph (감성적, 텍스처, 잉크)</span>
                    </Link>

                    <Link
                        to="/landing/particles"
                        className="block w-full py-6 px-6 bg-[#050505] hover:bg-[#0a0a0a] text-white font-bold rounded-lg shadow-md border border-cyan-500/30 transition duration-200"
                    >
                        <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Variant N</span><br />
                        <span className="text-sm font-normal text-gray-400">Neural Stream (Canvas Interactive)</span>
                    </Link>

                    <Link
                        to="/landing/physics"
                        className="block w-full py-6 px-6 bg-[#FDFBF7] hover:bg-white text-gray-800 font-bold rounded-lg shadow-md border border-orange-100 transition duration-200"
                    >
                        <span className="text-[#FF9AA2]">Variant P</span><br />
                        <span className="text-sm font-normal text-gray-500">Playful Physics (밝음, 물리엔진, 인터랙티브)</span>
                    </Link>

                    <Link
                        to="/landing/qq"
                        className="block w-full py-6 px-6 bg-[#FDFBF9] hover:bg-white text-gray-900 font-bold rounded-lg shadow-md border border-[#E8879B]/20 transition duration-200"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="bg-gradient-to-r from-[#E8879B] to-[#F4A574] bg-clip-text text-transparent text-xl">Variant Q</span>
                            <span className="bg-[#111] text-white text-xs px-2 py-1 rounded-full">TRENDY</span>
                        </div>
                        <span className="text-sm font-normal text-gray-500">Kinetic Logo + Bento Grid (최신 트렌드 집약체)</span>
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2 mt-8 border-t pt-8">
                        <Link
                            to="/landing/swiss"
                            className="block w-full py-8 px-6 bg-white hover:bg-gray-50 text-black font-black text-2xl border border-gray-200 transition-transform hover:-translate-y-1"
                        >
                            Variant T
                            <span className="block text-sm font-normal text-gray-500 mt-2 font-mono uppercase tracking-widest">
                                Swiss Editorial (성수동 힙스터 스타일)
                            </span>
                        </Link>

                        <Link
                            to="/landing/retro"
                            className="block w-full py-8 px-6 bg-[#008080] hover:bg-[#009090] text-white font-bold text-2xl border-4 border-[#C0C0C0] shadow-[inset_2px_2px_0_white,inset_-2px_-2px_0_black]"
                        >
                            <span className="flex items-center gap-2">
                                <span className="italic font-serif">Variant W95</span>
                                <span className="text-xs bg-[#C0C0C0] text-black px-1 border border-black shadow-[1px_1px_0_white]">OS</span>
                            </span>
                            <span className="block text-sm font-normal text-gray-200 mt-2 font-mono">
                                Retro Desktop (윈도우 95 감성)
                            </span>
                        </Link>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2 mt-8 border-t border-gray-200 pt-8">
                            <Link
                                to="/landing/cinematic"
                                className="block w-full py-8 px-6 bg-black hover:bg-neutral-900 text-white font-serif rounded-lg shadow-xl border border-gray-800 transition-transform hover:-translate-y-1"
                            >
                                <span className="text-2xl font-bold tracking-widest">Variant C</span>
                                <span className="block text-sm font-sans text-gray-500 mt-2 uppercase tracking-wide">
                                    Cinematic Noir (영화관 같은 압도적 몰입감)
                                </span>
                            </Link>

                            <Link
                                to="/landing/solar"
                                className="block w-full py-8 px-6 bg-[#F7F3E8] hover:bg-[#F0EAD6] text-[#344E41] font-sans rounded-[2rem] shadow-sm border border-[#A3B18A]/30 transition-transform hover:-translate-y-1"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl font-bold">Variant S</span>
                                    <span className="bg-[#588157] text-white text-xs px-2 py-1 rounded-full">HEALING</span>
                                </div>
                                <span className="block text-sm text-[#5F6F5E]">
                                    Solarpunk Garden (유기적 형태와 힐링)
                                </span>
                            </Link>

                            {/* ... 기존 링크들 ... */}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-1 md:col-span-2 mt-8 border-t border-gray-200 pt-8">
                                {/* G: Spatial */}
                                <Link to="/landing/spatial" className="group relative block w-full py-8 px-6 bg-black overflow-hidden rounded-2xl shadow-2xl border border-white/10 transition-all hover:scale-[1.02]">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.3),transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10 text-center">
                                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-200">Variant G</span>
                                        <span className="block text-sm text-blue-200 mt-2 font-medium">Spatial Glass (비전 프로 스타일)</span>
                                    </div>
                                </Link>

                                {/* M: Chat */}
                                <Link to="/landing/chat" className="block w-full py-8 px-6 bg-[#F2F4F7] hover:bg-[#E8EAF0] text-gray-800 rounded-2xl shadow-sm border border-gray-200 transition-all hover:scale-[1.02]">
                                    <div className="flex flex-col gap-2">
                                        <div className="bg-white p-3 rounded-tl-xl rounded-tr-xl rounded-br-xl w-fit shadow-sm text-sm">🍿 넷플릭스 너무 비싸...</div>
                                        <div className="bg-blue-500 text-white p-3 rounded-tl-xl rounded-tr-xl rounded-bl-xl w-fit self-end shadow-sm text-sm">💸 MoA로 4천원에 ㄱㄱ</div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <span className="text-xl font-bold text-blue-600">Variant M</span>
                                        <span className="block text-sm text-gray-500 mt-1 font-medium">Chat Stream (메신저 스타일)</span>
                                    </div>
                                </Link>

                                {/* L: Linear */}
                                <Link to="/landing/linear" className="group block w-full py-8 px-6 bg-[#050505] hover:bg-[#0A0A0A] text-white rounded-xl shadow-2xl border border-white/10 transition-all hover:scale-[1.02] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />
                                    <div className="relative z-10 text-center">
                                        <div className="flex justify-center items-center gap-2 mb-2">
                                            <span className="text-2xl font-bold tracking-tight">Variant L</span>
                                            <kbd className="px-1.5 py-0.5 bg-[#222] border border-white/10 rounded text-xs font-mono text-gray-400 group-hover:text-white transition-colors">⌘K</kbd>
                                        </div>
                                        <span className="block text-sm text-gray-500 group-hover:text-gray-300 mt-2 font-medium">Linear SaaS (키보드 퍼스트)</span>
                                    </div>
                                </Link>

                                <Link
                                    to="/landing/glass-light"
                                    className="group block w-full py-8 px-6 bg-gradient-to-br from-white to-slate-100 hover:to-white text-slate-800 rounded-2xl shadow-lg border border-white/50 transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
                                >
                                    {/* Decorative background blob */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/50 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-purple-300/50" />

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Variant G-Light</span>
                                            <span className="bg-white/80 border border-white backdrop-blur text-slate-600 text-xs px-2 py-1 rounded-full shadow-sm">KOREAN</span>
                                        </div>
                                        <span className="block text-sm text-slate-500 font-medium">
                                            Crystal Clear Glass (밝고 투명한 글래스모피즘)
                                        </span>
                                    </div>
                                </Link>

                                <Link
                                    to="/landing/parallax"
                                    className="group block w-full py-8 px-6 bg-[#f5f5f7] hover:bg-white text-[#1d1d1f] rounded-2xl shadow-lg border border-gray-200 transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
                                >
                                    {/* Decorative parallax orbs */}
                                    <div className="absolute top-0 left-0 w-20 h-20 bg-blue-200/40 rounded-full blur-xl -ml-6 -mt-6 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
                                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-200/40 rounded-full blur-xl -mr-8 -mb-8 transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2" />

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#007AFF] via-[#5856D6] to-[#AF52DE]">Variant Parallax</span>
                                            <span className="bg-[#007AFF] text-white text-xs px-2 py-1 rounded-full shadow-sm">NEW</span>
                                        </div>
                                        <span className="block text-sm text-[#86868b] font-medium">
                                            Liquid Depth (iOS 스타일 패럴랙스 스크롤링)
                                        </span>
                                    </div>
                                </Link>
<Link                                    to="/landing/portrait"                                    className="group block w-full py-8 px-6 bg-[#FDF8F3] hover:bg-white text-[#4a4a4a] rounded-2xl shadow-lg border border-[#f0e6dc] transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"                                >                                    {/* Decorative pastel blobs */}                                    <div className="absolute top-0 left-0 w-24 h-24 bg-[#FFD4DC]/50 rounded-full blur-2xl -ml-8 -mt-8 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />                                    <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#D4E4FF]/50 rounded-full blur-2xl -mr-6 -mb-6 transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2" />                                    <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-[#E4D4FF]/40 rounded-full blur-xl" />                                    <div className="relative z-10">                                        <div className="flex items-center justify-between mb-2">                                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FFB5C5] via-[#C5B5FF] to-[#B5D4FF]">Portrait Style</span>                                            <span className="bg-gradient-to-r from-[#FFB5C5] to-[#C5B5FF] text-white text-xs px-2 py-1 rounded-full shadow-sm">NEW</span>                                        </div>                                        <span className="block text-sm text-[#888] font-medium">                                            아기자기 파스텔+패럴랙스(파스텔/그라데이션/스크롤카드슝)                                        </span>                                    </div>                                </Link>
<Link to="/landing/ysa01" className="group block w-full py-8 px-6 bg-slate-50 hover:bg-white text-black rounded-2xl shadow-lg border border-gray-200 transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden" style={{ boxShadow: "4px 4px 12px rgba(0,0,0,0.08)" }}>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/40 rounded-full blur-2xl -mr-8 -mt-8" />
                                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-pink-500/40 rounded-full blur-2xl -ml-6 -mb-6" />
                                    <div className="absolute top-1/3 left-1/3 w-16 h-16 bg-lime-400/30 rounded-full blur-xl" />
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-2xl font-black"><span className="text-cyan-400">YSa</span><span className="text-pink-500">01</span></span>
                                            <span className="bg-lime-400 text-black text-xs px-2 py-1 rounded-full font-black border border-gray-200">NEW</span>
                                        </div>
                                        <span className="block text-sm text-gray-600 font-bold">패럴랙스+네오브루탈리즘(띠용때용, 롤링텍스트, 스크롤카드슝)</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
