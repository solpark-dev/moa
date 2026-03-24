import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PartyPopper, Wallet, ArrowRight, Check } from 'lucide-react';
import useBankVerificationStore from '@/store/bankVerificationStore';
import { BANKS } from './BankSelector';
import { useThemeStore } from '@/store/themeStore';

// canvas-confetti는 선택적 의존성 (없으면 애니메이션 생략)
let confetti = null;
try {
    confetti = require('canvas-confetti');
} catch (e) {
    // canvas-confetti가 설치되지 않음 - 무시
}

/**
 * Step 4: 완료 화면
 * CSS 변수 기반 테마 적용
 */
export default function CompletionStep() {
    const navigate = useNavigate();
    const { theme } = useThemeStore();
    const { formData, verification, reset } = useBankVerificationStore();

    // 은행 정보 가져오기
    const bank = BANKS.find(b => b.code === formData.bankCode);

    // 축하 애니메이션 (confetti)
    useEffect(() => {
        // confetti가 없으면 그냥 넘어감
        if (typeof confetti === 'function') {
            const duration = 2000;
            const end = Date.now() + duration;

            const colors = theme === 'christmas'
                ? ['#c41e3a', '#2d5a27', '#ffffff', '#f5c542']
                : theme === 'dark'
                    ? ['#635bff', '#00d4ff', '#4ade80', '#ffffff']
                    : theme === 'pop'
                        ? ['#ec4899', '#f97316', '#22c55e', '#3b82f6']
                        : ['#f97316', '#fb923c', '#fdba74', '#22c55e', '#4ade80'];

            (function frame() {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
    }, [theme]);

    // 내 지갑으로 이동
    const handleGoToWallet = () => {
        reset();
        navigate('/user/wallet');
    };

    // 홈으로 이동
    const handleGoHome = () => {
        reset();
        navigate('/');
    };

    return (
        <Card className="border-[var(--theme-border-width)] border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] bg-[var(--theme-bg-card)] overflow-hidden">
            <CardContent className="py-12 px-6">
                <div className="text-center">
                    {/* 성공 아이콘 */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 15,
                            delay: 0.2
                        }}
                        className="relative mx-auto w-24 h-24 mb-6"
                    >
                        {/* 배경 원 */}
                        <motion.div
                            className="absolute inset-0 bg-[var(--theme-primary-light)] rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            transition={{ duration: 0.5 }}
                        />
                        {/* 아이콘 */}
                        <div className="absolute inset-0 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: 'spring' }}
                            >
                                <PartyPopper className="w-10 h-10 text-white" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* 타이틀 */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-bold text-[var(--theme-text)] mb-2"
                    >
                        계좌 등록 완료!
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-[var(--theme-text-muted)] mb-8"
                    >
                        이제 파티 정산금을 받을 수 있어요
                    </motion.p>

                    {/* 등록된 계좌 정보 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-[var(--theme-primary-light)] rounded-2xl p-6 mb-8"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            {bank && (
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                                    style={{
                                        backgroundColor: bank.color,
                                        color: bank.textColor || '#ffffff'
                                    }}
                                >
                                    {bank.logo}
                                </div>
                            )}
                            <div className="text-left">
                                <p className="font-semibold text-[var(--theme-text)] text-lg">
                                    {formData.bankName}
                                </p>
                                <p className="text-[var(--theme-text-muted)]">
                                    {verification.maskedAccount || formData.accountNum}
                                </p>
                            </div>
                        </div>

                        {/* 체크 리스트 */}
                        <div className="space-y-2">
                            {[
                                '본인 계좌 확인 완료',
                                '정산 계좌로 등록 완료',
                            ].map((text, index) => (
                                <motion.div
                                    key={text}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="flex items-center gap-2 text-sm text-[var(--theme-text-muted)]"
                                >
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    {text}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* 버튼들 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-3"
                    >
                        <Button
                            onClick={handleGoToWallet}
                            className="w-full h-14 text-lg font-semibold rounded-xl bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] shadow-[var(--theme-shadow)]"
                        >
                            <Wallet className="w-5 h-5 mr-2" />
                            내 지갑으로 이동
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={handleGoHome}
                            className="w-full h-12 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
                        >
                            홈으로 가기
                        </Button>
                    </motion.div>
                </div>
            </CardContent>
        </Card>
    );
}
