import { motion, AnimatePresence } from 'framer-motion';
import useBankVerificationStore from '@/store/bankVerificationStore';
import { Button } from '@/components/ui/button';
import { X, ArrowDownCircle, Bell, ChevronRight, Info } from 'lucide-react';
import { BANKS } from './BankSelector';

/**
 * 가상 은행 앱 모달 (토스 스타일)
 * 실제 은행 앱처럼 1원 입금 알림을 보여줍니다
 * CSS 변수 기반 테마 적용
 */
export default function VirtualBankModal() {
    const {
        showVirtualBankModal,
        closeVirtualBankModal,
        verification,
        formData
    } = useBankVerificationStore();

    // 은행 정보 가져오기
    const bank = BANKS.find(b => b.code === formData.bankCode);

    // 현재 시간
    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    // 배경 클릭 시 닫기
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeVirtualBankModal();
        }
    };

    return (
        <AnimatePresence>
            {showVirtualBankModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleBackdropClick}
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                >
                    {/* 모달 컨텐츠 - 스마트폰 모양 */}
                    <motion.div
                        initial={{ scale: 0.9, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 50 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="w-full max-w-sm bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-[var(--theme-shadow-hover)]"
                    >
                        {/* 노치 */}
                        <div className="relative h-8 bg-slate-900 flex items-center justify-center">
                            <div className="absolute top-2 w-24 h-6 bg-black rounded-full" />
                        </div>

                        {/* 앱 헤더 */}
                        <div className="bg-gradient-to-b from-slate-800 to-slate-900 px-5 pt-2 pb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">4B</span>
                                    </div>
                                    <span className="text-white font-semibold">4beans 가상은행</span>
                                </div>
                                <button
                                    onClick={closeVirtualBankModal}
                                    className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-slate-600 transition-colors"
                                >
                                    <X className="w-4 h-4 text-slate-300" />
                                </button>
                            </div>

                            {/* 계좌 정보 */}
                            <div className="bg-slate-800/50 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    {bank && (
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                                            style={{
                                                backgroundColor: bank.color,
                                                color: bank.textColor || '#ffffff'
                                            }}
                                        >
                                            {bank.logo}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-white font-medium">{formData.bankName}</p>
                                        <p className="text-slate-400 text-sm">
                                            {verification.maskedAccount || formData.accountNum}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 메인 컨텐츠 */}
                        <div className="bg-white min-h-[400px] px-5 py-6">
                            {/* 알림 헤더 */}
                            <div className="flex items-center gap-2 mb-4">
                                <Bell className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-500">오늘의 입금내역</span>
                            </div>

                            {/* 입금 알림 카드 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-[var(--theme-primary-light)] border border-[var(--theme-border-light)] rounded-2xl p-5 mb-6"
                            >
                                {/* 입금 표시 */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-[var(--theme-primary)] rounded-full flex items-center justify-center">
                                            <ArrowDownCircle className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[var(--theme-primary)] font-semibold">입금</p>
                                            <p className="text-slate-500 text-xs">{timeString}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300" />
                                </div>

                                {/* 금액 */}
                                <div className="mb-4">
                                    <p className="text-3xl font-bold text-[var(--theme-primary)]">+1원</p>
                                </div>

                                {/* 입금자명 (인증코드 포함) */}
                                <div className="bg-white rounded-xl p-4 border border-[var(--theme-border-light)]">
                                    <p className="text-xs text-slate-500 mb-1">입금자명</p>
                                    <div className="flex items-center gap-2">
                                        <motion.p
                                            className="text-xl font-bold text-slate-800"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            MOA
                                            <motion.span
                                                className="text-orange-500"
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                    textShadow: [
                                                        '0 0 0px #f97316',
                                                        '0 0 8px #f97316',
                                                        '0 0 0px #f97316'
                                                    ]
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: 'easeInOut'
                                                }}
                                            >
                                                {verification.verifyCode || '----'}
                                            </motion.span>
                                        </motion.p>
                                    </div>
                                    <div className="flex items-center gap-1 mt-2">
                                        <div className="w-2 h-2 bg-[var(--theme-primary)] rounded-full animate-pulse" />
                                        <p className="text-xs text-[var(--theme-primary)] font-medium">
                                            숫자 4자리가 인증코드입니다
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* 안내 문구 */}
                            <div className="flex items-start gap-2 p-3 bg-[var(--theme-primary-light)] rounded-xl mb-6">
                                <Info className="w-4 h-4 text-[var(--theme-primary)] flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed">
                                    실제 서비스에서는 본인의 은행 앱에서 입금 내역을 확인합니다.
                                    <br />
                                    <span className="text-[var(--theme-primary)]">(데모용 화면입니다)</span>
                                </p>
                            </div>

                            {/* 확인 버튼 */}
                            <Button
                                onClick={closeVirtualBankModal}
                                className="w-full h-14 text-lg font-semibold rounded-xl bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)]"
                            >
                                확인했어요
                            </Button>
                        </div>

                        {/* 하단 홈바 */}
                        <div className="bg-white h-8 flex items-center justify-center pb-2">
                            <div className="w-32 h-1 bg-slate-300 rounded-full" />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
