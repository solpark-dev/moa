import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CommunityLayout from '../../components/community/CommunityLayout';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { NeoCard, NeoButton } from '@/components/common/neo';

// 테마별 스타일
const communityThemeStyles = {
    pop: {
        // Neo/Pop 스타일 - 핑크, 시안 계열
        dateBadge: 'bg-cyan-100 text-cyan-700',
        viewBadge: 'bg-pink-100 text-pink-700',
        editButton: 'bg-pink-500 hover:bg-pink-600 text-white',
    },
    classic: {
        dateBadge: 'bg-indigo-100 text-indigo-700',
        viewBadge: 'bg-purple-100 text-purple-700',
        editButton: 'bg-[#635bff] hover:bg-indigo-600 text-white',
    },
    dark: {
        dateBadge: 'bg-gray-700 text-gray-200',
        viewBadge: 'bg-gray-600 text-gray-200',
        editButton: 'bg-[#635bff] hover:bg-indigo-600 text-white',
    },
    christmas: {
        dateBadge: 'bg-[#1a5f2a] text-white',
        viewBadge: 'bg-[#c41e3a] text-white',
        editButton: 'bg-[#c41e3a] hover:bg-red-700 text-white',
    },
};

const GetNotice = () => {
    const navigate = useNavigate();
    const params = useParams();
    const noticeId = params.id || params.communityId;
    const { user } = useAuthStore();
    const { theme } = useThemeStore();
    const themeStyle = communityThemeStyles[theme] || communityThemeStyles.pop;
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === 'ADMIN';

    // Theme-specific color helpers
    const getAccentColor = () => {
        switch (theme) {
            case 'classic': return '#635bff';
            case 'dark': return '#635bff';
            case 'pop': return '#ec4899';
            case 'christmas': return '#c41e3a';
            default: return '#635bff';
        }
    };

    const getSecondaryColor = () => {
        switch (theme) {
            case 'classic': return '#06b6d4';
            case 'dark': return '#06b6d4';
            case 'pop': return '#84cc16';
            case 'christmas': return '#1a5f2a';
            default: return '#06b6d4';
        }
    };

    const getTextColor = () => {
        return theme === 'dark' ? 'text-white' : 'text-black';
    };

    useEffect(() => {
        if (!noticeId || noticeId === 'undefined') {
            navigate('/community/notice');
            return;
        }
        loadNotice();
    }, [noticeId]);

    const loadNotice = async () => {
        try {
            const response = await fetch(`/api/community/notice/${noticeId}`);

            if (!response.ok) {
                alert('공지사항을 찾을 수 없습니다.');
                navigate('/community/notice');
                return;
            }

            const data = await response.json();
            setNotice(data);
        } catch (error) {
            alert('공지사항을 불러오는데 실패했습니다.');
            navigate('/community/notice');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\. /g, '.').replace(/\.$/, '');
    };

    if (loading) {
        return (
            <CommunityLayout>
                <div className="py-20 text-center">
                    <span className="font-black text-gray-400">로딩 중...</span>
                </div>
            </CommunityLayout>
        );
    }

    if (!notice) {
        return (
            <CommunityLayout>
                <div className="py-20 text-center">
                    <span className="font-black text-gray-400">공지사항을 찾을 수 없습니다.</span>
                </div>
            </CommunityLayout>
        );
    }

    return (
        <CommunityLayout>
            <div className="max-w-3xl mx-auto pt-8">
                {/* 뒤로가기 버튼 */}
                <button
                    onClick={() => navigate('/community/notice')}
                    className={`flex items-center gap-2 mb-6 transition-colors group ${theme === "dark"
                        ? "text-gray-400 hover:text-[#635bff]"
                        : theme === "pop"
                            ? "text-black hover:text-pink-500"
                            : theme === "christmas"
                                ? "text-gray-500 hover:text-[#c41e3a]"
                                : "text-gray-400 hover:text-[#635bff]"
                        }`}
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold">목록으로</span>
                </button>

                <NeoCard
                    color={theme === "dark" ? "bg-[#1E293B]" : "bg-white"}
                    hoverable={false}
                    className="rounded-2xl p-6"
                >
                    <div className={`border-b pb-6 mb-6 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                        <h2 className={`text-xl font-black mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
                            {notice.title}
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 ${themeStyle.dateBadge} border border-gray-200 rounded-lg text-sm font-black`}>
                                등록일: {formatDate(notice.createdAt)}
                            </span>
                            <span className={`px-3 py-1 ${themeStyle.viewBadge} border border-gray-200 rounded-lg text-sm font-black`}>
                                조회수: {notice.viewCount || 0}
                            </span>
                        </div>
                    </div>

                    <div className={`min-h-[300px] py-6 font-medium leading-relaxed whitespace-pre-wrap ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        {notice.content}
                    </div>

                    <div className={`flex items-center justify-end mt-10 pt-6 border-t gap-3 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                        {isAdmin && (
                            <button
                                onClick={() => navigate(`/community/notice/update/${noticeId}`)}
                                className={`px-6 py-2 text-sm font-black ${themeStyle.editButton}
                                    border border-gray-200 rounded-xl
                                    shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
                                    hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]
                                    transition-all`}
                            >
                                수정
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/community/notice')}
                            className={`px-6 py-2 text-sm font-black rounded-xl transition-all ${theme === "dark"
                                ? "text-gray-200 bg-[#0F172A] border border-gray-700 hover:bg-gray-800"
                                : "text-black bg-white border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]"
                                }`}
                        >
                            목록
                        </button>
                    </div>
                </NeoCard>
            </div>
        </CommunityLayout>
    );
};

export default GetNotice;
