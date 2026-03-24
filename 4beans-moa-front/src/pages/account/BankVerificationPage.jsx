import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import useBankVerificationStore from '@/store/bankVerificationStore';
import {
    useTheme,
    ThemeSwitcher,
    ThemeBackground,
    ThemeMarquee,
} from '../../config/themeConfig';

// Step 컴포넌트들 (Phase 2-3에서 구현)
import BankSelectionStep from '@/components/bank-verification/BankSelectionStep';
import ProcessingStep from '@/components/bank-verification/ProcessingStep';
import VerificationStep from '@/components/bank-verification/VerificationStep';
import CompletionStep from '@/components/bank-verification/CompletionStep';
import VirtualBankModal from '@/components/bank-verification/VirtualBankModal';

/**
 * 1원 인증 페이지
 * 4단계 프로세스: 입력 → 처리 중 → 인증 → 완료
 */
export default function BankVerificationPage() {
    const navigate = useNavigate();
    const { step, reset, showVirtualBankModal } = useBankVerificationStore();

    // Theme
    const { theme, setTheme, currentTheme } = useTheme("appTheme");

    // 페이지 진입 시 상태 초기화
    useEffect(() => {
        reset();
    }, [reset]);

    // Step 애니메이션 설정
    const pageVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    const pageTransition = {
        type: 'tween',
        ease: 'easeInOut',
        duration: 0.3
    };

    // 현재 Step에 따른 컴포넌트 렌더링
    const renderStep = () => {
        switch (step) {
            case 'input':
                return <BankSelectionStep key="input" theme={theme} currentTheme={currentTheme} />;
            case 'processing':
                return <ProcessingStep key="processing" theme={theme} currentTheme={currentTheme} />;
            case 'verify':
                return <VerificationStep key="verify" theme={theme} currentTheme={currentTheme} />;
            case 'complete':
                return <CompletionStep key="complete" theme={theme} currentTheme={currentTheme} />;
            default:
                return <BankSelectionStep key="input" theme={theme} currentTheme={currentTheme} />;
        }
    };

    // 진행 상태 표시
    const getStepNumber = () => {
        const steps = ['input', 'processing', 'verify', 'complete'];
        return steps.indexOf(step) + 1;
    };

    const stepLabels = ['계좌 입력', '확인 중', '인증', '완료'];

    return (
        <div className={`min-h-[calc(100vh-160px)] py-8 px-4 transition-colors duration-300 ${theme === "dark" ? "bg-[#0B1120]" : theme === "pop" ? "bg-slate-50" : "bg-gradient-to-b from-slate-50 to-white"
            }`}>
            {/* Theme Switcher */}
            <ThemeSwitcher theme={theme} onThemeChange={setTheme} />

            <div className="max-w-md mx-auto">
                {/* 뒤로가기 버튼 */}
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center gap-2 mb-6 transition-colors group ${theme === "dark"
                        ? "text-gray-400 hover:text-[#635bff]"
                        : theme === "pop"
                            ? "text-black hover:text-pink-500"
                            : theme === "christmas"
                                ? "text-gray-500 hover:text-[#c41e3a]"
                                : "text-gray-400 hover:text-[#635bff]"
                        }`}
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold">뒤로가기</span>
                </button>

                {/* 진행 상태 인디케이터 */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        {stepLabels.map((label, index) => (
                            <div key={label} className="flex flex-col items-center">
                                <div
                                    className={`
                                        w-8 h-8 rounded-full flex items-center justify-center
                                        text-sm font-semibold transition-all duration-300
                                        ${index + 1 <= getStepNumber()
                                            ? theme === "dark"
                                                ? "bg-[#635bff] text-white"
                                                : theme === "pop"
                                                    ? "bg-pink-500 text-white"
                                                    : theme === "christmas"
                                                        ? "bg-[#c41e3a] text-white"
                                                        : "bg-[#635bff] text-white"
                                            : theme === "dark"
                                                ? "bg-gray-700 text-gray-400"
                                                : "bg-slate-200 text-slate-500"
                                        }
                                    `}
                                >
                                    {index + 1 < getStepNumber() ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span className={`
                                    text-xs mt-1 transition-colors duration-300
                                    ${index + 1 <= getStepNumber()
                                        ? theme === "dark"
                                            ? "text-[#635bff] font-medium"
                                            : theme === "pop"
                                                ? "text-pink-600 font-medium"
                                                : theme === "christmas"
                                                    ? "text-[#c41e3a] font-medium"
                                                    : "text-[#635bff] font-medium"
                                        : theme === "dark"
                                            ? "text-gray-500"
                                            : "text-slate-400"
                                    }
                                `}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* 프로그레스 바 */}
                    <div className={`relative h-1 rounded-full overflow-hidden ${theme === "dark" ? "bg-gray-700" : "bg-slate-200"
                        }`}>
                        <motion.div
                            className={`absolute top-0 left-0 h-full rounded-full ${theme === "dark"
                                ? "bg-[#635bff]"
                                : theme === "pop"
                                    ? "bg-pink-500"
                                    : theme === "christmas"
                                        ? "bg-[#c41e3a]"
                                        : "bg-[#635bff]"
                                }`}
                            initial={{ width: '0%' }}
                            animate={{ width: `${((getStepNumber() - 1) / 3) * 100}%` }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                        />
                    </div>
                </div>

                {/* Step 컴포넌트 */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 가상 은행 모달 */}
            <VirtualBankModal />
        </div>
    );
}
