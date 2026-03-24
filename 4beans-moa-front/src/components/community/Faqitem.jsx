import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { NeoCard, NeoButton } from '@/components/common/neo';
import { useThemeStore } from '@/store/themeStore';

const FaqItem = ({ faq, index, isAdmin, onUpdate, getCategoryFromTitle, isOpen, onToggle }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editCategory, setEditCategory] = useState('');
    const [editFormData, setEditFormData] = useState({
        title: '',
        content: faq.content
    });
    const { theme } = useThemeStore();

    // Theme-based colors
    const communityThemeStyles = {
        pop: {
            // Neo/Pop 스타일 - 핑크, 시안 계열
            categoryBadge: 'bg-pink-500',
            focusRing: 'focus:ring-pink-500',
            saveButton: 'bg-cyan-500',
            editButton: 'bg-pink-500',
            cardBg: 'bg-white',
            hoverBg: 'hover:bg-pink-50',
            answerBg: 'bg-slate-50',
            textColor: 'text-black',
            iconColor: 'text-black',
        },
        classic: {
            categoryBadge: 'bg-[#635bff]',
            focusRing: 'focus:ring-[#635bff]',
            saveButton: 'bg-indigo-500',
            editButton: 'bg-[#635bff]',
            cardBg: 'bg-white',
            hoverBg: 'hover:bg-indigo-50',
            answerBg: 'bg-slate-50',
            textColor: 'text-black',
            iconColor: 'text-black',
        },
        dark: {
            categoryBadge: 'bg-[#635bff]',
            focusRing: 'focus:ring-[#635bff]',
            saveButton: 'bg-indigo-500',
            editButton: 'bg-[#635bff]',
            cardBg: 'bg-[#1E293B]',
            hoverBg: 'hover:bg-gray-700',
            answerBg: 'bg-[#0F172A]',
            textColor: 'text-gray-200',
            iconColor: 'text-gray-400',
        },
        christmas: {
            categoryBadge: 'bg-[#c41e3a]',
            focusRing: 'focus:ring-[#c41e3a]',
            saveButton: 'bg-[#1a5f2a]',
            editButton: 'bg-[#1a5f2a]',
            cardBg: 'bg-white',
            hoverBg: 'hover:bg-red-50',
            answerBg: 'bg-slate-50',
            textColor: 'text-black',
            iconColor: 'text-black',
        },
    };

    const themeColors = communityThemeStyles[theme] || communityThemeStyles.pop;

    const categories = ['회원', '결제', '구독', '파티', '정산', '기타'];
    const category = getCategoryFromTitle ? getCategoryFromTitle(faq.title) : '기타';

    const getDisplayTitle = (title) => {
        return title.replace(/\[.*?\]\s*/, '');
    };

    const handleToggle = () => {
        if (!isEditing) {
            onToggle(faq.communityId);
        }
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setIsEditing(true);
        if (!isOpen) {
            onToggle(faq.communityId);
        }
        setEditCategory(category);
        setEditFormData({
            title: getDisplayTitle(faq.title),
            content: faq.content
        });
    };

    const handleEditChange = (field, value) => {
        setEditFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (!editFormData.title.trim()) {
            alert('질문 제목을 입력하세요.');
            return;
        }

        if (!editFormData.content.trim()) {
            alert('답변 내용을 입력하세요.');
            return;
        }

        const titleWithCategory = `[${editCategory}] ${editFormData.title}`;
        const success = await onUpdate(faq.communityId, {
            title: titleWithCategory,
            content: editFormData.content
        });
        if (success) {
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditCategory(category);
        setEditFormData({
            title: getDisplayTitle(faq.title),
            content: faq.content
        });
    };

    return (
        <div className="mb-4">
            <NeoCard
                color={themeColors.cardBg}
                hoverable={false}
                className="rounded-2xl overflow-hidden"
            >
                {/* Question Header */}
                <div
                    onClick={handleToggle}
                    className={`flex items-center p-5 cursor-pointer ${themeColors.hoverBg} transition-colors`}
                >
                    <span className={`px-3 py-1 text-sm font-black ${themeColors.categoryBadge} text-white rounded-lg ${theme === 'pop' ? 'border border-gray-200' : ''} shadow-[4px_4px_12px_rgba(0,0,0,0.08)] mr-4`}>
                        {category}
                    </span>
                    <span className={`flex-1 font-bold ${themeColors.textColor}`}>
                        {getDisplayTitle(faq.title)}
                    </span>
                    <ChevronDown
                        className={`w-6 h-6 ${themeColors.iconColor} transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>

                {/* Answer Content */}
                {isOpen && (
                    <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-5 ${themeColors.answerBg}`}>
                        {isEditing ? (
                            <div className="space-y-4">
                                {/* 카테고리 + 제목 한 줄 */}
                                <div className="flex gap-3">
                                    <select
                                        value={editCategory}
                                        onChange={(e) => setEditCategory(e.target.value)}
                                        className={`px-3 py-2 ${theme === 'dark' ? 'border-gray-700 bg-[#0F172A] text-gray-200' : 'border-gray-200 bg-white text-black'} rounded-xl font-black
                                            focus:outline-none focus:ring-2 ${themeColors.focusRing}`}
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <input
                                        value={editFormData.title}
                                        onChange={(e) => handleEditChange('title', e.target.value)}
                                        placeholder="질문 제목"
                                        className={`flex-1 px-4 py-2 ${theme === 'dark' ? 'border-gray-700 bg-[#0F172A] text-gray-200' : 'border-gray-200 bg-white text-black'} rounded-xl font-bold
                                            focus:outline-none focus:ring-2 ${themeColors.focusRing}`}
                                    />
                                </div>
                                {/* 답변 내용 */}
                                <textarea
                                    value={editFormData.content}
                                    onChange={(e) => handleEditChange('content', e.target.value)}
                                    rows={6}
                                    placeholder="답변 내용"
                                    className={`w-full px-4 py-3 ${theme === 'dark' ? 'border-gray-700 bg-[#0F172A] text-gray-200' : 'border-gray-200 bg-white text-black'} rounded-xl font-bold resize-none
                                        focus:outline-none focus:ring-2 ${themeColors.focusRing}`}
                                />
                                <div className="flex gap-3 justify-end">
                                    <NeoButton
                                        color={theme === 'dark' ? 'bg-gray-700' : 'bg-white'}
                                        size="sm"
                                        onClick={handleCancel}
                                    >
                                        취소
                                    </NeoButton>
                                    <NeoButton
                                        color={themeColors.saveButton}
                                        size="sm"
                                        onClick={handleSave}
                                    >
                                        저장
                                    </NeoButton>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium leading-relaxed whitespace-pre-wrap`}>
                                    {faq.content}
                                </p>
                                {isAdmin && (
                                    <div className="flex justify-end mt-4">
                                        <NeoButton
                                            color={themeColors.editButton}
                                            size="sm"
                                            onClick={handleEditClick}
                                        >
                                            수정
                                        </NeoButton>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </NeoCard>
        </div>
    );
};

export default FaqItem;
