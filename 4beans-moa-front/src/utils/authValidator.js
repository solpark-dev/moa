import httpClient from "@/api/httpClient";
import { useAuthStore } from "@/store/authStore";

export async function requireLogin() {
  const { accessToken } = useAuthStore.getState();

  if (!accessToken) {
    return false;
  }

  try {
    const res = await httpClient.get("/users/me");
    return res?.success === true;
  } catch (e) {
    return false;
  }
}
