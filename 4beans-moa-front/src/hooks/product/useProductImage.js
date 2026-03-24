import { useState, useEffect } from 'react';
import { uploadProductImage, uploadProductImages } from '../../api/productApi';

export const useProductImage = (initialImageUrl = '') => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(initialImageUrl || null);

    // initialImageUrl 변경 시 미리보기 업데이트 (단, 사용자가 파일을 선택하지 않은 경우에만)
    useEffect(() => {
        if (!selectedFile && initialImageUrl) {
            setPreviewUrl(initialImageUrl);
        } else if (!selectedFile && !initialImageUrl) {
            setPreviewUrl(null);
        }
    }, [initialImageUrl, selectedFile]);


    const handleFileChange = (e, onError) => {
        // 이미 파일이 있는데 선택창을 통해 또 선택했을 경우 체크 (선택사항, UX 정책에 따름)
        if (selectedFile) {
            e.preventDefault();
            if (onError) onError("이미지가 이미 지정되어 있습니다. 기존 이미지를 삭제 후 다시 시도해주세요.");
            return;
        }

        const file = e.target.files[0];
        if (file) {
            // 용량 체크 (10MB)
            if (file.size > 10 * 1024 * 1024) {
                if (onError) onError("파일 사이즈는 10MB를 초과할 수 없습니다.");
                e.target.value = '';
                return;
            }

            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (fileInputId) => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputId) {
            const fileInput = document.getElementById(fileInputId);
            if (fileInput) fileInput.value = '';
        }
    };

    // 이미지 업로드 로직
    // formDataImage: 폼 데이터에 있는 기존 이미지 URL (이미지 변경 없으면 이거 사용)
    const uploadImageIfSelected = async (currentFormImage) => {
        if (selectedFile) {
            const uploadFormData = new FormData();
            uploadFormData.append('file', selectedFile);
            const uploadResponse = await uploadProductImage(uploadFormData);
            return uploadResponse; // 업로드된 URL
        }
        return currentFormImage; // 변경 없으면 기존 URL 반환
    };

    return {
        selectedFile,
        setSelectedFile,
        previewUrl,
        setPreviewUrl,
        handleFileChange,
        handleRemoveImage,
        uploadImageIfSelected
    };
};

/**
 * 로고 + 아이콘 이미지 동시 관리 훅
 * @param {string} initialLogoUrl - 초기 로고 이미지 URL
 */
export const useProductImages = (initialLogoUrl = '') => {
    // 로고 이미지 상태
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreviewUrl, setLogoPreviewUrl] = useState(initialLogoUrl || null);

    // 아이콘 이미지 상태
    const [iconFile, setIconFile] = useState(null);
    const [iconPreviewUrl, setIconPreviewUrl] = useState(null);

    // 초기 로고 URL에서 아이콘 URL 유추
    useEffect(() => {
        if (initialLogoUrl && !logoFile) {
            setLogoPreviewUrl(initialLogoUrl);
            // _logo를 _icon으로 변환하여 아이콘 URL 유추
            const iconUrl = initialLogoUrl.replace(/_logo\./, '_icon.');
            setIconPreviewUrl(iconUrl);
        } else if (!initialLogoUrl && !logoFile) {
            setLogoPreviewUrl(null);
            setIconPreviewUrl(null);
        }
    }, [initialLogoUrl, logoFile]);

    // 로고 파일 변경 핸들러
    const handleLogoChange = (e, onError) => {
        if (logoFile) {
            e.preventDefault();
            if (onError) onError("로고 이미지가 이미 지정되어 있습니다. 기존 이미지를 삭제 후 다시 시도해주세요.");
            return;
        }

        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                if (onError) onError("파일 사이즈는 10MB를 초과할 수 없습니다.");
                e.target.value = '';
                return;
            }

            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 아이콘 파일 변경 핸들러
    const handleIconChange = (e, onError) => {
        if (iconFile) {
            e.preventDefault();
            if (onError) onError("아이콘 이미지가 이미 지정되어 있습니다. 기존 이미지를 삭제 후 다시 시도해주세요.");
            return;
        }

        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                if (onError) onError("파일 사이즈는 10MB를 초과할 수 없습니다.");
                e.target.value = '';
                return;
            }

            setIconFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setIconPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 로고 이미지 삭제
    const handleRemoveLogo = (fileInputId) => {
        setLogoFile(null);
        setLogoPreviewUrl(null);
        if (fileInputId) {
            const fileInput = document.getElementById(fileInputId);
            if (fileInput) fileInput.value = '';
        }
    };

    // 아이콘 이미지 삭제
    const handleRemoveIcon = (fileInputId) => {
        setIconFile(null);
        setIconPreviewUrl(null);
        if (fileInputId) {
            const fileInput = document.getElementById(fileInputId);
            if (fileInput) fileInput.value = '';
        }
    };

    // 이미지 업로드 (로고 + 아이콘 동시)
    const uploadImagesIfSelected = async (currentFormImage) => {
        // 로고 또는 아이콘 중 하나라도 새 파일이 있으면 업로드
        if (logoFile || iconFile) {
            // 로고가 없으면 기존 이미지 유지, 아이콘만 새로 업로드하는 경우 처리
            const uploadResponse = await uploadProductImages(logoFile, iconFile);
            console.log('[useProductImages] uploadResponse:', uploadResponse);

            // 응답이 문자열(URL)이면 그대로 반환
            if (typeof uploadResponse === 'string') {
                return uploadResponse;
            }
            // 응답이 객체면 URL 추출 시도
            if (uploadResponse?.data) {
                return uploadResponse.data;
            }
            if (uploadResponse?.url) {
                return uploadResponse.url;
            }
            // 그 외의 경우 응답 자체 반환
            return uploadResponse;
        }
        return currentFormImage; // 변경 없으면 기존 URL 반환
    };

    return {
        // 로고
        logoFile,
        setLogoFile,
        logoPreviewUrl,
        setLogoPreviewUrl,
        handleLogoChange,
        handleRemoveLogo,
        // 아이콘
        iconFile,
        setIconFile,
        iconPreviewUrl,
        setIconPreviewUrl,
        handleIconChange,
        handleRemoveIcon,
        // 업로드
        uploadImagesIfSelected
    };
};
