import { useSelector } from "react-redux";
import { WalletInformation } from "../../components/dashboard/WalletInformation";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FaBolt, FaCheckCircle, FaInfoCircle, FaPaperPlane, FaPlus, FaShieldAlt, FaWallet } from "react-icons/fa";

export const Wallet = () => {

    const transactions = useSelector(
        (state) => state.transactions.transactions
    );

    const filteredTransactions = transactions.filter(
        (transaction) => {
            return true;
        }
    );

    const totalTransactions = filteredTransactions.length;

    const totalCredits = filteredTransactions
        .filter(
            (transaction) => transaction.type === "credit"
        )
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount || 0),
            0
        );

    const totalDebits = filteredTransactions
        .filter(
            (transaction) => transaction.type === "debit"
        )
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount || 0),
            0
        );

    return (
        <>

            <DashboardLayout>

                {/* Your statistics */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                        <p className="text-sm text-slate-500">
                            Transactions
                        </p>

                        <h3 className="text-2xl font-bold mt-1">
                            {totalTransactions}
                        </h3>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                        <p className="text-sm text-slate-500">
                            Total Credits
                        </p>

                        <h3 className="text-2xl font-bold text-green-600 mt-1">
                            +₦{totalCredits.toLocaleString("en-NG")}
                        </h3>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                        <p className="text-sm text-slate-500">
                            Total Debits
                        </p>

                        <h3 className="text-2xl font-bold text-red-600 mt-1">
                            -₦{totalDebits.toLocaleString("en-NG")}
                        </h3>
                    </div>

                </div>

                <WalletInformation />

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">

                        <div className="
                            w-12 h-12 rounded-xl
                            bg-green-100 text-green-600
                            flex items-center justify-center
                        ">
                            <FaCheckCircle />
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Wallet Status
                            </p>

                            <h3 className="font-semibold text-slate-800">
                                Active
                            </h3>

                            <p className="text-xs text-slate-500 mt-1">
                                Your wallet is ready for transactions
                            </p>
                        </div>

                    </div>
                </div>

                {/* Secure wallet */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">

                        <div className="
                            w-12 h-12 rounded-xl
                            bg-blue-100 text-blue-600
                            flex items-center justify-center
                        ">
                            <FaShieldAlt />
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Wallet Security
                            </p>

                            <h3 className="font-semibold text-slate-800">
                                Protected
                            </h3>

                            <p className="text-xs text-slate-500 mt-1">
                                Your wallet is secured with encryption
                            </p>
                        </div>

                    </div>
                </div>

                {/* Quic Transfer */}

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">

                    <div className="flex items-center gap-3 mb-4">
                        <div className="
                            w-10 h-10 rounded-xl
                            bg-purple-100 text-purple-600
                            flex items-center justify-center
                        ">
                            <FaPaperPlane />
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Send Money
                            </h3>

                            <p className="text-sm text-slate-500">
                                Transfer funds securely
                            </p>
                        </div>
                    </div>

                    <button className="
                        w-full
                        bg-slate-900
                        text-white
                        py-3
                        rounded-xl
                        font-medium
                        hover:bg-slate-800
                        transition
                    ">
                        Make a Transfer
                    </button>

                </div>

                {/* Add money */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">

                    <div className="flex items-center gap-3 mb-4">

                        <div className="
                            w-10 h-10 rounded-xl
                            bg-green-100 text-green-600
                            flex items-center justify-center
                        ">
                            <FaPlus />
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Fund Wallet
                            </h3>

                            <p className="text-sm text-slate-500">
                                Add money to your wallet
                            </p>
                        </div>

                    </div>

                    <button className="
                        w-full
                        border
                        border-slate-200
                        text-slate-700
                        py-3
                        rounded-xl
                        font-medium
                        hover:bg-slate-50
                        transition
                    ">
                        Add Money
                    </button>

                </div>

                {/* Information */}

                <div className="
                    mt-5
                    flex items-start gap-3
                    rounded-xl
                    bg-blue-50
                    p-4
                    text-blue-700
                ">
                    <FaInfoCircle className="mt-1" />

                    <p className="text-sm">
                        Use your account number to receive money
                        directly into your wallet.
                    </p>
                </div>

                {/* Wallet benefit */}

                <div className="mt-6">

                    <h3 className="text-lg font-bold mb-4">
                        Your Wallet
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div className="bg-white rounded-2xl p-5 border border-slate-100">

                            <FaBolt className="text-yellow-500 text-xl mb-3" />

                            <h4 className="font-semibold">
                                Fast Transfers
                            </h4>

                            <p className="text-sm text-slate-500 mt-1">
                                Send money quickly and securely to
                                other accounts.
                            </p>

                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-slate-100">

                            <FaShieldAlt className="text-blue-600 text-xl mb-3" />

                            <h4 className="font-semibold">
                                Secure Payments
                            </h4>

                            <p className="text-sm text-slate-500 mt-1">
                                Your transactions are protected with
                                multiple security measures.
                            </p>

                        </div>

                        <div className="bg-white rounded-2xl p-5 border border-slate-100">

                            <FaWallet className="text-green-600 text-xl mb-3" />

                            <h4 className="font-semibold">
                                Easy Access
                            </h4>

                            <p className="text-sm text-slate-500 mt-1">
                                Manage your funds and account details
                                from one place.
                            </p>

                        </div>

                    </div>

                </div>

            </DashboardLayout>
        </>
    );
};