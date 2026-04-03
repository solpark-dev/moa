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
import { Button } from "@/components/ui/button";
import { User, Upload } from "lucide-react";
import { toast } from "@/utils/toast";
import httpClient from "@/api/httpClient";
import { useAuthStore } from "@/store/authStore";

export function UpdateUserDialog({ open, onOpenChange }) {
  const { user, setUser } = useAuthStore();

  const fileRef = useRef(null);
  const [nickname, setNickname] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [nickMsg, setNickMsg] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      setNickname(user.nickname || "");
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
      toast.warning("닉네임을 확인해주세요.");
      return;
    }

    const saveAction = async () => {
      let finalImageUrl = user.profileImage;
      if (imageFile) {
        const fileData = new FormData();
        fileData.append("file", imageFile);
        const uploadRes = await httpClient.post("/users/uploadProfileImage", fileData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (uploadRes?.success && uploadRes?.data) {
          finalImageUrl = uploadRes.data;
          setUser({ ...user, profileImage: finalImageUrl });
        } else {
          throw new Error("이미지 업로드 실패했습니다.");
        }
      }

      const res = await httpClient.put("/users/me", {
        nickname: nickname,
        phone: user?.phone,
        profileImage: finalImageUrl,
        agreeMarketing: user?.agreeMarketing,
      });

      if (!res?.success) throw new Error(res?.error?.message || "수정에 실패했습니다.");

      const meRes = await httpClient.get("/users/me");
      if (meRes?.success && meRes?.data) setUser(meRes.data);
      onOpenChange(false);
    };

    setLoading(true);
    toast.promise(saveAction(), {
      loading: "회원정보를 저장하는 중...",
      success: "회원정보가 성공적으로 수정되었습니다.",
      error: (err) => err.message || "수정 중 오류가 발생했습니다.",
    }).finally(() => {
      setLoading(false);
    });
  };

  const inputStyle = {
    background: "var(--glass-bg-card)",
    border: "1px solid var(--glass-border)",
    color: "var(--theme-text)",
  };

  const inputReadonlyStyle = {
    background: "var(--glass-bg-overlay)",
    border: "1px solid var(--glass-border)",
    color: "var(--theme-text-muted)",
  };

  const outlineBtnStyle = {
    background: "var(--glass-bg-overlay)",
    border: "1px solid var(--glass-border)",
    color: "var(--theme-text)",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md rounded-2xl"
        style={{
          background: "var(--glass-bg-card)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-glass)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ color: "var(--theme-text)" }}>
            <User className="w-5 h-5" />
            회원정보 수정
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group cursor-pointer" onClick={openFilePicker}>
              <Avatar className="w-20 h-20" style={{ border: "1px solid var(--glass-border)" }}>
                <AvatarImage src={displayImage} className="object-cover" />
                <AvatarFallback style={{ background: "var(--glass-bg-overlay)", color: "var(--theme-text-muted)" }}>
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
              className="rounded-xl"
              style={outlineBtnStyle}
            >
              이미지 변경
            </Button>
            <input ref={fileRef} type="file" accept="image/*" onChange={onImageSelect} className="hidden" />
          </div>

          <div style={{ borderTop: "1px solid var(--glass-border)" }} />

          {/* 이메일 (읽기전용) */}
          <div className="space-y-2">
            <Label className="text-sm font-bold" style={{ color: "var(--theme-text)" }}>이메일 (ID)</Label>
            <Input
              readOnly
              value={user?.userId || ""}
              className="rounded-xl cursor-not-allowed"
              style={inputReadonlyStyle}
            />
          </div>

          {/* 닉네임 */}
          <div className="space-y-2">
            <Label className="text-sm font-bold" style={{ color: "var(--theme-text)" }}>닉네임</Label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onBlur={() => checkNickname(nickname)}
              placeholder="변경할 닉네임 입력"
              className="rounded-xl"
              style={inputStyle}
            />
            {nickMsg.text && (
              <p className={`text-xs ${nickMsg.isError ? "text-red-500" : "text-emerald-500"}`}>
                {nickMsg.text}
              </p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl"
              style={outlineBtnStyle}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={onSave}
              disabled={loading}
              className="flex-1 text-white rounded-xl"
              style={{ background: "var(--theme-primary)" }}
            >
              {loading ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
