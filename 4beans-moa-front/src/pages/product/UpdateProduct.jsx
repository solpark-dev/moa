import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, ImageIcon } from 'lucide-react';
import httpClient from '../../api/httpClient';
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
const updateProductThemeStyles = {
    pop: {
        primary: 'indigo',
        focusRing: 'focus:ring-indigo-500',
        dragBorder: 'border-indigo-500',
        dragBg: 'bg-indigo-50',
        dragOverlay: 'bg-indigo-500/10',
        dragShadow: 'shadow-2xl',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        iconColorAlt: 'text-indigo-500',
        textAccent: 'text-indigo-600',
        textDark: 'text-indigo-900',
        buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
        buttonShadow: 'shadow-indigo-200 hover:shadow-indigo-300',
        hoverBorder: 'hover:border-indigo-400',
        spinnerBorder: 'border-indigo-500',
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
        iconColorAlt: 'text-[#c41e3a]',
        textAccent: 'text-[#c41e3a]',
        textDark: 'text-[#c41e3a]',
        buttonBg: 'bg-[#c41e3a] hover:bg-red-700',
        buttonShadow: 'shadow-red-200 hover:shadow-red-300',
        hoverBorder: 'hover:border-[#c41e3a]',
        spinnerBorder: 'border-[#c41e3a]',
    },
};

const UpdateProduct = () => {
    const { theme } = useThemeStore();
    const themeStyle = updateProductThemeStyles[theme] || updateProductThemeStyles.pop;
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        productName: '',
        price: '',
        categoryId: '',
        image: '',
        productStatus: 'ACTIVE'
    });

    const getAccentColor = () => {
        switch (theme) {
            case 'classic':
            case 'dark':
                return '#635bff';
            case 'pop':
                return '#ec4899';
            case 'christmas':
                return '#c41e3a';
            default:
                return '#635bff';
        }
    };

    // 이미지 파일 관리 state
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false); // 초기 로딩 포함

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

    useEffect(() => {
        const initData = async () => {
            try {
                setLoading(true);

                // 1. 카테고리 목록 불러오기
                const catResponse = await httpClient.get('/product/categorie');
                if (catResponse.success) {
                    setCategories(catResponse.data);
                }

                // 2. 상품 정보 불러오기
                const prodResponse = await httpClient.get(`/product/${id}`);
                if (prodResponse.success) {
                    const product = prodResponse.data;
                    setFormData({
                        productName: product.productName,
                        price: product.price,
                        categoryId: product.categoryId,
                        image: product.image || '',
                        productStatus: product.productStatus
                    });

                    // 기존 이미지가 있으면 미리보기 설정
                    if (product.image) {
                        setPreviewUrl(product.image);
                    }
                } else {
                    throw new Error(prodResponse.error?.message || "Failed to fetch product");
                }
            } catch (error) {
                console.error("Failed to load data", error);
                showAlert("데이터를 불러오는데 실패했습니다.", "오류", () => navigate('/product'));
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        // 이미 파일이 있는데 선택창을 통해 또 선택했을 경우 체크 (기존 이미지 포함)
        if (selectedFile) {
            e.preventDefault();
            showAlert("이미지가 이미 지정되어 있습니다. 새로운 이미지를 업로드하려면 'X' 버튼을 눌러 기존 이미지를 삭제해주세요.");
            return;
        }

        // 기존 이미지가 있는 상태에서 파일 선택 시도 (previewUrl이 있고 selectedFile이 없는 경우 = 기존 URL 이미지)
        // 이 경우에도 삭제 후 올리라고 안내하는 것이 UX상 깔끔함 (교체 의도 명확화)
        if (!selectedFile && previewUrl && !formData.image.startsWith('blob:')) {
            // formData.image에 값이 있고 previewUrl도 있다면 기존 이미지임
            // 다만 파일 input은 selectedFile과 연동되므로 여기서는 selectedFile 유무만 봐도 됨.
            // 하지만 "기존 이미지가 있는 상태"를 감지하여 막을지 여부.
            // AddProduct에서는 "이미지가 있으면 막음".
            // 여기서도 동일하게 가려면:
            if (previewUrl) {
                e.preventDefault();
                showAlert("이미지가 이미 지정되어 있습니다. 기존 이미지를 삭제 후 다시 시도해주세요.");
                return;
            }
        }

        const file = e.target.files[0];
        if (file) {
            // 용량 체크 (10MB)
            if (file.size > 10 * 1024 * 1024) {
                showAlert("파일 사이즈는 10MB를 초과할 수 없습니다.");
                e.target.value = ''; // input 초기화
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

    const handleInputClick = (e) => {
        if (selectedFile || previewUrl) {
            e.preventDefault();
            showAlert("이미지가 이미 지정되어 있습니다. 기존 이미지를 삭제 후 다시 시도해주세요.");
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setFormData(prev => ({ ...prev, image: '' })); // 이미지 삭제 시 URL도 비움

        const fileInput = document.getElementById('image-upload');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;
        setLoading(true);

        try {
            let imageUrl = formData.image;

            // 1. 새 이미지가 선택되었다면 업로드 수행
            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', selectedFile);

                const uploadResponse = await httpClient.post('/product/upload', uploadFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                imageUrl = uploadResponse; // 업로드된 새 URL
            }

            // 2. 상품 수정 요청
            const productPayload = {
                ...formData,
                productId: Number(id),
                price: Number(formData.price),
                categoryId: Number(formData.categoryId),
                image: imageUrl
            };

            const response = await httpClient.put('/product', productPayload);

            if (response === undefined || response === '' || response?.success) {
                showAlert('상품 정보가 수정되었습니다.', '성공', () => navigate(`/product/${id}`));
            } else {
                showAlert(response?.error?.message || '상품 수정에 실패했습니다.', '오류');
            }

        } catch (error) {
            console.error("Failed to update product", error);
            showAlert('상품 수정 중 오류가 발생했습니다.', '오류');
        } finally {
            setLoading(false);
        }
    };

    // 드래그 앤 드롭 핸들러
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = React.useRef(0);
    // hasFileRef는 렌더링 사이클과 관계없이 현재 파일 유무를 즉시 확인하기 위해 사용
    const hasFileRef = React.useRef(false);

    useEffect(() => {
        // 프리뷰 URL이 있거나 파일이 선택되었으면 파일이 있는 것으로 간주
        hasFileRef.current = !!(selectedFile || previewUrl);
    }, [selectedFile, previewUrl]);

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    useEffect(() => {
        const handleDragEnter = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter.current++;
            if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
                setIsDragging(true);
            }
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter.current--;
            if (dragCounter.current === 0) {
                setIsDragging(false);
            }
        };

        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            dragCounter.current = 0;

            if (hasFileRef.current) {
                showAlert("이미지가 이미 지정되어 있습니다. 기존 이미지를 삭제 후 다시 시도해주세요.");
                return;
            }

            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                if (file.size > 10 * 1024 * 1024) {
                    showAlert("파일 사이즈는 10MB를 초과할 수 없습니다.");
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

        window.addEventListener('dragenter', handleDragEnter);
        window.addEventListener('dragleave', handleDragLeave);
        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('drop', handleDrop);

        return () => {
            window.removeEventListener('dragenter', handleDragEnter);
            window.removeEventListener('dragleave', handleDragLeave);
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('drop', handleDrop);
        };
    }, []);

    const accent = getAccentColor();

    if (loading && !formData.productName) { // 초기 로딩 중일 때만 표시 (데이터 없는 경우)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className={`w-8 h-8 border-4 ${themeStyle.spinnerBorder} border-t-transparent rounded-full animate-spin`}></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl relative">
            {/* 전체 화면 드래그 오버레이 */}
            {isDragging && !selectedFile && !previewUrl && (
                <div className={`fixed inset-0 z-50 ${themeStyle.dragOverlay} backdrop-blur-sm border-4 ${themeStyle.dragBorder} rounded-xl flex items-center justify-center m-4 pointer-events-none`}>
                    <div className={`bg-white p-8 rounded-3xl ${themeStyle.dragShadow} flex flex-col items-center animate-bounce`}>
                        <Upload className={`w-16 h-16 ${themeStyle.iconColor} mb-4`} />
                        <h3 className={`text-2xl font-bold ${themeStyle.textDark}`}>여기에 파일을 놓으세요</h3>
                        <p className={themeStyle.textAccent}>이미지가 자동으로 업로드됩니다.</p>
                    </div>
                </div>
            )}

            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-stone-900'}`}>상품 정보 수정</h1>
            <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-stone-500'}`}>관리자 권한으로 기존 구독 상품 정보를 수정합니다.</p>

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

                {/* 상태 (Update에만 있음) */}
                <div>
                    <label className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-stone-700'}`}>판매 상태</label>
                    <div className="relative">
                        <select
                            name="productStatus"
                            value={formData.productStatus}
                            onChange={handleChange}
                            className={`w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 focus:ring-2 ${themeStyle.focusRing} focus:border-transparent outline-none appearance-none font-medium cursor-pointer`}
                        >
                            <option value="ACTIVE">판매중 (ACTIVE)</option>
                            <option value="INACTIVE">판매중지 (INACTIVE)</option>
                        </select>
                        <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${theme === 'dark' ? 'text-gray-400' : 'text-stone-500'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
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
                                    onChange={handleFileChange}
                                    onClick={handleInputClick}
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
                                            <Upload className={`w-6 h-6 ${isDragging ? themeStyle.iconColor : themeStyle.iconColorAlt}`} />
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
                                        {selectedFile ? (
                                            <>
                                                <p className="font-bold truncate text-lg mb-1">{selectedFile.name}</p>
                                                <p className="text-stone-300 text-sm font-medium bg-white/20 inline-block px-2 py-1 rounded-lg backdrop-blur-sm">
                                                    {formatBytes(selectedFile.size)}
                                                </p>
                                            </>
                                        ) : (
                                            /* 기존 이미지인 경우 파일명 등은 알기 어려울 수 있음 (URL만 존재) */
                                            <p className="font-bold truncate text-lg mb-1">현재 등록된 이미지</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
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
                            '수정 완료'
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
        </div >
    );
};

export default UpdateProduct;
