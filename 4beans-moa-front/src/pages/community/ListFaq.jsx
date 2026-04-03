import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import { useAuthStore } from '@/store/authStore';
import FaqItem from '../../components/community/FaqItem';
import { NeoButton, NeoPagination } from '@/components/common/neo';
import { toast } from '@/utils/toast';
import { Search } from 'lucide-react';

const CATEGORIES = ['전체', '회원', '결제', '구독', '파티', '정산', '기타'];

const ListFaq = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [faqs, setFaqs] = useState([]);
    const [filteredFaqs, setFilteredFaqs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [activeCategory, setActiveCategory] = useState('전체');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [openFaqId, setOpenFaqId] = useState(null);
    const pageSize = 10;

    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        loadFaqList();
    }, []);

    const loadFaqList = async () => {
        try {
            const response = await fetch(`/api/community/faq?page=1&size=100`);
            if (!response.ok) { setFaqs([]); return; }
            const data = await response.json();
            const list = data.content || [];
            setFaqs(list);
            setFilteredFaqs(list);
            updatePagination(list);
        } catch {
            setFaqs([]);
        }
    };

    const updatePagination = (data) => {
        setTotalPages(Math.ceil(data.length / pageSize));
        setCurrentPage(1);
    };

    const getCategoryFromTitle = (title) => {
        if (title.includes('[회원]')) return '회원';
        if (title.includes('[결제]')) return '결제';
        if (title.includes('[구독]')) return '구독';
        if (title.includes('[파티]')) return '파티';
        if (title.includes('[정산]')) return '정산';
        if (title.includes('[보증금]')) return '보증금';
        if (title.includes('[기타]')) return '기타';
        return '기타';
    };

    const filterFaqs = (category, keyword) => {
        let result = [...faqs];
        if (category !== '전체') {
            result = result.filter(faq => getCategoryFromTitle(faq.title) === category);
        }
        if (keyword.trim()) {
            result = result.filter(faq =>
                faq.title.toLowerCase().includes(keyword.toLowerCase()) ||
                faq.content.toLowerCase().includes(keyword.toLowerCase())
            );
        }
        setFilteredFaqs(result);
        updatePagination(result);
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        filterFaqs(category, searchKeyword);
        setOpenFaqId(null);
    };

    const handleSearch = () => {
        filterFaqs(activeCategory, searchKeyword);
        setOpenFaqId(null);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        setOpenFaqId(null);
        window.scrollTo(0, 0);
    };

    const getCurrentPageData = () => {
        const start = (currentPage - 1) * pageSize;
        return filteredFaqs.slice(start, start + pageSize);
    };

    const handleToggleFaq = (faqId) => {
        setOpenFaqId(openFaqId === faqId ? null : faqId);
    };

    const handleUpdateFaq = async (faqId, formData) => {
        try {
            const userId = user?.userId;
            const response = await fetch(`/api/community/faq/${faqId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, title: formData.title, content: formData.content }),
            });
            if (response.ok) {
                toast.success('수정되었습니다.');
                loadFaqList();
                return true;
            } else {
                toast.error('수정에 실패했습니다.');
                return false;
            }
        } catch {
            toast.error('수정 중 오류가 발생했습니다.');
            return false;
        }
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

    const categoryBtnStyle = (active) => ({
        padding: "6px 16px",
        borderRadius: "0.5rem",
        border: "1px solid var(--glass-border)",
        background: active ? "var(--theme-primary)" : "var(--glass-bg-overlay)",
        color: active ? "#fff" : "var(--theme-text)",
        fontWeight: 900,
        fontSize: "0.875rem",
        cursor: "pointer",
        transition: "all 0.15s",
    });

    return (
        <CommunityLayout title="자주 묻는 질문">
            {/* 카테고리 + 검색 */}
            <div className="mb-5 pb-4 space-y-3" style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => handleCategoryChange(cat)}
                            style={categoryBtnStyle(activeCategory === cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="flex justify-end">
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
            </div>

            {/* FAQ 리스트 */}
            <div>
                {getCurrentPageData().length === 0 ? (
                    <div className="py-16 text-center text-sm font-bold" style={{ color: "var(--theme-text-muted)" }}>
                        등록된 FAQ가 없습니다.
                    </div>
                ) : (
                    getCurrentPageData().map((faq, index) => (
                        <FaqItem
                            key={faq.communityId}
                            faq={faq}
                            index={(currentPage - 1) * pageSize + index + 1}
                            isAdmin={isAdmin}
                            onUpdate={handleUpdateFaq}
                            getCategoryFromTitle={getCategoryFromTitle}
                            isOpen={openFaqId === faq.communityId}
                            onToggle={handleToggleFaq}
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
                            onClick={() => navigate('/community/faq/add')}
                            color="bg-[#635bff] hover:bg-[#5851e8] text-white"
                            size="sm"
                        >
                            FAQ 등록
                        </NeoButton>
                    </div>
                )}
            </div>
        </CommunityLayout>
    );
};

export default ListFaq;
