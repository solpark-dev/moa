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
