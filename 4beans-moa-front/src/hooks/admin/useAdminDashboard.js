import { useState, useEffect } from "react";
import { getDashboardStats } from "@/api/adminDashboardApi";

export const useAdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getDashboardStats();
                setStats(data.data); // ApiResponse.success(data) 구조 가정
            } catch (err) {
                setError(err);
                console.error("대시보드 통계 조회 실패:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading, error };
};
