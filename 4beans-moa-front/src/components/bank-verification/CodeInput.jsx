import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * 4자리 인증코드 입력 컴포넌트
 * - 자동 포커스 이동
 * - 붙여넣기 지원
 * - 에러 시 흔들림 애니메이션
 */
export default function CodeInput({ value = '', onChange, onComplete, disabled = false, error = false }) {
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const code = value.padEnd(4, '').split('').slice(0, 4);

    // 첫 번째 입력창에 자동 포커스
    useEffect(() => {
        if (!disabled && inputRefs[0].current) {
            inputRefs[0].current.focus();
        }
    }, [disabled]);

    // 에러 시 첫 번째 입력창으로 포커스
    useEffect(() => {
        if (error && inputRefs[0].current) {
            inputRefs[0].current.focus();
        }
    }, [error]);

    // 입력 핸들러
    const handleChange = (index, inputValue) => {
        // 숫자만 허용
        const digit = inputValue.replace(/[^0-9]/g, '').slice(-1);

        // 새 코드 배열 생성
        const newCode = [...code];
        newCode[index] = digit;
        const newValue = newCode.join('');

        onChange(newValue);

        // 다음 입력창으로 포커스 이동
        if (digit && index < 3) {
            inputRefs[index + 1].current?.focus();
        }

        // 4자리 완성 시 콜백
        if (newValue.length === 4 && !newValue.includes('')) {
            onComplete?.(newValue);
        }
    };

    // 키다운 핸들러
    const handleKeyDown = (index, e) => {
        // Backspace 처리
        if (e.key === 'Backspace') {
            if (!code[index] && index > 0) {
                // 현재 값이 없으면 이전 칸으로 이동 후 삭제
                inputRefs[index - 1].current?.focus();
                const newCode = [...code];
                newCode[index - 1] = '';
                onChange(newCode.join(''));
            } else {
                // 현재 값 삭제
                const newCode = [...code];
                newCode[index] = '';
                onChange(newCode.join(''));
            }
            e.preventDefault();
        }

        // 왼쪽 화살표
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs[index - 1].current?.focus();
        }

        // 오른쪽 화살표
        if (e.key === 'ArrowRight' && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    // 붙여넣기 핸들러
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.replace(/[^0-9]/g, '').slice(0, 4);

        if (digits.length > 0) {
            onChange(digits);

            // 마지막 입력된 칸으로 포커스
            const lastIndex = Math.min(digits.length - 1, 3);
            inputRefs[lastIndex].current?.focus();

            // 4자리 완성 시 콜백
            if (digits.length === 4) {
                onComplete?.(digits);
            }
        }
    };

    // 흔들림 애니메이션 variants
    const shakeVariants = {
        shake: {
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.5 }
        },
        idle: { x: 0 }
    };

    return (
        <motion.div
            variants={shakeVariants}
            animate={error ? 'shake' : 'idle'}
            className="flex justify-center gap-3"
        >
            {[0, 1, 2, 3].map((index) => (
                <motion.input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={code[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`
                        w-14 h-16 text-center text-2xl font-bold
                        border-2 rounded-xl outline-none
                        transition-all duration-200
                        ${disabled
                            ? 'bg-slate-100 border-slate-200 cursor-not-allowed text-slate-400'
                            : error
                                ? 'border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100'
                                : 'border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100'
                        }
                    `}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                />
            ))}
        </motion.div>
    );
}
