import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { NeoCard, NeoButton } from '@/components/common/neo';

const CommunityLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthStore();
    const { theme } = useThemeStore();

    // Theme-based colors
    const communityThemeStyles = {
        pop: {
            // Neo/Pop 스타일 - 핑크, 시안 계열
            primary: 'bg-pink-500',
            secondary: 'bg-cyan-500',
            tertiary: 'bg-lime-400',
            activeTab: 'bg-pink-500',
            inactiveTabHover: 'hover:bg-pink-50',
        },
        classic: {
            primary: 'bg-[#635bff]',
            secondary: 'bg-indigo-500',
            tertiary: 'bg-purple-400',
            activeTab: 'bg-[#635bff]',
            inactiveTabHover: 'hover:bg-indigo-50',
        },
        dark: {
            primary: 'bg-[#635bff]',
            secondary: 'bg-indigo-500',
            tertiary: 'bg-purple-400',
            activeTab: 'bg-[#635bff]',
            inactiveTabHover: 'hover:bg-gray-700',
        },
        christmas: {
            primary: 'bg-[#c41e3a]',
            secondary: 'bg-[#1a5f2a]',
            tertiary: 'bg-white',
            activeTab: 'bg-[#c41e3a]',
            inactiveTabHover: 'hover:bg-red-50',
        },
    };

    const themeColors = communityThemeStyles[theme] || communityThemeStyles.pop;

    const isActiveTab = (path) => {
        if (path === '/community/inquiry') {
            return location.pathname.includes('/community/inquiry');
        }
        return location.pathname.includes(path);
    };

    const handleInquiryClick = () => {
        if (!user) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }

        if (user.role === 'ADMIN') {
            navigate('/community/inquiry/admin');
        } else {
            navigate('/community/inquiry');
        }
    };

    const tabs = [
        { name: 'FAQ', path: '/community/faq', onClick: null },
        { name: '공지사항', path: '/community/notice', onClick: null },
        { name: '1:1 문의', path: '/community/inquiry', onClick: handleInquiryClick }
    ];

    return (
        <div className="min-h-screen bg-transparent relative z-10">
            {/* Header Section */}
            <div className={`${theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'} bg-transparent`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
                    <NeoCard
                        color={themeColors.primary}
                        rotate={-1}
                        hoverable={false}
                        className="inline-block px-6 py-3 rounded-2xl mx-auto"
                    >
                        <h1 className={`text-3xl font-black tracking-tight text-white`}>
                            고객센터
                        </h1>
                    </NeoCard>
                </div>

                {/* Tab Navigation */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                    <nav className="flex justify-center gap-4">
                        {tabs.map((tab) => {
                            const isActive = isActiveTab(tab.path);
                            return (
                                <button
                                    key={tab.name}
                                    onClick={() => tab.onClick ? tab.onClick() : navigate(tab.path)}
                                    className={`
                                        px-6 py-3 font-black text-lg rounded-xl
                                        ${theme === 'pop' ? 'border border-gray-200' : theme === 'dark' ? 'border border-gray-600' : 'border border-gray-200'}
                                        transition-all duration-200
                                        ${isActive
                                            ? `${themeColors.activeTab} ${theme === 'dark' ? 'text-white' : 'text-white'} shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`
                                            : `${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-white text-black'} ${themeColors.inactiveTabHover} shadow-[4px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`
                                        }
                                    `}
                                >
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {children}
            </div>
        </div>
    );
};

export default CommunityLayout;
