export const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
}

export const getPushIcon = (pushCode) => {
    const iconMap = {
        'PAYMENT_SUCCESS': '💳',
        'PAYMENT_FAIL': '❌',
        'PARTY_JOIN': '🎉',
        'PARTY_WITHDRAW': '👋',
        'PARTY_START': '🚀',
        'PARTY_END': '🏁',
        'SETTLEMENT_MONTHLY': '💰',
        'DEPOSIT_PAID': '✅',
        'DEPOSIT_REFUND': '💸',
        'INQUIRY_ANSWER': '💬',
        'PAYMENT_RETRY': '🔄',
        'PAYMENT_RETRY_SUCCESS': '✅',
        'PAYMENT_RETRY_FINAL_FAIL': '🚫'
    }
    return iconMap[pushCode] || '🔔'
}

export const getPushCodeLabel = (pushCode) => {
    const labelMap = {
        'PAYMENT_SUCCESS': '결제 완료',
        'PAYMENT_FAIL': '결제 실패',
        'PARTY_JOIN': '파티 가입',
        'PARTY_WITHDRAW': '파티 탈퇴',
        'PARTY_START': '파티 시작',
        'PARTY_END': '파티 종료',
        'SETTLEMENT_MONTHLY': '월간 정산',
        'DEPOSIT_PAID': '보증금 납부',
        'DEPOSIT_REFUND': '보증금 환불',
        'INQUIRY_ANSWER': '문의 답변',
        'PAYMENT_RETRY': '결제 재시도',
        'PAYMENT_RETRY_SUCCESS': '재시도 성공',
        'PAYMENT_RETRY_FINAL_FAIL': '최종 실패'
    }
    return labelMap[pushCode] || pushCode
}