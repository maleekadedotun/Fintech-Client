import React, { useEffect, useState } from "react";
import {
    FaUserFriends,
    FaPlus,
    FaTrash,
    FaUniversity,
    FaSearch,
    FaSpinner,
    FaTimes,
    FaArrowLeft,
    FaCheckCircle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
    getBeneficiaries,
    saveBeneficiary,
    deleteBeneficiary,
} from "../../features/beneficiary/beneficiaryService";

export const Beneficiaries = () => {
    const navigate = useNavigate();
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Add Modal
    const [showModal, setShowModal] = useState(false);
    const [accountName, setAccountName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [bankName, setBankName] = useState("Fintech Bank");
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const fetchBeneficiaries = async () => {
        setLoading(true);
        try {
            const response = await getBeneficiaries();
            setBeneficiaries(response.beneficiaries || response.data || (Array.isArray(response) ? response : []));
        } catch (error) {
            console.error("Failed to load beneficiaries:", error);
            toast.error("Could not load beneficiaries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBeneficiaries();
    }, []);

    const handleSaveBeneficiary = async (e) => {
        e.preventDefault();
        if (!accountName || !accountNumber) {
            toast.error("Please fill in account details");
            return;
        }

        try {
            setSubmitting(true);
            await saveBeneficiary({
                accountName: accountName.trim(),
                accountNumber: accountNumber.trim(),
                bankName,
            });

            toast.success("Beneficiary saved successfully!");
            setShowModal(false);
            setAccountName("");
            setAccountNumber("");
            fetchBeneficiaries();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save beneficiary");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteBeneficiary = async (id) => {
        if (!window.confirm("Remove this beneficiary from your saved list?")) return;
        try {
            setDeletingId(id);
            await deleteBeneficiary(id);
            toast.success("Beneficiary removed");
            setBeneficiaries((prev) => prev.filter((b) => b._id !== id));
        } catch (error) {
            toast.error("Failed to delete beneficiary");
        } finally {
            setDeletingId(null);
        }
    };

    const filteredBeneficiaries = beneficiaries.filter(
        (b) =>
            b.accountName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.accountNumber?.includes(searchQuery) ||
            b.bankName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                <FaUserFriends className="text-cyan-600" /> Saved Beneficiaries
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Quick access to your regular transfer recipients and bill accounts
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm shadow-md shadow-cyan-600/20 transition"
                    >
                        <FaPlus /> Add Beneficiary
                    </button>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
                    {/* Search bar */}
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-3.5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, bank, or account number..."
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                        />
                    </div>

                    {loading ? (
                        <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                            <FaSpinner className="animate-spin text-2xl text-cyan-600" />
                            <p className="text-sm">Loading beneficiaries...</p>
                        </div>
                    ) : filteredBeneficiaries.length === 0 ? (
                        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl">
                            <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto text-2xl mb-3">
                                <FaUserFriends />
                            </div>
                            <h3 className="font-bold text-slate-800">No Beneficiaries Found</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                                Save frequent bank contacts for fast 1-click transfers without typing account numbers.
                            </p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-700 transition"
                            >
                                <FaPlus /> Add Beneficiary
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredBeneficiaries.map((b) => (
                                <div
                                    key={b._id}
                                    className="p-5 rounded-2xl border border-slate-200 hover:border-cyan-200 hover:shadow-md transition bg-white flex flex-col justify-between space-y-4"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                                                {b.accountName ? b.accountName.charAt(0).toUpperCase() : "B"}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                                                    {b.accountName}
                                                </h4>
                                                <p className="text-xs text-slate-500">{b.bankName || "Fintech Bank"}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDeleteBeneficiary(b._id)}
                                            disabled={deletingId === b._id}
                                            className="text-slate-400 hover:text-red-600 transition p-1"
                                            title="Delete Beneficiary"
                                        >
                                            {deletingId === b._id ? <FaSpinner className="animate-spin text-xs" /> : <FaTrash className="text-xs" />}
                                        </button>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                        <span className="font-mono text-xs font-semibold text-slate-700">
                                            {b.accountNumber}
                                        </span>
                                        <button
                                            onClick={() => navigate("/transfer")}
                                            className="text-xs font-bold text-cyan-600 hover:text-cyan-700"
                                        >
                                            Send Money &rarr;
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Beneficiary Modal */}
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
                                    <FaUserFriends />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Add New Beneficiary</h3>
                                <p className="text-xs text-slate-500">
                                    Save account for quicker transfers
                                </p>
                            </div>

                            <form onSubmit={handleSaveBeneficiary} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Account Holder Name
                                    </label>
                                    <input
                                        type="text"
                                        value={accountName}
                                        onChange={(e) => setAccountName(e.target.value)}
                                        placeholder="e.g. Samuel Okon"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Account Number (10 Digits)
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={10}
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ""))}
                                        placeholder="e.g. 0123456789"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Bank / Institution
                                    </label>
                                    <input
                                        type="text"
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        placeholder="e.g. Fintech Bank, GTBank, Access Bank"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
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
                                        disabled={submitting}
                                        className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold shadow-md shadow-cyan-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? <FaSpinner className="animate-spin" /> : "Save"}
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

export default Beneficiaries;
