import httpClient from './httpClient';

/**
 * 카테고리 목록 조회
 */
export const getCategories = () => {
    return httpClient.get('/product/categorie');
};

/**
 * 상품 상세 조회
 * @param {number|string} id 
 */
export const getProduct = (id) => {
    return httpClient.get(`/product/${id}`);
};

/**
 * 상품 등록
 * @param {Object} data 
 */
export const createProduct = (data) => {
    return httpClient.post('/product', data);
};

/**
 * 상품 수정
 * @param {Object} data 
 */
export const updateProduct = (data) => {
    return httpClient.put('/product', data);
};

/**
 * 이미지 업로드 (단일)
 * @param {FormData} formData
 */
export const uploadProductImage = (formData) => {
    return httpClient.post('/product/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * 로고 + 아이콘 이미지 동시 업로드
 * @param {File} logoFile - 로고 이미지 파일 (선택)
 * @param {File} iconFile - 아이콘 이미지 파일 (선택)
 * @returns {Promise<string>} 로고 이미지 URL (DB 저장용)
 */
export const uploadProductImages = (logoFile, iconFile) => {
    const formData = new FormData();
    if (logoFile) {
        formData.append('logoFile', logoFile);
    }
    if (iconFile) {
        formData.append('iconFile', iconFile);
    }
    console.log('[productApi] uploading images - logoFile:', !!logoFile, 'iconFile:', !!iconFile);
    return httpClient.post('/product/upload-images', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
