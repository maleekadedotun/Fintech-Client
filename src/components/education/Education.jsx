import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FaGraduationCap,
    FaShieldAlt,
    FaCheckCircle,
    FaCopy,
    FaLock,
    FaTimes,
    FaSpinner,
    FaArrowLeft,
    FaBookOpen,
    FaRedo,
    FaExclamationCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
    fetchEducationProviders,
    fetchEducationPlans,
    purchaseEducationPin,
    setSelectedProvider,
    setSelectedPlan,
    clearVerification,
    resetEducation,
} from "../../features/education/educationSlice";

export const Education = () => {
    const dispatch = useDispatch();

    const {
        providers,
        selectedProvider,
        plans,
        loadingPlans,
        plansError,
        selectedPlan,
        purchasing,
        purchaseSuccess,
    } = useSelector((state) => state.education);

    const [profileCode, setProfileCode] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState("");

    // PIN Modal
    const [showPinModal, setShowPinModal] = useState(false);
    const [pin, setPin] = useState("");

    // Fetch providers on mount
    useEffect(() => {
        dispatch(fetchEducationProviders());
    }, [dispatch]);

    // Fetch plans/packages when selected provider changes
    useEffect(() => {
        if (selectedProvider) {
            const providerKey = selectedProvider.serviceID || selectedProvider.id;
            dispatch(fetchEducationPlans(providerKey));
        }
    }, [dispatch, selectedProvider]);

    const handleSelectProvider = (p) => {
        dispatch(setSelectedProvider(p));
        dispatch(clearVerification());
    };

    const handleRetryPlans = () => {
        if (selectedProvider) {
            const providerKey = selectedProvider.serviceID || selectedProvider.id;
            dispatch(fetchEducationPlans(providerKey));
        }
    };

    // Calculate dynamic pricing from API plans (NO hardcoded prices)
    const unitPrice = Number(selectedPlan?.amount || selectedPlan?.price || 0);
    const totalAmount = unitPrice * quantity;

    const isJambSelected =
        selectedProvider?.serviceID?.toLowerCase().includes("jamb") ||
        selectedProvider?.id?.toString().toLowerCase().includes("jamb") ||
        selectedProvider?.name?.toLowerCase().includes("jamb");

    const handleInitiatePurchase = (e) => {
        e.preventDefault();

        if (!selectedPlan) {
            toast.error("Please select an examination package");
            return;
        }

        if (isJambSelected && (!profileCode || profileCode.trim().length < 10)) {
            toast.error("Please enter a valid 10-digit JAMB Profile Code");
            return;
        }

        if (!phoneNumber || phoneNumber.trim().length < 10) {
            toast.error("Please enter a valid phone number for SMS delivery");
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
            const providerKey = selectedProvider.serviceID || selectedProvider.id;
            const planCode = selectedPlan.code || selectedPlan.variation_code || selectedPlan.id;

            const payload = {
                disco: providerKey,
                providerId: providerKey,
                billersCode: profileCode.trim() || phoneNumber.trim(),
                variationCode: planCode,
                quantity: Number(quantity),
                amount: totalAmount,
                phoneNumber: phoneNumber.trim(),
                pin,
            };

            const response = await dispatch(purchaseEducationPin(payload)).unwrap();
            toast.success(response?.message || "Exam PIN purchased successfully!");
            setShowPinModal(false);
            setPin("");
        } catch (error) {
            toast.error(error || "Exam PIN purchase failed. Please check your PIN or balance.");
        }
    };

    const copyToClipboard = (text, label = "PIN") => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
    };

    const resetForm = () => {
        dispatch(resetEducation());
        setProfileCode("");
        setPhoneNumber("");
        setQuantity(1);
        setPin("");
    };

    // Extract PIN and Serial Number from response dynamically
    const extractedPin =
        purchaseSuccess?.pin ||
        purchaseSuccess?.token ||
        purchaseSuccess?.cards?.[0]?.Pin ||
        purchaseSuccess?.tokens?.[0]?.pin ||
        purchaseSuccess?.purchased_code ||
        purchaseSuccess?.data?.pin ||
        purchaseSuccess?.data?.cards?.[0]?.Pin ||
        null;

    const extractedSerial =
        purchaseSuccess?.serial ||
        purchaseSuccess?.serialNumber ||
        purchaseSuccess?.cards?.[0]?.Serial ||
        purchaseSuccess?.data?.serial ||
        null;

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
                                <FaGraduationCap className="text-indigo-600" /> Education & Exam PINs
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Purchase official WAEC, JAMB, NECO and NABTEB result checking tokens and registration e-PINs
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
                            <h2 className="text-2xl font-bold text-slate-900">e-PIN Generated!</h2>
                            <p className="text-slate-500 text-sm">
                                Your examination token has been generated and sent to your phone number.
                            </p>
                        </div>

                        {/* Generated Token Display */}
                        <div className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white text-center shadow-lg">
                            <p className="text-xs uppercase tracking-wider text-indigo-200 font-semibold mb-1">
                                {selectedPlan?.name || selectedProvider?.name}
                            </p>
                            <div className="text-2xl sm:text-3xl font-mono font-bold tracking-widest my-2 select-all break-all">
                                {extractedPin || "TOKEN-GENERATED-SUCCESSFULLY"}
                            </div>
                            {extractedSerial && (
                                <p className="text-xs font-mono text-indigo-200">
                                    Serial: {extractedSerial}
                                </p>
                            )}
                            {extractedPin && (
                                <div className="flex justify-center gap-4 mt-3">
                                    <button
                                        onClick={() => copyToClipboard(extractedPin, "Exam PIN")}
                                        className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold transition"
                                    >
                                        <FaCopy /> Copy PIN
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100 text-sm">
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Exam Body</span>
                                <span className="font-semibold text-slate-800">{selectedProvider?.name}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Package / Bouquet</span>
                                <span className="font-semibold text-slate-800">{selectedPlan?.name}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Quantity</span>
                                <span className="font-semibold text-slate-800">{quantity}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Amount Paid</span>
                                <span className="font-bold text-slate-900 text-base">₦{Number(totalAmount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-slate-500">Transaction ID</span>
                                <span className="font-mono text-xs text-slate-600">
                                    {purchaseSuccess.reference || purchaseSuccess.transaction?.reference || purchaseSuccess._id || "EDU-" + Date.now()}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <button
                                onClick={resetForm}
                                className="flex-1 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition text-center shadow-md shadow-indigo-600/20"
                            >
                                Buy Another PIN
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
                    /* ================= PURCHASE FORM ================= */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                            <form onSubmit={handleInitiatePurchase} className="space-y-6">
                                {/* Step 1: Exam Provider Tabs (Dynamic from getEducationProvidersCtrl) */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-semibold text-slate-800">
                                            Select Examination Body
                                        </label>
                                        <span className="text-xs text-slate-400 font-medium">
                                            {providers.length} bodies available
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {providers.map((p) => {
                                            const isSelected =
                                                selectedProvider?.id === p.id ||
                                                selectedProvider?.serviceID === p.serviceID;
                                            return (
                                                <button
                                                    key={p.serviceID || p.id}
                                                    type="button"
                                                    onClick={() => handleSelectProvider(p)}
                                                    className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                                                        isSelected
                                                            ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/20 shadow-sm"
                                                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${p.color || "from-indigo-600 to-purple-700"} flex items-center justify-center text-white text-lg shadow-sm`}>
                                                        <FaGraduationCap />
                                                    </div>
                                                    <span className="font-bold text-xs text-slate-900 block truncate w-full">
                                                        {p.name}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Step 2: Select Package / Variation (Dynamic from getEducationPlansCtrl) */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-semibold text-slate-800">
                                            Select Package ({selectedProvider?.name})
                                        </label>
                                        {loadingPlans && (
                                            <span className="text-xs text-indigo-600 flex items-center gap-1.5 font-medium">
                                                <FaSpinner className="animate-spin" /> Loading packages...
                                            </span>
                                        )}
                                    </div>

                                    {loadingPlans ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[1, 2].map((n) => (
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
                                            No packages found for this examination body.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                                            {plans.map((p, idx) => {
                                                const planCode = p.code || p.variation_code || p.id || p.name;
                                                const price = p.amount || p.variation_amount || p.price || 0;
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
                                                        className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                                                            isSelected
                                                                ? "border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/20 shadow-sm"
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
                                                        <span className="text-sm font-extrabold text-indigo-700 shrink-0">
                                                            ₦{Number(price).toLocaleString()}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Step 3: Optional Profile Code (e.g. For JAMB) */}
                                {isJambSelected && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                            JAMB Profile Code (10 Digits)
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={10}
                                            value={profileCode}
                                            onChange={(e) => setProfileCode(e.target.value.replace(/[^0-9]/g, ""))}
                                            placeholder="e.g. 5501928472"
                                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-slate-800"
                                            required
                                        />
                                    </div>
                                )}

                                {/* Step 4: Quantity (Dynamic computation from live API price) */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                        Number of PINs / Cards
                                    </label>
                                    <select
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-semibold"
                                    >
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? "PIN" : "PINs"} (₦{(unitPrice * num).toLocaleString()})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Step 5: Phone Number for SMS delivery */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                        Phone Number (for SMS Token Delivery)
                                    </label>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="e.g. 08012345678"
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loadingPlans || !selectedPlan}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold text-base shadow-lg shadow-indigo-600/25 hover:from-indigo-700 hover:to-purple-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaGraduationCap /> Pay ₦{Number(totalAmount).toLocaleString()}
                                </button>
                            </form>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl">
                                        <FaBookOpen />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-medium">Official Exam Vendor</p>
                                        <h3 className="font-bold text-lg">{selectedProvider?.name}</h3>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-700/60">
                                    <p>• 100% Genuine and authentic tokens</p>
                                    <p>• Direct API connection with exam boards</p>
                                    <p>• Instant SMS dispatch and on-screen PIN display</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
                                <div className="flex items-center gap-3 text-indigo-700">
                                    <FaShieldAlt className="text-xl shrink-0" />
                                    <h4 className="font-bold text-sm text-slate-900">Guaranteed Delivery</h4>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Your generated PINs are permanently saved in your transaction history so you can retrieve them anytime.
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
                                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                                    <FaLock />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Authorize Exam PIN Purchase</h3>
                                <p className="text-xs text-slate-500">
                                    Enter your 4-digit transaction PIN to generate token
                                </p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100 text-xs text-slate-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Examination:</span>
                                    <span className="font-bold text-slate-800">{selectedProvider?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Package:</span>
                                    <span className="font-bold text-slate-800">{selectedPlan?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Quantity:</span>
                                    <span className="font-bold text-slate-800">{quantity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total:</span>
                                    <span className="font-bold text-indigo-600 text-sm">₦{Number(totalAmount).toLocaleString()}</span>
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
                                    className="w-full text-center text-3xl tracking-[1em] py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
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
                                        className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold text-sm shadow-md hover:from-indigo-700 hover:to-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {purchasing ? (
                                            <>
                                                <FaSpinner className="animate-spin" /> Generating...
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

export default Education;
