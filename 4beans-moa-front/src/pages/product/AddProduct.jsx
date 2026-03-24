import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, ImageIcon } from 'lucide-react';
import { createProduct } from '../../api/productApi';
import { useDragAndDrop } from '../../hooks/common/useDragAndDrop';
import { useProductForm } from '../../hooks/product/useProductForm';
import { useProductImage } from '../../hooks/product/useProductImage';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/themeStore';

// 테마별 스타일
const addProductThemeStyles = {
    pop: {
        primary: 'indigo',
        focusRing: 'focus:ring-indigo-500',
        dragBorder: 'border-indigo-500',
        dragBg: 'bg-indigo-50',
        dragOverlay: 'bg-indigo-500/10',
        dragShadow: 'shadow-2xl',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        textAccent: 'text-indigo-600',
        textDark: 'text-indigo-900',
        buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
        buttonShadow: 'shadow-indigo-200 hover:shadow-indigo-300',
        hoverBorder: 'hover:border-indigo-400',
    },
    christmas: {
        primary: 'red',
        focusRing: 'focus:ring-[#c41e3a]',
        dragBorder: 'border-[#c41e3a]',
        dragBg: 'bg-red-50',
        dragOverlay: 'bg-[#c41e3a]/10',
        dragShadow: 'shadow-[4px_4px_12px_rgba(0,0,0,0.08)]',
        iconBg: 'bg-red-100',
        iconColor: 'text-[#c41e3a]',
        textAccent: 'text-[#c41e3a]',
        textDark: 'text-[#c41e3a]',
        buttonBg: 'bg-[#c41e3a] hover:bg-red-700',
        buttonShadow: 'shadow-red-200 hover:shadow-red-300',
        hoverBorder: 'hover:border-[#c41e3a]',
    },
};

const AddProduct = () => {
    const { theme } = useThemeStore();
    const themeStyle = addProductThemeStyles[theme] || addProductThemeStyles.pop;
    const navigate = useNavigate();

    const {
        formData,
        handleChange,
        categories
    } = useProductForm();

    const {
        selectedFile,
        setSelectedFile,
        previewUrl,
        setPreviewUrl,
        handleFileChange,
        handleRemoveImage,
        uploadImageIfSelected
    } = useProductImage();

    const [loading, setLoading] = useState(false);

    // 커스텀 알림(모달) 관리 state
    const [alertInfo, setAlertInfo] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

    const showAlert = (message, title = "알림", onConfirm = null) => {
        setAlertInfo({
            isOpen: true,
            title,
            message,
            onConfirm
        });
    };

    // input click handler wrapper
    const onInputClick = (e) => {
        if (selectedFile) {
            e.preventDefault();
            showAlert("이미지가 이미 지정되어 있습니다. 기존 이미지를 삭제 후 다시 시도해주세요.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;
        setLoading(true);

        try {
            // 1. 이미지 업로드 (선택된 경우)
            const imageUrl = await uploadImageIfSelected(formData.image);

            // 2. 상품 등록 요청
            const productPayload = {
                ...formData,
                price: Number(formData.price),
                categoryId: Number(formData.categoryId),
                image: imageUrl
            };

            const response = await createProduct(productPayload);

            if (response === undefined || response === '' || response?.success) {
                showAlert('상품이 성공적으로 등록되었습니다.', '성공', () => navigate('/product'));
            } else {
                showAlert(response?.error?.message || '상품 등록에 실패했습니다.', '오류');
            }

        } catch (error) {
            console.error("Failed to add product", error);
            showAlert('상품 등록 중 오류가 발생했습니다.', '오류');
        } finally {
            setLoading(false);
        }
    };

    // 드래그 앤 드롭 핸들러 (Hook 사용)
    const onFileDrop = (file) => {
        // 파일이 이미 있는지 확인
        if (selectedFile || previewUrl) {
            showAlert("이미지가 이미 지정되어 있습니다. 기존 이미지를 삭제 후 다시 시도해주세요.");
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const { isDragging } = useDragAndDrop({
        onFileDrop,
        onError: (msg) => showAlert(msg),
        enabled: true
    });

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl relative">
            {/* 전체 화면 드래그 오버레이 */}
            {isDragging && !selectedFile && (
                <div className={`fixed inset-0 z-50 ${themeStyle.dragOverlay} backdrop-blur-sm border-4 ${themeStyle.dragBorder} rounded-xl flex items-center justify-center m-4 pointer-events-none`}>
                    <div className={`bg-white p-8 rounded-3xl ${themeStyle.dragShadow} flex flex-col items-center animate-bounce`}>
                        <Upload className={`w-16 h-16 ${themeStyle.iconColor} mb-4`} />
                        <h3 className={`text-2xl font-bold ${themeStyle.textDark}`}>여기에 파일을 놓으세요</h3>
                        <p className={themeStyle.textAccent}>이미지가 자동으로 업로드됩니다.</p>
                    </div>
                </div>
            )}

            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>새로운 구독 상품 등록</h1>
            <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-stone-500'}`}>관리자 권한으로 새로운 구독 서비스를 등록합니다.</p>

            <form onSubmit={handleSubmit} className={`p-8 rounded-[2rem] shadow-xl space-y-8 ${theme === 'dark' ? 'bg-[#1E293B] border border-gray-700' : 'bg-white border border-stone-200'}`}>
                {/* 상품명 */}
                <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-stone-700'}`}>상품명 <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className={`w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 focus:ring-2 ${themeStyle.focusRing} focus:border-transparent outline-none transition-all font-medium`}
                        placeholder="예: Netflix Premium"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* 카테고리 */}
                    <div>
                        <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-stone-700'}`}>카테고리 <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className={`w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 focus:ring-2 ${themeStyle.focusRing} focus:border-transparent outline-none appearance-none font-medium cursor-pointer`}
                                required
                            >
                                <option value="">선택하세요</option>
                                {categories.map(cat => (
                                    <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                                ))}
                            </select>
                            <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${theme === 'dark' ? 'text-gray-400' : 'text-stone-500'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                    {/* 가격 */}
                    <div>
                        <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-stone-700'}`}>가격 (월) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-stone-500'}`}>₩</span>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className={`w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-3.5 focus:ring-2 ${themeStyle.focusRing} focus:border-transparent outline-none transition-all font-bold`}
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* 이미지 업로드 */}
                <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-stone-700'}`}>상품 이미지</label>
                    <div className="space-y-4">
                        {!previewUrl ? (
                            <div className="relative group">
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, showAlert)}
                                    onClick={onInputClick}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all group-hover:scale-[0.99]
                                        ${isDragging
                                            ? `${themeStyle.dragBorder} ${themeStyle.dragBg}`
                                            : `border-stone-300 bg-stone-50 hover:bg-stone-100 ${themeStyle.hoverBorder}`
                                        }`}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className={`w-12 h-12 rounded-full shadow-sm flex items-center justify-center mb-3 transition-colors ${isDragging ? themeStyle.iconBg : 'bg-white'}`}>
                                            <Upload className={`w-6 h-6 ${themeStyle.iconColor}`} />
                                        </div>
                                        <p className="mb-2 text-sm text-stone-600 font-bold"><span className={themeStyle.textAccent}>클릭하여 업로드</span> 또는 파일 놓기</p>
                                        <p className="text-xs text-stone-400">PNG, JPG, GIF (MAX. 10MB)</p>
                                    </div>
                                </label>
                            </div>
                        ) : (
                            <div className={`relative w-full h-64 rounded-2xl overflow-hidden group shadow-sm ${theme === 'dark'
                                ? 'bg-gray-800 border border-gray-600'
                                : 'bg-stone-100 border border-stone-200'
                                }`}>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className={`w-full h-full object-contain ${theme === 'dark' ? 'bg-[#0B1120]' : 'bg-stone-50'}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                                    <div className="text-white">
                                        <p className="font-bold truncate text-lg mb-1">{selectedFile?.name}</p>
                                        <p className="text-stone-300 text-sm font-medium bg-white/20 inline-block px-2 py-1 rounded-lg backdrop-blur-sm">
                                            {selectedFile?.size && (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage('image-upload')}
                                    className={`absolute top-4 right-4 p-2.5 rounded-xl shadow-lg backdrop-blur-sm transition-all hover:scale-105 active:scale-95 ${theme === 'dark'
                                        ? 'bg-gray-700/90 hover:bg-gray-600 text-white'
                                        : 'bg-white/90 hover:bg-white text-stone-700'
                                        }`}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-stone-100'}`}>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg ${themeStyle.buttonShadow} transition-all transform active:scale-[0.98] flex items-center justify-center gap-2
                            ${loading
                                ? 'bg-stone-400 cursor-not-allowed'
                                : themeStyle.buttonBg
                            }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                처리 중...
                            </>
                        ) : (
                            '상품 등록하기'
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/product')}
                        className={`w-full mt-3 py-4 rounded-xl font-bold transition-colors ${theme === 'dark'
                            ? 'text-gray-400 hover:bg-gray-800'
                            : 'text-stone-500 hover:bg-stone-100'
                            }`}
                    >
                        취소
                    </button>
                </div>
            </form>

            {/* 커스텀 알림 모달 */}
            <Dialog open={alertInfo.isOpen} onOpenChange={(open) => !open && setAlertInfo(prev => ({ ...prev, isOpen: false }))}>
                <DialogContent className={`sm:max-w-md rounded-2xl ${theme === 'dark' ? 'bg-[#1E293B] border-gray-700' : 'bg-white'}`}>
                    <DialogHeader>
                        <DialogTitle className={theme === 'dark' ? 'text-white' : ''}>{alertInfo.title}</DialogTitle>
                        <DialogDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                            {alertInfo.message}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end">
                        <Button
                            type="button"
                            onClick={() => {
                                setAlertInfo(prev => ({ ...prev, isOpen: false }));
                                if (alertInfo.onConfirm) alertInfo.onConfirm();
                            }}
                            className={`${themeStyle.buttonBg} text-white rounded-xl`}
                        >
                            확인
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddProduct;
