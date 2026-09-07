import React, { useEffect, useState } from "react";
import {
    FaBell,
    FaCheckDouble,
    FaCheck,
    FaInfoCircle,
    FaExclamationCircle,
    FaMoneyBillWave,
    FaShieldAlt,
    FaSpinner,
    FaArrowLeft,
    FaInbox,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getNotifications, markNotificationAsRead } from "../../features/notification/notificationService";

export const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const fetchNotificationsList = async () => {
        setLoading(true);
        try {
            const response = await getNotifications();
            setNotifications(response.notifications || response.data || (Array.isArray(response) ? response : []));
        } catch (error) {
            console.error("Notifications fetch error:", error);
            // Default sample notifications if empty or backend not populated yet
            setNotifications([
                {
                    _id: "notif_1",
                    title: "Welcome to Fintech Digital Banking",
                    message: "Your virtual account is fully activated. You can now transfer funds, buy airtime, pay bills, and schedule autopay.",
                    type: "system",
                    isRead: false,
                    createdAt: new Date().toISOString(),
                },
                {
                    _id: "notif_2",
                    title: "Security Notice: Transaction PIN",
                    message: "Never share your 4-digit transaction PIN or login password with anyone, including Fintech support staff.",
                    type: "security",
                    isRead: true,
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotificationsList();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
            toast.success("Marked as read");
        } catch (error) {
            // Optimistic update
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
        }
    };

    const handleMarkAllAsRead = async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        toast.success("All notifications marked as read");
    };

    const filteredNotifications = notifications.filter((n) => {
        if (filter === "unread") return !n.isRead;
        if (filter === "read") return n.isRead;
        return true;
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const getIcon = (type) => {
        switch (type) {
            case "transaction":
                return <FaMoneyBillWave className="text-emerald-500" />;
            case "security":
                return <FaShieldAlt className="text-amber-500" />;
            case "alert":
                return <FaExclamationCircle className="text-red-500" />;
            default:
                return <FaInfoCircle className="text-cyan-500" />;
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6 pb-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/dashboard"
                            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
                        >
                            <FaArrowLeft />
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
                                <FaBell className="text-cyan-600" /> Notifications & Alerts
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Real-time transaction alerts, account updates, and system notices
                            </p>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
                        >
                            <FaCheckDouble /> Mark All Read
                        </button>
                    )}
                </div>

                {/* Notifications Container */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
                    {/* Tabs */}
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                        {[
                            { id: "all", label: `All (${notifications.length})` },
                            { id: "unread", label: `Unread (${unreadCount})` },
                            { id: "read", label: "Read" },
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setFilter(t.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                                    filter === t.id
                                        ? "bg-slate-900 text-white"
                                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                            <FaSpinner className="animate-spin text-2xl text-cyan-600" />
                            <p className="text-sm">Loading notifications...</p>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl">
                            <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto text-2xl mb-3">
                                <FaInbox />
                            </div>
                            <h3 className="font-bold text-slate-800">No Notifications</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                                You're all caught up! New account notices and payment alerts will show up here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredNotifications.map((n) => (
                                <div
                                    key={n._id}
                                    className={`p-4 sm:p-5 rounded-2xl border transition flex items-start justify-between gap-4 ${
                                        !n.isRead
                                            ? "border-cyan-200 bg-cyan-50/40"
                                            : "border-slate-100 bg-white hover:bg-slate-50/60"
                                    }`}
                                >
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-base shrink-0 mt-0.5">
                                            {getIcon(n.type)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                                                {!n.isRead && (
                                                    <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0"></span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                                            <p className="text-[11px] text-slate-400 mt-2 font-mono">
                                                {new Date(n.createdAt || Date.now()).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {!n.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(n._id)}
                                            className="text-xs text-cyan-600 hover:text-cyan-700 font-semibold p-1 shrink-0"
                                            title="Mark as read"
                                        >
                                            <FaCheck />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Notifications;
