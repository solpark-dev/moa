import React from "react";
import { Link } from "react-router-dom";
import MainFeaturesSection from "../main/sections/MainFeaturesSection";
import MainTrendingSection from "../main/sections/MainTrendingSection";

export default function LandingPageA() {
    return (
        <div className="w-full pb-20 font-sans">
            {/* Variant A Hero: Dark, Bold, Modern */}
            <section className="relative bg-gray-900 text-white py-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 z-10">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            함께 보면<br />
                            반값입니다.
                        </h1>
                        <p className="text-xl text-gray-400 max-w-lg font-light">
                            프리미엄 콘텐츠, 이제 제값 주고 보지 마세요.<br />
                            스마트한 공유의 시작, MoA와 함께하세요.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/party"
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-none text-lg transition-transform hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                            >
                                파티 찾아보기
                            </Link>
                            <Link
                                to="/party/create"
                                className="px-8 py-4 border-2 border-white text-white font-bold rounded-none text-lg hover:bg-white hover:text-gray-900 transition-colors"
                            >
                                파티 만들기
                            </Link>
                        </div>
                    </div>

                    <div className="relative h-96 hidden md:block">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
                        <div className="absolute top-10 right-10 bg-gray-800 p-6 border border-gray-700 shadow-2xl transform rotate-3">
                            <div className="w-16 h-16 bg-red-500 rounded-sm mb-4"></div>
                            <div className="h-4 w-32 bg-gray-600 rounded mb-2"></div>
                            <div className="h-4 w-20 bg-gray-700 rounded"></div>
                        </div>
                        <div className="absolute bottom-10 left-10 bg-gray-800 p-6 border border-gray-700 shadow-2xl transform -rotate-6">
                            <div className="w-16 h-16 bg-blue-400 rounded-sm mb-4"></div>
                            <div className="h-4 w-32 bg-gray-600 rounded mb-2"></div>
                            <div className="h-4 w-20 bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reuse sections with wrapper to style them a bit if needed, or just standard */}
            <div className="bg-gray-50">
                <MainFeaturesSection />
            </div>

            <div className="bg-white">
                <MainTrendingSection />
            </div>
        </div>
    );
}
