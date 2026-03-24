import React from 'react';
import { useThemeStore } from '@/store/themeStore';

// 테마별 페이지네이션 스타일
const paginationThemeStyles = {
    pop: {
        activeBg: 'bg-pink-500',
        activeText: 'text-white',
    },
    classic: {
        activeBg: 'bg-[#635bff]',
        activeText: 'text-white',
    },
    dark: {
        activeBg: 'bg-[#635bff]',
        activeText: 'text-white',
    },
    christmas: {
        activeBg: 'bg-[#c41e3a]',
        activeText: 'text-white',
    },
};

/**
 * NeoPagination - 네오브루탈리즘 스타일 페이지네이션 컴포넌트
 *
 * @param {number} currentPage - 현재 페이지
 * @param {number} totalPages - 전체 페이지 수
 * @param {function} onPageChange - 페이지 변경 핸들러
 * @param {number} maxVisible - 표시할 최대 페이지 수 (기본값: 5)
 */
const NeoPagination = ({ currentPage, totalPages, onPageChange, maxVisible = 5 }) => {
    const { theme } = useThemeStore();
    const themeStyle = paginationThemeStyles[theme] || paginationThemeStyles.pop;
    if (totalPages <= 0) return null;

    const getPageNumbers = () => {
        const pages = [];
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = startPage + maxVisible - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        onPageChange(page);
    };

    return (
        <div className="flex justify-center">
            <div className="inline-flex items-center gap-2">
                {/* 이전 버튼 */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 font-black text-sm border border-gray-200 rounded-xl bg-white
                        disabled:opacity-50 disabled:cursor-not-allowed
                        hover:bg-slate-100
                        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
                        hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]
                        transition-all"
                >
                    이전
                </button>

                {/* 페이지 번호들 */}
                {getPageNumbers().map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 font-black text-sm border border-gray-200 rounded-xl transition-all shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
                            ${currentPage === pageNum
                                ? `${themeStyle.activeBg} ${themeStyle.activeText}`
                                : 'bg-white text-black hover:bg-slate-100 hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]'
                            }`}
                    >
                        {pageNum}
                    </button>
                ))}

                {/* 다음 버튼 */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 font-black text-sm border border-gray-200 rounded-xl bg-white
                        disabled:opacity-50 disabled:cursor-not-allowed
                        hover:bg-slate-100
                        shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
                        hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]
                        transition-all"
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export { NeoPagination };
