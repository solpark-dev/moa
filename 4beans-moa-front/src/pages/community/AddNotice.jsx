import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/community/CommunityLayout';
import NoticeForm from '../../components/community/NoticeForm';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { NeoCard, NeoButton } from '@/components/common/neo';

// 테마별 스타일
const communityThemeStyles = {
    pop: {
        // Neo/Pop 스타일 - 핑크 계열
        button: 'bg-pink-500 hover:bg-pink-600 text-white',
    },
    classic: {
        button: 'bg-[#635bff] hover:bg-indigo-600 text-white',
    },
    dark: {
        button: 'bg-[#635bff] hover:bg-indigo-600 text-white',
    },
    christmas: {
        button: 'bg-[#c41e3a] hover:bg-red-700 text-white',
    },
};

const AddNotice = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { theme } = useThemeStore();
    const themeStyle = communityThemeStyles[theme] || communityThemeStyles.pop;
    const [formData, setFormData] = useState({
        communityCodeId: 10,
        title: '',
        content: ''
    });

    const isAdmin = user?.role === 'ADMIN';
    const userId = user?.userId || 'admin@moa.com';

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
                            onClick={() => navigate('/community/notice')}
                            color={themeStyle.button}
                            size="sm"
                        >
                            목록으로 돌아가기
                        </NeoButton>
                    </NeoCard>
                </div>
            </CommunityLayout>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('제목을 입력하세요.');
            return;
        }

        if (!formData.content.trim()) {
            alert('내용을 입력하세요.');
            return;
        }

        try {
            const response = await fetch('/api/community/notice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userId: userId
                }),
            });

            if (response.ok) {
                alert('공지사항이 등록되었습니다.');
                navigate('/community/notice');
            } else {
                alert('등록에 실패했습니다.');
            }
        } catch (error) {
            alert('등록 중 오류가 발생했습니다.');
        }
    };

    return (
        <CommunityLayout>
            <div className="max-w-3xl mx-auto pt-8">
                <h2 className="text-lg font-black text-black mb-6">
                    공지사항 등록
                </h2>
                <NeoCard
                    color="bg-white"
                    hoverable={false}
                    className="rounded-2xl p-6"
                >
                    <NoticeForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        submitText="등록"
                        cancelPath="/community/notice"
                    />
                </NeoCard>
            </div>
        </CommunityLayout>
    );
};

export default AddNotice;
