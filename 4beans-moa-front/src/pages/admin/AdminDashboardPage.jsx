import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import {
    Loader2,
    DollarSign,
    Users,
    PartyPopper,
    TrendingUp,
    TrendingDown,
    Wallet,
    CreditCard,
    Clock,
    UserPlus,
    Activity,
    ArrowRight,
    Calendar,
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    BarChart3,
    Search,
    Filter,
    Bell,
    Target,
    XCircle,
    Settings,
    X,
    Save,
} from "lucide-react";
import Chart from "react-apexcharts";
import { useThemeStore } from "@/store/themeStore";

// Removed theme imports to enforce classic theme


// Removed local AnimatedGradient and GridPattern in favor of global theme

// Period Filter Component
const PeriodFilter = ({ selected, onChange, theme }) => {
    const options = [
        { value: "today", label: "오늘" },
        { value: "7days", label: "7일" },
        { value: "30days", label: "30일" },
        { value: "all", label: "전체" },
    ];

    const isDark = theme === 'dark';
    const primaryColor = theme === 'christmas' ? '#c41e3a' : theme === 'pop' ? '#ec4899' : '#635bff';

    return (
        <div className={`flex items-center gap-2 ${isDark ? 'bg-[#1E293B] border-gray-700' : 'bg-white border-gray-100'} border p-1 rounded-xl shadow-sm`}>
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${selected === opt.value
                        ? `text-white shadow-md`
                        : `${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-50'}`
                        }`}
                    style={selected === opt.value ? { backgroundColor: primaryColor, boxShadow: `0 4px 12px ${primaryColor}20` } : {}}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};

// Enhanced StatCard with Trend
const StatCard = ({ icon: Icon, title, value, subtitle, color, trend, delay = 0, theme }) => {
    const isDark = theme === 'dark';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`group relative ${isDark ? 'bg-[#1E293B] border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border p-5 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300`}
        >
            <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2 transition-transform duration-300 group-hover:scale-150"
                style={{ background: color }}
            />
            <div className="relative">
                <div className="flex items-center justify-between mb-3">
                    <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{ background: `${color}15` }}
                    >
                        <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    {trend !== undefined && (
                        <div className={`flex items-center gap-1 text-sm font-bold ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span>{Math.abs(trend)}%</span>
                        </div>
                    )}
                </div>
                <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{title}</div>
                <div className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
                {subtitle && <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-1`}>{subtitle}</div>}
            </div>
        </motion.div>
    );
};

// Alert Item Component
const AlertItem = ({ type, title, message, time }) => {
    const typeConfig = {
        error: { bg: "bg-red-50/50", border: "border-red-200/50", icon: XCircle, iconColor: "text-red-500" },
        warning: { bg: "bg-amber-50/50", border: "border-amber-200/50", icon: AlertTriangle, iconColor: "text-amber-500" },
        info: { bg: "bg-blue-50/50", border: "border-blue-200/50", icon: Bell, iconColor: "text-blue-500" },
    };
    const config = typeConfig[type] || typeConfig.info;
    const IconComponent = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-start gap-3 p-3 rounded-xl ${config.bg} border ${config.border}`}
        >
            <IconComponent className={`w-5 h-5 mt-0.5 ${config.iconColor}`} />
            <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">{title}</div>
                <div className="text-xs text-gray-500 truncate">{message}</div>
            </div>
            <div className="text-xs text-gray-400 whitespace-nowrap">{time}</div>
        </motion.div>
    );
};

// Quick Action Button
const QuickActionButton = ({ icon: Icon, label, to, color, delay = 0, theme }) => {
    const isDark = theme === 'dark';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay }}
        >
            <Link
                to={to}
                className={`group flex flex-col items-center gap-2 p-4 ${isDark ? 'bg-[#1E293B] border-gray-700 hover:bg-[#334155]' : 'bg-white border-gray-100'} border rounded-2xl hover:shadow-lg transition-all duration-300`}
            >
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${color}15` }}
                >
                    <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`}>{label}</span>
            </Link>
        </motion.div>
    );
};

// Goal Edit Modal Component
const GoalEditModal = ({ isOpen, onClose, currentGoal, onSave }) => {
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (isOpen) {
            setInputValue(currentGoal.toLocaleString());
        }
    }, [isOpen, currentGoal]);

    const handleInputChange = (e) => {
        // 숫자와 콤마만 허용
        const value = e.target.value.replace(/[^0-9,]/g, '');
        // 콤마 제거 후 다시 포맷팅
        const numericValue = value.replace(/,/g, '');
        if (numericValue === '') {
            setInputValue('');
        } else {
            setInputValue(Number(numericValue).toLocaleString());
        }
    };

    const handleSave = () => {
        const numericValue = Number(inputValue.replace(/,/g, ''));
        if (numericValue > 0) {
            onSave(numericValue);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const presetAmounts = [5000000, 10000000, 15000000, 20000000, 30000000];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#ec4899]/10 flex items-center justify-center">
                                        <Target className="w-5 h-5 text-[#ec4899]" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">월 목표 설정</h3>
                                        <p className="text-sm text-gray-500">이번 달 매출 목표를 설정하세요</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-5 space-y-5">
                                {/* Current Goal */}
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="text-sm text-gray-500 mb-1">현재 목표</div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {currentGoal.toLocaleString()}원
                                    </div>
                                </div>

                                {/* Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        새 목표 금액
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            placeholder="금액을 입력하세요"
                                            className="w-full px-4 py-3 pr-12 text-lg font-semibold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#ec4899] focus:ring-4 focus:ring-[#ec4899]/10 transition-all"
                                            autoFocus
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                            원
                                        </span>
                                    </div>
                                </div>

                                {/* Preset Buttons */}
                                <div>
                                    <div className="text-sm text-gray-500 mb-2">빠른 선택</div>
                                    <div className="flex flex-wrap gap-2">
                                        {presetAmounts.map((amount) => (
                                            <button
                                                key={amount}
                                                onClick={() => setInputValue(amount.toLocaleString())}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${inputValue === amount.toLocaleString()
                                                    ? 'bg-[#ec4899] text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {(amount / 10000).toLocaleString()}만원
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-200 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!inputValue}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ec4899] text-white font-medium hover:bg-[#5851e8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Save className="w-4 h-4" />
                                    저장
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// OttServiceStats with theme classes
const OttServiceStats = ({ stats }) => {
    if (!stats || stats.length === 0) return null;

    const colors = {
        'Netflix': '#E50914',
        'Disney+': '#113CCF',
        'Wavve': '#1351F9',
        'Watcha': '#FF0558',
        'TVING': '#FF153C',
        'Coupang Play': '#5F0080',
    };

    return (
        <div className="space-y-3">
            {stats.slice(0, 5).map((ott, index) => (
                <motion.div
                    key={ott.ottName}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                >
                    <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: colors[ott.ottName] || '#ec4899' }}
                    >
                        {ott.ottName?.[0]}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{ott.ottName}</span>
                            <span className="text-xs text-gray-500">{ott.partyCount}개</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(ott.activeCount / Math.max(ott.partyCount, 1)) * 100}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="h-full rounded-full"
                                style={{ background: colors[ott.ottName] || '#ec4899' }}
                            />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default function AdminDashboardPage() {
    const { stats, loading, error } = useAdminDashboard();
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    const primaryColor = theme === 'christmas' ? '#c41e3a' : theme === 'pop' ? '#ec4899' : '#635bff';

    const [period, setPeriod] = useState("7days");
    const [searchQuery, setSearchQuery] = useState("");

    // Goal Modal State - localStorage 사용
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [monthlyGoal, setMonthlyGoal] = useState(() => {
        const saved = localStorage.getItem('adminMonthlyGoal');
        return saved ? Number(saved) : 10000000; // 기본값 1000만원
    });

    // Save monthly goal handler - localStorage에 저장
    const handleSaveGoal = (newGoal) => {
        localStorage.setItem('adminMonthlyGoal', newGoal.toString());
        setMonthlyGoal(newGoal);
        setIsGoalModalOpen(false);
    };

    // Use empty stats object as fallback when loading or error
    const safeStats = stats || {};

    // Real alerts data from API
    const alerts = useMemo(() => safeStats.alerts || [], [safeStats.alerts]);

    // Search filter for users and payments
    const filteredRecentUsers = useMemo(() => {
        const users = safeStats.recentUsers || [];
        if (!searchQuery.trim()) return users;
        const query = searchQuery.toLowerCase();
        return users.filter(user =>
            user.userName?.toLowerCase().includes(query) ||
            user.userEmail?.toLowerCase().includes(query) ||
            user.odUserId?.toLowerCase().includes(query)
        );
    }, [safeStats.recentUsers, searchQuery]);

    const filteredRecentPayments = useMemo(() => {
        const payments = safeStats.recentPayments || [];
        if (!searchQuery.trim()) return payments;
        const query = searchQuery.toLowerCase();
        return payments.filter(payment =>
            payment.odUserId?.toLowerCase().includes(query) ||
            payment.partyName?.toLowerCase().includes(query)
        );
    }, [safeStats.recentPayments, searchQuery]);

    // Filter revenue data based on period
    const filteredRevenueData = useMemo(() => {
        const dailyRevenues = stats?.dailyRevenues || [];
        if (dailyRevenues.length === 0) return { dates: [], amounts: [] };

        let data = [...dailyRevenues];

        switch (period) {
            case "today":
                data = data.slice(-1);
                break;
            case "7days":
                data = data.slice(-7);
                break;
            case "30days":
                data = data.slice(-30);
                break;
            case "all":
            default:
                // Use all data
                break;
        }

        return {
            dates: data.map(d => d.date?.slice(5) || ''),
            amounts: data.map(d => d.amount || 0),
        };
    }, [stats?.dailyRevenues, period]);

    // ApexCharts - Monthly Revenue Bar Chart (using real API data)
    // NOTE: All useMemo hooks must be called before any conditional returns
    const monthlyRevenueData = useMemo(() => {
        const revenues = safeStats.monthlyRevenues || [];
        return {
            labels: revenues.map(r => r.label || ''),
            amounts: revenues.map(r => r.amount || 0),
        };
    }, [safeStats.monthlyRevenues]);

    // ApexCharts - User Growth Area Chart (using real API data)
    const weeklyUserData = useMemo(() => {
        const newUsers = safeStats.weeklyNewUsers || [];
        const activeUsers = safeStats.weeklyActiveUsers || [];

        // Get labels from the data (already sorted oldest-first from backend)
        const labels = newUsers.length > 0
            ? newUsers.map(w => w.week || '')
            : ["4주 전", "3주 전", "2주 전", "1주 전"];

        return {
            labels,
            newUserCounts: newUsers.map(w => w.count || 0),
            activeUserCounts: activeUsers.map(w => w.count || 0),
        };
    }, [safeStats.weeklyNewUsers, safeStats.weeklyActiveUsers]);

    if (loading) {
        return (
            <div className="min-h-screen bg-transparent flex justify-center items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="w-12 h-12 animate-spin text-[#ec4899]" />
                    <p className="text-gray-500 font-medium">대시보드 로딩 중...</p>
                </motion.div>
            </div>
        );
    }

    // Don't block the entire page on error - just show dashboard with empty/zero values

    // ApexCharts - Revenue Line Chart (connected to period filter)
    const revenueLineOptions = {
        chart: { type: "area", toolbar: { show: false }, animations: { enabled: true, speed: 800 }, background: 'transparent' },
        stroke: { curve: "smooth", width: 3 },
        colors: ["#ec4899"],
        fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 } },
        xaxis: { categories: filteredRevenueData.dates, labels: { style: { colors: 'var(--theme-text-muted)' } } },
        yaxis: { labels: { formatter: (v) => `${(v / 1000000).toFixed(1)}M`, style: { colors: 'var(--theme-text-muted)' } } },
        tooltip: { theme: 'light', y: { formatter: (v) => `${v?.toLocaleString()}원` } },
        grid: { borderColor: "var(--theme-border-light)", strokeDashArray: 4 },
        dataLabels: { enabled: false },
    };

    const revenueLineSeries = [{
        name: "매출",
        data: filteredRevenueData.amounts,
    }];

    // ApexCharts - Party Status Donut
    const partyDonutOptions = {
        chart: { type: "donut", animations: { enabled: true, speed: 800 }, background: 'transparent' },
        colors: ["#10b981", "#ec4899", "#94a3b8"],
        labels: ["활성", "모집중", "종료"],
        legend: { position: "bottom", fontSize: "12px", labels: { colors: 'var(--theme-text-muted)' } },
        plotOptions: { pie: { donut: { size: "70%", labels: { show: true, total: { show: true, label: "전체", color: 'var(--theme-text)', formatter: () => safeStats.totalPartyCount || 0 } } } } },
        dataLabels: { enabled: false },
        stroke: { show: false }
    };

    const partyDonutSeries = [
        safeStats.activePartyCount || 0,
        safeStats.recruitingPartyCount || 0,
        Math.max(0, (safeStats.totalPartyCount || 0) - (safeStats.activePartyCount || 0) - (safeStats.recruitingPartyCount || 0)),
    ];

    const monthlyBarOptions = {
        chart: { type: "bar", toolbar: { show: false }, animations: { enabled: true, speed: 800 }, background: 'transparent' },
        colors: ["#ec4899"],
        plotOptions: { bar: { borderRadius: 8, columnWidth: "50%" } },
        xaxis: { categories: monthlyRevenueData.labels, labels: { style: { colors: 'var(--theme-text-muted)' } } },
        yaxis: { labels: { formatter: (v) => `${(v / 1000000).toFixed(0)}M`, style: { colors: 'var(--theme-text-muted)' } } },
        tooltip: { theme: 'light', y: { formatter: (v) => `${v?.toLocaleString()}원` } },
        grid: { borderColor: "var(--theme-border-light)" },
        dataLabels: { enabled: false },
    };

    const monthlyBarSeries = [{
        name: "월 매출",
        data: monthlyRevenueData.amounts,
    }];

    const userGrowthOptions = {
        chart: { type: "area", toolbar: { show: false }, sparkline: { enabled: false }, background: 'transparent' },
        stroke: { curve: "smooth", width: 2 },
        colors: ["#10b981", "#ec4899"],
        fill: { type: "gradient", gradient: { opacityFrom: 0.3, opacityTo: 0.1 } },
        xaxis: { categories: weeklyUserData.labels, labels: { style: { colors: 'var(--theme-text-muted)' } } },
        yaxis: { labels: { style: { colors: 'var(--theme-text-muted)' } } },
        grid: { borderColor: "var(--theme-border-light)" },
        legend: { position: "top", labels: { colors: 'var(--theme-text-muted)' } },
        dataLabels: { enabled: false },
    };

    const userGrowthSeries = [
        { name: "신규 가입", data: weeklyUserData.newUserCounts },
        { name: "활성 사용자", data: weeklyUserData.activeUserCounts },
    ];

    // ApexCharts - Radial Goal Gauge
    const goalGaugeOptions = {
        chart: { type: "radialBar", background: 'transparent' },
        colors: ["#ec4899"],
        plotOptions: {
            radialBar: {
                hollow: { size: "70%" },
                track: { background: "var(--theme-border-light)" },
                dataLabels: {
                    name: { fontSize: "14px", color: "var(--theme-text-muted)" },
                    value: { fontSize: "24px", fontWeight: "bold", color: "var(--theme-text)" },
                },
            },
        },
        labels: ["목표 달성률"],
    };

    const goalPercentage = Math.min(100, Math.round(((safeStats.thisMonthRevenue || 0) / monthlyGoal) * 100));

    // Period label for chart subtitle
    const getPeriodLabel = () => {
        switch (period) {
            case "today": return "오늘";
            case "7days": return "최근 7일";
            case "30days": return "최근 30일";
            case "all": return "전체 기간";
            default: return "최근 7일";
        }
    };

    return (
        <div className="min-h-screen bg-transparent pb-20 transition-colors duration-300 relative z-10">
            {/* Goal Edit Modal */}
            <GoalEditModal
                isOpen={isGoalModalOpen}
                onClose={() => setIsGoalModalOpen(false)}
                currentGoal={monthlyGoal}
                onSave={handleSaveGoal}
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error notice - show but don't block */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3"
                    >
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                        <p className="text-sm text-amber-700">일부 통계 데이터를 불러오지 못했습니다. 표시된 값이 정확하지 않을 수 있습니다.</p>
                    </motion.div>
                )}
                {/* Page Header with Search and Period Filter */}
                <div className="mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className={`text-2xl md:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {theme === 'christmas' ? '🎄 관리자 대시보드' : '📊 관리자 대시보드'}
                                </h1>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>서비스 현황을 한눈에 확인하세요</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                <input
                                    type="text"
                                    placeholder="사용자, 파티 검색..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`pl-10 pr-4 py-2.5 ${isDark ? 'bg-[#1E293B] border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900'} border rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:border-[${primaryColor}]`}
                                    style={{ '--tw-ring-color': `${primaryColor}20` }}
                                />
                            </div>
                            {/* Period Filter - Connected to Revenue Chart */}
                            <PeriodFilter selected={period} onChange={setPeriod} theme={theme} />
                        </div>
                    </div>
                </div>

                {/* Alerts Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`mb-6 ${isDark ? 'bg-[#1E293B] border-gray-700' : 'bg-white border-gray-100'} rounded-2xl border p-4 shadow-sm`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5" style={{ color: primaryColor }} />
                            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>실시간 알림</h3>
                        </div>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>최근 24시간</span>
                    </div>
                    <div className="space-y-2">
                        {alerts.map((alert, i) => (
                            <AlertItem key={i} {...alert} />
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions - moved up for quick access */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-6"
                >
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>빠른 작업</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        <QuickActionButton icon={Users} label="회원 관리" to="/admin/users" color={primaryColor} delay={0} theme={theme} />
                        <QuickActionButton icon={PartyPopper} label="파티 목록" to="/party" color="#10b981" delay={0.05} theme={theme} />
                        <QuickActionButton icon={AlertCircle} label="블랙리스트" to="/admin/blacklist/add" color="#ef4444" delay={0.1} theme={theme} />
                        <QuickActionButton icon={Activity} label="공지사항" to="/community/notice" color="#f59e0b" delay={0.15} theme={theme} />
                        <QuickActionButton icon={Calendar} label="FAQ 관리" to="/community/faq" color="#8b5cf6" delay={0.2} theme={theme} />
                        <QuickActionButton icon={CreditCard} label="문의 관리" to="/community/inquiry/admin" color="#06b6d4" delay={0.25} theme={theme} />
                    </div>
                </motion.div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        icon={DollarSign}
                        title="총 매출"
                        value={`${(safeStats.totalRevenue || 0).toLocaleString()}원`}
                        subtitle="전체 누적"
                        color={primaryColor}
                        trend={safeStats.revenueTrend}
                        delay={0}
                        theme={theme}
                    />
                    <StatCard
                        icon={Wallet}
                        title="이번 달 매출"
                        value={`${(safeStats.thisMonthRevenue || 0).toLocaleString()}원`}
                        subtitle={`${safeStats.thisMonthPaymentCount || 0}건 결제`}
                        color="#00d4ff"
                        trend={safeStats.revenueTrend}
                        delay={0.1}
                        theme={theme}
                    />
                    <StatCard
                        icon={Users}
                        title="총 회원"
                        value={`${(safeStats.totalUserCount || 0).toLocaleString()}명`}
                        subtitle={`오늘 +${safeStats.todayNewUsers || 0}명`}
                        color="#10b981"
                        trend={safeStats.userTrend}
                        delay={0.2}
                        theme={theme}
                    />
                    <StatCard
                        icon={PartyPopper}
                        title="활성 파티"
                        value={`${safeStats.activePartyCount || 0}개`}
                        subtitle={`전체 ${safeStats.totalPartyCount || 0}개`}
                        color="#f59e0b"
                        delay={0.3}
                        theme={theme}
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard icon={Activity} title="모집중 파티" value={`${safeStats.recruitingPartyCount || 0}개`} color="#8b5cf6" delay={0.4} theme={theme} />
                    <StatCard icon={Clock} title="결제 대기" value={`${safeStats.pendingPaymentCount || 0}건`} color="#f97316" delay={0.5} theme={theme} />
                    <StatCard icon={CheckCircle2} title="완료된 결제" value={`${(safeStats.completedPaymentCount || 0).toLocaleString()}건`} color="#06b6d4" delay={0.6} theme={theme} />
                    <StatCard icon={UserPlus} title="오늘 가입" value={`${safeStats.todayNewUsers || 0}명`} color={primaryColor} trend={safeStats.todayUserTrend} delay={0.7} theme={theme} />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Revenue Line Chart - Connected to Period Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">매출 추이</h3>
                                <p className="text-sm text-gray-500">{getPeriodLabel()} 일별 매출</p>
                            </div>
                            {safeStats.revenueTrend !== undefined && (
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${safeStats.revenueTrend >= 0 ? 'bg-[#ec4899]/10' : 'bg-red-500/10'}`}>
                                    {safeStats.revenueTrend >= 0 ? (
                                        <TrendingUp className="w-4 h-4 text-[#ec4899]" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                    )}
                                    <span className={`text-sm font-semibold ${safeStats.revenueTrend >= 0 ? 'text-[#ec4899]' : 'text-red-500'}`}>
                                        {safeStats.revenueTrend >= 0 ? '+' : ''}{safeStats.revenueTrend}%
                                    </span>
                                </div>
                            )}
                        </div>
                        <Chart options={revenueLineOptions} series={revenueLineSeries} type="area" height={250} />
                    </motion.div>

                    {/* Goal Gauge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">월 목표</h3>
                                <p className="text-sm text-gray-500">{(monthlyGoal / 10000).toLocaleString()}만원 목표</p>
                            </div>
                            <button
                                onClick={() => setIsGoalModalOpen(true)}
                                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-[#ec4899]/10 flex items-center justify-center transition-colors group"
                                title="목표 수정"
                            >
                                <Settings className="w-4 h-4 text-gray-400 group-hover:text-[#ec4899] transition-colors" />
                            </button>
                        </div>
                        <Chart options={goalGaugeOptions} series={[goalPercentage]} type="radialBar" height={220} />
                        <div className="text-center mt-2">
                            <span className="text-sm text-gray-500">
                                {(safeStats.thisMonthRevenue || 0).toLocaleString()}원 / {monthlyGoal.toLocaleString()}원
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Monthly Bar Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-1">월별 매출</h3>
                        <p className="text-sm text-gray-500 mb-4">최근 6개월 비교</p>
                        <Chart options={monthlyBarOptions} series={monthlyBarSeries} type="bar" height={200} />
                    </motion.div>

                    {/* Party Status Donut */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-1">파티 현황</h3>
                        <p className="text-sm text-gray-500 mb-4">상태별 분포</p>
                        <Chart options={partyDonutOptions} series={partyDonutSeries} type="donut" height={200} />
                    </motion.div>

                    {/* User Growth Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-1">사용자 추이</h3>
                        <p className="text-sm text-gray-500 mb-4">주간 가입/활성</p>
                        <Chart options={userGrowthOptions} series={userGrowthSeries} type="area" height={200} />
                    </motion.div>
                </div>

                {/* Bottom Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* OTT Service Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-1">OTT별 파티</h3>
                        <p className="text-sm text-gray-500 mb-4">서비스별 현황</p>
                        <OttServiceStats stats={safeStats.ottPartyStats} />
                    </motion.div>

                    {/* Recent Users */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">최근 가입</h3>
                                <p className="text-sm text-gray-500">신규 회원</p>
                            </div>
                            <Link to="/admin/users" className="flex items-center gap-1 text-sm font-medium text-[#ec4899] hover:underline">
                                전체보기 <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {filteredRecentUsers.slice(0, 4).map((user, index) => (
                                <motion.div
                                    key={user.odUserId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-[#ec4899] flex items-center justify-center text-white text-sm font-bold">
                                        {user.userName?.[0] || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 text-sm truncate">{user.userName}</div>
                                        <div className="text-xs text-gray-500 truncate">{user.userEmail}</div>
                                    </div>
                                    <div className="text-xs text-gray-500">{user.regDate?.slice(5)}</div>
                                </motion.div>
                            ))}
                            {filteredRecentUsers.length === 0 && (
                                <p className="text-sm text-gray-400 text-center py-4">
                                    {searchQuery ? '검색 결과 없음' : '데이터 없음'}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    {/* Recent Payments */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">최근 결제</h3>
                                <p className="text-sm text-gray-500">결제 내역</p>
                            </div>
                            <CreditCard className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                            {filteredRecentPayments.slice(0, 4).map((payment, index) => (
                                <div key={payment.paymentId} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50">
                                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 text-sm truncate">{payment.odUserId}</div>
                                        <div className="text-xs text-gray-500">{payment.amount?.toLocaleString()}원</div>
                                    </div>
                                    <div className="text-xs text-gray-500">{payment.paymentDate?.slice(5)}</div>
                                </div>
                            ))}
                            {filteredRecentPayments.length === 0 && (
                                <p className="text-sm text-gray-400 text-center py-4">
                                    {searchQuery ? '검색 결과 없음' : '데이터 없음'}
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
