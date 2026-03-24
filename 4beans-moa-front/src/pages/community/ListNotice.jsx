import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import NoticeItem from '../../components/community/NoticeItem';
import { NeoButton, NeoPagination } from '@/components/common/neo';
import { Search } from 'lucide-react';

// 테마별 스타일
const communityThemeStyles = {
    pop: {
        // Neo/Pop 스타일 - 핑크, 시안 계열
        button: 'bg-pink-500 hover:bg-pink-600 text-white',
        searchIconHover: 'hover:text-pink-500',
        focusRing: 'focus:ring-pink-500',
    },
    classic: {
        button: 'bg-[#635bff] hover:bg-[#5851e8] text-white',
        searchIconHover: 'hover:text-[#635bff]',
        focusRing: 'focus:ring-[#635bff]',
    },
    dark: {
        button: 'bg-[#635bff] hover:bg-[#5851e8] text-white',
        searchIconHover: 'hover:text-[#635bff]',
        focusRing: 'focus:ring-[#635bff]',
    },
    christmas: {
        button: 'bg-[#c41e3a] hover:bg-red-700 text-white',
        searchIconHover: 'hover:text-[#c41e3a]',
        focusRing: 'focus:ring-[#c41e3a]',
    },
};

const ListNotice = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { theme } = useThemeStore();
    const themeStyle = communityThemeStyles[theme] || communityThemeStyles.pop;
    const [notices, setNotices] = useState([]);
    const [filteredNotices, setFilteredNotices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const pageSize = 10;

    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        loadNoticeList();
    }, []);

    const loadNoticeList = async () => {
        try {
            const response = await fetch(`/api/community/notice?page=1&size=100`);

            if (!response.ok) {
                setNotices([]);
                return;
            }

            const data = await response.json();
            const sortedNotices = (data.content || []).sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setNotices(sortedNotices);
            setFilteredNotices(sortedNotices);
            updatePagination(sortedNotices);
        } catch (error) {
            setNotices([]);
        }
    };

    const updatePagination = (data) => {
        setTotalPages(Math.ceil(data.length / pageSize));
        setCurrentPage(1);
    };

    const handleSearch = () => {
        if (!searchKeyword.trim()) {
            setFilteredNotices(notices);
            updatePagination(notices);
            return;
        }

        const filtered = notices.filter(notice =>
            notice.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            notice.content.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        setFilteredNotices(filtered);
        updatePagination(filtered);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredNotices.slice(startIndex, endIndex);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\. /g, '.').replace(/\.$/, '');
    };

    const getNoticeId = (notice) => {
        return notice.communityId || notice.id;
    };

    const handleNoticeClick = (notice) => {
        const id = getNoticeId(notice);
        if (id) {
            navigate(`/community/notice/${id}`);
        }
    };

    return (
        <CommunityLayout>
            <div className="pt-8">
                {/* 검색 영역 */}
                <div className="flex items-center justify-end mb-6 pb-4 border-b border-gray-200">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="검색어 입력"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className={`w-56 px-4 py-2 pr-10 font-bold
                                border border-gray-200 rounded-xl
                                shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
                                focus:outline-none focus:ring-2 ${themeStyle.focusRing}
                                transition-all`}
                        />
                        <button
                            onClick={handleSearch}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-black'} ${themeStyle.searchIconHover} transition-colors`}
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 공지사항 리스트 */}
            <div>
                {getCurrentPageData().length === 0 ? (
                    <div className="py-16 text-center font-bold text-gray-400">
                        등록된 공지사항이 없습니다.
                    </div>
                ) : (
                    getCurrentPageData().map((notice, index) => (
                        <NoticeItem
                            key={getNoticeId(notice)}
                            notice={notice}
                            index={filteredNotices.length - ((currentPage - 1) * pageSize + index)}
                            formatDate={formatDate}
                            onClick={() => handleNoticeClick(notice)}
                        />
                    ))
                )}
            </div>

            {/* 페이지네이션 및 등록 버튼 */}
            <div className="flex items-center justify-center mt-8 relative">
                {totalPages > 1 && (
                    <NeoPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}

                {isAdmin && (
                    <div className="absolute right-0">
                        <NeoButton
                            onClick={() => navigate('/community/notice/add')}
                            color={themeStyle.button}
                            size="sm"
                        >
                            등록
                        </NeoButton>
                    </div>
                )}
            </div>
        </CommunityLayout>
    );
};

export default ListNotice;
