import React, { useState, useEffect } from 'react';
import CommunityLayout from '../../components/community/CommunityLayout';
import InquiryForm from '../../components/community/InquiryForm';
import InquiryItem from '../../components/community/InquiryItem';
import InquiryDetailModal from '../../components/community/InquiryDetailModal';
import { useAuthStore } from '@/store/authStore';
import { NeoPagination } from '@/components/common/neo';
import { toast } from '@/utils/toast';

const Inquiry = () => {
    const { user } = useAuthStore();
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
        if (userId) loadMyInquiries(1);
    }, [userId]);

    const loadMyInquiries = async (page) => {
        if (!userId) return;
        try {
            const response = await fetch(`/api/community/inquiry/my?userId=${userId}&page=${page}&size=${pageSize}`);
            if (!response.ok) { setInquiries([]); return; }
            const data = await response.json();
            setInquiries(data.content || []);
            setCurrentPage(data.page || 1);
            setTotalPages(data.totalPages || 0);
        } catch {
            setInquiries([]);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            toast.warning('제목을 입력하세요.');
            return;
        }
        if (!formData.content.trim()) {
            toast.warning('내용을 입력하세요.');
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append('userId', userId);
            submitData.append('communityCodeId', formData.communityCodeId);
            submitData.append('title', formData.title);
            submitData.append('content', formData.content);
            if (imageFile) submitData.append('file', imageFile);

            const response = await fetch('/api/community/inquiry', {
                method: 'POST',
                body: submitData
            });

            if (response.ok) {
                toast.success('문의가 등록되었습니다.');
                setFormData({ communityCodeId: 1, title: '', content: '' });
                setImageFile(null);
                setImagePreview(null);
                loadMyInquiries(1);
            } else {
                toast.error('등록에 실패했습니다.');
            }
        } catch {
            toast.error('등록 중 오류가 발생했습니다.');
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
        <CommunityLayout title="1:1 문의">
            <div className="space-y-8">
                {/* 문의하기 폼 */}
                <div>
                    <h3 className="text-[15px] font-black mb-4" style={{ color: "var(--theme-text)" }}>
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

                {/* 나의 문의 내역 */}
                <div>
                    <h3 className="text-[15px] font-black mb-4" style={{ color: "var(--theme-text)" }}>
                        나의 문의 내역
                    </h3>
                    <div
                        className="rounded-2xl p-4"
                        style={{
                            border: "1px solid var(--glass-border)",
                            background: "var(--glass-bg-overlay)",
                        }}
                    >
                        {inquiries.length === 0 ? (
                            <div className="py-10 text-center text-sm font-bold" style={{ color: "var(--theme-text-muted)" }}>
                                등록된 문의가 없습니다.
                            </div>
                        ) : (
                            inquiries.map((inquiry) => (
                                <InquiryItem
                                    key={inquiry.communityId}
                                    inquiry={inquiry}
                                    onClick={handleInquiryClick}
                                />
                            ))
                        )}
                        {totalPages > 1 && (
                            <div className="pt-4">
                                <NeoPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
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
