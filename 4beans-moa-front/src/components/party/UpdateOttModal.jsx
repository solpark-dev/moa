import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { updateOttAccount } from "../../api/partyApi";
import { useThemeStore } from "@/store/themeStore";

export default function UpdateOttModal({ isOpen, onClose, partyId, currentOttId }) {
    const { theme } = useThemeStore();
    const [ottId, setOttId] = useState(currentOttId || "");
    const [ottPassword, setOttPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const getThemeColors = () => {
        switch (theme) {
            case 'pop':
                return {
                    focusRing: 'focus:ring-pink-500',
                    buttonBg: 'bg-pink-500 hover:bg-pink-600',
                };
            case 'christmas':
                return {
                    focusRing: 'focus:ring-[#c41e3a]',
                    buttonBg: 'bg-[#c41e3a] hover:bg-[#a51830]',
                };
            case 'dark':
                return {
                    focusRing: 'focus:ring-[#635bff]',
                    buttonBg: 'bg-[#635bff] hover:bg-[#5851e8]',
                };
            default:
                return {
                    focusRing: 'focus:ring-[#635bff]',
                    buttonBg: 'bg-[#635bff] hover:bg-[#5851e8]',
                };
        }
    };

    const themeColors = getThemeColors();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!ottId || !ottPassword) {
            alert("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }

        setLoading(true);
        try {
            await updateOttAccount(partyId, { ottId, ottPassword });
            alert("OTT 계정 정보가 수정되었습니다.");
            onClose(true); // true indicates success
        } catch (error) {
            console.error("Failed to update OTT account", error);
            alert("정보 수정에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>OTT 계정 정보 수정</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">아이디 (이메일)</label>
                        <input
                            type="text"
                            value={ottId}
                            onChange={(e) => setOttId(e.target.value)}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${themeColors.focusRing}`}
                            placeholder="example@email.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">비밀번호</label>
                        <input
                            type="text"
                            value={ottPassword}
                            onChange={(e) => setOttPassword(e.target.value)}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${themeColors.focusRing}`}
                            placeholder="새로운 비밀번호"
                        />
                    </div>

                    <DialogFooter>
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 ${themeColors.buttonBg} text-white rounded-lg font-medium transition-colors disabled:opacity-50`}
                        >
                            {loading ? "저장 중..." : "저장하기"}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
