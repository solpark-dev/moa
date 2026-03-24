import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import httpClient from '../../api/httpClient';
import { getProductIconUrl } from '@/utils/imageUtils';

/**
 * 구독 추가 모달 컴포넌트
 * CSS 변수 기반 테마 적용
 */

const AddSubscriptionModal = ({ productId, startDate, endDate, onClose, onSuccess, user }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            try {
                const response = await httpClient.get(`/product/${productId}`);
                if (response.success) {
                    setProduct(response.data);
                } else {
                    throw new Error(response.error?.message || "Failed to fetch product");
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
                alert("상품 정보를 불러오는데 실패했습니다.");
                onClose();
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId, onClose]);

    const handleSubscribe = async () => {
        if (submitting) return;

        setSubmitting(true);
        try {
            // 디버깅용 로그
            console.log('=== 구독 신청 디버깅 ===');
            console.log('전달받은 user:', user);
            console.log('productId:', productId);
            console.log('startDate:', startDate);
            console.log('endDate:', endDate);

            const requestBody = {
                userId: user?.userId,
                productId: Number(productId),
                subscriptionStatus: 'ACTIVE',
                startDate: startDate,
                endDate: endDate || null
            };

            console.log('전송할 requestBody:', requestBody);

            const response = await httpClient.post('/subscription', requestBody);
            console.log('응답:', response);
            if (response.success) {
                alert('구독이 성공적으로 신청되었습니다!');
                if (onSuccess) onSuccess();
                onClose();
            } else {
                alert(response.error?.message || '구독 신청에 실패했습니다.');
            }
        } catch (error) {
            console.error("Failed to subscribe", error);
            alert('구독 신청에 실패했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!productId) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[var(--theme-bg-card)] w-full max-w-xl rounded-2xl shadow-[var(--theme-shadow)] overflow-hidden animate-in zoom-in-95 duration-200 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-[var(--theme-primary-light)] rounded-full hover:bg-[var(--theme-border-light)] transition-colors z-10"
                >
                    <X className="w-5 h-5 text-[var(--theme-text-muted)]" />
                </button>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--theme-primary)]"></div>
                    </div>
                ) : product ? (
                    <div className="p-8">
                        <h1 className="text-2xl font-bold mb-2 text-center text-[var(--theme-text)]">구독 신청</h1>
                        <p className="text-[var(--theme-text-muted)] mb-8 text-center">선택하신 상품의 구독 정보를 확인해주세요.</p>

                        {/* 상품 정보 */}
                        <div className="bg-[var(--theme-primary-light)] p-6 rounded-xl mb-6 text-center">
                            {product.image ? (
                                <img
                                    src={getProductIconUrl(product.image)}
                                    alt={product.productName}
                                    className="w-24 h-24 object-contain rounded-lg mx-auto mb-4 bg-[var(--theme-bg-card)] p-2"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-[var(--theme-border-light)] rounded-lg mx-auto mb-4 flex items-center justify-center text-[var(--theme-text-muted)]">
                                    No Img
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-[var(--theme-text)] mb-1">{product.productName}</h3>
                            <p className="text-[var(--theme-primary)] font-bold text-2xl">
                                ₩{product.price?.toLocaleString()}
                                <span className="text-sm text-[var(--theme-text-muted)] font-normal ml-1">/월</span>
                            </p>
                        </div>

                        {/* 구독 일정 정보 */}
                        <div className="bg-[var(--theme-primary-light)] rounded-2xl p-5 mb-6 border border-[var(--theme-border-light)]">
                            <h4 className="font-bold text-[var(--theme-text)] mb-3 text-sm">구독 일정</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[var(--theme-text-muted)] text-sm">시작일 (결제일)</span>
                                    <span className="font-bold text-[var(--theme-primary)]">{startDate}</span>
                                </div>
                                {endDate && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-[var(--theme-text-muted)] text-sm">종료일</span>
                                        <span className="font-bold text-[var(--theme-primary)]">{endDate}</span>
                                    </div>
                                )}
                                {!endDate && (
                                    <p className="text-xs text-[var(--theme-text-muted)] pt-1">종료일 미지정 - 자동 갱신으로 계속 유지됩니다</p>
                                )}
                            </div>
                        </div>

                        {/* 버튼 */}
                        <div className="space-y-3">
                            <button
                                onClick={handleSubscribe}
                                disabled={submitting}
                                className="w-full bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white py-4 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {submitting ? '처리 중...' : '구독 시작하기'}
                            </button>
                            <button
                                onClick={onClose}
                                disabled={submitting}
                                className="w-full bg-[var(--theme-bg-card)] border border-[var(--theme-border-light)] text-[var(--theme-text)] py-4 rounded-xl font-bold hover:bg-[var(--theme-primary-light)] transition-colors disabled:opacity-50"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default AddSubscriptionModal;
