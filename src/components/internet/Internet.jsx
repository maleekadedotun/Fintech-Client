import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FaWifi,
    FaShieldAlt,
    FaCheckCircle,
    FaLock,
    FaTimes,
    FaUserCheck,
    FaSpinner,
    FaArrowLeft,
    FaGlobe,
    FaRedo,
    FaExclamationCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
    fetchInternetPlans,
    fetchInternetProviders,
    verifyInternetAccount,
    purchaseInternet,
    setSelectedProvider,
    setSelectedPlan,
    clearVerification,
    resetInternet,
} from "../../features/internet/internetSlice";

export const Internet = () => {
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
    } = useSelector((state) => state.internet);

    const [accountNumber, setAccountNumber] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // PIN Modal
    const [showPinModal, setShowPinModal] = useState(false);
    const [pin, setPin] = useState("");

    // Load available providers on mount
    useEffect(() => {
        dispatch(fetchInternetProviders());
    }, [dispatch]);

    // Load plans whenever selected provider changes
    useEffect(() => {
        if (selectedProvider) {
            const providerKey = selectedProvider.serviceID || selectedProvider.id;
            dispatch(fetchInternetPlans(providerKey));
        }
    }, [dispatch, selectedProvider]);

    const handleSelectProvider = (p) => {
        dispatch(setSelectedProvider(p));
        dispatch(clearVerification());
    };

    const handleRetryPlans = () => {
        if (selectedProvider) {
            const providerKey = selectedProvider.serviceID || selectedProvider.id;
            dispatch(fetchInternetPlans(providerKey));
        }
    };

    const handleVerifyAccount = async () => {
        if (!accountNumber || accountNumber.trim().length < 5) {
            toast.error("Please enter a valid Account/User ID");
            return;
        }

        try {
            const discoKey = selectedProvider.serviceID || selectedProvider.id;
            const result = await dispatch(
                verifyInternetAccount({
                    disco: discoKey,
                    serviceID: discoKey,
                    billersCode: accountNumber.trim(),
                })
            ).unwrap();

            if (result?.Customer_Name || result?.customerName || result?.name) {
                toast.success("Account verified successfully!");
            } else {
                toast.success("Account verified!");
            }
        } catch (error) {
            toast.error(error || "Unable to verify Internet Account");
        }
    };

    const handleInitiatePurchase = (e) => {
        e.preventDefault();

        if (!accountNumber) {
            toast.error("Please enter your Internet Account/User ID");
            return;
        }
        if (!selectedPlan) {
            toast.error("Please select a data bundle");
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
            const planCode = selectedPlan.code || selectedPlan.id || selectedPlan.variation_code;
            const planAmount = selectedPlan.amount || selectedPlan.price;
            const discoKey = selectedProvider.serviceID || selectedProvider.id;

            const payload = {
                disco: discoKey,
                providerId: discoKey,
                billersCode: accountNumber.trim(),
                variationCode: planCode,
                amount: planAmount,
                phoneNumber: phoneNumber.trim(),
                pin,
            };

            const response = await dispatch(purchaseInternet(payload)).unwrap();
            toast.success(response?.message || "Internet subscription renewed successfully!");
            setShowPinModal(false);
            setPin("");
        } catch (error) {
            toast.error(error || "Internet subscription failed.");
        }
    };

    const resetForm = () => {
        dispatch(resetInternet());
        setAccountNumber("");
        setPhoneNumber("");
        setPin("");
    };

    const currentPlanAmount = selectedPlan?.amount || selectedPlan?.price || 0;

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
                                <FaGlobe className="text-cyan-600" /> Broadband & Internet
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Renew Spectranet and Smile Communications broadband instantly
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
                            <h2 className="text-2xl font-bold text-slate-900">Broadband Recharged!</h2>
                            <p className="text-slate-500 text-sm">
                                Your internet data allowance has been credited and activated.
                            </p>
                        </div>

                        <div className="mt-6 bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100 text-sm">
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Provider</span>
                                <span className="font-semibold text-slate-800">{selectedProvider?.name}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Plan</span>
                                <span className="font-semibold text-slate-800">{selectedPlan?.name}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Account ID</span>
                                <span className="font-semibold text-slate-800 font-mono">{accountNumber}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Amount Paid</span>
                                <span className="font-bold text-slate-900 text-base">₦{Number(currentPlanAmount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-slate-500">Transaction Ref</span>
                                <span className="font-mono text-xs text-slate-600">
                                    {purchaseSuccess.reference || purchaseSuccess.transaction?.reference || purchaseSuccess._id || "INT-" + Date.now()}
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
                        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                            <form onSubmit={handleInitiatePurchase} className="space-y-6">
                                {/* Provider Selection (Only 2 Providers: Spectranet and Smile) */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-semibold text-slate-800">
                                            Select Broadband Provider
                                        </label>
                                        <span className="text-xs text-slate-400 font-medium">
                                            {providers.length} available
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {providers.map((p) => {
                                            const isSelected = selectedProvider?.id === p.id || selectedProvider?.serviceID === p.serviceID;
                                            return (
                                                <button
                                                    key={p.serviceID || p.id}
                                                    type="button"
                                                    onClick={() => handleSelectProvider(p)}
                                                    className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-2 ${
                                                        isSelected
                                                            ? "border-cyan-600 bg-cyan-50/60 ring-2 ring-cyan-600/20 shadow-sm"
                                                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${p.color || "from-cyan-600 to-blue-700"} flex items-center justify-center text-white text-xl shadow-sm`}>
                                                        <FaWifi />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-sm text-slate-800 block">
                                                            {p.name}
                                                        </span>
                                                        <span className="text-[11px] text-slate-500 font-normal">
                                                            4G LTE Broadband
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Account Number & Verification */}
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="text-sm font-semibold text-slate-800">
                                            User ID / Account / Device Number
                                        </label>
                                        {accountNumber.trim().length >= 5 && (
                                            <button
                                                type="button"
                                                onClick={handleVerifyAccount}
                                                disabled={verifying}
                                                className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 transition"
                                            >
                                                {verifying ? (
                                                    <>
                                                        <FaSpinner className="animate-spin" /> Verifying...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaUserCheck /> Verify Account
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={accountNumber}
                                        onChange={(e) => {
                                            setAccountNumber(e.target.value);
                                            dispatch(clearVerification());
                                        }}
                                        placeholder="e.g. Spectranet Account ID or Smile Account No"
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-mono text-slate-800"
                                        required
                                    />

                                    {verifiedCustomer && (
                                        <div className="mt-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                                            <FaCheckCircle className="text-emerald-600 mt-0.5 shrink-0" />
                                            <div className="text-xs text-emerald-900">
                                                <p className="font-bold">
                                                    {verifiedCustomer.Customer_Name ||
                                                        verifiedCustomer.customerName ||
                                                        verifiedCustomer.name ||
                                                        "Account Verified"}
                                                </p>
                                                <p className="text-emerald-700 mt-0.5">Status: Active Subscriber</p>
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

                                {/* Plan Selection - Dynamically Loaded from getInternetPlansCtrl */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-semibold text-slate-800">
                                            Select Data Plan ({selectedProvider?.shortName || selectedProvider?.name})
                                        </label>
                                        {loadingPlans && (
                                            <span className="text-xs text-cyan-600 flex items-center gap-1.5 font-medium">
                                                <FaSpinner className="animate-spin" /> Loading plans...
                                            </span>
                                        )}
                                    </div>

                                    {loadingPlans ? (
                                        /* Skeleton Loading */
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
                                        /* Error Loading Plans with Retry */
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
                                            No active internet packages found for this provider.
                                        </div>
                                    ) : (
                                        /* Dynamic Plans Grid */
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                                            {plans.map((p) => {
                                                const planKey = p.code || p.id || p.variation_code;
                                                const isSelected =
                                                    selectedPlan?.code === planKey ||
                                                    selectedPlan?.id === planKey ||
                                                    selectedPlan?.variation_code === planKey;
                                                const price = p.amount || p.price;

                                                return (
                                                    <button
                                                        key={planKey}
                                                        type="button"
                                                        onClick={() => dispatch(setSelectedPlan(p))}
                                                        className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                                                            isSelected
                                                                ? "border-cyan-600 bg-cyan-50/80 ring-2 ring-cyan-600/20 shadow-sm"
                                                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        <div className="pr-2">
                                                            <p className="text-xs font-bold text-slate-900 leading-tight">
                                                                {p.name}
                                                            </p>
                                                            {p.code && (
                                                                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                                                    Code: {p.code}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-extrabold text-cyan-700 shrink-0">
                                                            ₦{Number(price).toLocaleString()}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                        Phone Number (for SMS confirmation)
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
                                    disabled={loadingPlans || !selectedPlan}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-base shadow-lg shadow-cyan-600/25 hover:from-cyan-700 hover:to-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaWifi /> Renew Subscription {selectedPlan && `(₦${Number(currentPlanAmount).toLocaleString()})`}
                                </button>
                            </form>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl">
                                        <FaWifi />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-medium">Fast Broadband</p>
                                        <h3 className="font-bold text-lg">{selectedProvider?.name}</h3>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-700/60">
                                    <p className="flex items-center gap-2">
                                        <FaCheckCircle className="text-cyan-400 shrink-0" />
                                        <span>Instant top-up and account renewal</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaCheckCircle className="text-cyan-400 shrink-0" />
                                        <span>Direct API connection to service providers</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <FaCheckCircle className="text-cyan-400 shrink-0" />
                                        <span>Secure transaction with 4-digit PIN verification</span>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
                                <div className="flex items-center gap-3 text-cyan-700">
                                    <FaShieldAlt className="text-xl shrink-0" />
                                    <h4 className="font-bold text-sm text-slate-900">Protected & Verified</h4>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Always verify your user or device ID before paying to ensure your data subscription is applied to the right device.
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
                                <div className="w-14 h-14 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                                    <FaLock />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Authorize Internet Renewal</h3>
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
                                    <span>Plan:</span>
                                    <span className="font-bold text-slate-800">{selectedPlan?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total:</span>
                                    <span className="font-bold text-cyan-700 text-sm">
                                        ₦{Number(currentPlanAmount).toLocaleString()}
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
                                    className="w-full text-center text-3xl tracking-[1em] py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-mono"
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
                                        className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-sm shadow-md hover:from-cyan-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

export default Internet;
