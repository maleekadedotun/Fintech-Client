import React, { useState } from "react";
import {
    FaMobileAlt,
    FaWifi,
    FaBolt,
    FaTv,
    FaGlobe,
    FaFutbol,
    FaGraduationCap,
    FaShieldAlt,
    FaCalendarAlt,
    FaUserFriends,
    FaFileAlt,
    FaSearch,
    FaChevronRight,
    FaHistory,
    FaStar,
    FaMoneyCheckAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

const BILL_CATEGORIES = [
    {
        id: "airtime",
        title: "Airtime Top-up",
        desc: "MTN, Airtel, Glo, 9mobile instant recharge",
        icon: <FaMobileAlt />,
        color: "bg-green-600",
        gradient: "from-green-500 to-emerald-700",
        badge: "Instant",
        path: "/airtime",
        featured: true,
    },
    {
        id: "data",
        title: "Data Bundles",
        desc: "SME, Corporate & Direct data plans",
        icon: <FaWifi />,
        color: "bg-cyan-600",
        gradient: "from-cyan-500 to-blue-700",
        badge: "Popular",
        path: "/data",
        featured: true,
    },
    {
        id: "electricity",
        title: "Electricity Token",
        desc: "Prepaid & Postpaid for IKEDC, EKEDC, AEDC & more",
        icon: <FaBolt />,
        color: "bg-amber-500",
        gradient: "from-amber-500 to-orange-600",
        badge: "Zero Fee",
        path: "/electricity",
        featured: true,
    },
    {
        id: "cable",
        title: "Cable TV",
        desc: "DStv, GOtv, StarTimes & Showmax subscription",
        icon: <FaTv />,
        color: "bg-purple-600",
        gradient: "from-purple-600 to-indigo-700",
        badge: "Fast Signal",
        path: "/cable",
        featured: true,
    },
    {
        id: "internet",
        title: "Broadband & Fibre",
        desc: "Spectranet & Smile 4G broadband renewals",
        icon: <FaGlobe />,
        color: "bg-sky-600",
        gradient: "from-sky-500 to-blue-600",
        badge: "24/7 Fast",
        path: "/internet",
    },
    {
        id: "betting",
        title: "Betting Top-up",
        desc: "Fund Bet9ja, SportyBet, 1xBet & NairaBet",
        icon: <FaFutbol />,
        color: "bg-emerald-600",
        gradient: "from-emerald-600 to-teal-800",
        badge: "Instant",
        path: "/betting",
    },
    {
        id: "education",
        title: "Education & Exam PINs",
        desc: "WAEC result checkers, JAMB e-PINs & NECO tokens",
        icon: <FaGraduationCap />,
        color: "bg-indigo-600",
        gradient: "from-indigo-600 to-purple-800",
        badge: "Official",
        path: "/education",
    },
    {
        id: "insurance",
        title: "Motor & Life Insurance",
        desc: "NIID-approved 3rd party motor & health cover",
        icon: <FaShieldAlt />,
        color: "bg-blue-700",
        gradient: "from-blue-700 to-indigo-900",
        badge: "NIID Verified",
        path: "/insurance",
    },
    {
        id: "schedule",
        title: "Autopay & Schedules",
        desc: "Automate recurrent rent, transfers & utilities",
        icon: <FaCalendarAlt />,
        color: "bg-teal-600",
        gradient: "from-teal-600 to-cyan-800",
        badge: "Automated",
        path: "/schedule",
    },
    {
        id: "beneficiaries",
        title: "Saved Beneficiaries",
        desc: "Manage contacts for 1-click transfers & bills",
        icon: <FaUserFriends />,
        color: "bg-rose-600",
        gradient: "from-rose-600 to-pink-700",
        badge: "Quick Pay",
        path: "/beneficiaries",
    },
    {
        id: "statement",
        title: "Account Statement",
        desc: "Download official PDF, Excel and CSV bank statements",
        icon: <FaFileAlt />,
        color: "bg-slate-800",
        gradient: "from-slate-800 to-slate-950",
        badge: "Export",
        path: "/statement",
    },
];

export const Bills = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const filteredCategories = BILL_CATEGORIES.filter(
        (c) =>
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.desc.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="max-w-2xl space-y-4 relative z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                            <FaMoneyCheckAlt /> Utilities & Bill Payments
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Pay All Bills in Seconds. <br className="hidden sm:inline" />
                            Zero Hassle, Instant Value.
                        </h1>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                            Recharge airtime, buy data, generate electricity tokens, subscribe cable TV, fund sportsbooks, and buy official exam pins directly from your digital wallet.
                        </p>

                        {/* Search Bar inside Hero */}
                        <div className="pt-2">
                            <div className="relative max-w-lg">
                                <FaSearch className="absolute left-4 top-4 text-slate-400 text-base" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search bills, discos, internet providers, exams..."
                                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/15 transition"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Popular Services Section */}
                {!search && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <FaStar className="text-amber-500" /> Featured Services
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {BILL_CATEGORIES.filter((c) => c.featured).map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => navigate(cat.path)}
                                    className="group p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 text-left flex flex-col justify-between space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.gradient} text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition duration-200`}>
                                            {cat.icon}
                                        </div>
                                        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                            {cat.badge}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-base group-hover:text-cyan-600 transition">
                                            {cat.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                            {cat.desc}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Bill Categories Grid */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {search ? `Search Results for "${search}"` : "All Services & Financial Tools"}
                        </h2>
                        <p className="text-slate-500 text-xs mt-0.5">
                            Select a category to begin your transaction
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => navigate(cat.path)}
                                className="group p-4 rounded-2xl border border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/30 transition text-left flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className={`w-11 h-11 rounded-2xl ${cat.color} text-white flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition`}>
                                        {cat.icon}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-900 text-sm group-hover:text-cyan-700 transition">
                                                {cat.title}
                                            </h4>
                                            <span className="text-[10px] font-semibold text-cyan-600 bg-cyan-100/60 px-2 py-0.2 rounded-md">
                                                {cat.badge}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                                            {cat.desc}
                                        </p>
                                    </div>
                                </div>

                                <FaChevronRight className="text-slate-300 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition text-xs shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Bills;
