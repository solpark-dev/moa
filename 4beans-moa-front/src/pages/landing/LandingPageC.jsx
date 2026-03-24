import React from "react";
import { Link } from "react-router-dom";
import MainTrendingSection from "../main/sections/MainTrendingSection";

export default function LandingPageC() {
    return (
        <div className="w-full pb-20 font-sans tracking-wide">
            {/* Variant C Hero: Minimal, Clean, B&W with Accent */}
            <section className="bg-white text-gray-900 py-40 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-6xl md:text-8xl font-thin tracking-tighter mb-8 text-black">
                        단순함의 <span className="font-bold underline decoration-blue-500 decoration-4 underline-offset-8">미학</span>.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 font-light mb-12 max-w-2xl mx-auto">
                        복잡한 건 딱 질색이니까. 원하는 OTT만 쏙 골라, 가장 합리적인 가격으로.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        <Link
                            to="/party"
                            className="text-lg font-medium border-b-2 border-black pb-1 hover:text-blue-600 hover:border-blue-600 transition-all"
                        >
                            파티 둘러보기 →
                        </Link>
                        <Link
                            to="/party/create"
                            className="text-lg font-medium text-gray-400 hover:text-black transition-colors"
                        >
                            파티 만들기
                        </Link>
                    </div>
                </div>
            </section>

            {/* Ultra Minimal Feature List */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">01. 선택</h3>
                        <p className="text-gray-500">원하는 서비스를 고르세요. 넷플릭스, 디즈니, 무엇이든.</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">02. 매칭</h3>
                        <p className="text-gray-500">가장 적합한 파티원을 자동으로 찾아드립니다.</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">03. 감상</h3>
                        <p className="text-gray-500">이제 즐기기만 하세요. 정산은 매달 자동으로.</p>
                    </div>
                </div>
            </section>

            <div className="bg-white">
                <MainTrendingSection />
            </div>
        </div>
    );
}
