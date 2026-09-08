import {
    FaUsers,
    FaWallet,
    FaMoneyBillWave,
    FaExchangeAlt,
    FaUserCheck,
    FaArrowUp,
    FaExclamationCircle,
} from "react-icons/fa";

function AdminStats({ dashboardStats, overviewStats, revenueStats, loading }) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <div className="h-4 bg-slate-200 rounded w-24"></div>
                            <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
                        </div>
                        <div className="h-8 bg-slate-200 rounded w-36"></div>
                        <div className="h-3 bg-slate-100 rounded w-28"></div>
                    </div>
                ))}
            </div>
        );
    }

    const totalUsers = dashboardStats?.totalUsers ?? overviewStats?.totalUsers ?? 0;
    const totalWallets = dashboardStats?.totalWallets ?? overviewStats?.totalWallets ?? 0;
    const totalBalance = dashboardStats?.totalWalletBalance ?? 0;
    const totalRevenue = revenueStats?.summary?.platformProfit ?? dashboardStats?.totalRevenue ?? 0;
    const todayProfit = revenueStats?.summary?.todayProfit ?? 0;
    const todayTransfers = dashboardStats?.todayTransfers ?? 0;
    const totalTransactions = overviewStats?.totalTransactions ?? 0;
    const kycPending = overviewStats?.kycPending ?? 0;
    const kycVerified = overviewStats?.kycVerified ?? 0;
    const pendingWithdrawals = dashboardStats?.pendingWithdrawals ?? 0;

    const cards = [
        {
            title: "Total Revenue",
            value: `₦${Number(totalRevenue).toLocaleString("en-NG")}`,
            subtext: todayProfit > 0 ? `+₦${Number(todayProfit).toLocaleString("en-NG")} today` : "Platform profit",
            icon: <FaMoneyBillWave />,
            gradient: "from-emerald-500 to-teal-700",
            lightBg: "bg-emerald-50 text-emerald-600",
            badgeIcon: <FaArrowUp className="text-xs" />,
            badgeColor: "bg-emerald-100 text-emerald-700",
        },
        {
            title: "System Liquidity",
            value: `₦${Number(totalBalance).toLocaleString("en-NG")}`,
            subtext: `${totalWallets} active user wallets`,
            icon: <FaWallet />,
            gradient: "from-blue-600 to-indigo-700",
            lightBg: "bg-blue-50 text-blue-600",
            badgeIcon: null,
            badgeColor: "bg-blue-100 text-blue-700",
        },
        {
            title: "Total Users",
            value: Number(totalUsers).toLocaleString(),
            subtext: `${kycVerified} verified · ${kycPending} pending`,
            icon: <FaUsers />,
            gradient: "from-purple-600 to-violet-800",
            lightBg: "bg-purple-50 text-purple-600",
            badgeIcon: <FaUserCheck className="text-xs" />,
            badgeColor: "bg-purple-100 text-purple-700",
        },
        {
            title: "Volume & Transfers",
            value: `₦${Number(todayTransfers).toLocaleString("en-NG")}`,
            subtext: `${totalTransactions} total transactions logged`,
            icon: <FaExchangeAlt />,
            gradient: "from-cyan-500 to-blue-600",
            lightBg: "bg-cyan-50 text-cyan-600",
            badgeIcon: null,
            badgeColor: "bg-cyan-100 text-cyan-700",
        },
    ];

    return (
        <div className="space-y-4">
            {pendingWithdrawals > 0 && (
                <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 animate-fadeIn">
                    <div className="flex items-center gap-3">
                        <FaExclamationCircle className="text-xl text-amber-500 flex-shrink-0" />
                        <div>
                            <span className="font-semibold">{pendingWithdrawals} Pending Withdrawal{pendingWithdrawals > 1 ? "s" : ""}</span>
                            <p className="text-xs text-amber-700 mt-0.5">Customer withdrawal requests require administrative review.</p>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-semibold uppercase tracking-wider">
                        Action Needed
                    </span>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        className="relative overflow-hidden bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default"
                    >
                        {/* Top decorative accent */}
                        <div
                            className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.gradient}`}
                        ></div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-500 tracking-wide">
                                {card.title}
                            </span>
                            <div
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${card.lightBg} group-hover:scale-110 transition-transform duration-300`}
                            >
                                {card.icon}
                            </div>
                        </div>

                        <div className="mt-4">
                            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                                {card.value}
                            </h2>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-500">
                                    {card.subtext}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminStats;
