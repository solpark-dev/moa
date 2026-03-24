import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, AlertCircle, Loader2, Shield } from 'lucide-react';
import useBankVerificationStore from '@/store/bankVerificationStore';
import BankSelector from './BankSelector';
import { requestVerification } from '@/api/bankAccountApi';

/**
 * Step 1: 은행 및 계좌 정보 입력
 * CSS 변수 기반 테마 적용
 */
export default function BankSelectionStep({ theme = 'classic' }) {
    const {
        formData,
        setFormData,
        setStep,
        setVerificationSuccess,
        setError,
        error,
        clearError
    } = useBankVerificationStore();

    const [isSubmitting, setIsSubmitting] = useState(false);

    // 은행 선택 핸들러
    const handleBankChange = ({ bankCode, bankName }) => {
        setFormData({ bankCode, bankName });
        clearError();
    };

    // 계좌번호 입력 (숫자만)
    const handleAccountNumChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setFormData({ accountNum: value });
        clearError();
    };

    // 예금주명 입력
    const handleAccountHolderChange = (e) => {
        setFormData({ accountHolder: e.target.value });
        clearError();
    };

    // 유효성 검사
    const isValid = () => {
        return (
            formData.bankCode &&
            formData.accountNum.length >= 10 &&
            formData.accountHolder.length >= 2
        );
    };

    // 1원 인증 요청
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValid()) return;

        setIsSubmitting(true);
        clearError();

        try {
            // API 호출
            const response = await requestVerification(
                formData.bankCode,
                formData.accountNum,
                formData.accountHolder
            );

            // 응답 처리
            if (response.success !== false) {
                // 처리 중 단계로 이동 (4초 딜레이 후 인증 단계로)
                setStep('processing');

                // 4초 후 인증 데이터 설정 및 인증 단계로 이동
                setTimeout(() => {
                    setVerificationSuccess({
                        bankTranId: response.bankTranId,
                        maskedAccount: response.maskedAccount || maskAccountNumber(formData.accountNum),
                        expiresAt: response.expiresAt || new Date(Date.now() + 10 * 60 * 1000).toISOString(),
                        verifyCode: response.printContent || response.verifyCode || ''
                    });
                }, 4000);
            } else {
                setError(response.message || '인증 요청에 실패했습니다.');
            }
        } catch (err) {
            console.error('인증 요청 실패:', err);
            setError(err.response?.data?.message || err.message || '인증 요청에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 계좌번호 마스킹
    const maskAccountNumber = (num) => {
        if (num.length < 6) return num;
        const prefix = num.slice(0, 3);
        const suffix = num.slice(-3);
        return `${prefix}-***-***${suffix}`;
    };

    return (
        <Card className="border-[var(--theme-border-width)] border-[var(--theme-border-light)] shadow-[var(--theme-shadow)] bg-[var(--theme-bg-card)]">
            <CardHeader className="text-center pb-2">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="mx-auto w-16 h-16 bg-[var(--theme-primary)] rounded-full flex items-center justify-center mb-4 shadow-lg"
                >
                    <Building2 className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-xl font-bold text-[var(--theme-text)]">
                    정산받을 계좌를 등록해주세요
                </CardTitle>
                <CardDescription className="text-[var(--theme-text-muted)]">
                    1원 인증을 통해 본인 계좌를 확인합니다
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* 에러 메시지 */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        </motion.div>
                    )}

                    {/* 은행 선택 */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-[var(--theme-text)]">
                            은행 선택
                        </Label>
                        <BankSelector
                            value={formData.bankCode}
                            onChange={handleBankChange}
                            disabled={isSubmitting}
                            theme={theme}
                        />
                    </div>

                    {/* 계좌번호 */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-[var(--theme-text)]">
                            계좌번호
                        </Label>
                        <Input
                            type="text"
                            inputMode="numeric"
                            value={formData.accountNum}
                            onChange={handleAccountNumChange}
                            placeholder="계좌번호 입력 (숫자만)"
                            maxLength={20}
                            disabled={isSubmitting}
                            className="h-12 text-lg rounded-xl border-[var(--theme-border-width)] border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] text-[var(--theme-text)] focus:border-[var(--theme-primary)] focus:ring-[var(--theme-focus-ring)]"
                        />
                        <p className="text-xs text-[var(--theme-text-muted)]">
                            - 없이 숫자만 입력하세요
                        </p>
                    </div>

                    {/* 예금주명 */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-[var(--theme-text)]">
                            예금주명
                        </Label>
                        <Input
                            type="text"
                            value={formData.accountHolder}
                            onChange={handleAccountHolderChange}
                            placeholder="예금주명 입력"
                            maxLength={20}
                            disabled={isSubmitting}
                            className="h-12 text-lg rounded-xl border-[var(--theme-border-width)] border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] text-[var(--theme-text)] focus:border-[var(--theme-primary)] focus:ring-[var(--theme-focus-ring)]"
                        />
                    </div>

                    {/* 안내 문구 */}
                    <div className="flex items-start gap-2 p-3 bg-[var(--theme-primary-light)] rounded-xl">
                        <Shield className="w-5 h-5 text-[var(--theme-primary)] flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-[var(--theme-text-muted)] leading-relaxed">
                            입력하신 계좌로 <span className="font-semibold text-[var(--theme-primary)]">1원</span>이 입금됩니다.
                            입금자명에 표시된 <span className="font-semibold">4자리 숫자</span>를 입력하면 인증이 완료됩니다.
                        </p>
                    </div>

                    {/* 제출 버튼 */}
                    <Button
                        type="submit"
                        disabled={!isValid() || isSubmitting}
                        className="w-full h-14 text-lg font-semibold rounded-xl bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] shadow-[var(--theme-shadow)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                요청 중...
                            </>
                        ) : (
                            '1원 인증 요청'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
