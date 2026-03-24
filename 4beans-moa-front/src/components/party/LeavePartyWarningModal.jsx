import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

export default function LeavePartyWarningModal({ isOpen, onClose, onConfirm }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                        <AlertTriangle className="w-6 h-6" />
                        <DialogTitle>정말 탈퇴하시겠습니까?</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2 text-base text-gray-700">
                        파티 탈퇴 시 환불 정책에 따라 보증금이 처리됩니다.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-sm text-amber-800 my-2">
                    <p className="font-bold mb-2">환불 정책</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li><strong>파티 시작 2일 전까지:</strong> 전액 환불</li>
                        <li><strong>파티 시작 1일 전부터:</strong> 환불 불가 (전액 몰수)</li>
                    </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-sm text-red-700 my-2">
                    <p className="font-bold mb-1">주의사항</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>탈퇴 즉시 파티 멤버 자격을 잃게 됩니다.</li>
                        <li>몰수된 보증금은 파티장에게 귀속됩니다.</li>
                        <li>이 작업은 되돌릴 수 없습니다.</li>
                    </ul>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                        동의하고 탈퇴하기
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
