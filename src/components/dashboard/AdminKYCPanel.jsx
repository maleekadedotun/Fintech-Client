import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    approveKYCAction,
    rejectKYCAction,
    fetchPendingKYC,
} from "../../features/admin/adminSlice";
import {
    FaIdCard,
    FaCheckCircle,
    FaTimesCircle,
    FaSearch,
    FaSyncAlt,
    FaUserCheck,
    FaCopy,
    FaCheck,
    FaExclamationTriangle,
} from "react-icons/fa";
import toast from "react-hot-toast";

function AdminKYCPanel() {
    const dispatch = useDispatch();
    const { pendingKYC, kycLoading, kycActionLoading } = useSelector(
        (state) => state.admin
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUserForReject, setSelectedUserForReject] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [copiedId, setCopiedId] = useState(null);
    const [actionId, setActionId] = useState(null);

    const handleCopy = (idNumber) => {
        navigator.clipboard.writeText(idNumber);
        setCopiedId(idNumber);
        toast.success("ID Number copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleApprove = async (user) => {
        setActionId(user._id);
        const res = await dispatch(approveKYCAction(user._id));
        setActionId(null);
        if (approveKYCAction.fulfilled.match(res)) {
            toast.success(`KYC Approved for ${user.name}! Upgraded to Tier 2.`);
        } else {
            toast.error(res.payload || "Failed to approve KYC");
        }
    };

    const handleOpenRejectModal = (user) => {
        setSelectedUserForReject(user);
        setRejectReason("");
    };

    const handleConfirmReject = async () => {
        if (!selectedUserForReject) return;
        setActionId(selectedUserForReject._id);
        const res = await dispatch(
            rejectKYCAction({
                userId: selectedUserForReject._id,
                reason: rejectReason.trim() || "ID verification failed. Please re-submit valid documents.",
            })
        );
        setActionId(null);
        setSelectedUserForReject(null);
        if (rejectKYCAction.fulfilled.match(res)) {
            toast.success("KYC submission rejected. User notified.");
        } else {
            toast.error(res.payload || "Failed to reject KYC");
        }
    };

    const submissions = Array.isArray(pendingKYC)
        ? pendingKYC
        : pendingKYC?.data || [];

    const filteredSubmissions = submissions.filter((user) => {
        const query = searchTerm.toLowerCase();
        return (
            user.name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.idNumber?.toLowerCase().includes(query) ||
            user.idType?.toLowerCase().includes(query)
        );
    });

    const getDocBadgeColor = (type) => {
        const t = (type || "").toUpperCase();
        if (t.includes("NIN")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
        if (t.includes("BVN")) return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
        if (t.includes("PASSPORT")) return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
        if (t.includes("DRIVER")) return "bg-amber-500/10 text-amber-400 border-amber-500/30";
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Header / Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xl shadow-inner">
                        <FaIdCard />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-white tracking-tight">
                                KYC Verification Queue
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                                {submissions.length} Pending
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                            Review identity documents to upgrade user accounts from Tier 1 to Tier 2
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1 sm:w-64">
                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                        <input
                            type="text"
                            placeholder="Search name, ID, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800 text-xs rounded-xl pl-9 pr-3 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => dispatch(fetchPendingKYC())}
                        disabled={kycLoading}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition"
                        title="Refresh Queue"
                    >
                        <FaSyncAlt className={`${kycLoading ? "animate-spin text-cyan-400" : ""}`} />
                    </button>
                </div>
            </div>

            {/* List / Table Content */}
            <div className="mt-6">
                {kycLoading && submissions.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-10 h-10 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
                        <p className="text-xs text-slate-400 mt-3 font-medium">
                            Scanning pending KYC submissions...
                        </p>
                    </div>
                ) : filteredSubmissions.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl mx-auto mb-3">
                            <FaUserCheck />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-200">
                            {searchTerm ? "No matching KYC requests" : "KYC Queue is completely clear!"}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                            {searchTerm
                                ? "Try adjusting your search criteria"
                                : "All submitted identity verification requests have been reviewed and processed."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredSubmissions.map((user) => {
                            const isProcessing = kycActionLoading && actionId === user._id;

                            return (
                                <div
                                    key={user._id}
                                    className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition flex flex-col justify-between"
                                >
                                    <div>
                                        {/* User Info Bar */}
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-white">
                                                        {user.name}
                                                    </h4>
                                                    <p className="text-xs text-slate-400">
                                                        {user.email}
                                                    </p>
                                                    {user.phoneNumber && (
                                                        <p className="text-[11px] text-slate-500">
                                                            {user.phoneNumber}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                                                Pending Review
                                            </span>
                                        </div>

                                        {/* ID Document Details Box */}
                                        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2 mb-4">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400 font-medium">
                                                    Document Type:
                                                </span>
                                                <span
                                                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getDocBadgeColor(
                                                        user.idType
                                                    )}`}
                                                >
                                                    {user.idType || "National ID"}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400 font-medium">
                                                    ID / Document No:
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <code className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                                                        {user.idNumber}
                                                    </code>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopy(user.idNumber)}
                                                        className="text-slate-400 hover:text-white transition p-1"
                                                        title="Copy ID"
                                                    >
                                                        {copiedId === user.idNumber ? (
                                                            <FaCheck className="text-emerald-400 text-xs" />
                                                        ) : (
                                                            <FaCopy className="text-xs" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/50">
                                                <span>Current Tier: Tier {user.tier || 1}</span>
                                                <span>Target: Tier 2 (₦5M/day)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/50">
                                        <button
                                            type="button"
                                            disabled={isProcessing}
                                            onClick={() => handleApprove(user)}
                                            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-emerald-950/50 transition"
                                        >
                                            <FaCheckCircle className="text-xs" />
                                            <span>
                                                {isProcessing ? "Processing..." : "Approve & Upgrade"}
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            disabled={isProcessing}
                                            onClick={() => handleOpenRejectModal(user)}
                                            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-semibold transition"
                                        >
                                            <FaTimesCircle className="text-xs" />
                                            <span>Reject</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Rejection Reason Modal */}
            {selectedUserForReject && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 text-lg">
                                <FaExclamationTriangle />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">
                                    Reject KYC Submission
                                </h3>
                                <p className="text-xs text-slate-400">
                                    {selectedUserForReject.name} ({selectedUserForReject.email})
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                Reason for Rejection (sent to customer notification)
                            </label>
                            <textarea
                                rows={3}
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="e.g. Document number does not match name on account, or image was blurry."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
                            />
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {[
                                    "Invalid ID Number",
                                    "Name mismatch",
                                    "Expired identification document",
                                    "Unrecognized document type",
                                ].map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setRejectReason(preset)}
                                        className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                                    >
                                        {preset}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                            <button
                                type="button"
                                onClick={() => setSelectedUserForReject(null)}
                                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmReject}
                                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-lg shadow-rose-950/50 transition"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminKYCPanel;
