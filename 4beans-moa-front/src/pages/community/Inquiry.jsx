import React, { useState, useEffect } from 'react';
import CommunityLayout from '../../components/community/CommunityLayout';
import InquiryForm from '../../components/community/InquiryForm';
import InquiryItem from '../../components/community/InquiryItem';
import InquiryDetailModal from '../../components/community/InquiryDetailModal';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { NeoCard, NeoPagination } from '@/components/common/neo';

// 테마별 스타일
const communityThemeStyles = {
    pop: {
        cardBg: 'bg-white',
        textColor: 'text-black',
    },
    classic: {
        cardBg: 'bg-white',
        textColor: 'text-black',
    },
    dark: {
        cardBg: 'bg-[#1E293B]',
        textColor: 'text-gray-200',
    },
    christmas: {
        cardBg: 'bg-white',
        textColor: 'text-black',
    },
};

const Inquiry = () => {
    const { user } = useAuthStore();
    const { theme } = useThemeStore();
    const themeStyle = communityThemeStyles[theme] || communityThemeStyles.pop;
    const [inquiries, setInquiries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        communityCodeId: 1,
        title: '',
        content: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const pageSize = 5;

    const userId = user?.userId;

    useEffect(() => {
        if (userId) {
            loadMyInquiries(1);
        }
    }, [userId]);

    const loadMyInquiries = async (page) => {
        if (!userId) return;

        try {
            const response = await fetch(`/api/community/inquiry/my?userId=${userId}&page=${page}&size=${pageSize}`);

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

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            alert('제목을 입력하세요.');
            return;
        }

        if (!formData.content.trim()) {
            alert('내용을 입력하세요.');
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append('userId', userId);
            submitData.append('communityCodeId', formData.communityCodeId);
            submitData.append('title', formData.title);
            submitData.append('content', formData.content);

            if (imageFile) {
                submitData.append('file', imageFile);
            }

            const response = await fetch('/api/community/inquiry', {
                method: 'POST',
                body: submitData
            });

            if (response.ok) {
                alert('문의가 등록되었습니다.');
                setFormData({
                    communityCodeId: 1,
                    title: '',
                    content: ''
                });
                setImageFile(null);
                setImagePreview(null);
                loadMyInquiries(1);
            } else {
                alert('등록에 실패했습니다.');
            }
        } catch (error) {
            alert('등록 중 오류가 발생했습니다.');
        }
    };

    const handleInquiryClick = (inquiry) => {
        setSelectedInquiry(inquiry);
        setIsDetailModalOpen(true);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        loadMyInquiries(page);
    };


    return (
        <CommunityLayout>
            <div className="max-w-[1100px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 min-w-0">
                    {/* 문의하기 섹션 */}
                    <div className="min-w-0 overflow-hidden">
                        <h3 className={`text-lg font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                            문의하기
                        </h3>
                        <InquiryForm
                            formData={formData}
                            setFormData={setFormData}
                            imagePreview={imagePreview}
                            setImageFile={setImageFile}
                            setImagePreview={setImagePreview}
                            onSubmit={handleSubmit}
                        />
                    </div>

                    {/* 나의 문의 내역 섹션 */}
                    <div className="min-w-0 overflow-hidden">
                        <h3 className={`text-lg font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                            나의 문의 내역
                        </h3>

                        {/* 리스트를 하나의 카드로 감싸기 (문의하기 폼과 동일한 높이) */}
                        <NeoCard
                            color={theme === 'dark' ? 'bg-[#1E293B]' : 'bg-white'}
                            hoverable={false}
                            className="rounded-2xl p-6 h-[687px] flex flex-col"
                        >
                            {inquiries.length === 0 ? (
                                <div className={`flex-1 flex items-center justify-center font-bold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    등록된 문의가 없습니다.
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto">
                                    {inquiries.map((inquiry) => (
                                        <InquiryItem
                                            key={inquiry.communityId}
                                            inquiry={inquiry}
                                            onClick={handleInquiryClick}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* 페이지네이션 - 카드 안 하단 */}
                            <div className="pt-4">
                                <NeoPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </NeoCard>
                    </div>
                </div>
            </div>

            <InquiryDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                inquiry={selectedInquiry}
            />
        </CommunityLayout>
    );
};

export default Inquiry;
