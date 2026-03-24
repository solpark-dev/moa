import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';

/**
 * 카운트다운 타이머 컴포넌트
 * @param {Date|string} expiresAt - 만료 시간
 * @param {function} onExpire - 만료 시 콜백
 */
export default function CountdownTimer({ expiresAt, onExpire }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        if (!expiresAt) return { minutes: 10, seconds: 0, total: 600 };

        const expireTime = new Date(expiresAt).getTime();
        const now = Date.now();
        const diff = Math.max(0, Math.floor((expireTime - now) / 1000));

        return {
            minutes: Math.floor(diff / 60),
            seconds: diff % 60,
            total: diff
        };
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            if (newTimeLeft.total <= 0) {
                clearInterval(interval);
                onExpire?.();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, onExpire]);

    // 시간 포맷팅
    const formatTime = () => {
        const mins = String(timeLeft.minutes).padStart(2, '0');
        const secs = String(timeLeft.seconds).padStart(2, '0');
        return `${mins}:${secs}`;
    };

    // 남은 시간에 따른 스타일
    const getTimerColor = () => {
        if (timeLeft.total <= 60) return 'text-red-500'; // 1분 이하
        if (timeLeft.total <= 180) return 'text-orange-500'; // 3분 이하
        return 'text-slate-500';
    };

    const isUrgent = timeLeft.total <= 60;

    return (
        <motion.div
            className={`flex items-center justify-center gap-2 ${getTimerColor()}`}
            animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
            transition={isUrgent ? { duration: 1, repeat: Infinity } : {}}
        >
            {isUrgent ? (
                <AlertCircle className="w-4 h-4" />
            ) : (
                <Clock className="w-4 h-4" />
            )}
            <span className="font-mono text-sm font-medium">
                {formatTime()} 남음
            </span>
        </motion.div>
    );
}
