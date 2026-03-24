import httpClient from "@/api/httpClient";
import { useFindIdStore } from "@/store/user/findIdStore";

export const useFindIdLogic = () => {
  const { setField } = useFindIdStore();

  const handlePassAuth = async () => {
    const { IMP } = window;

    try {
      setField("isLoading", true);

      const startRes = await httpClient.get("/signup/pass/start");
      const { impCode, merchantUid } = startRes.data;

      if (!IMP) {
        alert("본인인증 모듈을 불러올 수 없습니다.");
        setField("isLoading", false);
        return;
      }

      IMP.init(impCode);

      IMP.certification(
        { merchant_uid: merchantUid, popup: false },
        async (rsp) => {
          if (!rsp.success) {
            alert(`본인인증 실패: ${rsp.error_msg || ""}`);
            setField("isLoading", false);
            return;
          }

          try {
            // PASS 인증 검증
            const verifyRes = await httpClient.post("/signup/pass/verify", {
              imp_uid: rsp.imp_uid,
            });

            const { phone } = verifyRes.data;

            // 아이디 찾기
            const findIdRes = await httpClient.post("/signup/find-id", {
              phone,
            });
            const { email } = findIdRes.data;

            if (!email) {
              alert("가입된 아이디를 찾을 수 없습니다.");
              return;
            }

            setField("foundEmail", email);
            setField("step", 2);
          } catch (err) {
            console.error(err);
            alert("아이디 찾기 처리 중 오류가 발생했습니다.");
          } finally {
            setField("isLoading", false);
          }
        }
      );
    } catch (error) {
      console.error(error);
      alert("인증 초기화 중 오류가 발생했습니다.");
      setField("isLoading", false);
    }
  };

  return { handlePassAuth };
};
