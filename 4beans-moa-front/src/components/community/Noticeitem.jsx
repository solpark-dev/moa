import React from 'react';
import { NeoCard } from '@/components/common/neo';
import { useThemeStore } from '@/store/themeStore';

const NoticeItem = ({ notice, index, formatDate, onClick }) => {
    const { theme } = useThemeStore();

    // Theme-based colors
    const communityThemeStyles = {
        pop: {
            // Neo/Pop 스타일 - 핑크, 시안 계열
            cardBg: 'bg-white',
            cardHover: 'hover:bg-pink-50',
            textColor: 'text-black',
            indexColor: 'text-gray-400',
            dateColor: 'text-gray-500',
            viewBadge: 'bg-pink-500',
        },
        classic: {
            cardBg: 'bg-white',
            cardHover: 'hover:bg-indigo-50',
            textColor: 'text-black',
            indexColor: 'text-gray-400',
            dateColor: 'text-gray-500',
            viewBadge: 'bg-[#635bff]',
        },
        dark: {
            cardBg: 'bg-[#1E293B]',
            cardHover: 'hover:bg-gray-700',
            textColor: 'text-gray-200',
            indexColor: 'text-gray-500',
            dateColor: 'text-gray-400',
            viewBadge: 'bg-[#635bff]',
        },
        christmas: {
            cardBg: 'bg-white',
            cardHover: 'hover:bg-red-50',
            textColor: 'text-black',
            indexColor: 'text-gray-400',
            dateColor: 'text-gray-500',
            viewBadge: 'bg-[#c41e3a]',
        },
    };

    const themeColors = communityThemeStyles[theme] || communityThemeStyles.pop;

    return (
        <div className="mb-3">
            <NeoCard
                color={themeColors.cardBg}
                hoverable={false}
                className={`rounded-xl p-4 cursor-pointer ${themeColors.cardHover} transition-all`}
                onClick={onClick}
            >
                <div className="grid grid-cols-12 items-center">
                    {/* 번호 */}
                    <div className="col-span-1 text-center">
                        <span className={`font-black ${themeColors.indexColor}`}>{index}</span>
                    </div>

                    {/* 제목 */}
                    <div className="col-span-7 px-2">
                        <span className={`font-bold ${themeColors.textColor} truncate block`}>
                            {notice.title}
                        </span>
                    </div>

                    {/* 등록일 */}
                    <div className={`col-span-2 text-center text-sm font-bold ${themeColors.dateColor}`}>
                        {formatDate(notice.createdAt)}
                    </div>

                    {/* 조회수 */}
                    <div className="col-span-2 flex justify-center">
                        <span className={`px-3 py-1 ${themeColors.viewBadge} text-white rounded-lg ${theme === 'pop' ? 'border border-gray-200' : ''} text-sm font-black`}>
                            {notice.viewCount || 0}
                        </span>
                    </div>
                </div>
            </NeoCard>
        </div>
    );
};

export default NoticeItem;
