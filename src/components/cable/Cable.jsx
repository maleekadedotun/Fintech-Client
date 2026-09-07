import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FaTv,
    FaShieldAlt,
    FaCheckCircle,
    FaLock,
    FaTimes,
    FaUserCheck,
    FaSpinner,
    FaArrowLeft,
    FaRedo,
    FaExclamationCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
    fetchCableProviders,
    fetchCablePlans,
    verifyCableCustomerAccount,
    purchaseCable,
    setSelectedProvider,
    setSelectedPlan,
    clearVerification,
    resetCable,
} from "../../features/cable/cableSlice";

export const Cable = () => {
    const dispatch = useDispatch();

    const {
        providers,
        selectedProvider,
        plans,
        loadingPlans,
        plansError,
        selectedPlan,
        verifying,
        verifiedCustomer,
        verificationError,
        purchasing,
        purchaseSuccess,
    } = useSelector((state) => state.cable);

    const [smartCardNumber, setSmartCardNumber] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // PIN & Modal
    const [showPinModal, setShowPinModal] = useState(false);
    const [pin, setPin] = useState("");

    // Fetch providers on mount
    useEffect(() => {
        dispatch(fetchCableProviders());
    }, [dispatch]);

    // Fetch plans when selected provider changes
    useEffect(() => {
        if (selectedProvider) {
            const providerKey = selectedProvider.serviceID || selectedProvider.id;
            dispatch(fetchCablePlans(providerKey));
        }
    }, [dispatch, selectedProvider]);

    const handleSelectProvider = (p) => {
        dispatch(setSelectedProvider(p));
        dispatch(clearVerification());
    };

    const handleRetryPlans = () => {
        if (selectedProvider) {
            const providerKey = selectedProvider.serviceID || selectedProvider.id;
            dispatch(fetchCablePlans(providerKey));
        }
    };

    const handleVerifySmartCard = async () => {
        if (!smartCardNumber || smartCardNumber.trim().length < 6) {
            toast.error("Please enter a valid SmartCard or IUC number");
            return;
        }

        try {
            const providerKey = selectedProvider.serviceID || selectedProvider.id;
            const result = await dispatch(
                verifyCableCustomerAccount({
                    providerId: providerKey,
                    smartCardNumber: smartCardNumber.trim(),
                })
            ).unwrap();

            if (result?.Customer_Name || result?.customerName || result?.name) {
                toast.success("Smartcard verified successfully!");
            } else {
                toast.success("Subscriber verified!");
            }
        } catch (error) {
            toast.error(error || "Failed to verify Smartcard number");
        }
    };

    const handleInitiateSubscription = (e) => {
        e.preventDefault();

        if (!smartCardNumber) {
            toast.error("Please enter your Smartcard or IUC number");
            return;
        }
        if (!selectedPlan) {
            toast.error("Please select a subscription package");
            return;
        }
        if (!phoneNumber || phoneNumber.trim().length < 10) {
            toast.error("Please enter a valid phone number");
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
            const planCode =
                selectedPlan.code ||
                selectedPlan.variation_code ||
                selectedPlan.variationCode ||
                selectedPlan.id;
            const planAmount = Number(
                selectedPlan.variation_amount ||
                selectedPlan.amount ||
                selectedPlan.price ||
                0
            );
            const providerKey = selectedProvider.serviceID || selectedProvider.id;

            const payload = {
                providerId: providerKey,
                smartCardNumber: smartCardNumber.trim(),
                variationCode: planCode,
                plan: selectedPlan.name || selectedPlan.planName,
                planId: selectedPlan.id || selectedPlan.planId || planCode,
                amount: planAmount,
                phoneNumber: phoneNumber.trim(),
                pin,
            };

            const response = await dispatch(purchaseCable(payload)).unwrap();
            toast.success(response?.message || "Cable TV subscription renewed successfully!");
            setShowPinModal(false);
            setPin("");
        } catch (error) {
            toast.error(error || "Cable subscription failed.");
        }
    };

    const handleResetForm = () => {
        dispatch(resetCable());
        setSmartCardNumber("");
        setPhoneNumber("");
        setPin("");
    };

    const planPrice =
        selectedPlan?.variation_amount ||
        selectedPlan?.amount ||
        selectedPlan?.price ||
        0;

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
                                <FaTv className="text-purple-600" /> Cable TV Subscription
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Instantly renew DStv, GOtv, StarTimes & Showmax with zero downtime
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
                            <h2 className="text-2xl font-bold text-slate-900">Subscription Active!</h2>
                            <p className="text-slate-500 text-sm">
                                Your TV channels will be reconnected immediately.
                            </p>
                        </div>

                        {/* Breakdown */}
                        <div className="mt-6 bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100 text-sm">
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Provider</span>
                                <span className="font-semibold text-slate-800">{selectedProvider?.name}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Package / Bouquet</span>
                                <span className="font-semibold text-slate-800">{selectedPlan?.name || "Selected Package"}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">SmartCard / IUC</span>
                                <span className="font-semibold text-slate-800 font-mono">{smartCardNumber}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Amount Paid</span>
                                <span className="font-bold text-slate-900 text-base">₦{Number(planPrice).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-slate-500">Reference</span>
                                <span className="font-mono text-xs text-slate-600">
                                    {purchaseSuccess.reference || purchaseSuccess.transaction?.reference || purchaseSuccess._id || "TX-" + Date.now()}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <button
                                onClick={handleResetForm}
                                className="flex-1 py-3 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition text-center shadow-md shadow-purple-600/20"
                            >
                                Renew Another Decoder
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
                            <form onSubmit={handleInitiateSubscription} className="space-y-6">
                                {/* Step 1: Provider Tabs */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-semibold text-slate-800">
                                            Select Cable Provider
                                        </label>
                                        <span className="text-xs text-slate-400 font-medium">
                                            {providers.length} providers
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {providers.map((p) => {
                                            const isSelected =
                                                selectedProvider?.id === p.id ||
                                                selectedProvider?.serviceID === p.serviceID;
                                            return (
                                                <button
                                                    key={p.id || p.serviceID}
                                                    type="button"
                                                    onClick={() => handleSelectProvider(p)}
                                                    className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-2 ${
                                                        isSelected
                                                            ? "border-purple-600 bg-purple-50 ring-2 ring-purple-600/20 shadow-sm"
                                                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg shadow-sm ${p.iconBg || "bg-purple-600"}`}>
                                                        <FaTv />
                                                    </div>
                                                    <span className="font-bold text-sm text-slate-800">{p.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Step 2: Smartcard Number */}
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="text-sm font-semibold text-slate-800">
                                            SmartCard / IUC / UIC Number
                                        </label>
                                        {smartCardNumber.trim().length >= 6 && (
                                            <button
                                                type="button"
                                                onClick={handleVerifySmartCard}
                                                disabled={verifying}
                                                className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition"
                                            >
                                                {verifying ? (
                                                    <>
                                                        <FaSpinner className="animate-spin" /> Verifying...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaUserCheck /> Check Subscriber
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={smartCardNumber}
                                        onChange={(e) => {
                                            setSmartCardNumber(e.target.value.replace(/[^0-9]/g, ""));
                                            dispatch(clearVerification());
                                        }}
                                        placeholder="e.g. 1023456789"
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono text-slate-800"
                                        required
                                    />

                                    {/* Verified Customer box */}
                                    {verifiedCustomer && (
                                        <div className="mt-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                                            <FaCheckCircle className="text-emerald-600 mt-0.5 shrink-0" />
                                            <div className="text-xs text-emerald-900">
                                                <p className="font-bold">
                                                    {verifiedCustomer.Customer_Name ||
                                                        verifiedCustomer.customerName ||
                                                        verifiedCustomer.name ||
                                                        "Subscriber Verified"}
                                                </p>
                                                <p className="text-emerald-700 mt-0.5">
                                                    Current Bouquet:{" "}
                                                    {verifiedCustomer.Current_Bouquet ||
                                                        verifiedCustomer.currentBouquet ||
                                                        "Active Line"}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {verificationError && (
                                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                                            <FaExclamationCircle className="shrink-0" />
                                            <span>{verificationError}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Step 3: Package Selection */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-semibold text-slate-800">
                                            Select Package / Bouquet ({selectedProvider?.name})
                                        </label>
                                        {loadingPlans && (
                                            <span className="text-xs text-purple-600 flex items-center gap-1.5 font-medium">
                                                <FaSpinner className="animate-spin" /> Loading packages...
                                            </span>
                                        )}
                                    </div>

                                    {loadingPlans ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[1, 2, 3, 4].map((n) => (
                                                <div
                                                    key={n}
                                                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50 animate-pulse space-y-2"
                                                >
                                                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : plansError ? (
                                        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                                            <div className="flex items-center gap-2 text-center sm:text-left">
                                                <FaExclamationCircle className="text-amber-600 text-lg shrink-0" />
                                                <span>{plansError}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRetryPlans}
                                                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
                                            >
                                                <FaRedo /> Retry
                                            </button>
                                        </div>
                                    ) : plans.length === 0 ? (
                                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-sm">
                                            No subscription packages available for this provider.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                                            {plans.map((p, idx) => {
                                                const planCode =
                                                    p.code ||
                                                    p.variation_code ||
                                                    p.variationCode ||
                                                    p.id ||
                                                    p.planId ||
                                                    p.name;
                                                const price =
                                                    p.variation_amount ||
                                                    p.amount ||
                                                    p.price ||
                                                    0;
                                                const isSelected =
                                                    selectedPlan &&
                                                    ((selectedPlan.code && selectedPlan.code === p.code) ||
                                                        (selectedPlan.variation_code &&
                                                            selectedPlan.variation_code === p.variation_code) ||
                                                        (selectedPlan.id && selectedPlan.id === p.id) ||
                                                        selectedPlan.name === p.name);

                                                return (
                                                    <button
                                                        key={planCode || idx}
                                                        type="button"
                                                        onClick={() => dispatch(setSelectedPlan(p))}
                                                        className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                                                            isSelected
                                                                ? "border-purple-600 bg-purple-50 ring-2 ring-purple-600/20 shadow-sm"
                                                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        <div className="pr-2">
                                                            <p className="text-xs font-bold text-slate-900 leading-tight">
                                                                {p.name || p.planName}
                                                            </p>
                                                            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                                                                {p.code || "1 Month"}
                                                            </p>
                                                        </div>
                                                        <span className="text-xs font-extrabold text-purple-700 shrink-0">
                                                            ₦{Number(price).toLocaleString()}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Step 4: Phone Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                        Phone Number (for SMS confirmation)
                                    </label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="e.g. 08012345678"
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loadingPlans || !selectedPlan}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-base shadow-lg shadow-purple-600/25 hover:from-purple-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaTv /> Pay ₦{Number(planPrice).toLocaleString()}
                                </button>
                            </form>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl">
                                        <FaTv />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-medium">Digital TV</p>
                                        <h3 className="font-bold text-lg">{selectedProvider?.name}</h3>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-700/60">
                                    <p className="flex items-center gap-2">
                                        <FaCheckCircle className="text-purple-400 shrink-0" />
                                        <span>Instant automatic channel activation</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaCheckCircle className="text-purple-400 shrink-0" />
                                        <span>Official provider direct billing</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaCheckCircle className="text-purple-400 shrink-0" />
                                        <span>Full package catalog & bouquet switching</span>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
                                <div className="flex items-center gap-3 text-purple-700">
                                    <FaShieldAlt className="text-xl shrink-0" />
                                    <h4 className="font-bold text-sm text-slate-900">Protected & Verified</h4>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Always check your subscriber details before authorizing transaction to guarantee renewal on the correct decoder.
                                </p>
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
                                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                                    <FaLock />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Authorize TV Renewal</h3>
                                <p className="text-xs text-slate-500">
                                    Enter your 4-digit transaction PIN to proceed
                                </p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100 text-xs text-slate-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Provider:</span>
                                    <span className="font-bold text-slate-800">{selectedProvider?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Bouquet:</span>
                                    <span className="font-bold text-slate-800">{selectedPlan?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Smartcard:</span>
                                    <span className="font-mono font-bold text-slate-800">{smartCardNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total:</span>
                                    <span className="font-bold text-purple-700 text-sm">
                                        ₦{Number(planPrice).toLocaleString()}
                                    </span>
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
                                    className="w-full text-center text-3xl tracking-[1em] py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono"
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
                                        disabled={pin.length !== 4 || purchasing}
                                        className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-md hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {purchasing ? (
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

export default Cable;
