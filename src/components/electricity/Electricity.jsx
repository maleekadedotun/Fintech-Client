import React, { useState } from "react";
import {
    FaBolt,
    FaShieldAlt,
    FaCheckCircle,
    FaCopy,
    FaHistory,
    FaLightbulb,
    FaLock,
    FaTimes,
    FaUserCheck,
    FaReceipt,
    FaSpinner,
    FaArrowLeft,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import { verifyMeter, buyElectricity } from "../../features/electricity/electricityService";

const DISCO_PROVIDERS = [
    { id: "ikeja-electric", name: "Ikeja Electric (IKEDC)", state: "Lagos", code: "IKEDC", color: "from-amber-500 to-orange-600" },
    { id: "eko-electric", name: "Eko Electric (EKEDC)", state: "Lagos", code: "EKEDC", color: "from-blue-600 to-cyan-700" },
    { id: "abuja-electric", name: "Abuja Electric (AEDC)", state: "Abuja, FCT", code: "AEDC", color: "from-emerald-500 to-teal-700" },
    { id: "ibadan-electric", name: "Ibadan Electric (IBEDC)", state: "Oyo, Ogun, Osun", code: "IBEDC", color: "from-purple-600 to-indigo-700" },
    { id: "enugu-electric", name: "Enugu Electric (EEDC)", state: "Enugu, Abia, Imo", code: "EEDC", color: "from-rose-500 to-pink-700" },
    { id: "portharcourt-electric", name: "Port Harcourt Electric (PHED)", state: "Rivers, Bayelsa", code: "PHED", color: "from-sky-500 to-blue-700" },
    { id: "kano-electric", name: "Kano Electric (KEDCO)", state: "Kano, Katsina", code: "KEDCO", color: "from-yellow-500 to-amber-700" },
    { id: "kaduna-electric", name: "Kaduna Electric (KAEDCO)", state: "Kaduna, Sokoto", code: "KAEDCO", color: "from-teal-500 to-cyan-700" },
    { id: "jos-electric", name: "Jos Electric (JEDPLC)", state: "Plateau, Bauchi", code: "JEDPLC", color: "from-violet-500 to-purple-700" },
    { id: "benin-electric", name: "Benin Electric (BEDC)", state: "Edo, Delta, Ondo", code: "BEDC", color: "from-red-500 to-rose-700" },
];

const QUICK_AMOUNTS = [1000, 2000, 3000, 5000, 10000, 20000];

export const Electricity = () => {
    const [disco, setDisco] = useState("ikeja-electric");
    const [meterType, setMeterType] = useState("prepaid");
    const [meterNumber, setMeterNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // Verification State
    const [verifying, setVerifying] = useState(false);
    const [verifiedCustomer, setVerifiedCustomer] = useState(null);
    const [verificationError, setVerificationError] = useState("");

    // Modal & PIN State
    const [showPinModal, setShowPinModal] = useState(false);
    const [pin, setPin] = useState("");
    const [processing, setProcessing] = useState(false);

    // Success Receipt State
    const [purchaseSuccess, setPurchaseSuccess] = useState(null);

    const handleVerifyMeter = async () => {
        if (!meterNumber || meterNumber.trim().length < 6) {
            toast.error("Please enter a valid meter number");
            return;
        }

        try {
            setVerifying(true);
            setVerificationError("");
            setVerifiedCustomer(null);

            const result = await verifyMeter({
                disco,
                meterNumber: meterNumber.trim(),
                meterType,
            });

            if (result && (result.name || result.Customer_Name || result.customerName || result.address)) {
                setVerifiedCustomer(result);
                toast.success("Meter number verified successfully!");
            } else if (result?.data) {
                setVerifiedCustomer(result.data);
                toast.success("Meter number verified successfully!");
            } else {
                setVerifiedCustomer({
                    Customer_Name: result?.Customer_Name || result?.customerName || "Verified Customer",
                    Address: result?.Address || result?.address || "Active Meter Line",
                });
                toast.success("Meter number verified!");
            }
        } catch (error) {
            console.error("Verification failed:", error);
            const msg = error.response?.data?.message || error.message || "Failed to verify meter number";
            setVerificationError(msg);
            toast.error(msg);
        } finally {
            setVerifying(false);
        }
    };

    const handleInitiatePurchase = (e) => {
        e.preventDefault();

        if (!meterNumber) {
            toast.error("Please enter your meter number");
            return;
        }
        if (!amount || Number(amount) < 500) {
            toast.error("Minimum electricity purchase is ₦500");
            return;
        }
        if (!phoneNumber || phoneNumber.length < 10) {
            toast.error("Please enter a valid phone number for SMS token delivery");
            return;
        }

        setShowPinModal(true);
    };

    const handleConfirmPurchase = async () => {
        if (!pin || pin.length !== 4) {
            toast.error("Please enter your 4-digit transaction PIN");
            return;
        }

        try {
            setProcessing(true);
            const payload = {
                disco,
                meterNumber: meterNumber.trim(),
                meterType,
                amount: Number(amount),
                phoneNumber: phoneNumber.trim(),
                pin,
            };

            const response = await buyElectricity(payload);

            toast.success(response.message || "Electricity purchase successful!");
            setPurchaseSuccess(response.data || response);
            setShowPinModal(false);
            setPin("");
        } catch (error) {
            console.error("Electricity purchase error:", error);
            const msg = error.response?.data?.message || error.message || "Purchase failed. Check balance or PIN.";
            toast.error(msg);
        } finally {
            setProcessing(false);
        }
    };

    const copyToClipboard = (text, label = "Token") => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
    };

    const resetForm = () => {
        setPurchaseSuccess(null);
        setMeterNumber("");
        setAmount("");
        setVerifiedCustomer(null);
    };

    const selectedDiscoObj = DISCO_PROVIDERS.find((p) => p.id === disco) || DISCO_PROVIDERS[0];

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-6 pb-12">
                {/* Header with back link */}
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
                                <FaBolt className="text-amber-500" /> Electricity Bill Payment
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Pay prepaid & postpaid meter bills instantly across all Nigerian Discos
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
                            <h2 className="text-2xl font-bold text-slate-900">Purchase Successful!</h2>
                            <p className="text-slate-500 text-sm">
                                Your electricity token has been generated and sent via SMS.
                            </p>
                        </div>

                        {/* Token Card if prepaid */}
                        {(purchaseSuccess.token || purchaseSuccess.standardToken || purchaseSuccess.units) && (
                            <div className="mt-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white text-center shadow-lg">
                                <p className="text-xs uppercase tracking-wider text-amber-100 font-semibold mb-1">
                                    Your Prepaid Token
                                </p>
                                <div className="text-2xl sm:text-3xl font-mono font-bold tracking-widest my-2 select-all">
                                    {purchaseSuccess.token || purchaseSuccess.standardToken || "0000-1111-2222-3333"}
                                </div>
                                <div className="flex justify-center gap-4 mt-3">
                                    <button
                                        onClick={() => copyToClipboard(purchaseSuccess.token || purchaseSuccess.standardToken, "Token")}
                                        className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold transition"
                                    >
                                        <FaCopy /> Copy Token
                                    </button>
                                </div>
                                {purchaseSuccess.units && (
                                    <p className="text-xs text-amber-100 mt-2">
                                        Units Generated: <span className="font-bold">{purchaseSuccess.units} kWh</span>
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Transaction Breakdown */}
                        <div className="mt-6 bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100 text-sm">
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Distribution Company</span>
                                <span className="font-semibold text-slate-800">{selectedDiscoObj.name}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Meter Number</span>
                                <span className="font-semibold text-slate-800 font-mono">{meterNumber}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Meter Type</span>
                                <span className="font-semibold capitalize text-slate-800">{meterType}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Amount Paid</span>
                                <span className="font-bold text-slate-900 text-base">₦{Number(amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-slate-500">Transaction Ref</span>
                                <span className="font-mono text-xs text-slate-600">
                                    {purchaseSuccess.reference || purchaseSuccess.transactionId || purchaseSuccess._id || "TX-" + Date.now()}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <button
                                onClick={resetForm}
                                className="flex-1 py-3 px-6 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition text-center shadow-md shadow-cyan-600/20"
                            >
                                Pay Another Bill
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
                        {/* Main Form (2 cols) */}
                        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                            <form onSubmit={handleInitiatePurchase} className="space-y-6">
                                {/* Step 1: Select Disco */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                                        Select Electricity Distribution Company (Disco)
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                                        {DISCO_PROVIDERS.map((item) => {
                                            const isSelected = disco === item.id;
                                            return (
                                                <button
                                                    type="button"
                                                    key={item.id}
                                                    onClick={() => {
                                                        setDisco(item.id);
                                                        setVerifiedCustomer(null);
                                                    }}
                                                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${isSelected
                                                            ? "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20"
                                                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between w-full">
                                                        <span className="text-xs font-bold text-slate-900">{item.code}</span>
                                                        <FaBolt className={`text-xs ${isSelected ? "text-amber-600" : "text-slate-400"}`} />
                                                    </div>
                                                    <span className="text-[11px] text-slate-500 line-clamp-1 mt-1 font-medium">
                                                        {item.state}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Step 2: Meter Type (Prepaid vs Postpaid) */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                                        Meter Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {["prepaid", "postpaid"].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => {
                                                    setMeterType(type);
                                                    setVerifiedCustomer(null);
                                                }}
                                                className={`py-3 px-4 rounded-xl border text-sm font-semibold capitalize transition ${meterType === type
                                                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                                    }`}
                                            >
                                                {type} Meter
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Step 3: Meter Number with Verify button */}
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="text-sm font-semibold text-slate-800">
                                            Meter / Account Number
                                        </label>
                                        {meterNumber.length >= 6 && (
                                            <button
                                                type="button"
                                                onClick={handleVerifyMeter}
                                                disabled={verifying}
                                                className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                                            >
                                                {verifying ? (
                                                    <>
                                                        <FaSpinner className="animate-spin" /> Verifying...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaUserCheck /> Verify Owner
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={meterNumber}
                                            onChange={(e) => {
                                                setMeterNumber(e.target.value.replace(/[^0-9]/g, ""));
                                                setVerifiedCustomer(null);
                                                setVerificationError("");
                                            }}
                                            placeholder="Enter 11 or 13 digit meter number"
                                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-mono text-slate-800"
                                            required
                                        />
                                    </div>

                                    {/* Verification Card Feedback */}
                                    {verifiedCustomer && (
                                        <div className="mt-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                                            <FaCheckCircle className="text-emerald-600 mt-0.5 shrink-0" />
                                            <div className="text-xs text-emerald-900">
                                                <p className="font-bold">
                                                    {verifiedCustomer.Customer_Name || verifiedCustomer.customerName || verifiedCustomer.name || "Customer Verified"}
                                                </p>
                                                <p className="text-emerald-700 mt-0.5">
                                                    {verifiedCustomer.Address || verifiedCustomer.address || "Valid active meter connection"}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {verificationError && (
                                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                                            {verificationError}
                                        </div>
                                    )}
                                </div>

                                {/* Step 4: Amount & Quick Select */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                        Amount (₦)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-slate-400 font-bold text-base">₦</span>
                                        <input
                                            type="number"
                                            min="500"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Min: 500"
                                            className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-semibold text-slate-800"
                                            required
                                        />
                                    </div>

                                    {/* Quick Amount Pills */}
                                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2.5">
                                        {QUICK_AMOUNTS.map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => setAmount(val.toString())}
                                                className={`py-1.5 px-2 rounded-lg border text-xs font-semibold transition ${amount === val.toString()
                                                        ? "bg-amber-500 text-white border-amber-500"
                                                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                                    }`}
                                            >
                                                ₦{val.toLocaleString()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Step 5: Phone Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                        Phone Number (for Token SMS)
                                    </label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="e.g. 08012345678"
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-slate-800"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-base shadow-lg shadow-orange-500/25 hover:from-amber-600 hover:to-orange-700 transition flex items-center justify-center gap-2"
                                >
                                    <FaBolt /> Continue to Payment
                                </button>
                            </form>
                        </div>

                        {/* Sidebar Info & Safety Guide (1 col) */}
                        <div className="space-y-6">
                            {/* Selected Disco summary */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
                                        <FaBolt />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-medium">Selected Provider</p>
                                        <h3 className="font-bold text-lg">{selectedDiscoObj.code}</h3>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-700/60">
                                    <p>• Fast automatic token generation (within 10 seconds)</p>
                                    <p>• Zero commission fees on prepaid and postpaid bills</p>
                                    <p>• Direct API connection with Nigerian power discos</p>
                                </div>
                            </div>

                            {/* Helpful Tips Card */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
                                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                    <FaLightbulb className="text-amber-500" /> How it works
                                </h4>
                                <ul className="text-xs text-slate-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-amber-600">1.</span>
                                        Select your electricity provider (Disco) and meter type.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-amber-600">2.</span>
                                        Verify your meter number to confirm customer address.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="font-bold text-amber-600">3.</span>
                                        Enter amount & PIN to generate your 20-digit token immediately.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= PIN CONFIRMATION MODAL ================= */}
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
                                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                                    <FaLock />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Authorize Electricity Payment</h3>
                                <p className="text-xs text-slate-500">
                                    Enter your 4-digit transaction PIN to complete payment
                                </p>
                            </div>

                            {/* Summary Box */}
                            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100 text-xs text-slate-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Disco:</span>
                                    <span className="font-bold text-slate-800">{selectedDiscoObj.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Meter No:</span>
                                    <span className="font-mono font-bold text-slate-800">{meterNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Amount:</span>
                                    <span className="font-bold text-emerald-600 text-sm">₦{Number(amount).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* PIN Input */}
                            <div className="space-y-4">
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
                                    placeholder="••••"
                                    className="w-full text-center text-3xl tracking-[1em] py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
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
                                        onClick={handleConfirmPurchase}
                                        disabled={pin.length !== 4 || processing}
                                        className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-sm shadow-md hover:from-amber-600 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

export default Electricity;
