import React, { useEffect, useState } from "react";
import {
    FaCalendarAlt,
    FaPlus,
    FaPause,
    FaPlay,
    FaTrash,
    FaExchangeAlt,
    FaClock,
    FaCheckCircle,
    FaSpinner,
    FaTimes,
    FaShieldAlt,
    FaArrowLeft,
    FaCalendarCheck,
    FaUserCheck,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
    getScheduledTransfers,
    createScheduledTransfer,
    pauseScheduledTransfer,
    resumeScheduledTransfer,
    deleteScheduledTransfer,
} from "../../features/schedule/scheduleService";

export const Schedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal for New Schedule
    const [showModal, setShowModal] = useState(false);
    const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [frequency, setFrequency] = useState("monthly");
    const [nextRun, setNextRun] = useState("");
    const [creating, setCreating] = useState(false);

    // Action loading per schedule ID
    const [actionId, setActionId] = useState(null);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const response = await getScheduledTransfers();
            setSchedules(response.transfers || response.data || (Array.isArray(response) ? response : []));
        } catch (error) {
            console.error("Failed to fetch schedules:", error);
            toast.error("Could not load scheduled transfers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
        // default next run date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setNextRun(tomorrow.toISOString().split("T")[0]);
    }, []);

    const handleCreateSchedule = async (e) => {
        e.preventDefault();

        if (!receiverAccountNumber || receiverAccountNumber.length < 10) {
            toast.error("Please enter a valid 10-digit account number");
            return;
        }
        if (!amount || Number(amount) < 100) {
            toast.error("Minimum scheduled transfer is ₦100");
            return;
        }
        if (!nextRun) {
            toast.error("Please select a start date");
            return;
        }

        try {
            setCreating(true);
            const payload = {
                receiverAccountNumber: receiverAccountNumber.trim(),
                amount: Number(amount),
                frequency,
                nextRun: new Date(nextRun).toISOString(),
            };

            await createScheduledTransfer(payload);
            toast.success("Standing order scheduled successfully!");
            setShowModal(false);
            setReceiverAccountNumber("");
            setAmount("");
            fetchSchedules();
        } catch (error) {
            console.error("Error creating schedule:", error);
            const msg = error.response?.data?.message || error.message || "Failed to create schedule";
            toast.error(msg);
        } finally {
            setCreating(false);
        }
    };

    const handleToggleStatus = async (item) => {
        const isPaused = item.status === "paused";
        try {
            setActionId(item._id);
            if (isPaused) {
                await resumeScheduledTransfer(item._id);
                toast.success("Schedule activated");
            } else {
                await pauseScheduledTransfer(item._id);
                toast.success("Schedule paused");
            }
            fetchSchedules();
        } catch (error) {
            toast.error("Action failed");
        } finally {
            setActionId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to cancel and delete this recurring transfer?")) return;
        try {
            setActionId(id);
            await deleteScheduledTransfer(id);
            toast.success("Schedule deleted");
            setSchedules((prev) => prev.filter((s) => s._id !== id));
        } catch (error) {
            toast.error("Delete failed");
        } finally {
            setActionId(null);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-6 pb-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/bills"
                            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
                        >
                            <FaArrowLeft />
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
                                <FaCalendarAlt className="text-cyan-600" /> Scheduled Payments & Autopay
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Set up automated standing orders, rent payments, and recurring transfers
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm shadow-md shadow-cyan-600/20 transition"
                    >
                        <FaPlus /> New Schedule
                    </button>
                </div>

                {/* Main Schedule List */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Active Standing Orders</h2>
                            <p className="text-xs text-slate-500">Auto-processed on the designated next run date</p>
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold">
                            {schedules.length} Total
                        </span>
                    </div>

                    {loading ? (
                        <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                            <FaSpinner className="animate-spin text-2xl text-cyan-600" />
                            <p className="text-sm">Loading scheduled transfers...</p>
                        </div>
                    ) : schedules.length === 0 ? (
                        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl">
                            <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto text-2xl mb-3">
                                <FaCalendarCheck />
                            </div>
                            <h3 className="font-bold text-slate-800">No Scheduled Transfers</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                                Automate your regular allowances, rent, bills, or family support transfers with zero manual hassle.
                            </p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-700 transition"
                            >
                                <FaPlus /> Create First Schedule
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {schedules.map((item) => {
                                const isPaused = item.status === "paused";
                                return (
                                    <div
                                        key={item._id}
                                        className={`p-5 rounded-2xl border transition ${
                                            isPaused
                                                ? "border-slate-200 bg-slate-50/50 opacity-75"
                                                : "border-slate-200 bg-white hover:border-cyan-200 hover:shadow-md"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                                                    isPaused ? "bg-slate-400" : "bg-cyan-600"
                                                }`}>
                                                    <FaExchangeAlt />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-sm">
                                                        Account: {item.receiverAccountNumber}
                                                    </h4>
                                                    <p className="text-xs font-semibold capitalize text-cyan-700">
                                                        {item.frequency} Transfer
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                                    isPaused
                                                        ? "bg-amber-100 text-amber-700"
                                                        : "bg-emerald-100 text-emerald-700"
                                                }`}
                                            >
                                                {item.status || "Active"}
                                            </span>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                            <div>
                                                <p className="text-slate-400">Amount per run</p>
                                                <p className="font-bold text-slate-800 text-base">
                                                    ₦{Number(item.amount).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-slate-400 flex items-center gap-1 justify-end">
                                                    <FaClock /> Next Run
                                                </p>
                                                <p className="font-semibold text-slate-700">
                                                    {item.nextRun ? new Date(item.nextRun).toLocaleDateString() : "Pending"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() => handleToggleStatus(item)}
                                                disabled={actionId === item._id}
                                                className={`flex-1 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                                                    isPaused
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                                        : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                                }`}
                                            >
                                                {actionId === item._id ? (
                                                    <FaSpinner className="animate-spin" />
                                                ) : isPaused ? (
                                                    <>
                                                        <FaPlay className="text-[10px]" /> Resume
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaPause className="text-[10px]" /> Pause
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                disabled={actionId === item._id}
                                                className="py-2 px-3 rounded-xl text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Create Schedule Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 text-lg"
                            >
                                <FaTimes />
                            </button>

                            <div className="text-center space-y-2 mb-6">
                                <div className="w-14 h-14 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                                    <FaCalendarAlt />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">New Scheduled Transfer</h3>
                                <p className="text-xs text-slate-500">
                                    Funds will be transferred automatically according to your frequency
                                </p>
                            </div>

                            <form onSubmit={handleCreateSchedule} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Receiver Account Number (10 Digits)
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={10}
                                        value={receiverAccountNumber}
                                        onChange={(e) => setReceiverAccountNumber(e.target.value.replace(/[^0-9]/g, ""))}
                                        placeholder="e.g. 1029384756"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Amount per Transfer (₦)
                                    </label>
                                    <input
                                        type="number"
                                        min="100"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Min: 100"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Recurrence Frequency
                                    </label>
                                    <select
                                        value={frequency}
                                        onChange={(e) => setFrequency(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Start / First Execution Date
                                    </label>
                                    <input
                                        type="date"
                                        value={nextRun}
                                        onChange={(e) => setNextRun(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold shadow-md shadow-cyan-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {creating ? <FaSpinner className="animate-spin" /> : "Save Schedule"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Schedule;
