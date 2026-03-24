import { useState } from 'react'
import { Plus, Pencil, Trash2, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Accordion,
    AccordionItem,
    AccordionContent
} from '@/components/ui/accordion'

/**
 * 템플릿 관리 탭 컴포넌트
 * CSS 변수 기반 테마 적용
 */

const TemplatesTab = ({ templates, isLoading, onAdd, onEdit, onDelete }) => {
    const [expandedId, setExpandedId] = useState('')

    return (
        <div className="h-full flex flex-col">
            <div className="px-6 py-3 border-b border-[var(--theme-border-light)] bg-[var(--theme-bg-card)] flex items-center justify-between flex-shrink-0">
                <p className="text-sm text-[var(--theme-text-muted)]">
                    총 <span className="font-semibold text-[var(--theme-text)]">{templates.length}</span>개의 템플릿
                </p>
                <Button onClick={onAdd} size="sm" className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white">
                    <Plus className="w-4 h-4 mr-1" />
                    새 템플릿
                </Button>
            </div>

            <ScrollArea className="flex-1">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-[var(--theme-text-muted)]" />
                    </div>
                ) : templates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-[var(--theme-primary)] opacity-50">
                        <FileText className="w-10 h-10 mb-2" />
                        <p className="text-sm">등록된 템플릿이 없습니다</p>
                    </div>
                ) : (
                    <Accordion
                        type="single"
                        collapsible
                        value={expandedId}
                        onValueChange={(val) => setExpandedId(val || '')}
                        className="p-4 space-y-2"
                    >
                        {templates.map((template) => {
                            const isExpanded = expandedId === template.pushCodeId.toString()
                            return (
                                <AccordionItem
                                    key={template.pushCodeId}
                                    value={template.pushCodeId.toString()}
                                    className={`border border-[var(--theme-border-light)] rounded-xl overflow-hidden transition-colors ${isExpanded ? 'bg-[var(--theme-primary-light)]' : 'bg-[var(--theme-bg-card)] hover:bg-[var(--theme-primary-light)]'
                                        }`}
                                >
                                    <div
                                        className="flex items-center w-full px-4 py-3 cursor-pointer"
                                        onClick={() => setExpandedId(isExpanded ? '' : template.pushCodeId.toString())}
                                    >
                                        <Badge variant="outline" className="font-mono text-xs flex-shrink-0 w-40 justify-center bg-[var(--theme-bg-card)]">
                                            {template.codeName}
                                        </Badge>

                                        <span className="font-medium text-[var(--theme-text)] truncate flex-1 ml-3">
                                            {template.titleTemplate}
                                        </span>

                                        <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onEdit(template)
                                                }}
                                                className="h-8 w-8 text-[var(--theme-text-muted)] hover:text-[var(--theme-primary)] hover:bg-[var(--theme-primary-light)]"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onDelete(template.pushCodeId)
                                                }}
                                                className="h-8 w-8 text-[var(--theme-text-muted)] hover:text-red-600 hover:bg-red-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <AccordionContent className="px-4 pb-4 pt-0">
                                        <div className="bg-[var(--theme-bg-card)] border border-[var(--theme-border-light)] rounded-lg p-3">
                                            <p className="text-xs text-[var(--theme-text-muted)] mb-1">내용 템플릿</p>
                                            <p className="text-sm text-[var(--theme-text)] whitespace-pre-wrap">
                                                {template.contentTemplate}
                                            </p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                )}
            </ScrollArea>
        </div>
    )
}

export default TemplatesTab