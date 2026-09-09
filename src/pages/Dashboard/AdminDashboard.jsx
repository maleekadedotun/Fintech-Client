import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../../layouts/DashboardLayout";
import AdminStats from "../../components/dashboard/AdminStats";
import RevenueChart from "../../components/dashboard/RevenueChart";
import AdminKYCPanel from "../../components/dashboard/AdminKYCPanel";
import AdminQuickActions from "../../components/dashboard/AdminQuickActions";
import UserTable from "../../components/dashboard/UserTable";
import { loadFullAdminDashboard } from "../../features/admin/adminSlice";
import {
    FaSyncAlt,
    FaShieldAlt,
    FaCircle,
} from "react-icons/fa";

function AdminDashboard() {
    const dispatch = useDispatch();
    const {
        dashboardStats,
        overviewStats,
        revenueStats,
        topUsers,
        allUsers,
        loading,
    } = useSelector((state) => state.admin);

    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        dispatch(loadFullAdminDashboard());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(loadFullAdminDashboard());
    };

    const todayDate = new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <DashboardLayout>
            <div className="space-y-8 pb-10">
                {/* Admin Header Banner */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
                    {/* Atmospheric Glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                    <FaShieldAlt className="text-xs" />
                                    Executive Portal
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    <FaCircle className="text-[6px] animate-pulse" />
                                    System Online
                                </span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                                Welcome back, {user?.name || "Admin"}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                Real-time ledger balances, platform transaction flow, and user moderation
                            </p>
                        </div>

                        <div className="flex items-center gap-3 self-start md:self-auto">
                            <div className="hidden sm:block text-right pr-3 border-r border-slate-800">
                                <span className="text-[11px] text-slate-400 font-medium block">
                                    Operations Date
                                </span>
                                <span className="text-xs font-semibold text-slate-200">
                                    {todayDate}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold backdrop-blur-md hover:scale-105 active:scale-95 disabled:opacity-50 transition"
                            >
                                <FaSyncAlt className={`text-xs ${loading ? "animate-spin" : ""}`} />
                                <span>{loading ? "Syncing..." : "Refresh"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 1: Core Stat Cards */}
                <AdminStats
                    dashboardStats={dashboardStats}
                    overviewStats={overviewStats}
                    revenueStats={revenueStats}
                    loading={loading}
                />

                {/* Section 2: Revenue & Growth Visualizations */}
                <RevenueChart
                    revenueStats={revenueStats}
                    loading={loading}
                />

                {/* Section 3: Identity Verification & KYC Queue */}
                <AdminKYCPanel />

                {/* Section 4: Administrative Quick Actions & High-Volume Accounts */}
                <AdminQuickActions
                    topUsers={topUsers}
                />

                {/* Section 5: Registered Customer Directory Table */}
                <UserTable
                    users={allUsers}
                    loading={loading}
                />
            </div>
        </DashboardLayout>
    );
}

export default AdminDashboard;