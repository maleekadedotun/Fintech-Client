import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../../layouts/DashboardLayout";
import { submitKYCAction, fetchMyKYCStatus, clearKycState } from "../../features/kyc/kycSlice";
import {
    FaShieldAlt,
    FaIdCard,
    FaCheckCircle,
    FaHourglassHalf,
    FaTimesCircle,
    FaLock,
    FaCheck,
    FaInfoCircle,
    FaArrowRight,
    FaRegLightbulb,
} from "react-icons/fa";
import toast from "react-hot-toast";

const ID_TYPES = [
    { value: "NIN", label: "National Identification Number (NIN)", placeholder: "Enter 11-digit NIN" },
    { value: "BVN", label: "Bank Verification Number (BVN)", placeholder: "Enter 11-digit BVN" },
    { value: "Passport", label: "International Passport", placeholder: "Enter Passport Number (e.g. A12345678)" },
    { value: "DriversLicense", label: "Driver's License", placeholder: "Enter Driver's License Number" },
    { value: "VotersCard", label: "Voter's Card (VIN)", placeholder: "Enter Voter Identification Number" },
];

function KYC() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { kycStatus, tier, submitting, loading, error, successMessage } = useSelector(
        (state) => state.kyc
    );

    const [idType, setIdType] = useState("NIN");
    const [idNumber, setIdNumber] = useState("");
    const [consent, setConsent] = useState(false);

    useEffect(() => {
        dispatch(fetchMyKYCStatus());
    }, [dispatch]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearKycState());
            setIdNumber("");
            setConsent(false);
        }
        if (error) {
            toast.error(error);
            dispatch(clearKycState());
        }
    }, [successMessage, error, dispatch]);

    const activeStatus = kycStatus || user?.kycStatus || "unverified";
    const currentTier = tier || user?.tier || 1;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idNumber.trim()) {
            toast.error("Please enter your ID document number");
            return;
        }
        if (!consent) {
            toast.error("Please agree to identity verification terms");
            return;
        }

        dispatch(submitKYCAction({ idType, idNumber: idNumber.trim() }));
    };

    const selectedTypeObj = ID_TYPES.find((t) => t.value === idType) || ID_TYPES[0];

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
                {/* Header Banner */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-2">
                                <FaShieldAlt className="text-xs" />
                                Regulatory Compliance
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                                Identity & KYC Verification
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                Upgrade your account limits and unlock high-volume transfers by verifying your identity.
                            </p>
                        </div>

                        {/* Status Badge */}
                        <div className="self-start sm:self-auto">
                            {activeStatus === "verified" && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-lg">
                                    <FaCheckCircle className="text-emerald-400" />
                                    <span>Tier {currentTier} Verified</span>
                                </div>
                            )}
                            {activeStatus === "pending" && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-lg animate-pulse">
                                    <FaHourglassHalf className="text-amber-400" />
                                    <span>Verification Pending</span>
                                </div>
                            )}
                            {activeStatus === "rejected" && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold shadow-lg">
                                    <FaTimesCircle className="text-rose-400" />
                                    <span>Submission Rejected</span>
                                </div>
                            )}
                            {activeStatus === "unverified" && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold shadow-lg">
                                    <FaLock className="text-slate-400" />
                                    <span>Tier 1 (Basic)</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tier Limits Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tier 1 */}
                    <div
                        className={`rounded-3xl p-6 border transition ${
                            currentTier === 1
                                ? "bg-slate-900 border-slate-700 shadow-md"
                                : "bg-slate-950/50 border-slate-800/80 opacity-70"
                        }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Current Level
                            </span>
                            {currentTier === 1 && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                    Active
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Tier 1: Basic Account</h3>
                        <p className="text-xs text-slate-400 mb-4">Phone number verified on registration</p>

                        <div className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Daily Transfer Limit</span>
                                <span className="font-semibold text-slate-200">₦50,000</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Maximum Wallet Balance</span>
                                <span className="font-semibold text-slate-200">₦300,000</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">International Wire</span>
                                <span className="text-rose-400 font-semibold">Disabled</span>
                            </div>
                        </div>
                    </div>

                    {/* Tier 2 */}
                    <div
                        className={`rounded-3xl p-6 border relative overflow-hidden transition ${
                            currentTier === 2
                                ? "bg-gradient-to-b from-cyan-950/30 to-slate-900 border-cyan-500/40 shadow-xl"
                                : "bg-slate-900 border-cyan-500/20 shadow-md"
                        }`}
                    >
                        <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                                Upgrade Target
                            </span>
                            {currentTier === 2 ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    Active Tier 2
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                    Recommended
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Tier 2: Verified VIP</h3>
                        <p className="text-xs text-slate-400 mb-4">Government ID verified by compliance</p>

                        <div className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Daily Transfer Limit</span>
                                <span className="font-bold text-cyan-400">₦5,000,000</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Maximum Wallet Balance</span>
                                <span className="font-bold text-emerald-400">Unlimited</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Automated Payments & Schedules</span>
                                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                    <FaCheck className="text-[10px]" /> Enabled
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* State-specific UI */}
                {activeStatus === "verified" ? (
                    <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 text-center shadow-xl space-y-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl mx-auto shadow-inner">
                            <FaCheckCircle />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                You Are Fully Verified!
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1">
                                Your government-issued identity has been verified by our compliance team. You now enjoy maximum daily transaction limits of ₦5,000,000.
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-xs">
                            <FaIdCard className="text-cyan-400" />
                            <span>Document on file: <strong>{user?.idType || "National ID"}</strong></span>
                        </div>
                    </div>
                ) : activeStatus === "pending" ? (
                    <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-8 text-center shadow-xl space-y-4">
                        <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-3xl mx-auto animate-pulse">
                            <FaHourglassHalf />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                Verification in Progress
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1">
                                We received your KYC submission. An administrator will review your credentials shortly. You will receive an in-app notification once verified.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                            <span className="text-xs text-slate-400">Typical review time:</span>
                            <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                                1 - 6 Hours
                            </span>
                        </div>
                    </div>
                ) : (
                    /* KYC Submission Form (Unverified or Rejected) */
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                        {activeStatus === "rejected" && (
                            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                                <FaTimesCircle className="text-rose-400 text-lg mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-bold text-rose-300">
                                        Previous Submission Rejected
                                    </h4>
                                    <p className="text-xs text-slate-300 mt-1">
                                        Your previous verification request was rejected. Please review the details, double check your ID number, and re-submit below.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
                            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-lg">
                                <FaIdCard />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">
                                    Submit Identification Documents
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Select an official ID type and enter your registered ID number
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Select ID Type */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-2">
                                    Choose Government Document Type
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {ID_TYPES.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setIdType(type.value)}
                                            className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition ${
                                                idType === type.value
                                                    ? "bg-cyan-500/10 border-cyan-500 text-white font-semibold"
                                                    : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                                            }`}
                                        >
                                            <span className="text-xs">{type.label}</span>
                                            {idType === type.value && (
                                                <FaCheckCircle className="text-cyan-400 text-xs shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ID Number Input */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-2">
                                    {selectedTypeObj.label}
                                </label>
                                <div className="relative">
                                    <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                                    <input
                                        type="text"
                                        value={idNumber}
                                        onChange={(e) => setIdNumber(e.target.value)}
                                        placeholder={selectedTypeObj.placeholder}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition font-mono"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                                    <FaInfoCircle className="text-[10px]" />
                                    Your information is encrypted with bank-grade 256-bit SSL and used strictly for identity verification.
                                </p>
                            </div>

                            {/* Consent Checkbox */}
                            <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={consent}
                                    onChange={(e) => setConsent(e.target.checked)}
                                    className="mt-1 rounded border-slate-700 text-cyan-500 focus:ring-0"
                                />
                                <span className="text-xs text-slate-400 leading-relaxed">
                                    I certify that the identification document details provided above are authentic, valid, and belong to me. I authorize the compliance team to verify these credentials against official regulatory registries.
                                </span>
                            </label>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitting || loading}
                                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:scale-[0.99] disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition cursor-pointer"
                            >
                                <span>{submitting ? "Submitting for Review..." : "Submit for KYC Verification"}</span>
                                <FaArrowRight className="text-xs" />
                            </button>
                        </form>
                    </div>
                )}

                {/* Helpful Tips Card */}
                <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/60 flex items-start gap-3.5 text-xs text-slate-400">
                    <FaRegLightbulb className="text-amber-400 text-base shrink-0 mt-0.5" />
                    <div>
                        <span className="font-semibold text-slate-200 block mb-0.5">
                            Why do we require KYC verification?
                        </span>
                        In accordance with Central Bank compliance and anti-money laundering (AML) directives, verifying your identity protects your account from unauthorized takeovers and permits higher transaction volumes.
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default KYC;
