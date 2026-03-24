import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Mail, Smartphone, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import useBankVerificationStore from '@/store/bankVerificationStore';
import CodeInput from './CodeInput';
import CountdownTimer from './CountdownTimer';
import { verifyAndRegister } from '@/api/bankAccountApi';
import { BANKS } from './BankSelector';

/**
 * Step 3: 인증코드 입력
 * CSS 변수 기반 테마 적용
 */
export default function VerificationStep() {
    const {
        formData,
        verification,
        setStep,
        setError,
        error,
        clearError,
        openVirtualBankModal,
        decrementAttempts
    } = useBankVerificationStore();

    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [codeError, setCodeError] = useState(false);

    // 은행 정보 가져오기
    const bank = BANKS.find(b => b.code === formData.bankCode);

    // 인증코드 변경 핸들러
    const handleCodeChange = (newCode) => {
        setCode(newCode);
        setCodeError(false);
        clearError();
    };

    // 인증코드 제출
    const handleSubmit = async (submittedCode = code) => {
        if (submittedCode.length !== 4) return;

        setIsSubmitting(true);
        clearError();
        setCodeError(false);

        try {
            const response = await verifyAndRegister(
                verification.bankTranId,
                submittedCode
            );

            if (response.success !== false && !response.error) {
                // 인증 성공 → 완료 단계로
                setStep('complete');
            } else {
                // 인증 실패
                setCodeError(true);
                decrementAttempts();
                setError(response.message || response.error?.message || '인증코드가 일치하지 않습니다.');
                setCode('');
            }
        } catch (err) {
            console.error('인증 실패:', err);
            setCodeError(true);
            decrementAttempts();
            setError(err.response?.data?.message || '인증에 실패했습니다. 다시 시도해주세요.');
            setCode('');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 자동 제출 (4자리 입력 완료 시)
    const handleCodeComplete = (completedCode) => {
        handleSubmit(completedCode);
    };

    // 만료 시 처리
    const handleExpire = () => {
        setError('인증 시간이 만료되었습니다. 다시 시도해주세요.');
        setTimeout(() => {
            setStep('input');
        }, 2000);
    };

    // 재전송
    const handleResend = () => {
        // 입력 단계로 돌아가서 다시 요청
        setStep('input');
    };

    return (
        <Card className="border-[var(--theme-border-width)] border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] bg-[var(--theme-bg-card)]">
            <CardHeader className="text-center pb-2">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg"
                >
                    <CheckCircle2 className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-xl font-bold text-[var(--theme-text)]">
                    1원이 입금되었습니다!
                </CardTitle>
                <CardDescription className="text-[var(--theme-text-muted)]">
                    입금자명에서 4자리 인증코드를 확인해주세요
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* 계좌 정보 */}
                <div className="flex items-center justify-center gap-3 p-4 bg-[var(--theme-primary-light)] rounded-xl">
                    {bank && (
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                            style={{
                                backgroundColor: bank.color,
                                color: bank.textColor || '#ffffff'
                            }}
                        >
                            {bank.logo}
                        </div>
                    )}
                    <div className="text-left">
                        <p className="font-medium text-[var(--theme-text)]">{formData.bankName}</p>
                        <p className="text-sm text-[var(--theme-text-muted)]">
                            {verification.maskedAccount || formData.accountNum}
                        </p>
                    </div>
                </div>

                {/* 확인 방법 버튼 */}
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        className="h-14 flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-[var(--theme-border-light)] hover:border-[var(--theme-primary)] hover:bg-[var(--theme-primary-light)]"
                        onClick={() => window.open('https://mail.google.com', '_blank')}
                    >
                        <Mail className="w-5 h-5 text-[var(--theme-primary)]" />
                        <span className="text-xs">이메일 확인</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-14 flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-[var(--theme-border-light)] hover:border-[var(--theme-primary)] hover:bg-[var(--theme-primary-light)]"
                        onClick={openVirtualBankModal}
                    >
                        <Smartphone className="w-5 h-5 text-[var(--theme-primary)]" />
                        <span className="text-xs">가상 은행앱</span>
                    </Button>
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {error}
                                {verification.remainingAttempts > 0 && (
                                    <span className="block mt-1 text-xs">
                                        남은 시도: {verification.remainingAttempts}회
                                    </span>
                                )}
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                {/* 인증코드 입력 */}
                <div className="space-y-4">
                    <p className="text-center text-sm font-medium text-[var(--theme-text-muted)]">
                        인증코드 4자리
                    </p>
                    <CodeInput
                        value={code}
                        onChange={handleCodeChange}
                        onComplete={handleCodeComplete}
                        disabled={isSubmitting}
                        error={codeError}
                    />
                </div>

                {/* 타이머 */}
                <div className="text-center">
                    <CountdownTimer
                        expiresAt={verification.expiresAt}
                        onExpire={handleExpire}
                    />
                </div>

                {/* 인증 완료 버튼 */}
                <Button
                    onClick={() => handleSubmit()}
                    disabled={code.length !== 4 || isSubmitting}
                    className="w-full h-14 text-lg font-semibold rounded-xl bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] shadow-[var(--theme-shadow)] transition-all duration-300 disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            인증 중...
                        </>
                    ) : (
                        '인증 완료'
                    )}
                </Button>

                {/* 재전송 */}
                <div className="text-center">
                    <button
                        onClick={handleResend}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1 text-sm text-[var(--theme-text-muted)] hover:text-[var(--theme-primary)] transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        코드를 못 받으셨나요? 재전송
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
