import React from "react";
import { Link } from "react-router-dom";
import MainFeaturesSection from "../main/sections/MainFeaturesSection";
import MainTrendingSection from "../main/sections/MainTrendingSection";

export default function LandingPageD() {
    return (
        <div className="w-full pb-20 font-sans">
            {/* Variant D Hero: Vibrant, Pop, High Energy */}
            <section className="relative bg-yellow-400 py-24 px-6 overflow-hidden">
                {/* Background Patterns */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

                <div className="absolute top-10 right-10 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-bounce"></div>
                <div className="absolute bottom-10 left-10 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 gap-12">
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-6xl md:text-8xl font-black text-black mb-6 tracking-tight drop-shadow-md transform -rotate-2">
                            POP<span className="text-white">!</span><br />
                            <span className="text-white">CORN</span> &<br />
                            CHILL.
                        </h1>
                        <p className="text-2xl font-bold text-black mb-8 transform rotate-1 bg-white inline-block px-4 py-2 border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]">
                            구독료 걱정은 이제 그만! 🍿
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start mt-8">
                            <Link
                                to="/party"
                                className="px-10 py-4 bg-pink-500 hover:bg-pink-400 text-white font-black text-xl border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[4px_4px_12px_rgba(0,0,0,0.08)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-xl"
                            >
                                파티 시작 🔥
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-md">
                        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] transform rotate-3 hover:rotate-0 transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4 border-b-2 border-dashed border-gray-300 pb-4">
                                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs">N</div>
                                <div>
                                    <div className="font-bold text-lg">넷플릭스 프리미엄</div>
                                    <div className="text-sm text-gray-500">4,250원 / 월</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mb-4 border-b-2 border-dashed border-gray-300 pb-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">D+</div>
                                <div>
                                    <div className="font-bold text-lg">디즈니+</div>
                                    <div className="text-sm text-gray-500">2,400원 / 월</div>
                                </div>
                            </div>
                            <div className="text-center bg-black text-white font-bold py-3 rounded-xl mt-2">
                                도합 6,650원! 💸
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="bg-white border-b-4 border-black">
                <MainTrendingSection />
            </div>

            <div className="bg-pink-100">
                <MainFeaturesSection />
            </div>
        </div>
    );
}
