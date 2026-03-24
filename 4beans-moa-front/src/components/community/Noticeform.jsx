import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NeoButton } from '@/components/common/neo';
import { useThemeStore } from '@/store/themeStore';

// 테마별 스타일
const communityThemeStyles = {
    pop: {
        // Neo/Pop 스타일 - 핑크, 시안 계열
        button: 'bg-pink-500 hover:bg-pink-600 text-white',
        focusRing: 'focus:ring-pink-500',
    },
    classic: {
        button: 'bg-[#635bff] hover:bg-indigo-600 text-white',
        focusRing: 'focus:ring-[#635bff]',
    },
    dark: {
        button: 'bg-[#635bff] hover:bg-indigo-600 text-white',
        focusRing: 'focus:ring-[#635bff]',
    },
    christmas: {
        button: 'bg-[#c41e3a] hover:bg-red-700 text-white',
        focusRing: 'focus:ring-[#c41e3a]',
    },
};

const NoticeForm = ({ formData, setFormData, onSubmit, submitText, cancelPath }) => {
    const navigate = useNavigate();
    const { theme } = useThemeStore();
    const themeStyle = communityThemeStyles[theme] || communityThemeStyles.pop;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* Title */}
            <div>
                <label className="block text-sm font-black text-black mb-2">
                    제목
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="제목을 입력하세요"
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 ${themeStyle.focusRing} placeholder-gray-400`}
                />
            </div>

            {/* Content */}
            <div>
                <label className="block text-sm font-black text-black mb-2">
                    내용
                </label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="내용을 입력하세요"
                    rows={12}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl font-bold focus:outline-none focus:ring-2 ${themeStyle.focusRing} placeholder-gray-400 resize-none`}
                />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-4 pt-4">
                <NeoButton
                    type="button"
                    color="bg-white"
                    size="sm"
                    onClick={() => navigate(cancelPath)}
                >
                    취소
                </NeoButton>
                <NeoButton
                    type="submit"
                    color={themeStyle.button}
                    size="sm"
                >
                    {submitText}
                </NeoButton>
            </div>
        </form>
    );
};

export default NoticeForm;
