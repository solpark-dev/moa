import { useThemeStore } from '@/store/themeStore';

// 테마별 문의 상태 뱃지 스타일
const communityThemeStyles = {
    light: {
        completed: 'bg-emerald-500 text-white',
        pending: 'bg-gray-200 text-gray-600',
    },
    dark: {
        completed: 'bg-emerald-500 text-white',
        pending: 'bg-gray-600 text-gray-300',
    },
};

const InquiryStatusBadge = ({ status }) => {
    const { theme } = useThemeStore();
    const themeStyle = communityThemeStyles[theme] || communityThemeStyles.light;

    if (status === '답변완료') {
        return (
            <span className={`px-3 py-1 text-xs font-black rounded-lg ${themeStyle.completed} border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}>
                답변완료
            </span>
        );
    }
    return (
        <span className={`px-3 py-1 text-xs font-black rounded-lg ${themeStyle.pending} border border-gray-200 shadow-[4px_4px_12px_rgba(0,0,0,0.08)]`}>
            답변대기
        </span>
    );
};

export default InquiryStatusBadge;
