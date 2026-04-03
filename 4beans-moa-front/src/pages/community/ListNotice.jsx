import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import { useAuthStore } from '@/store/authStore';
import NoticeItem from '../../components/community/NoticeItem';
import { NeoButton, NeoPagination } from '@/components/common/neo';
import { Search } from 'lucide-react';

const ListNotice = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
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
            if (!response.ok) { setNotices([]); return; }
            const data = await response.json();
            const sorted = (data.content || []).sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setNotices(sorted);
            setFilteredNotices(sorted);
            updatePagination(sorted);
        } catch {
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
        const filtered = notices.filter(n =>
            n.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            n.content.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        setFilteredNotices(filtered);
        updatePagination(filtered);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const getCurrentPageData = () => {
        const start = (currentPage - 1) * pageSize;
        return filteredNotices.slice(start, start + pageSize);
    };

    const formatDate = (dateString) => {
        return new Date(dateString)
            .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
            .replace(/\. /g, '.').replace(/\.$/, '');
    };

    const getNoticeId = (notice) => notice.communityId || notice.id;

    const handleNoticeClick = (notice) => {
        const id = getNoticeId(notice);
        if (id) navigate(`/community/notice/${id}`);
    };

    const inputStyle = {
        border: "1px solid var(--glass-border)",
        background: "var(--glass-bg-overlay)",
        color: "var(--theme-text)",
        borderRadius: "0.75rem",
        padding: "8px 40px 8px 16px",
        fontSize: "0.875rem",
        outline: "none",
        width: "14rem",
    };

    return (
        <CommunityLayout title="공지사항">
            {/* 검색 */}
            <div className="flex items-center justify-end mb-5 pb-4" style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="검색어 입력"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={inputStyle}
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--theme-text-muted)" }}
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* 리스트 */}
            <div>
                {getCurrentPageData().length === 0 ? (
                    <div className="py-16 text-center text-sm font-bold" style={{ color: "var(--theme-text-muted)" }}>
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

            {/* 페이지네이션 + 등록 버튼 */}
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
                            color="bg-[#635bff] hover:bg-[#5851e8] text-white"
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
