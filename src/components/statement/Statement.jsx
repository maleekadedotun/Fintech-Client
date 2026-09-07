import React, { useEffect, useState } from "react";
import {
    FaFileAlt,
    FaDownload,
    FaCalendarAlt,
    FaFilePdf,
    FaFileExcel,
    FaFileCsv,
    FaArrowDown,
    FaArrowUp,
    FaSpinner,
    FaArrowLeft,
    FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getStatement, downloadStatement } from "../../features/statement/statementService";

export const Statement = () => {
    const [period, setPeriod] = useState("30");
    const [format, setFormat] = useState("pdf");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [statementData, setStatementData] = useState(null);

    // Set default dates
    useEffect(() => {
        const today = new Date();
        const past = new Date();
        past.setDate(today.getDate() - 30);
        setEndDate(today.toISOString().split("T")[0]);
        setStartDate(past.toISOString().split("T")[0]);
    }, []);

    const fetchPreview = async () => {
        setLoadingPreview(true);
        try {
            const params = {
                startDate,
                endDate,
                period,
            };
            const response = await getStatement(params);
            setStatementData(response.statement || response.data || response);
        } catch (error) {
            console.error("Statement preview error:", error);
            // Non-critical, fallback to standard mock or empty
        } finally {
            setLoadingPreview(false);
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetchPreview();
        }
    }, [startDate, endDate]);

    const handlePeriodChange = (days) => {
        setPeriod(days);
        const today = new Date();
        const past = new Date();
        past.setDate(today.getDate() - Number(days));
        setEndDate(today.toISOString().split("T")[0]);
        setStartDate(past.toISOString().split("T")[0]);
    };

    const handleDownload = async () => {
        try {
            setDownloading(true);
            const params = {
                startDate,
                endDate,
                format,
            };

            const blob = await downloadStatement(params);
            
            // Create download link
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Fintech_Account_Statement_${startDate}_to_${endDate}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            toast.success("Statement downloaded successfully!");
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Could not download statement. Please check selected range.");
        } finally {
            setDownloading(false);
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
                                <FaFileAlt className="text-indigo-600" /> Account Statement
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Generate and export official stamped account activity statements
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Statement Configurator (1 col) */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
                        <h3 className="font-bold text-slate-900 text-base">Statement Period</h3>

                        {/* Quick Presets */}
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: "30 Days", val: "30" },
                                { label: "90 Days", val: "90" },
                                { label: "6 Months", val: "180" },
                            ].map((p) => (
                                <button
                                    key={p.val}
                                    type="button"
                                    onClick={() => handlePeriodChange(p.val)}
                                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                                        period === p.val
                                            ? "bg-slate-900 text-white border-slate-900"
                                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                    }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>

                        {/* Date Pickers */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Export Format */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                File Format
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: "pdf", name: "PDF", icon: <FaFilePdf className="text-red-500" /> },
                                    { id: "excel", name: "Excel", icon: <FaFileExcel className="text-emerald-500" /> },
                                    { id: "csv", name: "CSV", icon: <FaFileCsv className="text-blue-500" /> },
                                ].map((fmt) => (
                                    <button
                                        key={fmt.id}
                                        type="button"
                                        onClick={() => setFormat(fmt.id)}
                                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition ${
                                            format === fmt.id
                                                ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/20 text-indigo-900"
                                                : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                        }`}
                                    >
                                        <span className="text-base">{fmt.icon}</span>
                                        {fmt.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Download CTA */}
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {downloading ? (
                                <>
                                    <FaSpinner className="animate-spin" /> Preparing Document...
                                </>
                            ) : (
                                <>
                                    <FaDownload /> Download Statement
                                </>
                            )}
                        </button>
                    </div>

                    {/* Statement Preview (2 cols) */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="font-bold text-slate-900 text-base">Statement Summary</h3>
                                <p className="text-xs text-slate-500">
                                    Period: {startDate} to {endDate}
                                </p>
                            </div>
                            <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <FaCheckCircle /> Official Document
                            </span>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-xs text-slate-500 font-medium">Total Inflow (Credits)</p>
                                <p className="text-base sm:text-lg font-extrabold text-emerald-600 mt-1">
                                    ₦{Number(statementData?.totalCredit || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-xs text-slate-500 font-medium">Total Outflow (Debits)</p>
                                <p className="text-base sm:text-lg font-extrabold text-red-600 mt-1">
                                    ₦{Number(statementData?.totalDebit || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                                <p className="text-xs text-slate-500 font-medium">Transaction Count</p>
                                <p className="text-base sm:text-lg font-extrabold text-slate-800 mt-1">
                                    {statementData?.transactions?.length || 0}
                                </p>
                            </div>
                        </div>

                        {/* Recent ledger transactions in range */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                                Statement Line Items Preview
                            </h4>
                            {loadingPreview ? (
                                <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                                    <FaSpinner className="animate-spin text-xl text-indigo-600" />
                                    <p className="text-xs">Fetching records...</p>
                                </div>
                            ) : statementData?.transactions && statementData.transactions.length > 0 ? (
                                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                    {statementData.transactions.slice(0, 10).map((t, idx) => {
                                        const isCredit = t.type === "credit";
                                        return (
                                            <div
                                                key={t._id || idx}
                                                className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                        isCredit ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                                                    }`}>
                                                        {isCredit ? <FaArrowDown /> : <FaArrowUp />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">{t.description || t.narration || "Transaction"}</p>
                                                        <p className="text-[11px] text-slate-400 font-mono">
                                                            {new Date(t.createdAt || Date.now()).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`font-bold ${isCredit ? "text-emerald-600" : "text-red-600"}`}>
                                                    {isCredit ? "+" : "-"}₦{Number(t.amount || 0).toLocaleString()}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
                                    No transaction entries recorded for this range.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Statement;
