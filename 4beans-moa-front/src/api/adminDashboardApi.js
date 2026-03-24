import httpClient from "@/api/httpClient";

// 관리자 대시보드 통계 조회
export const getDashboardStats = async () => {
    const response = await httpClient.get("/admin/dashboard/stats");
    return response;
};

// 월 목표 조회
export const getMonthlyGoal = async () => {
    const response = await httpClient.get("/admin/dashboard/goal");
    return response;
};

// 월 목표 수정
export const updateMonthlyGoal = async (goalAmount) => {
    const response = await httpClient.put("/admin/dashboard/goal", { goalAmount });
    return response;
};
