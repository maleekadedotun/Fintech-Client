import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { lookupAccount } from "../../features/transactions/transactionService";
import TransferConfirmationModal from "../../components/modals/TransferConfirmationModal";
import { useDispatch, useSelector } from "react-redux";
import { transferFailure, transferStart, transferSuccess } from "../../features/transfer/transferSlice";
import { transferFunds } from "../../features/transfer/transferService";
import { fetchTransactions } from "../../features/transactions/transactionSlice";

function Transfer() {
    // dispatch
    const dispatch = useDispatch();

    const [accountInfo, setAccountInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lookupError, setLookupError] = useState("");
    const [showModal, setShowModal] = useState(false);


    const { loading: transferLoading, } = useSelector((state) => state.transfer);

    console.log(
        "TRANSFER LOADING:",
        transferLoading
    );


    const resolveAccount = async () => {

        try {

            setLoading(true);
            setLookupError("");

            const response = await lookupAccount(accountNumber);

            setAccountInfo(response.data);

        }

        catch (error) {
            setAccountInfo(null);

            setLookupError(
                error.response?.data?.message ||
                "Unable to verify account"
            );
            console.log("Entire Error:", error);

            console.log("Status:", error.response?.status);

            console.log("Response:", error.response?.data);

            console.log("Message:", error.message);

            // setAccountInfo(null);

            setAccountInfo(null);

        }

        finally {

            setLoading(false);

        }

    };

    // confrim transaction
    // const confirmTransfer = async (transactionPin) => {

    //     dispatch(transferStart());

    //     try {

    //         const payload = {
    //             accountNumber: watch("accountNumber"),
    //             amount: watch("amount"),
    //             narration: watch("narration"),
    //             transactionPin,
    //         };

    //         console.log("Transfer payload:", payload);

    //         const response = await transferFunds(payload);

    //         dispatch(transferSuccess(response));

    //         setShowModal(false);
    //         reset();

    //         toast.success(
    //             response?.message ||
    //             "Transaction successful"
    //         );

    //     } catch (error) {

    //         console.log("Transfer error:", error.response?.data);
    //         const message = error.response?.data?.message || "Transaction failed";

    //         // dispatch(
    //         //     transferFailure(
    //         //         error.response?.data?.message ||
    //         //         "Transfer failed"
    //         //     )
    //         // );
    //         dispatch(
    //             transferFailure(message)
    //         );
    //         toast.error(message);

    //     }

    // };

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

            // Update transfer Redux
            dispatch(transferSuccess(response));

            // Get the latest transactions
            dispatch(fetchTransactions());

            setShowModal(false);
            reset();

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

    const {

        register,

        handleSubmit,
        watch,
        reset,
        formState: { errors },

    } = useForm();

    const accountNumber = watch("accountNumber");

    useEffect(() => {

        if (accountNumber?.length === 10) {

            resolveAccount();

        } else {

            setAccountInfo(null);
            setLookupError("");

        }

    }, [accountNumber]);


    const onSubmit = (data) => {

        console.log(data);
        setShowModal(true);

    };

    // const confirmTransfer = async (transactionPin) => {

    //     // onConfirm(transactionPin)
    //     dispatch(transferStart());

    //     try {

    //         const payload = {

    //             accountNumber: watch("accountNumber"),

    //             amount: watch("amount"),

    //             narration: watch("narration"),

    //             transactionPin: transactionPin,

    //         };

    //         const response = await transferFunds(payload);

    //         dispatch(transferSuccess(response));

    //         setShowModal(false);

    //     } catch (error) {

    //         dispatch(
    //             transferFailure(
    //                 error.response?.data?.message
    //             )
    //         );

    //     }

    // };

    return (

        <div className="max-w-xl mx-auto">

            <div className="bg-white rounded-3xl shadow-sm p-8">

                <h2 className="text-3xl font-bold mb-8">

                    Send Money

                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >

                    <div>

                        <label>

                            Recipient Account Number

                        </label>

                        <input

                            {...register("accountNumber", {
                                required: "Account number is required",
                                minLength: {
                                    value: 10,
                                    message: "Account number must be 10 digits",
                                },
                                maxLength: {
                                    value: 10,
                                    message: "Account number must be 10 digits",
                                },
                            })}

                            className="w-full border rounded-xl p-4 mt-2"

                            placeholder="9139973832"

                        />

                        {errors.accountNumber && (

                            <p className="mt-2 text-red-600 text-sm">

                                {errors.accountNumber.message}

                            </p>

                        )}

                        {/* {loading && (

                            <p className="text-blue-600 mt-2">

                                Looking up account...

                            </p>

                        )} */}

                        {lookupError && (

                            <div className="mt-3 rounded-xl border border-red-200 bg-red-50  p-4">

                                <p className="text-red-700 font-medium">

                                    {lookupError}

                                </p>

                            </div>

                        )}

                        {loading && (
                            <div className="flex items-center gap-2 mt-2 text-blue-600">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <span>Looking up account...</span>
                            </div>
                        )}

                        {accountInfo && (

                            <div className="mt-3 rounded-xl bg-green-50 border border-green-200 p-4">


                                <h3 className="font-bold">

                                    {accountInfo.accountName}

                                </h3>

                                <p>

                                    {accountInfo.bankName}

                                </p>

                            </div>

                        )}

                    </div>

                    <div>

                        <label>

                            Amount

                        </label>

                        <input

                            type="number"

                            {...register("amount", {
                                required: "Amount is required",
                                min: {
                                    value: 100,
                                    message: "Minimum transfer is ₦100",
                                },
                            })}

                            className="w-full border rounded-xl p-4 mt-2"

                            placeholder="5000"

                        />

                        {errors.amount && (

                            <p className="mt-2 text-red-600 text-sm">

                                {errors.amount.message}

                            </p>

                        )}

                    </div>

                    <div>

                        <label>

                            Narration

                        </label>

                        <textarea

                            {...register("narration", {
                                required: "Narration is required",
                                maxLength: {
                                    value: 100,
                                    message: "Narration cannot exceed 100 characters",
                                },
                            })}

                            rows="4"

                            className="w-full border rounded-xl p-4 mt-2"

                            placeholder="Payment"

                        />

                        {errors.narration && (

                            <p className="mt-2 text-red-600 text-sm">

                                {errors.narration.message}

                            </p>

                        )}

                    </div>

                    {/* <button

                        className="
                            w-full

                            bg-blue-700

                            text-white

                            rounded-xl

                            py-4

                            font-semibold

                            hover:bg-blue-800
                        "

                    >

                        Transfer

                    </button> */}

                    <button

                        disabled={!accountInfo || loading}

                        className={`
                            w-full
                            rounded-xl
                            py-4
                            font-semibold
                            transition

                            ${accountInfo
                                ? "bg-blue-700 text-white hover:bg-blue-800"
                                : "bg-slate-300 text-slate-500 cursor-not-allowed"
                            }
                        `}

                    >

                        Transfer

                    </button>

                </form>

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

        </div>

    );

}

export default Transfer;