import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FaUndo,
    FaCrown,
    FaShieldAlt,
    FaSearch,
    FaSpinner,
} from "react-icons/fa";
import { reverseTransactionAction } from "../../features/admin/adminSlice";
import toast from "react-hot-toast";

function AdminQuickActions({ topUsers }) {
    const dispatch = useDispatch();
    const { reversing } = useSelector((state) => state.admin);

    const [reference, setReference] = useState("");
    const [confirmModal, setConfirmModal] = useState(false);

    const handleInitiateReversal = (e) => {
        e.preventDefault();
        if (!reference.trim()) {
            toast.error("Please enter a valid transaction reference");
            return;
        }
        setConfirmModal(true);
    };

    const handleConfirmReversal = async () => {
        try {
            const res = await dispatch(reverseTransactionAction(reference.trim())).unwrap();
            toast.success(res?.message || "Transfer reversed successfully!");
            setReference("");
            setConfirmModal(false);
        } catch (err) {
            toast.error(err || "Failed to reverse transaction");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Action: Transaction Reversal Console */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
                {/* Background decorative glow */}
                <div className="absolute -right-16 -top-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl border border-cyan-500/30">
                                <FaUndo />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">
                                    Administrative Reversal
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Reverse errant transfers & refund debited accounts
                                </p>
                            </div>
                        </div>
                        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Ledger Synchronized
                        </span>
                    </div>

                    <form onSubmit={handleInitiateReversal} className="mt-6">
                        <label className="block text-xs font-medium text-slate-300 mb-2">
                            Transaction Reference Number
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                                <input
                                    type="text"
                                    placeholder="Enter reference (e.g. 7f8a9e10...)"
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={reversing || !reference.trim()}
                                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold text-sm shadow-lg shadow-red-900/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                            >
                                {reversing ? (
                                    <>
                                        <FaSpinner className="animate-spin text-sm" />
                                        Reversing...
                                    </>
                                ) : (
                                    <>
                                        <FaUndo className="text-xs" />
                                        Execute Reversal
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                        <FaShieldAlt className="text-cyan-400" />
                        Atomic multi-wallet ledger guarantees rollback accuracy
                    </span>
                    <span className="text-slate-500">
                        Admin authorization required
                    </span>
                </div>
            </div>

            {/* Top Transacting Accounts Ranking */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
                                <FaCrown />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    High-Volume Users
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Top transacting accounts
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mt-4">
                        {topUsers && topUsers.length > 0 ? (
                            topUsers.slice(0, 4).map((user, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                                                index === 0
                                                    ? "bg-amber-100 text-amber-700"
                                                    : index === 1
                                                    ? "bg-slate-200 text-slate-700"
                                                    : index === 2
                                                    ? "bg-amber-200/50 text-amber-900"
                                                    : "bg-slate-100 text-slate-500"
                                            }`}
                                        >
                                            #{index + 1}
                                        </span>
                                        <div className="truncate max-w-[130px]">
                                            <p className="text-xs font-semibold text-slate-800 truncate">
                                                User {String(user._id).substring(0, 8)}...
                                            </p>
                                            <span className="text-[11px] text-slate-400">
                                                Account ID
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-cyan-600">
                                        ₦{Number(user.totalAmount || 0).toLocaleString("en-NG")}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-slate-400 text-xs">
                                No user volume metrics recorded yet.
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 text-center">
                    <span className="text-xs font-medium text-slate-400">
                        Ranked by cumulative transaction volume
                    </span>
                </div>
            </div>

            {/* Reversal Confirmation Modal */}
            {confirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-scaleUp">
                        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto">
                            <FaUndo />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-slate-800">
                                Confirm Reversal
                            </h3>
                            <p className="text-sm text-slate-500 mt-2">
                                Are you sure you want to reverse transfer reference:
                            </p>
                            <div className="mt-3 p-3 bg-slate-100 rounded-xl font-mono text-xs font-semibold text-slate-700 break-all">
                                {reference}
                            </div>
                            <p className="text-xs text-red-500 mt-2">
                                This will debit the recipient wallet, refund the sender, create a ledger record, and notify the user.
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setConfirmModal(false)}
                                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={reversing}
                                onClick={handleConfirmReversal}
                                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-md shadow-red-600/30 transition flex items-center justify-center gap-2"
                            >
                                {reversing ? <FaSpinner className="animate-spin text-sm" /> : "Yes, Reverse"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminQuickActions;
