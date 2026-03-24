import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import FaqItem from '../../components/community/FaqItem';
import { NeoButton, NeoPagination } from '@/components/common/neo';
import { Search } from 'lucide-react';

// 테마별 스타일
const communityThemeStyles = {
    pop: {
        // Neo/Pop 스타일 - 핑크, 시안 계열
        button: 'bg-pink-500 hover:bg-pink-600 text-white',
        searchIconHover: 'hover:text-pink-500',
        categoryButtonActive: 'bg-pink-500 text-white',
        categoryButtonInactive: 'bg-white text-black hover:bg-pink-50',
        focusRing: 'focus:ring-pink-500',
    },
    classic: {
        button: 'bg-[#635bff] hover:bg-indigo-600 text-white',
        searchIconHover: 'hover:text-[#635bff]',
        categoryButtonActive: 'bg-[#635bff] text-white',
        categoryButtonInactive: 'bg-white text-black hover:bg-indigo-50',
        focusRing: 'focus:ring-[#635bff]',
    },
    dark: {
        button: 'bg-[#635bff] hover:bg-indigo-600 text-white',
        searchIconHover: 'hover:text-[#635bff]',
        categoryButtonActive: 'bg-[#635bff] text-white',
        categoryButtonInactive: 'bg-gray-700 text-gray-200 hover:bg-gray-600',
        focusRing: 'focus:ring-[#635bff]',
    },
    christmas: {
        button: 'bg-[#c41e3a] hover:bg-red-700 text-white',
        searchIconHover: 'hover:text-[#c41e3a]',
        categoryButtonActive: 'bg-[#c41e3a] text-white',
        categoryButtonInactive: 'bg-white text-black hover:bg-red-50',
        focusRing: 'focus:ring-[#c41e3a]',
    },
};

const ListFaq = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { theme } = useThemeStore();
    const themeStyle = communityThemeStyles[theme] || communityThemeStyles.pop;
    const [faqs, setFaqs] = useState([]);
    const [filteredFaqs, setFilteredFaqs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [activeCategory, setActiveCategory] = useState('전체');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [openFaqId, setOpenFaqId] = useState(null);
    const pageSize = 10;

    const isAdmin = user?.role === 'ADMIN';

    const categories = ['전체', '회원', '결제', '구독', '파티', '정산', '기타'];

    useEffect(() => {
        loadFaqList();
    }, []);

    const loadFaqList = async () => {
        try {
            const response = await fetch(`/api/community/faq?page=1&size=100`);

            if (!response.ok) {
                setFaqs([]);
                return;
            }

            const data = await response.json();
            setFaqs(data.content || []);
            setFilteredFaqs(data.content || []);
            updatePagination(data.content || []);
        } catch (error) {
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

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        filterFaqs(category, searchKeyword);
        setOpenFaqId(null);
    };

    const handleSearch = () => {
        filterFaqs(activeCategory, searchKeyword);
        setOpenFaqId(null);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
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

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        setOpenFaqId(null);
        window.scrollTo(0, 0);
    };

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredFaqs.slice(startIndex, endIndex);
    };

    const handleToggleFaq = (faqId) => {
        setOpenFaqId(openFaqId === faqId ? null : faqId);
    };

    const handleUpdateFaq = async (faqId, formData) => {
        try {
            const userId = user?.userId || 'admin@moa.com';

            const response = await fetch(`/api/community/faq/${faqId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    title: formData.title,
                    content: formData.content
                }),
            });

            if (response.ok) {
                alert('수정되었습니다.');
                loadFaqList();
                return true;
            } else {
                alert('수정에 실패했습니다.');
                return false;
            }
        } catch (error) {
            alert('수정 중 오류가 발생했습니다.');
            return false;
        }
    };

    return (
        <CommunityLayout>
            <div className="pt-8">
                {/* 카테고리 및 검색 영역 */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={`
                                    px-4 py-2 font-black text-sm rounded-lg
                                    ${theme === 'pop' ? 'border border-gray-200' : theme === 'dark' ? 'border border-gray-600' : 'border border-gray-200'}
                                    transition-all duration-200
                                    ${activeCategory === category
                                        ? `${themeStyle.categoryButtonActive} shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`
                                        : `${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : themeStyle.categoryButtonInactive} shadow-[4px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)] `
                                    }
                                `}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

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

            {/* FAQ 리스트 - 카드 레이어 없이 바로 표시 */}
            <div>
                {getCurrentPageData().length === 0 ? (
                    <div className="py-16 text-center font-bold text-gray-400">
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
                            onClick={() => navigate('/community/faq/add')}
                            color={themeStyle.button}
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
