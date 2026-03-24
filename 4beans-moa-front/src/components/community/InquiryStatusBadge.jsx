import React from 'react';
import { useThemeStore } from '@/store/themeStore';

// 테마별 문의 상태 뱃지 스타일
const communityThemeStyles = {
    pop: {
        // Neo/Pop 스타일 - 핑크, 시안 계열
        completed: 'bg-cyan-500 text-white',
        pending: 'bg-gray-200 text-gray-600',
    },
    classic: {
        completed: 'bg-emerald-500 text-white',
        pending: 'bg-gray-200 text-gray-600',
    },
    dark: {
        completed: 'bg-emerald-500 text-white',
        pending: 'bg-gray-600 text-gray-300',
    },
    christmas: {
        completed: 'bg-[#1a5f2a] text-white',
        pending: 'bg-[#c41e3a] text-white',
    },
};

const InquiryStatusBadge = ({ status }) => {
    const { theme } = useThemeStore();
    const themeStyle = communityThemeStyles[theme] || communityThemeStyles.pop;

    if (status === '답변완료') {
        return (
            <span className={`px-3 py-1 text-xs font-black rounded-lg ${themeStyle.completed} border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}>
                답변완료
            </span>
        );
    }
    return (
        <span className={`px-3 py-1 text-xs font-black rounded-lg ${themeStyle.pending} border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}>
            답변대기
        </span>
    );
};

export default InquiryStatusBadge;
