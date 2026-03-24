import httpClient from "@/api/httpClient";
import { useBackupCodeStore } from "@/store/user/backupCodeStore";
import { toast } from "@/utils/toast";
import { handleApiError } from "@/utils/errorHandler";

export function useBackupCodeModal() {
  const {
    open,
    codes,
    loading,
    setOpen,
    setCodes,
    setLoading,
    reset,
    issued,
    setIssued,
  } = useBackupCodeStore();

  const fetchExistingCodes = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await httpClient.get("/auth/otp/backup/list");
      const data = res?.data || {};
      const issuedFlag = !!data.issued;
      const list = Array.isArray(data.codes) ? data.codes : [];

      setIssued(issuedFlag);
      setCodes(list);
    } catch (e) {
      console.error("backup list error", e);
    } finally {
      setLoading(false);
    }
  };

  const issueBackupCodes = async () => {
    if (loading || issued) return;

    setLoading(true);

    try {
      const res = await httpClient.post("/auth/otp/backup/issue");
      const list = res?.data?.codes || [];

      if (!list.length) {
        toast.error("발급된 백업 코드가 없습니다.");
        setIssued(false);
        return;
      }

      setCodes(list);
      setIssued(true);
      setOpen(true);
    } catch (e) {
      const err = handleApiError(e);

      if (err.code === "E450") {
        await fetchExistingCodes();
        setOpen(true);
        return;
      }

      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openViewer = async () => {
    if (loading) return;

    await fetchExistingCodes();
    setOpen(true);
  };

  const openExistingCodes = async () => {
    if (loading) return;
    await fetchExistingCodes();
    setOpen(true);
  };

  const close = () => {
    reset();
  };

  const copyAll = async () => {
    if (!codes.length) return;
    try {
      await navigator.clipboard.writeText(codes.join("\n"));
      toast.success("백업 코드를 클립보드에 복사했어요.");
    } catch {
      toast.error("클립보드 복사에 실패했습니다.");
    }
  };

  const downloadTxt = () => {
    if (!codes.length) return;
    const blob = new Blob([codes.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "moa-backup-codes.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return {
    open,
    codes,
    loading,
    issued,
    issueBackupCodes,
    openExistingCodes,
    close,
    copyAll,
    downloadTxt,
    fetchExistingCodes,
    openViewer,
  };
}
