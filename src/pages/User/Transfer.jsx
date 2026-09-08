import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
    FaArrowRight,
    FaCheckCircle,
    FaExchangeAlt,
    FaMoneyBillWave,
    FaUser,
    FaWallet,
    FaShieldAlt,
    FaUniversity,
    FaFileInvoiceDollar,
} from "react-icons/fa";

import { lookupAccount } from "../../features/transactions/transactionService";
import TransferConfirmationModal from "../../components/modals/TransferConfirmationModal";

import { useDispatch, useSelector } from "react-redux";

import {
    transferFailure,
    transferStart,
    transferSuccess,
} from "../../features/transfer/transferSlice";

import { transferFunds } from "../../features/transfer/transferService";
import { fetchTransactions } from "../../features/transactions/transactionSlice";

function Transfer() {
    const dispatch = useDispatch();

    const [accountInfo, setAccountInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lookupError, setLookupError] = useState("");
    const [showModal, setShowModal] = useState(false);

    const { loading: transferLoading } = useSelector(
        (state) => state.transfer
    );

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const accountNumber = watch("accountNumber");
    const amount = watch("amount");
    const narration = watch("narration");

    // --------------------------------
    // Account Lookup
    // --------------------------------
    const resolveAccount = async () => {
        try {
            setLoading(true);
            setLookupError("");
            setAccountInfo(null);

            const response = await lookupAccount(accountNumber);

            setAccountInfo(response.data);
        } catch (error) {
            setAccountInfo(null);

            setLookupError(
                error.response?.data?.message ||
                "Unable to verify this account"
            );

            console.log("Account lookup error:", error);
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------
    // Automatically verify account
    // --------------------------------
    useEffect(() => {
        if (accountNumber?.length === 10) {
            resolveAccount();
        } else {
            setAccountInfo(null);
            setLookupError("");
        }
    }, [accountNumber]);

    // --------------------------------
    // Submit transfer form
    // --------------------------------
    const onSubmit = () => {
        if (!accountInfo) {
            toast.error("Please verify the recipient account first");
            return;
        }

        setShowModal(true);
    };

    // --------------------------------
    // Confirm transfer
    // --------------------------------
    const confirmTransfer = async (transactionPin) => {
        dispatch(transferStart());

        try {
            const payload = {
                accountNumber: watch("accountNumber"),
                amount: watch("amount"),
                narration: watch("narration"),
                transactionPin,
            };

            console.log("Transfer payload:", payload);

            const response = await transferFunds(payload);

            dispatch(transferSuccess(response));

            dispatch(fetchTransactions());

            setShowModal(false);

            reset();

            setAccountInfo(null);

            toast.success(
                response?.message || "Transaction successful"
            );
        } catch (error) {
            console.log(
                "Transfer error:",
                error.response?.data
            );

            const message =
                error.response?.data?.message ||
                "Transaction failed";

            dispatch(transferFailure(message));

            toast.error(message);
        }
    };

    // --------------------------------
    // Quick amount
    // --------------------------------
    const selectAmount = (value) => {
        setValue("amount", value.toString(), {
            shouldValidate: true,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">

            <div className="max-w-3xl mx-auto">

                {/* =========================================
                    HEADER
                ========================================= */}
                <div className="mb-8">

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                w-14
                                h-14
                                rounded-2xl
                                bg-gradient-to-br
                                from-blue-700
                                to-cyan-500
                                flex
                                items-center
                                justify-center
                                text-white
                                text-xl
                                shadow-lg
                                shadow-blue-200
                            "
                        >
                            <FaExchangeAlt />
                        </div>

                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                                Send Money
                            </h1>

                            <p className="text-slate-500 mt-1">
                                Transfer money securely to another account
                            </p>
                        </div>

                    </div>

                </div>


                {/* =========================================
                    MAIN CARD
                ========================================= */}
                <div
                    className="
                        bg-white
                        rounded-3xl
                        border
                        border-slate-100
                        shadow-xl
                        shadow-slate-200/50
                        overflow-hidden
                    "
                >

                    {/* =====================================
                        CARD HEADER
                    ===================================== */}
                    <div
                        className="
                            bg-gradient-to-r
                            from-slate-950
                            via-blue-950
                            to-blue-800
                            px-6
                            sm:px-8
                            py-7
                            text-white
                        "
                    >

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-blue-200 text-sm mb-1">
                                    New Transfer
                                </p>

                                <h2 className="text-2xl font-bold">
                                    Transfer Funds
                                </h2>
                            </div>

                            <div
                                className="
                                    w-12
                                    h-12
                                    rounded-2xl
                                    bg-white/10
                                    backdrop-blur
                                    flex
                                    items-center
                                    justify-center
                                    text-cyan-300
                                    text-xl
                                "
                            >
                                <FaMoneyBillWave />
                            </div>

                        </div>

                    </div>


                    {/* =====================================
                        FORM
                    ===================================== */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-6 sm:p-8 space-y-7"
                    >

                        {/* =================================
                            RECIPIENT ACCOUNT
                        ================================= */}
                        <div>

                            <div className="flex items-center justify-between mb-3">

                                <label className="font-semibold text-slate-800">
                                    Recipient Account
                                </label>

                                <span className="text-xs text-slate-400">
                                    10 digits
                                </span>

                            </div>

                            <div className="relative">

                                <div
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        w-10
                                        h-10
                                        rounded-xl
                                        bg-blue-50
                                        text-blue-600
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <FaUniversity />
                                </div>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={10}
                                    {...register("accountNumber", {
                                        required:
                                            "Account number is required",

                                        minLength: {
                                            value: 10,
                                            message:
                                                "Account number must be 10 digits",
                                        },

                                        maxLength: {
                                            value: 10,
                                            message:
                                                "Account number must be 10 digits",
                                        },

                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message:
                                                "Account number must contain only numbers",
                                        },
                                    })}
                                    className="
                                        w-full
                                        pl-16
                                        pr-12
                                        py-4
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        text-slate-900
                                        font-medium
                                        tracking-wider
                                        outline-none
                                        transition
                                        focus:bg-white
                                        focus:border-blue-500
                                        focus:ring-4
                                        focus:ring-blue-100
                                    "
                                    placeholder="Enter account number"
                                />

                                {loading && (
                                    <div
                                        className="
                                            absolute
                                            right-4
                                            top-1/2
                                            -translate-y-1/2
                                            w-5
                                            h-5
                                            border-2
                                            border-blue-600
                                            border-t-transparent
                                            rounded-full
                                            animate-spin
                                        "
                                    />
                                )}

                                {!loading &&
                                    accountInfo && (
                                        <FaCheckCircle
                                            className="
                                                absolute
                                                right-4
                                                top-1/2
                                                -translate-y-1/2
                                                text-green-500
                                                text-xl
                                            "
                                        />
                                    )}
                            </div>

                            {errors.accountNumber && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.accountNumber.message}
                                </p>
                            )}

                            {/* Looking up */}
                            {loading && (
                                <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">

                                    <span>
                                        Verifying account...
                                    </span>

                                </div>
                            )}

                            {/* Lookup error */}
                            {lookupError && (
                                <div
                                    className="
                                        mt-3
                                        flex
                                        items-start
                                        gap-3
                                        rounded-2xl
                                        border
                                        border-red-200
                                        bg-red-50
                                        px-4
                                        py-3
                                    "
                                >

                                    <div className="text-red-500 mt-0.5">
                                        ⚠
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-red-700">
                                            Account verification failed
                                        </p>

                                        <p className="text-sm text-red-600 mt-1">
                                            {lookupError}
                                        </p>
                                    </div>

                                </div>
                            )}

                            {/* =================================
                                VERIFIED ACCOUNT
                            ================================= */}
                            {accountInfo && (
                                <div
                                    className="
                                        mt-4
                                        rounded-2xl
                                        border
                                        border-green-200
                                        bg-gradient-to-r
                                        from-green-50
                                        to-emerald-50
                                        p-5
                                    "
                                >

                                    <div className="flex items-center justify-between">

                                        <div className="flex items-center gap-4">

                                            <div
                                                className="
                                                    w-12
                                                    h-12
                                                    rounded-full
                                                    bg-green-100
                                                    text-green-600
                                                    flex
                                                    items-center
                                                    justify-center
                                                    text-lg
                                                "
                                            >
                                                <FaUser />
                                            </div>

                                            <div>

                                                <div className="flex items-center gap-2">

                                                    <h3 className="font-bold text-slate-900">
                                                        {accountInfo.accountName}
                                                    </h3>

                                                    <FaCheckCircle className="text-green-500 text-sm" />

                                                </div>

                                                <p className="text-sm text-slate-500 mt-1">
                                                    {accountInfo.bankName}
                                                </p>

                                            </div>

                                        </div>

                                        <span
                                            className="
                                                hidden
                                                sm:inline-flex
                                                items-center
                                                rounded-full
                                                bg-green-100
                                                px-3
                                                py-1
                                                text-xs
                                                font-semibold
                                                text-green-700
                                            "
                                        >
                                            Verified
                                        </span>

                                    </div>

                                </div>
                            )}

                        </div>


                        {/* =================================
                            AMOUNT
                        ================================= */}
                        <div>

                            <label className="block font-semibold text-slate-800 mb-3">
                                Amount
                            </label>

                            <div className="relative">

                                <span
                                    className="
                                        absolute
                                        left-5
                                        top-1/2
                                        -translate-y-1/2
                                        text-xl
                                        font-bold
                                        text-slate-400
                                    "
                                >
                                    ₦
                                </span>

                                <input
                                    type="number"
                                    {...register("amount", {
                                        required:
                                            "Amount is required",

                                        min: {
                                            value: 100,
                                            message:
                                                "Minimum transfer is ₦100",
                                        },
                                    })}
                                    className="
                                        w-full
                                        pl-12
                                        pr-5
                                        py-5
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        text-2xl
                                        font-bold
                                        text-slate-900
                                        outline-none
                                        transition
                                        focus:bg-white
                                        focus:border-blue-500
                                        focus:ring-4
                                        focus:ring-blue-100
                                    "
                                    placeholder="0.00"
                                />

                            </div>

                            {errors.amount && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.amount.message}
                                </p>
                            )}

                            {/* Quick amounts */}
                            <div className="mt-4">

                                <p className="text-xs font-medium text-slate-400 mb-2">
                                    Quick amount
                                </p>

                                <div className="flex flex-wrap gap-2">

                                    {[1000, 5000, 10000, 20000].map(
                                        (value) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() =>
                                                    selectAmount(value)
                                                }
                                                className="
                                                    px-4
                                                    py-2
                                                    rounded-xl
                                                    border
                                                    border-slate-200
                                                    bg-white
                                                    text-sm
                                                    font-semibold
                                                    text-slate-600
                                                    hover:border-blue-400
                                                    hover:text-blue-600
                                                    hover:bg-blue-50
                                                    transition
                                                "
                                            >
                                                ₦
                                                {value.toLocaleString()}
                                            </button>
                                        )
                                    )}

                                </div>

                            </div>

                        </div>


                        {/* =================================
                            NARRATION
                        ================================= */}
                        <div>

                            <div className="flex items-center justify-between mb-3">

                                <label className="font-semibold text-slate-800">
                                    Narration
                                </label>

                                <span className="text-xs text-slate-400">
                                    {narration?.length || 0}/100
                                </span>

                            </div>

                            <div className="relative">

                                <FaFileInvoiceDollar
                                    className="
                                        absolute
                                        left-4
                                        top-5
                                        text-slate-400
                                    "
                                />

                                <textarea
                                    {...register("narration", {
                                        required:
                                            "Narration is required",

                                        maxLength: {
                                            value: 100,
                                            message:
                                                "Narration cannot exceed 100 characters",
                                        },
                                    })}
                                    rows={4}
                                    maxLength={100}
                                    className="
                                        w-full
                                        pl-12
                                        pr-4
                                        py-4
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        text-slate-800
                                        outline-none
                                        resize-none
                                        transition
                                        focus:bg-white
                                        focus:border-blue-500
                                        focus:ring-4
                                        focus:ring-blue-100
                                    "
                                    placeholder="What is this payment for?"
                                />

                            </div>

                            {errors.narration && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.narration.message}
                                </p>
                            )}

                        </div>


                        {/* =================================
                            TRANSFER SUMMARY
                        ================================= */}
                        {(accountInfo || amount) && (
                            <div
                                className="
                                    rounded-2xl
                                    bg-slate-50
                                    border
                                    border-slate-200
                                    p-5
                                "
                            >

                                <div className="flex items-center gap-2 mb-4">

                                    <FaWallet className="text-blue-600" />

                                    <h3 className="font-bold text-slate-800">
                                        Transfer Summary
                                    </h3>

                                </div>

                                <div className="space-y-3">

                                    <div className="flex justify-between gap-4">

                                        <span className="text-sm text-slate-500">
                                            Recipient
                                        </span>

                                        <span className="text-sm font-semibold text-slate-800 text-right">
                                            {accountInfo?.accountName ||
                                                "Not verified"}
                                        </span>

                                    </div>

                                    <div className="flex justify-between gap-4">

                                        <span className="text-sm text-slate-500">
                                            Account
                                        </span>

                                        <span className="text-sm font-semibold text-slate-800">
                                            {accountNumber || "—"}
                                        </span>

                                    </div>

                                    <div className="flex justify-between gap-4">

                                        <span className="text-sm text-slate-500">
                                            Bank
                                        </span>

                                        <span className="text-sm font-semibold text-slate-800 text-right">
                                            {accountInfo?.bankName ||
                                                "—"}
                                        </span>

                                    </div>

                                    <div className="border-t border-slate-200 pt-3 flex justify-between items-center">

                                        <span className="font-semibold text-slate-700">
                                            Amount
                                        </span>

                                        <span className="text-xl font-bold text-blue-700">
                                            ₦
                                            {amount
                                                ? Number(amount).toLocaleString()
                                                : "0"}
                                        </span>

                                    </div>

                                </div>

                            </div>
                        )}


                        {/* =================================
                            SECURITY MESSAGE
                        ================================= */}
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-2xl
                                bg-blue-50
                                border
                                border-blue-100
                                p-4
                            "
                        >

                            <div
                                className="
                                    w-10
                                    h-10
                                    rounded-xl
                                    bg-blue-100
                                    text-blue-600
                                    flex
                                    items-center
                                    justify-center
                                    flex-shrink-0
                                "
                            >
                                <FaShieldAlt />
                            </div>

                            <div>

                                <p className="text-sm font-semibold text-blue-900">
                                    Secure Transfer
                                </p>

                                <p className="text-xs text-blue-700 mt-1">
                                    Your transaction will require your PIN for confirmation.
                                </p>

                            </div>

                        </div>


                        {/* =================================
                            SUBMIT BUTTON
                        ================================= */}
                        <button
                            type="submit"
                            disabled={
                                !accountInfo ||
                                loading ||
                                transferLoading
                            }
                            className={`
                                w-full
                                py-4
                                rounded-2xl
                                font-bold
                                text-lg
                                flex
                                items-center
                                justify-center
                                gap-3
                                transition
                                duration-200
                                ${
                                    accountInfo &&
                                    !loading &&
                                    !transferLoading
                                        ? `
                                            bg-gradient-to-r
                                            from-blue-700
                                            to-cyan-500
                                            text-white
                                            shadow-lg
                                            shadow-blue-200
                                            hover:shadow-xl
                                            hover:-translate-y-0.5
                                          `
                                        : `
                                            bg-slate-200
                                            text-slate-400
                                            cursor-not-allowed
                                          `
                                }
                            `}
                        >

                            <span>
                                Continue to Transfer
                            </span>

                            <FaArrowRight />

                        </button>

                        {!accountInfo && (
                            <p className="text-center text-xs text-slate-400">
                                Enter a valid recipient account number to continue
                            </p>
                        )}

                    </form>

                </div>


                {/* =========================================
                    FOOTER NOTE
                ========================================= */}
                <div className="flex justify-center mt-6">

                    <p className="text-xs text-slate-400 text-center">
                        🔒 Your transaction is protected with secure authentication
                    </p>

                </div>

            </div>


            {/* =============================================
                CONFIRMATION MODAL
            ============================================= */}
            <TransferConfirmationModal
                open={showModal}
                onClose={() => setShowModal(false)}
                account={accountInfo}
                amount={watch("amount")}
                narration={watch("narration")}
                onConfirm={confirmTransfer}
                loading={transferLoading}
            />

        </div>
    );
}

export default Transfer;