import React, { useState } from "react";
import {
    FaGamepad,
    FaShieldAlt,
    FaCheckCircle,
    FaLock,
    FaTimes,
    FaSpinner,
    FaArrowLeft,
    FaFutbol,
    FaCoins,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import { buyBetting } from "../../features/betting/bettingService";

const BETTING_PROVIDERS = [
    { id: "bet9ja", name: "Bet9ja", color: "from-green-600 to-emerald-800", logoText: "Bet9ja" },
    { id: "sportybet", name: "SportyBet", color: "from-red-600 to-rose-700", logoText: "Sporty" },
    { id: "1xbet", name: "1xBet", color: "from-blue-600 to-cyan-700", logoText: "1xBet" },
    { id: "nairabet", name: "NairaBet", color: "from-orange-600 to-amber-700", logoText: "NairaBet" },
    { id: "betway", name: "Betway", color: "from-slate-800 to-black", logoText: "Betway" },
    { id: "merrybet", name: "Merrybet", color: "from-yellow-500 to-amber-600", logoText: "Merrybet" },
    { id: "bangbet", name: "BangBet", color: "from-purple-600 to-indigo-700", logoText: "BangBet" },
    { id: "msport", name: "MSport", color: "from-teal-600 to-cyan-800", logoText: "MSport" },
];

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

export const Betting = () => {
    const [provider, setProvider] = useState(BETTING_PROVIDERS[0]);
    const [customerId, setCustomerId] = useState("");
    const [amount, setAmount] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // PIN Modal
    const [showPinModal, setShowPinModal] = useState(false);
    const [pin, setPin] = useState("");
    const [processing, setProcessing] = useState(false);

    // Success
    const [purchaseSuccess, setPurchaseSuccess] = useState(null);

    const handleInitiateFunding = (e) => {
        e.preventDefault();

        if (!customerId) {
            toast.error("Please enter your Betting User ID / Account ID");
            return;
        }
        if (!amount || Number(amount) < 100) {
            toast.error("Minimum deposit is ₦100");
            return;
        }
        if (!phoneNumber || phoneNumber.length < 10) {
            toast.error("Please enter a valid phone number");
            return;
        }

        setShowPinModal(true);
    };

    const handleConfirmFunding = async () => {
        if (!pin || pin.length !== 4) {
            toast.error("Please enter your 4-digit transaction PIN");
            return;
        }

        try {
            setProcessing(true);
            const payload = {
                providerId: provider.id,
                customerId: customerId.trim(),
                amount: Number(amount),
                phoneNumber: phoneNumber.trim(),
                pin,
            };

            const response = await buyBetting(payload);

            toast.success(response.message || "Betting wallet credited instantly!");
            setPurchaseSuccess(response.data || response);
            setShowPinModal(false);
            setPin("");
        } catch (error) {
            console.error("Betting deposit error:", error);
            const msg = error.response?.data?.message || error.message || "Deposit failed. Check your User ID or PIN.";
            toast.error(msg);
        } finally {
            setProcessing(false);
        }
    };

    const resetForm = () => {
        setPurchaseSuccess(null);
        setCustomerId("");
        setAmount("");
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
                                <FaFutbol className="text-emerald-600" /> Betting & Gaming Top-Up
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Instant wallet top-up for all sports betting platforms in Nigeria
                            </p>
                        </div>
                    </div>
                </div>

                {purchaseSuccess ? (
                    /* ================= SUCCESS RECEIPT ================= */
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 max-w-2xl mx-auto">
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                                <FaCheckCircle />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Wallet Funded!</h2>
                            <p className="text-slate-500 text-sm">
                                Your betting account has been credited successfully.
                            </p>
                        </div>

                        <div className="mt-6 bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100 text-sm">
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Platform</span>
                                <span className="font-semibold text-slate-800">{provider.name}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">User / Account ID</span>
                                <span className="font-semibold text-slate-800 font-mono">{customerId}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Amount Deposited</span>
                                <span className="font-bold text-slate-900 text-base">₦{Number(amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-slate-500">Transaction ID</span>
                                <span className="font-mono text-xs text-slate-600">
                                    {purchaseSuccess.reference || purchaseSuccess._id || "BET-" + Date.now()}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <button
                                onClick={resetForm}
                                className="flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition text-center shadow-md shadow-emerald-600/20"
                            >
                                Fund Another Account
                            </button>
                            <Link
                                to="/transactions"
                                className="flex-1 py-3 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition text-center"
                            >
                                View Transactions
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* ================= PAYMENT FORM ================= */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                            <form onSubmit={handleInitiateFunding} className="space-y-6">
                                {/* Provider Picker */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                                        Select Betting Platform
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {BETTING_PROVIDERS.map((p) => {
                                            const isSelected = provider.id === p.id;
                                            return (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => setProvider(p)}
                                                    className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-2 ${
                                                        isSelected
                                                            ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/20"
                                                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${p.color} flex items-center justify-center text-white text-lg font-black`}>
                                                        <FaFutbol />
                                                    </div>
                                                    <span className="font-bold text-xs text-slate-800">{p.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Customer ID */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                        User ID / Customer ID / Account ID
                                    </label>
                                    <input
                                        type="text"
                                        value={customerId}
                                        onChange={(e) => setCustomerId(e.target.value)}
                                        placeholder={`Enter your ${provider.name} User ID`}
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-slate-800"
                                        required
                                    />
                                </div>

                                {/* Amount & Quick Select */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                        Deposit Amount (₦)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-slate-400 font-bold text-base">₦</span>
                                        <input
                                            type="number"
                                            min="100"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Min: 100"
                                            className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-800"
                                            required
                                        />
                                    </div>

                                    {/* Quick Pills */}
                                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2.5">
                                        {QUICK_AMOUNTS.map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => setAmount(val.toString())}
                                                className={`py-1.5 px-2 rounded-lg border text-xs font-semibold transition ${
                                                    amount === val.toString()
                                                        ? "bg-emerald-600 text-white border-emerald-600"
                                                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                                }`}
                                            >
                                                ₦{val.toLocaleString()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                        Phone Number (for SMS Receipt)
                                    </label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="e.g. 08012345678"
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
                                        required
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-800 transition flex items-center justify-center gap-2"
                                >
                                    <FaCoins /> Fund {provider.name} Wallet
                                </button>
                            </form>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
                                        <FaFutbol />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-medium">Selected Sportsbook</p>
                                        <h3 className="font-bold text-lg">{provider.name}</h3>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-700/60">
                                    <p>• Zero service charge on deposits</p>
                                    <p>• Instant real-time crediting</p>
                                    <p>• Licensed by National Lottery Regulatory Commission</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PIN Modal */}
                {showPinModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                            <button
                                onClick={() => {
                                    setShowPinModal(false);
                                    setPin("");
                                }}
                                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 text-lg"
                            >
                                <FaTimes />
                            </button>

                            <div className="text-center space-y-2 mb-6">
                                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                                    <FaLock />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Confirm Betting Deposit</h3>
                                <p className="text-xs text-slate-500">
                                    Enter your 4-digit transaction PIN to proceed
                                </p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100 text-xs text-slate-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Platform:</span>
                                    <span className="font-bold text-slate-800">{provider.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>User ID:</span>
                                    <span className="font-bold text-slate-800">{customerId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Amount:</span>
                                    <span className="font-bold text-emerald-600 text-sm">₦{Number(amount).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
                                    placeholder="••••"
                                    className="w-full text-center text-3xl tracking-[1em] py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                                    autoFocus
                                />

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPinModal(false);
                                            setPin("");
                                        }}
                                        className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleConfirmFunding}
                                        disabled={pin.length !== 4 || processing}
                                        className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold text-sm shadow-md hover:from-emerald-700 hover:to-teal-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <FaSpinner className="animate-spin" /> Processing...
                                            </>
                                        ) : (
                                            "Pay Now"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Betting;
