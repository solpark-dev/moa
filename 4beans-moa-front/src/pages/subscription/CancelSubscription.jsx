import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import httpClient from '../../api/httpClient';

const CancelSubscription = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const cancelSubscription = async () => {
            if (window.confirm('정말로 구독을 해지하시겠습니까? 다음 결제일부터 서비스 이용이 중단됩니다.')) {
                try {
                    // httpClient는 성공 시 response.data를 직접 반환
                    // HTTP 요청이 성공하면 해지 완료로 처리
                    await httpClient.post(`/subscription/${id}/cancel`);
                    alert('구독이 해지되었습니다.');
                    navigate('/subscription');
                } catch (error) {
                    console.error("Failed to cancel subscription", error);
                    const errorMessage = error.response?.data?.error?.message || '구독 해지에 실패했습니다.';
                    alert(errorMessage);
                    navigate(`/subscription/${id}`);
                }
            } else {
                navigate(`/subscription/${id}`);
            }
        };

        cancelSubscription();
    }, [id, navigate]);

    return (
        <div className="flex justify-center items-center h-64">
            <p>처리 중...</p>
        </div>
    );
};

export default CancelSubscription;
