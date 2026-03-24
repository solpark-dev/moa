// 환경 변수에서 클라이언트 키 가져오기
const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;

if (!clientKey) {
    console.error("Toss Client Key is missing. Please check .env file.");
}

export const requestPayment = (orderName, amount, customerName) => {
    return new Promise((resolve, reject) => {
        if (!clientKey) {
            alert("결제 설정 오류: Toss Client Key가 없습니다. 관리자에게 문의하세요.");
            return reject(new Error("Toss Client Key is missing"));
        }
        const tossPayments = window.TossPayments(clientKey);

        const orderId = "ORDER_" + new Date().getTime();

        tossPayments
            .requestPayment("카드", {
                amount: amount,
                orderId: orderId,
                orderName: orderName,
                customerName: customerName,
                successUrl: window.location.origin + "/payment/success",
                failUrl: window.location.origin + "/payment/fail",
            })
            .then(() => {
                // Toss Payments는 성공 시 successUrl로 리다이렉트하므로
                // 여기서는 실제로 resolve가 호출되지 않습니다.
                // 하지만 명시적으로 resolve를 추가합니다.
                resolve({
                    orderId: orderId,
                    amount: amount,
                });
            })
            .catch((error) => {
                if (error.code === "USER_CANCEL") {
                    reject(new Error("사용자가 결제를 취소했습니다."));
                } else {
                    reject(error);
                }
            });
    });
};

export const requestBillingAuth = (customerKey) => {
    return new Promise((resolve, reject) => {
        const tossPayments = window.TossPayments(clientKey);

        // Toss customerKey는 최소 2자 이상이어야 함 - prefix 추가
        const formattedCustomerKey = `MOA_${customerKey}`;

        tossPayments
            .requestBillingAuth("카드", {
                customerKey: formattedCustomerKey,
                successUrl: window.location.origin + "/payment/billing/success",
                failUrl: window.location.origin + "/payment/billing/fail",
            })
            .catch((error) => {
                reject(error);
            });
    });
};
