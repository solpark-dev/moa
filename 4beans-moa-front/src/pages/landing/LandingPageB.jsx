import React from "react";
import { Link } from "react-router-dom";
import MainFeaturesSection from "../main/sections/MainFeaturesSection";
import MainTrendingSection from "../main/sections/MainTrendingSection";

export default function LandingPageB() {
    return (
        <div className="w-full pb-20 font-sans text-gray-700">
            {/* Variant B Hero: Soft, Trustworthy, Friendly */}
            <section className="relative bg-emerald-50 text-emerald-900 py-24 px-6 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
                        5만 명 이상의 선택
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-gray-900">
                        구독료는 나누고,
                        <br />
                        <span className="text-emerald-600">즐거움은 더하세요.</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        안전하고 믿을 수 있는 OTT 공유 커뮤니티.<br />
                        복잡한 정산은 저희가 할게요, 편안하게 감상만 하세요.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/party"
                            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full text-lg shadow-lg hover:shadow-emerald-200 transition-all"
                        >
                            파티 찾기
                        </Link>
                        <Link
                            to="/party/create"
                            className="px-8 py-3 bg-white text-emerald-700 border border-emerald-200 font-medium rounded-full text-lg hover:bg-emerald-50 transition-colors"
                        >
                            파티 만들기
                        </Link>
                    </div>

                    <div className="mt-12 flex justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="font-bold text-xl">NETFLIX</div>
                        <div className="font-bold text-xl">Disney+</div>
                        <div className="font-bold text-xl">YouTube</div>
                    </div>
                </div>

                {/* Decorative blobs */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </section>

            {/* Trust/Testimonial Placeholder (Mock) - Adding this as it's key for Variant B */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-12">MoA를 사랑하는 이유</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-50 p-6 rounded-2xl">
                                <div className="flex justify-center mb-4 text-yellow-400">★★★★★</div>
                                <p className="text-gray-600 mb-4">"매달 구독료를 70% 이상 아끼고 있어요. 정말 안전하고 간편합니다!"</p>
                                <div className="font-semibold text-gray-800">- 행복한 유저 {i}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="bg-emerald-50/30">
                <MainTrendingSection />
            </div>

            <div className="bg-white">
                <MainFeaturesSection />
            </div>
        </div>
    );
}
