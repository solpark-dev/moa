import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

// Recharts imports
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";

// ApexCharts imports
import Chart from "react-apexcharts";

// Sample data for testing
const lineData = [
    { name: "1월", value: 4000000 },
    { name: "2월", value: 3000000 },
    { name: "3월", value: 5000000 },
    { name: "4월", value: 4500000 },
    { name: "5월", value: 6000000 },
    { name: "6월", value: 5500000 },
];

const barData = [
    { name: "Netflix", value: 1200000 },
    { name: "Disney+", value: 800000 },
    { name: "Wavve", value: 600000 },
    { name: "TVING", value: 400000 },
    { name: "Coupang", value: 300000 },
];

const pieData = [
    { name: "활성", value: 45, color: "#10b981" },
    { name: "모집중", value: 30, color: "#635bff" },
    { name: "종료", value: 25, color: "#94a3b8" },
];

const areaData = [
    { name: "1주", users: 120, payments: 80 },
    { name: "2주", users: 180, payments: 120 },
    { name: "3주", users: 150, payments: 100 },
    { name: "4주", users: 220, payments: 180 },
];

// Recharts Section
const RechartsSection = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            📊 Recharts
            <span className="text-sm font-normal text-gray-500">(React 최적화, 가벼움)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Line Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Line Chart - 월별 매출</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000000}M`} />
                        <Tooltip formatter={(v) => `${v.toLocaleString()}원`} />
                        <Line type="monotone" dataKey="value" stroke="#635bff" strokeWidth={3} dot={{ fill: "#635bff", r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Bar Chart - OTT별 매출</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(v) => `${v.toLocaleString()}원`} />
                        <Bar dataKey="value" fill="#635bff" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Pie Chart - 파티 상태</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Area Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Area Chart - 주간 추이</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={areaData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="users" stackId="1" stroke="#635bff" fill="#635bff" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="payments" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                        <Legend />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
);

// ApexCharts Section
const ApexChartsSection = () => {
    const lineOptions = {
        chart: { type: "line", toolbar: { show: false }, animations: { enabled: true, speed: 800 } },
        stroke: { curve: "smooth", width: 3 },
        colors: ["#635bff"],
        xaxis: { categories: lineData.map(d => d.name) },
        yaxis: { labels: { formatter: (v) => `${v / 1000000}M` } },
        tooltip: { y: { formatter: (v) => `${v.toLocaleString()}원` } },
        grid: { borderColor: "#f0f0f0" },
    };

    const barOptions = {
        chart: { type: "bar", toolbar: { show: false }, animations: { enabled: true, speed: 800 } },
        colors: ["#635bff"],
        plotOptions: { bar: { borderRadius: 8, columnWidth: "60%" } },
        xaxis: { categories: barData.map(d => d.name) },
        tooltip: { y: { formatter: (v) => `${v.toLocaleString()}원` } },
        grid: { borderColor: "#f0f0f0" },
    };

    const pieOptions = {
        chart: { type: "donut", animations: { enabled: true, speed: 800 } },
        colors: pieData.map(d => d.color),
        labels: pieData.map(d => d.name),
        legend: { position: "bottom" },
        plotOptions: { pie: { donut: { size: "60%" } } },
    };

    const areaOptions = {
        chart: { type: "area", toolbar: { show: false }, animations: { enabled: true, speed: 800 } },
        stroke: { curve: "smooth", width: 2 },
        colors: ["#635bff", "#10b981"],
        xaxis: { categories: areaData.map(d => d.name) },
        fill: { type: "gradient", gradient: { opacityFrom: 0.4, opacityTo: 0.1 } },
        legend: { position: "top" },
        grid: { borderColor: "#f0f0f0" },
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
                📈 ApexCharts
                <span className="text-sm font-normal text-gray-500">(애니메이션 풍부, 인터랙티브)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Line Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Line Chart - 월별 매출</h3>
                    <Chart options={lineOptions} series={[{ name: "매출", data: lineData.map(d => d.value) }]} type="line" height={200} />
                </div>

                {/* Bar Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Bar Chart - OTT별 매출</h3>
                    <Chart options={barOptions} series={[{ name: "매출", data: barData.map(d => d.value) }]} type="bar" height={200} />
                </div>

                {/* Pie/Donut Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Donut Chart - 파티 상태</h3>
                    <Chart options={pieOptions} series={pieData.map(d => d.value)} type="donut" height={200} />
                </div>

                {/* Area Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Area Chart - 주간 추이</h3>
                    <Chart
                        options={areaOptions}
                        series={[
                            { name: "가입자", data: areaData.map(d => d.users) },
                            { name: "결제", data: areaData.map(d => d.payments) }
                        ]}
                        type="area"
                        height={200}
                    />
                </div>
            </div>
        </div>
    );
};

// Main Component
export default function ChartComparisonPage() {
    const [selected, setSelected] = useState(null);

    return (
        <div className="min-h-screen bg-transparent py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/admin" className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">차트 라이브러리 비교</h1>
                        <p className="text-gray-500">Recharts vs ApexCharts - 두 라이브러리를 비교하고 선택하세요</p>
                    </div>
                </div>

                {/* Selection Buttons */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setSelected("recharts")}
                        className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 ${selected === "recharts"
                            ? "border-blue-500 bg-blue-50 shadow-lg"
                            : "border-gray-200 bg-white hover:border-blue-300"
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            {selected === "recharts" && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                            <span className="font-bold text-lg">Recharts 선택</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">가볍고 React 친화적</p>
                    </button>
                    <button
                        onClick={() => setSelected("apexcharts")}
                        className={`flex-1 p-4 rounded-2xl border-2 transition-all duration-300 ${selected === "apexcharts"
                            ? "border-orange-500 bg-orange-50 shadow-lg"
                            : "border-gray-200 bg-white hover:border-orange-300"
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            {selected === "apexcharts" && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
                            <span className="font-bold text-lg">ApexCharts 선택</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">애니메이션 풍부, 인터랙티브</p>
                    </button>
                </div>

                {selected && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white text-center"
                    >
                        <p className="font-bold text-lg">
                            ✅ {selected === "recharts" ? "Recharts" : "ApexCharts"} 선택됨!
                        </p>
                        <p className="text-sm opacity-90">대시보드에 이 라이브러리를 적용합니다.</p>
                    </motion.div>
                )}

                {/* Charts Comparison */}
                <div className="space-y-12">
                    <RechartsSection />
                    <div className="border-t-2 border-dashed border-gray-200 my-8" />
                    <ApexChartsSection />
                </div>
            </div>
        </div>
    );
}
