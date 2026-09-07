import React, { useState } from "react";
import {
    FaShieldAlt,
    FaCheckCircle,
    FaLock,
    FaTimes,
    FaSpinner,
    FaArrowLeft,
    FaCar,
    FaFileContract,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import { buyInsurance } from "../../features/insurance/insuranceService";

const INSURANCE_POLICIES = [
    {
        id: "third-party-motor",
        name: "Third Party Motor Insurance",
        color: "from-blue-600 to-indigo-700",
        price: 15000,
        validity: "1 Year",
        desc: "Mandatory third party property damage & liability cover (NIID verified)",
    },
    {
        id: "commercial-vehicle",
        name: "Commercial Vehicle Insurance",
        color: "from-emerald-600 to-teal-800",
        price: 20000,
        validity: "1 Year",
        desc: "Full coverage for commercial buses, haulage, and ride-hailing cars",
    },
    {
        id: "motorcycle-tricycle",
        name: "Motorcycle & Tricycle Insurance",
        color: "from-amber-500 to-orange-600",
        price: 5000,
        validity: "1 Year",
        desc: "Affordable road cover for 2-wheelers and tricycles (Keke)",
    },
    {
        id: "personal-accident",
        name: "Personal Accident Cover",
        color: "from-purple-600 to-pink-700",
        price: 8000,
        validity: "1 Year",
        desc: "24/7 financial protection against unexpected medical emergencies",
    },
];

export const Insurance = () => {
    const [policy, setPolicy] = useState(INSURANCE_POLICIES[0]);
    const [step, setStep] = useState(1);

    // Personal & Vehicle form data
    const [insuredName, setInsuredName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [plateNumber, setPlateNumber] = useState("");
    const [chassisNumber, setChassisNumber] = useState("");
    const [engineCapacity, setEngineCapacity] = useState("2.0L");
    const [vehicleMake, setVehicleMake] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [vehicleColor, setVehicleColor] = useState("");
    const [yearOfMake, setYearOfMake] = useState("2020");
    const [state, setState] = useState("Lagos");
    const [lga, setLga] = useState("Ikeja");

    // PIN Modal
    const [showPinModal, setShowPinModal] = useState(false);
    const [pin, setPin] = useState("");
    const [processing, setProcessing] = useState(false);

    // Success
    const [purchaseSuccess, setPurchaseSuccess] = useState(null);

    const handleNextStep = (e) => {
        e.preventDefault();
        if (!insuredName || !phoneNumber || !email) {
            toast.error("Please fill in all personal details");
            return;
        }
        setStep(2);
    };

    const handleInitiateInsurance = (e) => {
        e.preventDefault();
        if (!plateNumber || !vehicleMake || !vehicleModel) {
            toast.error("Please complete the vehicle details");
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
                providerId: policy.id,
                billersCode: plateNumber.trim() || phoneNumber.trim(),
                variationCode: policy.id,
                phoneNumber: phoneNumber.trim(),
                insuredName: insuredName.trim(),
                email: email.trim(),
                plateNumber: plateNumber.trim(),
                chassisNumber: chassisNumber.trim() || "N/A",
                engineCapacity,
                vehicleMake: vehicleMake.trim(),
                vehicleModel: vehicleModel.trim(),
                vehicleColor: vehicleColor.trim() || "Black",
                yearOfMake,
                state,
                lga,
                pin,
            };

            const response = await buyInsurance(payload);

            toast.success(response.message || "Insurance policy registered successfully!");
            setPurchaseSuccess(response.data || response);
            setShowPinModal(false);
            setPin("");
        } catch (error) {
            console.error("Insurance purchase error:", error);
            const msg = error.response?.data?.message || error.message || "Insurance registration failed.";
            toast.error(msg);
        } finally {
            setProcessing(false);
        }
    };

    const resetForm = () => {
        setPurchaseSuccess(null);
        setStep(1);
        setPlateNumber("");
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
                                <FaShieldAlt className="text-blue-600" /> Digital Insurance
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Instant NIID-verified motor, health, and personal accident insurance certificates
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
                            <h2 className="text-2xl font-bold text-slate-900">Policy Issued!</h2>
                            <p className="text-slate-500 text-sm">
                                Your certificate of insurance has been generated and uploaded to the NIID database.
                            </p>
                        </div>

                        <div className="mt-6 bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100 text-sm">
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Policy Type</span>
                                <span className="font-semibold text-slate-800">{policy.name}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Insured Name</span>
                                <span className="font-semibold text-slate-800">{insuredName}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Plate Number</span>
                                <span className="font-semibold text-slate-800 font-mono">{plateNumber.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Premium Paid</span>
                                <span className="font-bold text-slate-900 text-base">₦{Number(policy.price).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-slate-500">Policy / Certificate Ref</span>
                                <span className="font-mono text-xs text-slate-600">
                                    {purchaseSuccess.certificateNo || purchaseSuccess.reference || "INS-" + Date.now()}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <button
                                onClick={resetForm}
                                className="flex-1 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition text-center shadow-md shadow-blue-600/20"
                            >
                                Register Another Policy
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
                    /* ================= REGISTRATION FORM ================= */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                            {/* Step Indicators */}
                            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className={`flex items-center gap-2 text-sm font-bold ${
                                        step === 1 ? "text-blue-600" : "text-slate-400"
                                    }`}
                                >
                                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                                        step === 1 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                                    }`}>1</span>
                                    Policy & Personal Details
                                </button>
                                <span className="text-slate-300">/</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (insuredName && phoneNumber && email) setStep(2);
                                    }}
                                    className={`flex items-center gap-2 text-sm font-bold ${
                                        step === 2 ? "text-blue-600" : "text-slate-400"
                                    }`}
                                >
                                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                                        step === 2 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                                    }`}>2</span>
                                    Vehicle & Location
                                </button>
                            </div>

                            {step === 1 ? (
                                <form onSubmit={handleNextStep} className="space-y-6">
                                    {/* Policy Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                                            Select Insurance Policy
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {INSURANCE_POLICIES.map((p) => {
                                                const isSelected = policy.id === p.id;
                                                return (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        onClick={() => setPolicy(p)}
                                                        className={`p-4 rounded-2xl border text-left transition flex items-start justify-between ${
                                                            isSelected
                                                                ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20"
                                                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        <div>
                                                            <span className="font-bold text-sm text-slate-900">{p.name}</span>
                                                            <p className="text-[11px] text-slate-500 mt-1">{p.desc}</p>
                                                        </div>
                                                        <span className="font-extrabold text-blue-700 text-sm">
                                                            ₦{p.price.toLocaleString()}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Personal Info */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                                Full Name of Insured
                                            </label>
                                            <input
                                                type="text"
                                                value={insuredName}
                                                onChange={(e) => setInsuredName(e.target.value)}
                                                placeholder="e.g. John Doe"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                                Email Address (for e-Certificate)
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="e.g. john@example.com"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                                                required
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                placeholder="e.g. 08012345678"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-base shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition"
                                    >
                                        Proceed to Vehicle Details &rarr;
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleInitiateInsurance} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                                Vehicle License Plate Number
                                            </label>
                                            <input
                                                type="text"
                                                value={plateNumber}
                                                onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                                                placeholder="e.g. KSF-123-AB"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono font-bold text-slate-800 uppercase"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                                Chassis Number / VIN
                                            </label>
                                            <input
                                                type="text"
                                                value={chassisNumber}
                                                onChange={(e) => setChassisNumber(e.target.value.toUpperCase())}
                                                placeholder="e.g. 4T1BE32K..."
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-slate-800 uppercase"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                                Vehicle Make
                                            </label>
                                            <input
                                                type="text"
                                                value={vehicleMake}
                                                onChange={(e) => setVehicleMake(e.target.value)}
                                                placeholder="e.g. Toyota, Honda, Lexus"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                                Vehicle Model
                                            </label>
                                            <input
                                                type="text"
                                                value={vehicleModel}
                                                onChange={(e) => setVehicleModel(e.target.value)}
                                                placeholder="e.g. Corolla, Civic, RX350"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                                Vehicle Color
                                            </label>
                                            <input
                                                type="text"
                                                value={vehicleColor}
                                                onChange={(e) => setVehicleColor(e.target.value)}
                                                placeholder="e.g. Silver, Black, White"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                                                State / LGA
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    value={state}
                                                    onChange={(e) => setState(e.target.value)}
                                                    placeholder="State"
                                                    className="w-full px-3 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={lga}
                                                    onChange={(e) => setLga(e.target.value)}
                                                    placeholder="LGA"
                                                    className="w-full px-3 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="py-4 px-6 rounded-2xl border border-slate-200 text-slate-700 font-semibold"
                                        >
                                            &larr; Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 hover:from-blue-700 hover:to-indigo-800 transition flex items-center justify-center gap-2"
                                        >
                                            <FaShieldAlt /> Pay Premium (₦{policy.price.toLocaleString()})
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl">
                                        <FaFileContract />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-medium">Selected Policy</p>
                                        <h3 className="font-bold text-lg">{policy.name.split(" ")[0]} Insurance</h3>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-700/60">
                                    <p>• Verified instantly by Nigerian Insurance Industry Database (NIID)</p>
                                    <p>• Protects against VIO and Police road inspections</p>
                                    <p>• PDF certificate delivered immediately via email</p>
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
                                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                                    <FaLock />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Authorize Insurance Purchase</h3>
                                <p className="text-xs text-slate-500">
                                    Enter your 4-digit transaction PIN to issue policy
                                </p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100 text-xs text-slate-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Policy:</span>
                                    <span className="font-bold text-slate-800">{policy.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Plate No:</span>
                                    <span className="font-bold text-slate-800 uppercase font-mono">{plateNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Premium:</span>
                                    <span className="font-bold text-blue-700 text-sm">₦{Number(policy.price).toLocaleString()}</span>
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
                                    className="w-full text-center text-3xl tracking-[1em] py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
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
                                        className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold text-sm shadow-md hover:from-blue-700 hover:to-indigo-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {processing ? (
                                            <>
                                                <FaSpinner className="animate-spin" /> Issuing...
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

export default Insurance;
