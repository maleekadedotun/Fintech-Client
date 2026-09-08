import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { FaChartLine, FaChartPie } from "react-icons/fa";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function RevenueChart({ revenueStats, loading }) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse h-80"></div>
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse h-80"></div>
            </div>
        );
    }

    const daily = revenueStats?.dailyRevenue || [];
    const breakdown = revenueStats?.breakdown || [];
    const summary = revenueStats?.summary || {};

    // 1. Line Chart Data (Daily Revenue)
    const lineLabels = daily.length > 0 
        ? daily.map((d) => d.date)
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const lineDataPoints = daily.length > 0
        ? daily.map((d) => d.profit)
        : [0, 0, 0, 0, 0, 0, summary.todayProfit || 0];

    const lineChartData = {
        labels: lineLabels,
        datasets: [
            {
                label: "Profit (₦)",
                data: lineDataPoints,
                borderColor: "#0284c7", // cyan/sky 600
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, "rgba(2, 132, 199, 0.35)");
                    gradient.addColorStop(1, "rgba(2, 132, 199, 0.0)");
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: "#0284c7",
                borderWidth: 2.5,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "#0f172a",
                padding: 12,
                titleFont: { size: 12, family: "Inter, sans-serif" },
                bodyFont: { size: 14, weight: "bold", family: "Inter, sans-serif" },
                displayColors: false,
                callbacks: {
                    label: (context) => `Profit: ₦${Number(context.raw || 0).toLocaleString("en-NG")}`,
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: "#94a3b8", font: { family: "Inter, sans-serif", size: 11 } },
            },
            y: {
                grid: { color: "#f1f5f9" },
                ticks: {
                    color: "#94a3b8",
                    font: { family: "Inter, sans-serif", size: 11 },
                    callback: (value) => `₦${value.toLocaleString("en-NG")}`,
                },
            },
        },
    };

    // 2. Doughnut Chart Data (Category Breakdown)
    const categoryColors = [
        "#0284c7", // Cyan
        "#10b981", // Emerald
        "#8b5cf6", // Purple
        "#f59e0b", // Amber
        "#ec4899", // Pink
        "#6366f1", // Indigo
        "#64748b", // Slate
    ];

    const doughnutLabels = breakdown.length > 0
        ? breakdown.map((b) => (b._id ? b._id.toUpperCase() : "OTHER"))
        : ["Transfer", "Airtime", "Data", "Bills"];

    const doughnutDataPoints = breakdown.length > 0
        ? breakdown.map((b) => b.profit)
        : [1, 1, 1, 1];

    const doughnutChartData = {
        labels: doughnutLabels,
        datasets: [
            {
                data: doughnutDataPoints,
                backgroundColor: categoryColors.slice(0, doughnutLabels.length),
                borderWidth: 2,
                borderColor: "#ffffff",
                hoverOffset: 6,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "72%",
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    boxWidth: 10,
                    boxHeight: 10,
                    usePointStyle: true,
                    pointStyle: "circle",
                    padding: 14,
                    color: "#475569",
                    font: { size: 11, family: "Inter, sans-serif" },
                },
            },
            tooltip: {
                backgroundColor: "#0f172a",
                padding: 10,
                callbacks: {
                    label: (context) => ` ${context.label}: ₦${Number(context.raw || 0).toLocaleString("en-NG")}`,
                },
            },
        },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Trend Line Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-lg">
                            <FaChartLine />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">
                                Revenue Growth & Profit
                            </h3>
                            <p className="text-xs text-slate-500">
                                Daily earnings trajectory
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                            All-Time Volume
                        </span>
                        <span className="text-base font-bold text-slate-800">
                            ₦{Number(summary.transactionVolume || 0).toLocaleString("en-NG")}
                        </span>
                    </div>
                </div>

                <div className="h-64 sm:h-72 w-full">
                    <Line data={lineChartData} options={lineOptions} />
                </div>
            </div>

            {/* Category Breakdown Doughnut Chart */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
                        <FaChartPie />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">
                            Revenue Stream
                        </h3>
                        <p className="text-xs text-slate-500">
                            Profit by transaction type
                        </p>
                    </div>
                </div>

                <div className="relative h-60 sm:h-64 w-full flex items-center justify-center">
                    <Doughnut data={doughnutChartData} options={doughnutOptions} />
                    {/* Centered label inside cutout */}
                    <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
                        <span className="text-xs text-slate-400 font-medium">Profit</span>
                        <p className="text-sm font-bold text-slate-800">
                            ₦{Number(summary.platformProfit || 0).toLocaleString("en-NG")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RevenueChart;
