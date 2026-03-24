export const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\. /g, '.').replace(/\.$/, '');
};

export const getCategoryName = (codeId) => {
    const categories = {
        1: '회원',
        2: '결제',
        3: '기타'
    };
    return categories[codeId] || '기타';
};

export const getNoticeCategoryName = (codeId) => {
    const categories = {
        5: '회원',
        6: '결제',
        7: '구독',
        8: '파티',
        9: '정산',
        10: '시스템'
    };
    return categories[codeId] || '시스템';
};

export const getFaqCategoryName = (codeId) => {
    const categories = {
        4: 'FAQ',
        5: '회원',
        6: '결제',
        7: '구독',
        8: '파티',
        9: '정산',
        10: '기타'
    };
    return categories[codeId] || '기타';
};