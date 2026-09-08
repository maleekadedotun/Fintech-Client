import React, { useState, useMemo } from "react";
import {
    FaSearch,
    FaUserCheck,
    FaClock,
    FaTimesCircle,
    FaFilter,
    FaUserShield,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

function UserTable({ users, loading }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [kycFilter, setKycFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 8;

    const filteredUsers = useMemo(() => {
        if (!users || !Array.isArray(users)) return [];

        return users.filter((u) => {
            const matchesSearch =
                (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesKyc =
                kycFilter === "all" ||
                (kycFilter === "verified" && u.kycStatus === "verified") ||
                (kycFilter === "pending" && u.kycStatus === "pending") ||
                (kycFilter === "unverified" && (!u.kycStatus || u.kycStatus === "unverified"));

            const matchesRole =
                roleFilter === "all" ||
                (roleFilter === "admin" && (u.role === "admin" || u.isAdmin)) ||
                (roleFilter === "user" && u.role !== "admin" && !u.isAdmin);

            return matchesSearch && matchesKyc && matchesRole;
        });
    }, [users, searchTerm, kycFilter, roleFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    const getKycBadge = (status) => {
        switch (status) {
            case "verified":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        <FaUserCheck className="text-[10px]" />
                        Verified
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                        <FaClock className="text-[10px]" />
                        Pending
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                        <FaTimesCircle className="text-[10px]" />
                        Unverified
                    </span>
                );
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-5">
            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">
                        User Directory & Accounts
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Manage registered accounts, authentication roles, and KYC statuses
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="relative min-w-[220px]">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
                        />
                    </div>

                    {/* KYC Filter */}
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                        <FaFilter className="text-slate-400 ml-2" />
                        <select
                            value={kycFilter}
                            onChange={(e) => {
                                setKycFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="bg-transparent text-slate-700 font-medium py-1 px-2 focus:outline-none cursor-pointer"
                        >
                            <option value="all">All KYC</option>
                            <option value="verified">Verified</option>
                            <option value="pending">Pending</option>
                            <option value="unverified">Unverified</option>
                        </select>
                    </div>

                    {/* Role Filter */}
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                        <select
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="bg-transparent text-slate-700 font-medium py-1 px-2 focus:outline-none cursor-pointer"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admins</option>
                            <option value="user">Standard Users</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                            <th className="pb-3 pl-2">Customer</th>
                            <th className="pb-3">Role</th>
                            <th className="pb-3">KYC Status</th>
                            <th className="pb-3">Tier</th>
                            <th className="pb-3">Registered</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {loading ? (
                            [1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="py-4 pl-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-200"></div>
                                            <div className="space-y-1">
                                                <div className="h-3 bg-slate-200 rounded w-28"></div>
                                                <div className="h-2.5 bg-slate-100 rounded w-36"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                                    <td className="py-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                                    <td className="py-4"><div className="h-4 bg-slate-200 rounded w-12"></div></td>
                                    <td className="py-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                                </tr>
                            ))
                        ) : paginatedUsers.length > 0 ? (
                            paginatedUsers.map((user) => {
                                const initials = (user.name || user.email || "U")
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .substring(0, 2)
                                    .toUpperCase();

                                const isAdmin = user.role === "admin" || user.isAdmin;
                                const formattedDate = user.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                      })
                                    : "N/A";

                                return (
                                    <tr
                                        key={user._id}
                                        className="hover:bg-slate-50/80 transition duration-150 group"
                                    >
                                        <td className="py-3.5 pl-2">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                                                        isAdmin
                                                            ? "bg-gradient-to-tr from-purple-600 to-indigo-600"
                                                            : "bg-gradient-to-tr from-cyan-500 to-blue-600"
                                                    }`}
                                                >
                                                    {initials}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800 text-xs group-hover:text-cyan-600 transition">
                                                        {user.name || "Unnamed User"}
                                                    </p>
                                                    <span className="text-[11px] text-slate-400">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-3.5">
                                            {isAdmin ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                                    <FaUserShield className="text-[10px]" />
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium text-slate-600 bg-slate-100">
                                                    Customer
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-3.5">
                                            {getKycBadge(user.kycStatus)}
                                        </td>

                                        <td className="py-3.5 text-xs font-medium text-slate-600">
                                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                                                Tier {user.tier || 1}
                                            </span>
                                        </td>

                                        <td className="py-3.5 text-xs text-slate-500">
                                            {formattedDate}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-10 text-center text-slate-400 text-xs">
                                    No accounts match your current filter criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {!loading && filteredUsers.length > 0 && (
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <span>
                        Showing {Math.min((currentPage - 1) * usersPerPage + 1, filteredUsers.length)} to{" "}
                        {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <FaChevronLeft className="text-[10px]" />
                        </button>
                        <span className="font-semibold text-slate-700 px-1">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <FaChevronRight className="text-[10px]" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserTable;
