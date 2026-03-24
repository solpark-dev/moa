import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Upload, BellRing, Phone } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { formatPhone } from "@/utils/phoneUtils";
import httpClient from "@/api/httpClient";
import { useAuthStore } from "@/store/authStore";

// 테마별 스타일
const dialogThemeStyles = {
  pop: {
    content: "bg-white border border-gray-200",
    title: "text-black",
    label: "text-black",
    input: "bg-white border-gray-200 text-black",
    inputReadonly: "bg-slate-100 border-gray-200 text-gray-700",
    switchBg: "data-[state=checked]:bg-pink-500",
    primaryBtn: "bg-pink-500 hover:bg-pink-600 text-white",
    secondaryBtn: "bg-white border-gray-200 text-black hover:bg-slate-50",
    sectionBg: "bg-slate-100 border-gray-200",
    mutedText: "text-gray-600",
  },
  classic: {
    content: "bg-white border border-gray-200",
    title: "text-black",
    label: "text-black",
    input: "bg-white border-gray-200 text-black",
    inputReadonly: "bg-slate-100 border-gray-200 text-gray-700",
    switchBg: "data-[state=checked]:bg-[#635bff]",
    primaryBtn: "bg-[#635bff] hover:bg-[#5851e8] text-white",
    secondaryBtn: "bg-white border-gray-200 text-black hover:bg-slate-50",
    sectionBg: "bg-slate-100 border-gray-200",
    mutedText: "text-gray-600",
  },
  dark: {
    content: "bg-[#1E293B] border border-gray-700",
    title: "text-gray-100",
    label: "text-gray-200",
    input: "bg-[#0F172A] border-gray-700 text-gray-100",
    inputReadonly: "bg-[#0F172A] border-gray-700 text-gray-400",
    switchBg: "data-[state=checked]:bg-[#635bff]",
    primaryBtn: "bg-[#635bff] hover:bg-[#5851e8] text-white",
    secondaryBtn: "bg-[#0F172A] border-gray-700 text-gray-200 hover:bg-gray-800",
    sectionBg: "bg-[#0F172A] border-gray-700",
    mutedText: "text-gray-400",
  },
  christmas: {
    content: "bg-white border border-gray-200",
    title: "text-black",
    label: "text-black",
    input: "bg-white border-gray-200 text-black",
    inputReadonly: "bg-slate-100 border-gray-200 text-gray-700",
    switchBg: "data-[state=checked]:bg-[#c41e3a]",
    primaryBtn: "bg-[#c41e3a] hover:bg-red-700 text-white",
    secondaryBtn: "bg-white border-gray-200 text-black hover:bg-red-50",
    sectionBg: "bg-slate-100 border-gray-200",
    mutedText: "text-gray-600",
  },
};

export function UpdateUserDialog({ open, onOpenChange }) {
  const { theme } = useThemeStore();
  const themeStyle = dialogThemeStyles[theme] || dialogThemeStyles.pop;
  const { user, setUser } = useAuthStore();
  
  const fileRef = useRef(null);
  const [nickname, setNickname] = useState("");
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [nickMsg, setNickMsg] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);

  // 초기값 설정
  useEffect(() => {
    if (open && user) {
      setNickname(user.nickname || "");
      setAgreeMarketing(user.agreeMarketing ?? user.marketing ?? false);
      setPreviewUrl(user.profileImage || null);
      setImageFile(null);
      setNickMsg({ text: "", isError: false });
    }
  }, [open, user]);

  const displayImage = previewUrl || user?.profileImage;

  const openFilePicker = () => fileRef.current?.click();

  const onImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const checkNickname = async (value) => {
    if (!value || value === user?.nickname) {
      setNickMsg({ text: "", isError: false });
      return;
    }
    try {
      const res = await httpClient.get("/users/check-nickname", { params: { nickname: value } });
      if (res?.available) {
        setNickMsg({ text: "사용 가능한 닉네임입니다.", isError: false });
      } else {
        setNickMsg({ text: "이미 사용 중인 닉네임입니다.", isError: true });
      }
    } catch {
      setNickMsg({ text: "닉네임 확인 중 오류가 발생했습니다.", isError: true });
    }
  };

  const onSave = async () => {
    if (nickMsg.isError) {
      alert("닉네임을 확인해주세요.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nickname", nickname);
      formData.append("agreeMarketing", agreeMarketing);
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      const res = await httpClient.put("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res?.success) {
        // 사용자 정보 갱신
        const meRes = await httpClient.get("/users/me");
        if (meRes?.success && meRes?.data) {
          setUser(meRes.data);
        }
        alert("회원정보가 수정되었습니다.");
        onOpenChange(false);
      } else {
        alert(res?.error?.message || "수정에 실패했습니다.");
      }
    } catch (err) {
      alert(err?.response?.data?.error?.message || "수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const onPassVerify = () => {
    window.open("https://nice.checkplus.co.kr", "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-md ${themeStyle.content}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${themeStyle.title}`}>
            <User className="w-5 h-5" />
            회원정보 수정
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group cursor-pointer" onClick={openFilePicker}>
              <Avatar className="w-20 h-20 border border-gray-200">
                <AvatarImage src={displayImage} className="object-cover" />
                <AvatarFallback className="bg-slate-200 text-slate-700">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-20 h-20 rounded-full bg-black/40 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openFilePicker}
              className={`${themeStyle.secondaryBtn} rounded-xl`}
            >
              이미지 변경
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onImageSelect}
              className="hidden"
            />
          </div>

          <Separator className={theme === "dark" ? "bg-gray-700" : "bg-gray-200"} />

          {/* 이메일 (읽기전용) */}
          <div className="space-y-2">
            <Label className={`text-sm font-bold ${themeStyle.label}`}>이메일 (ID)</Label>
            <Input
              readOnly
              value={user?.userId || ""}
              className={`${themeStyle.inputReadonly} rounded-xl cursor-not-allowed`}
            />
          </div>

          {/* 닉네임 */}
          <div className="space-y-2">
            <Label className={`text-sm font-bold ${themeStyle.label}`}>닉네임</Label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onBlur={() => checkNickname(nickname)}
              placeholder="변경할 닉네임 입력"
              className={`${themeStyle.input} rounded-xl`}
            />
            {nickMsg.text && (
              <p className={`text-xs ${nickMsg.isError ? "text-red-500" : "text-emerald-600"}`}>
                {nickMsg.text}
              </p>
            )}
          </div>

          {/* 휴대폰 번호 */}
          <div className="space-y-2">
            <Label className={`text-sm font-bold ${themeStyle.label}`}>휴대폰 번호</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={formatPhone(user?.phone) || "-"}
                className={`flex-1 ${themeStyle.inputReadonly} rounded-xl cursor-not-allowed`}
              />
              <Button
                type="button"
                variant="outline"
                onClick={onPassVerify}
                className={`${themeStyle.secondaryBtn} rounded-xl px-4`}
              >
                본인인증
              </Button>
            </div>
          </div>

          <Separator className={theme === "dark" ? "bg-gray-700" : "bg-gray-200"} />

          {/* 마케팅 동의 */}
          <div className={`${themeStyle.sectionBg} border rounded-xl p-4`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4" />
                <div>
                  <p className={`text-sm font-bold ${themeStyle.label}`}>마케팅 정보 수신 동의</p>
                  <p className={`text-xs ${themeStyle.mutedText}`}>이벤트 및 혜택 정보를 받아보세요</p>
                </div>
              </div>
              <Switch
                checked={agreeMarketing}
                onCheckedChange={setAgreeMarketing}
                className={themeStyle.switchBg}
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className={`flex-1 ${themeStyle.secondaryBtn} rounded-xl`}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={onSave}
              disabled={loading}
              className={`flex-1 ${themeStyle.primaryBtn} rounded-xl`}
            >
              {loading ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
