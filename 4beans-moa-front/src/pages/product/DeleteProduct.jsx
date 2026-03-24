import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
const deleteProductThemeStyles = {
    pop: {
        confirmButton: 'bg-indigo-600 hover:bg-indigo-700',
    },
    christmas: {
        confirmButton: 'bg-[#c41e3a] hover:bg-red-700',
    },
};

const DeleteProduct = () => {
    const { theme } = useThemeStore();
    const themeStyle = deleteProductThemeStyles[theme] || deleteProductThemeStyles.pop;
    const { id } = useParams();
    const navigate = useNavigate();

    // Steps: 'CONFIRM', 'LOADING', 'SUCCESS', 'ERROR'
    const [step, setStep] = useState('CONFIRM');
    const [isOpen, setIsOpen] = useState(true);
    const [message, setMessage] = useState('');

    const handleClose = () => {
        setIsOpen(false);
        // 다이얼로그가 닫히면 애니메이션 후 이동
        setTimeout(() => {
            if (step === 'SUCCESS') {
                navigate('/product');
            } else {
                navigate(`/product/${id}`);
            }
        }, 300);
    };

    const handleDelete = async () => {
        setStep('LOADING');
        try {
            const response = await httpClient.delete(`/product/${id}`);
            if (response.success) {
                setStep('SUCCESS');
            } else {
                setStep('ERROR');
                setMessage(response.error?.message || '상품 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error("Failed to delete product", error);
            setStep('ERROR');
            setMessage('사용중인 상품이 있어 삭제가 불가능 합니다.\n비활성(INACTIVE) 상태로 변경하여 주세요.');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md bg-white rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {step === 'CONFIRM' && '상품 삭제'}
                        {step === 'LOADING' && '처리 중...'}
                        {step === 'SUCCESS' && '삭제 완료'}
                        {step === 'ERROR' && '삭제 실패'}
                    </DialogTitle>
                    <DialogDescription className="text-stone-600 whitespace-pre-wrap mt-2">
                        {step === 'CONFIRM' && '정말로 이 상품을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.'}
                        {step === 'LOADING' && '잠시만 기다려 주세요.'}
                        {step === 'SUCCESS' && '상품이 정상적으로 삭제되었습니다.'}
                        {step === 'ERROR' && message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end gap-2 mt-4">
                    {step === 'CONFIRM' && (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="rounded-xl"
                            >
                                취소
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                            >
                                삭제하기
                            </Button>
                        </>
                    )}
                    {(step === 'SUCCESS' || step === 'ERROR') && (
                        <Button
                            type="button"
                            onClick={handleClose}
                            className={`${themeStyle.confirmButton} text-white rounded-xl`}
                        >
                            확인
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteProduct;
