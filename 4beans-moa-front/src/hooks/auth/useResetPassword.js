import httpClient from "@/api/httpClient";

export const initResetPwdPage = () => {
  const passBtn = document.getElementById("btnResetPassAuth");
  const step1 = document.getElementById("resetStep1");
  const step2 = document.getElementById("resetStep2");
  const guide = document.getElementById("resetGuide");
  const formArea = document.getElementById("resetFormArea");
  const btnReset = document.getElementById("btnResetPwd");
  const newPwdInput = document.getElementById("resetNewPassword");
  const newPwdCheckInput = document.getElementById("resetNewPasswordCheck");

  if (!passBtn || !step1 || !step2 || !guide || !formArea || !btnReset) {
    return;
  }

  if (!passBtn.dataset.boundPass) {
    passBtn.addEventListener("click", async () => {
      try {
        const res = await httpClient.get("/signup/pass/start");
        const { data } = res;
        const { impCode, merchantUid } = data;

        if (!window.IMP) {
          alert("본인인증 모듈이 로드되지 않았습니다.");
          return;
        }

        window.IMP.init(impCode);
        window.IMP.certification(
          {
            merchant_uid: merchantUid,
            popup: true,
            pg: "inicis_unified",
          },
          async function (rsp) {
            if (!rsp.success) {
              alert("본인인증 실패");
              return;
            }

            const verify = await httpClient.post("/users/pass/verify", {
              imp_uid: rsp.imp_uid,
            });

            const { data } = verify;
            const di = data.di;

            await httpClient.post("/users/resetPwd/start-pass", { di });

            guide.innerText =
              "본인 인증이 완료되었습니다. 새 비밀번호를 입력해 주세요.";
            formArea.classList.remove("hidden");

            step1.classList.remove("text-blue-600");
            step1.classList.add("text-gray-400");
            step2.classList.remove("text-gray-400");
            step2.classList.add("text-blue-600");

            alert("본인인증 성공. 비밀번호를 변경할 수 있습니다.");
          }
        );
      } catch (err) {
        console.log(err);
        const msg =
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "본인인증 처리 중 오류가 발생했습니다.";
        alert(msg);
      }
    });

    passBtn.dataset.boundPass = "true";
  }

  if (!btnReset.dataset.boundReset) {
    btnReset.addEventListener("click", async () => {
      const password = newPwdInput.value.trim();
      const passwordCheck = newPwdCheckInput.value.trim();

      if (!password || !passwordCheck) {
        alert("비밀번호를 모두 입력해 주세요.");
        return;
      }

      if (password !== passwordCheck) {
        alert("새 비밀번호와 확인이 일치하지 않습니다.");
        return;
      }

      if (password.length < 8 || password.length > 20) {
        alert("비밀번호는 8~20자여야 합니다.");
        return;
      }

      const pattern =
        /^(?=.*[A-Za-z])(?:(?=.*[0-9])|(?=.*[^A-Za-z0-9])).{8,20}$/;
      if (!pattern.test(password)) {
        alert("영문과 숫자 또는 특수문자를 포함한 비밀번호를 입력해 주세요.");
        return;
      }

      try {
        const res = await httpClient.post("/users/resetPwd", {
          password,
          passwordConfirm: passwordCheck,
        });

        if (res.success) {
          alert("비밀번호가 변경되었습니다. 다시 로그인해 주세요.");
          window.location.href = "/login";
        } else {
          const msg = res.error?.message || "비밀번호 변경에 실패했습니다.";
          alert(msg);
        }
      } catch (err) {
        console.log(err);
        const msg =
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "비밀번호 변경 중 오류가 발생했습니다.";
        alert(msg);
      }
    });

    btnReset.dataset.boundReset = "true";
  }
};
