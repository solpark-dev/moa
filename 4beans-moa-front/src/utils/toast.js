import { toast as sonnerToast } from 'sonner';

/**
 * Toast notification helpers with Korean messages
 * Uses sonner library for consistent, beautiful notifications
 */
export const toast = {
    /**
     * Success notification (green)
     */
    success: (message, options = {}) => {
        sonnerToast.success(message, {
            duration: 3000,
            ...options,
        });
    },

    /**
     * Error notification (red)
     */
    error: (message, options = {}) => {
        sonnerToast.error(message, {
            duration: 5000,
            ...options,
        });
    },

    /**
     * Warning notification (yellow)
     */
    warning: (message, options = {}) => {
        sonnerToast.warning(message, {
            duration: 4000,
            ...options,
        });
    },

    /**
     * Info notification (blue)
     */
    info: (message, options = {}) => {
        sonnerToast.info(message, {
            duration: 3000,
            ...options,
        });
    },

    /**
     * Loading notification with promise
     * Automatically shows success/error based on promise result
     *
     * @example
     * toast.promise(
     *   fetchData(),
     *   {
     *     loading: '데이터 로딩 중...',
     *     success: '로딩 완료!',
     *     error: '로딩 실패',
     *   }
     * );
     */
    promise: (promise, messages = {}) => {
        return sonnerToast.promise(promise, {
            loading: messages.loading || '처리 중...',
            success: messages.success || '완료되었습니다',
            error: messages.error || '오류가 발생했습니다',
            ...messages.options,
        });
    },

    /**
     * Custom toast with action button
     *
     * @example
     * toast.errorWithAction(
     *   '결제에 실패했습니다',
     *   '다시 시도',
     *   () => retryPayment()
     * );
     */
    errorWithAction: (message, actionLabel, actionFn) => {
        sonnerToast.error(message, {
            duration: 6000,
            action: {
                label: actionLabel,
                onClick: actionFn,
            },
        });
    },

    /**
     * Success toast with action button
     */
    successWithAction: (message, actionLabel, actionFn) => {
        sonnerToast.success(message, {
            duration: 5000,
            action: {
                label: actionLabel,
                onClick: actionFn,
            },
        });
    },

    /**
     * Payment-specific error toast with retry or support option
     *
     * @param {string} message - Error message
     * @param {boolean} canRetry - Whether payment can be retried
     * @param {function} retryFn - Function to call on retry
     */
    paymentError: (message, canRetry = false, retryFn = null) => {
        if (canRetry && retryFn) {
            sonnerToast.error(message, {
                duration: 8000,
                action: {
                    label: '다시 시도',
                    onClick: retryFn,
                },
            });
        } else {
            sonnerToast.error(message, {
                duration: 5000,
                action: {
                    label: '고객센터',
                    onClick: () => window.location.href = '/support',
                },
            });
        }
    },

    /**
     * Dismiss a specific toast or all toasts
     * @param {string|number} toastId - Optional toast ID to dismiss specific toast
     */
    dismiss: (toastId = null) => {
        if (toastId) {
            sonnerToast.dismiss(toastId);
        } else {
            sonnerToast.dismiss();
        }
    },

    /**
     * Custom toast with full control
     * @param {string} message
     * @param {object} options - Full sonner options
     */
    custom: (message, options = {}) => {
        return sonnerToast(message, options);
    },
};

// Export sonner directly for advanced usage
export { sonnerToast };
