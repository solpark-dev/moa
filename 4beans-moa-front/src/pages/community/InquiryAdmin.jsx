import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import InquiryStatusBadge from '../../components/community/InquiryStatusBadge';
import InquiryDetailModal from '../../components/community/InquiryDetailModal';
import InquiryAnswerModal from '../../components/community/InquiryAnswerModal';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { formatDate, getCategoryName } from '../../utils/communityUtils';
import { NeoCard, NeoButton, NeoPagination } from '@/components/common/neo';
import { ImageIcon } from 'lucide-react';

// 테마별 스타일
const communityThemeStyles = {
    pop: {
        // Neo/Pop 스타일 - 핑크, 시안 계열
        categoryBadge: 'bg-pink-100 text-pink-700',
        answerButton: 'bg-cyan-500 hover:bg-cyan-600 text-white',
        redirectButton: 'bg-pink-500 hover:bg-pink-600 text-white',
        hoverBg: 'hover:bg-pink-50',
    },
    classic: {
        categoryBadge: 'bg-indigo-100 text-indigo-700',
        answerButton: 'bg-emerald-500 hover:bg-emerald-600 text-white',
        redirectButton: 'bg-[#635bff] hover:bg-indigo-600 text-white',
        hoverBg: 'hover:bg-indigo-50',
    },
    dark: {
        categoryBadge: 'bg-gray-700 text-gray-200',
        answerButton: 'bg-emerald-500 hover:bg-emerald-600 text-white',
        redirectButton: 'bg-[#635bff] hover:bg-indigo-600 text-white',
        hoverBg: 'hover:bg-gray-700',
    },
    christmas: {
        categoryBadge: 'bg-[#c41e3a] text-white',
        answerButton: 'bg-[#1a5f2a] hover:bg-green-700 text-white',
        redirectButton: 'bg-[#c41e3a] hover:bg-red-700 text-white',
        hoverBg: 'hover:bg-red-50',
    },
};

const InquiryAdmin = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { theme } = useThemeStore();
    const themeStyle = communityThemeStyles[theme] || communityThemeStyles.pop;
    const [inquiries, setInquiries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
    const pageSize = 10;

    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        if (isAdmin) {
            loadAllInquiries(1);
        }
    }, [isAdmin]);

    const loadAllInquiries = async (page) => {
        try {
            const response = await fetch(`/api/community/inquiry?page=${page}&size=${pageSize}`);

            if (!response.ok) {
                setInquiries([]);
                return;
            }

            const data = await response.json();
            setInquiries(data.content || []);
            setCurrentPage(data.page || 1);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            setInquiries([]);
        }
    };

    if (!isAdmin) {
        return (
            <CommunityLayout>
                <div className="text-center py-20">
                    <NeoCard
                        color="bg-white"
                        hoverable={false}
                        className="inline-block px-8 py-6 rounded-2xl"
                    >
                        <p className="text-gray-600 font-bold mb-6">관리자만 접근 가능합니다.</p>
                        <NeoButton
                            onClick={() => navigate('/community/inquiry')}
                            color={themeStyle.redirectButton}
                            size="sm"
                        >
                            문의하기로 이동
                        </NeoButton>
                    </NeoCard>
                </div>
            </CommunityLayout>
        );
    }

    const handleTitleClick = (inquiry) => {
        setSelectedInquiry(inquiry);
        setIsDetailModalOpen(true);
    };

    const handleAnswerClick = (inquiry) => {
        setSelectedInquiry(inquiry);
        setIsAnswerModalOpen(true);
    };

    const handleAnswerSubmit = async (communityId, answerContent) => {
        const isUpdate = selectedInquiry?.answerContent;
        const method = isUpdate ? 'PUT' : 'POST';

        try {
            const response = await fetch('/api/community/inquiry/answer', {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    communityId: communityId,
                    answerContent: answerContent
                }),
            });

            if (response.ok) {
                alert(isUpdate ? '답변이 수정되었습니다.' : '답변이 등록되었습니다.');
                setIsAnswerModalOpen(false);
                loadAllInquiries(currentPage);
            } else {
                alert('답변 처리에 실패했습니다.');
            }
        } catch (error) {
            alert('답변 처리 중 오류가 발생했습니다.');
        }
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        loadAllInquiries(page);
    };

    return (
        <CommunityLayout>
            <div className="max-w-5xl mx-auto">
                <h2 className="text-lg font-black text-black mb-6">
                    문의 관리
                </h2>

                <NeoCard
                    color="bg-white"
                    hoverable={false}
                    className="rounded-2xl overflow-hidden"
                >
                    {/* 테이블 헤더 */}
                    <div className="bg-slate-100 border-b border-gray-200">
                        <div className="grid gap-4 py-3 px-4 text-sm font-black text-black" style={{ gridTemplateColumns: 'repeat(19, minmax(0, 1fr))' }}>
                            <div className="col-span-1 text-center">번호</div>
                            <div className="col-span-1 text-center" style={{ whiteSpace: 'nowrap' }}>카테고리</div>
                            <div className="col-span-8 pl-4">제목</div>
                            <div className="col-span-3 text-center">작성자</div>
                            <div className="col-span-2 text-center">작성일</div>
                            <div className="col-span-2 text-center">상태</div>
                            <div className="col-span-2 text-center">관리</div>
                        </div>
                    </div>

                    {inquiries.length === 0 ? (
                        <div className="py-20 text-center font-bold text-gray-400">
                            등록된 문의가 없습니다.
                        </div>
                    ) : (
                        inquiries.map((inquiry, index) => (
                            <div
                                key={inquiry.communityId}
                                onClick={() => handleTitleClick(inquiry)}
                                className={`grid gap-4 py-4 px-4 border-b border-gray-200 last:border-b-0 ${themeStyle.hoverBg} items-center text-sm cursor-pointer transition-colors`}
                                style={{ gridTemplateColumns: 'repeat(19, minmax(0, 1fr))' }}
                            >
                                <div className="col-span-1 text-center font-bold text-gray-600">
                                    {(currentPage - 1) * pageSize + index + 1}
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <span className={`px-2 py-1 text-xs font-black rounded-lg ${themeStyle.categoryBadge} border border-gray-200`} style={{ whiteSpace: 'nowrap' }}>
                                        {getCategoryName(inquiry.communityCodeId)}
                                    </span>
                                </div>
                                <div className="col-span-8 pl-4 flex items-center gap-2 font-bold text-black">
                                    <span className="truncate">{inquiry.title}</span>
                                    {inquiry.fileOriginal && (
                                        <ImageIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    )}
                                </div>
                                <div className="col-span-3 text-center font-medium text-gray-600">
                                    {inquiry.userId}
                                </div>
                                <div className="col-span-2 text-center font-medium text-gray-600" style={{ whiteSpace: 'nowrap' }}>
                                    {formatDate(inquiry.createdAt)}
                                </div>
                                <div className="col-span-2 flex justify-center">
                                    <InquiryStatusBadge status={inquiry.answerStatus} />
                                </div>
                                <div className="col-span-2 text-center">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAnswerClick(inquiry);
                                        }}
                                        className={`px-3 py-1.5 text-xs font-black rounded-lg border border-gray-200
                                            shadow-[4px_4px_12px_rgba(0,0,0,0.08)]
                                            hover:shadow-[6px_6px_16px_rgba(0,0,0,0.12)]
                                            transition-all
                                            ${inquiry.answerStatus === '답변완료'
                                                ? 'bg-white text-black'
                                                : themeStyle.answerButton
                                            }`}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        {inquiry.answerStatus === '답변완료' ? '수정' : '답변'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    {/* 페이지네이션 */}
                    {totalPages > 0 && (
                        <div className="py-6 border-t border-gray-200">
                            <NeoPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </NeoCard>
            </div>

            <InquiryDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                inquiry={selectedInquiry}
            />

            <InquiryAnswerModal
                isOpen={isAnswerModalOpen}
                onClose={() => setIsAnswerModalOpen(false)}
                inquiry={selectedInquiry}
                onAnswerSubmit={handleAnswerSubmit}
            />
        </CommunityLayout>
    );
};

export default InquiryAdmin;
