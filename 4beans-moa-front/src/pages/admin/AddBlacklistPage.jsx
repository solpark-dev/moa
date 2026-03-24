import { useAddBlacklistLogic } from "@/hooks/admin/useAddBlacklist";
import AddBlacklistHero from "./components/pages/addBlacklist/AddBlacklistHero";
import AddBlacklistFormCard from "./components/pages/addBlacklist/AddBlacklistFormCard";

export default function AddBlacklistPage() {
  const {
    userId,
    reasonType,
    reasonDetail,
    submitting,
    error,
    handleChangeUserId,
    handleChangeReasonType,
    handleChangeReasonDetail,
    handleSubmit,
    handleCancel,
  } = useAddBlacklistLogic();

  return (
    <div className="min-h-screen bg-transparent text-black overflow-hidden">
      <AddBlacklistHero />
      <AddBlacklistFormCard
        userId={userId}
        reasonType={reasonType}
        reasonDetail={reasonDetail}
        submitting={submitting}
        error={error}
        onChangeUserId={handleChangeUserId}
        onChangeReasonType={handleChangeReasonType}
        onChangeReasonDetail={handleChangeReasonDetail}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
