import { Trash2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    AccordionItem,
    AccordionContent
} from '@/components/ui/accordion'
import { getPushIcon } from '@/utils/pushUtils'

/**
 * 알림 아이템 컴포넌트
 * CSS 변수 기반 테마 적용
 */

const formatRelativeDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
}

const NotificationItem = ({
    notification,
    isExpanded = false,
    onToggle,
    onDelete,
    onMarkAsRead
}) => {
    const isUnread = notification.isRead === 'N'

    const handleClick = () => {
        if (onToggle) {
            onToggle(notification.pushId)
        }
        if (isUnread && onMarkAsRead) {
            onMarkAsRead(notification.pushId)
        }
    }

    const handleDelete = (e) => {
        e.stopPropagation()
        if (onDelete) {
            onDelete(notification.pushId, e)
        }
    }

    return (
        <AccordionItem
            value={notification.pushId.toString()}
            className={`border rounded-lg mb-2 overflow-hidden transition-colors ${isUnread
                ? 'bg-[var(--theme-primary-light)] border-[var(--theme-border-light)]'
                : 'bg-[var(--theme-bg-card)] border-[var(--theme-border-light)]'
                }`}
        >
            <div
                className="flex items-center w-full px-3 py-2.5 cursor-pointer group hover:bg-[var(--theme-primary-light)] transition-colors"
                onClick={handleClick}
            >
                <div className="flex items-start gap-3 flex-1">
                    <span className="text-lg flex-shrink-0">
                        {getPushIcon(notification.pushCode)}
                    </span>
                    <div className="text-left">
                        <div className="flex items-center gap-2">
                            <p
                                className={`text-sm ${isUnread
                                    ? 'font-semibold text-[var(--theme-text)]'
                                    : 'font-medium text-[var(--theme-text-muted)]'
                                    }`}
                            >
                                {notification.title}
                            </p>
                            {isUnread && (
                                <span className="w-2 h-2 bg-[var(--theme-primary)] rounded-full flex-shrink-0" />
                            )}
                        </div>
                        <p className="text-[11px] text-[var(--theme-text-muted)] mt-0.5">
                            {formatRelativeDate(notification.sentAt)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1 ml-auto flex-shrink-0">
                    <ChevronDown
                        className={`w-4 h-4 text-[var(--theme-text-muted)] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                            }`}
                    />
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDelete}
                            className="h-7 w-7 text-[var(--theme-text-muted)] hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    )}
                </div>
            </div>
            <AccordionContent className="px-3 pb-3 pt-0">
                <div className="pl-8 pr-2">
                    <p className="text-sm text-[var(--theme-text)] leading-relaxed whitespace-pre-wrap">
                        {notification.content}
                    </p>
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}

export default NotificationItem