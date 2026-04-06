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
