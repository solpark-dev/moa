import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

/**
 * 템플릿 폼 컴포넌트
 * CSS 변수 기반 테마 적용
 */

const TemplateForm = ({ isOpen, onClose, template, onSave, isLoading }) => {
    const [form, setForm] = useState({
        codeName: '',
        titleTemplate: '',
        contentTemplate: ''
    })

    useEffect(() => {
        if (template) {
            setForm({
                codeName: template.codeName || '',
                titleTemplate: template.titleTemplate || '',
                contentTemplate: template.contentTemplate || ''
            })
        } else {
            setForm({
                codeName: '',
                titleTemplate: '',
                contentTemplate: ''
            })
        }
    }, [template])

    const handleSubmit = async () => {
        if (!form.codeName || !form.titleTemplate || !form.contentTemplate) {
            alert('모든 필드를 입력해주세요.')
            return
        }
        await onSave({
            ...template,
            ...form
        })
    }

    const handleCodeNameChange = (e) => {
        setForm({ ...form, codeName: e.target.value.toUpperCase() })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
            <DialogContent allowScroll className="max-w-lg bg-[var(--theme-bg-card)]">
                <DialogHeader>
                    <DialogTitle className="text-[var(--theme-primary)]">
                        {template?.pushCodeId ? '템플릿 수정' : '새 템플릿 추가'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm font-medium text-[var(--theme-text)] mb-1.5 block">
                            푸시 코드
                        </label>
                        <Input
                            value={form.codeName}
                            onChange={handleCodeNameChange}
                            placeholder="예: PAY_SUCCESS"
                            className="font-mono focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
                        />
                        <p className="text-xs text-[var(--theme-text-muted)] mt-1">
                            영문 대문자와 언더스코어(_)만 사용
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[var(--theme-text)] mb-1.5 block">
                            제목 템플릿
                        </label>
                        <Input
                            value={form.titleTemplate}
                            onChange={(e) => setForm({ ...form, titleTemplate: e.target.value })}
                            placeholder="예: 결제 완료"
                            className="focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[var(--theme-text)] mb-1.5 block">
                            내용 템플릿
                        </label>
                        <Textarea
                            value={form.contentTemplate}
                            onChange={(e) => setForm({ ...form, contentTemplate: e.target.value })}
                            placeholder="예: {productName} 결제가 완료되었습니다. 금액: {amount}원"
                            rows={4}
                            className="focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"
                        />
                        <p className="text-xs text-[var(--theme-text-muted)] mt-1">
                            {'{변수명}'} 형식으로 동적 값 사용 가능
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} className="border-[var(--theme-border-light)] hover:bg-[var(--theme-primary-light)] text-[var(--theme-text)]">
                        취소
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white">
                        {isLoading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                        저장
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default TemplateForm