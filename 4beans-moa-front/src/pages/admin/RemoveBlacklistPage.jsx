import { useRemoveBlacklistLogic } from "@/hooks/admin/useRemoveBlacklist";
import RemoveBlacklistHero from "./components/pages/addBlacklist/removeBlacklist/RemoveBlacklistHero";
import RemoveBlacklistFormCard from "./components/pages/addBlacklist/removeBlacklist/RemoveBlacklistFormCard";

export default function RemoveBlacklistPage() {
  const {
    userId,
    reason,
    submitting,
    error,
    handleChangeReason,
    handleSubmit,
    handleCancel,
  } = useRemoveBlacklistLogic();

  return (
    <div className="min-h-screen bg-transparent text-slate-900 font-sans pb-24 overflow-hidden">
      <RemoveBlacklistHero />
      <RemoveBlacklistFormCard
        userId={userId}
        reason={reason}
        submitting={submitting}
        error={error}
        onChangeReason={handleChangeReason}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
