import { FaCheckCircle, FaArrowLeft, FaTimesCircle } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPayment } from "../../features/payment/paymentService";
import { getWalletBalance } from "../../features/transactions/transactionService";
import { useEffect, useState } from "react";



function Success() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const amount = searchParams.get("amount");

    const sessionId = searchParams.get("session_id");
    const [loading, setLoading] = useState(true);
    const [payment, setPayment] = useState(null);
    const [error, setError] = useState("");
    const [wallet, setWallet] = useState(null);
    // const [payment, setPayment] = useState(null);



    useEffect(() => {
        const verify = async () => {
            if (!sessionId) {
                setError("Payment session ID is missing.");
                setLoading(false); return;
            }

            try {
                console.log("Verifying payment session:", sessionId);
                const response = await verifyPayment(sessionId);
                console.log("Payment verification response:", response);

                setPayment(response.data);

                // const walletResponse = await getWalletBalance();

                // console.log(
                //     "Updated wallet:",
                //     walletResponse
                // );

                // setWallet(walletResponse);
                let walletResponse;

                for (let attempt = 1; attempt <= 5; attempt++) {

                    walletResponse = await getWalletBalance();

                    console.log(
                        `Wallet check ${attempt}:`,
                        walletResponse
                    );

                    setWallet(walletResponse);

                    // Stop checking once the wallet has been updated
                    if (
                        walletResponse?.balance >=
                        Number(response.data.amount)
                    ) {
                        break;
                    }

                    // Wait 1 second before checking again
                    await new Promise(resolve =>
                        setTimeout(resolve, 1000)
                    );
                }
                setPayment(response.data);
            }
            catch (error) {
                console.error("Payment verification error:",
                    error.response?.data || error.message);
                setError(error.response?.data?.message || "Unable to verify payment.");
            }
            finally {
                setLoading(false);
            }
        }; verify();
    }, [sessionId]);

    if (loading) {
        return (
            <div className=" min-h-screen bg-slate-50 flex items-center justify-center p-4 ">
                <div className=" bg-white rounded-3xl shadow-xl p-8 text-center w-full max-w-md ">
                    <div className=" w-16 h-16 mx-auto border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin " />
                    <h1 className=" text-2xl font-bold mt-6 "> Verifying Payment </h1> <p className=" text-slate-500 mt-2 ">
                        Please wait while we confirm your payment. </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className=" min-h-screen bg-slate-50 flex items-center justify-center p-4 ">
                <div className=" bg-white rounded-3xl shadow-xl p-8 text-center w-full max-w-md ">
                    <div className=" w-20 h-20 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center text-4xl ">
                        <FaTimesCircle />
                    </div>
                    <h1 className=" text-3xl font-bold mt-6 ">
                        Payment Verification Failed
                    </h1>
                    <p className=" text-red-600 mt-3 ">
                        {error}
                    </p>
                    <button
                        onClick={() => navigate("/user/dashboard")}
                        className=" mt-7 w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl py-4 font-semibold " > <FaArrowLeft /> Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // return (

    //     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">

    //         <div className="w-full max-w-md">

    //             <div className="bg-white rounded-3xl shadow-xl p-8 text-center">

    //                 <div className="
    //                     w-20
    //                     h-20
    //                     mx-auto
    //                     rounded-full
    //                     bg-green-100
    //                     text-green-600
    //                     flex
    //                     items-center
    //                     justify-center
    //                     text-4xl
    //                 ">
    //                     <FaCheckCircle />
    //                 </div>

    //                 <h1 className="text-3xl font-bold text-slate-900 mt-6">
    //                     Payment Successful
    //                 </h1>

    //                 <p className="text-slate-500 mt-3">
    //                     Your wallet funding payment was completed successfully.
    //                 </p>

    //                 <div className="
    //                     mt-6
    //                     rounded-2xl
    //                     bg-green-50
    //                     border
    //                     border-green-200
    //                     p-5
    //                 ">

    //                     <p className="text-sm text-green-700">
    //                         Amount Funded
    //                     </p>

    //                     <h2 className="
    //                         text-4xl
    //                         font-bold
    //                         text-green-700
    //                         mt-2
    //                     ">
    //                         ₦{Number(amount).toLocaleString()}
    //                     </h2>

    //                 </div>

    //                 {/* <div className="
    //                     mt-6
    //                     rounded-2xl
    //                     bg-green-50
    //                     border
    //                     border-green-200
    //                     p-5
    //                 ">

    //                     <p className="text-sm text-green-700">
    //                         Wallet Funding
    //                     </p>

    //                     <h2 className="
    //                         text-3xl
    //                         font-bold
    //                         text-green-700
    //                         mt-1
    //                     ">
    //                         Payment Completed
    //                     </h2>

    //                 </div> */}

    //                 <p className="text-sm text-slate-500 mt-5">
    //                     Your wallet balance is being updated.
    //                 </p>

    //                 <button
    //                     onClick={() => navigate("/user/dashboard")}
    //                     className="
    //                         mt-7
    //                         w-full
    //                         flex
    //                         items-center
    //                         justify-center
    //                         gap-2
    //                         bg-blue-700
    //                         hover:bg-blue-800
    //                         text-white
    //                         rounded-xl
    //                         py-4
    //                         font-semibold
    //                         transition
    //                     "
    //                 >
    //                     <FaArrowLeft />
    //                     Back to Dashboard
    //                 </button>

    //             </div>

    //         </div>

    //     </div>

    // );

    return (

        <div className="
        min-h-screen
        bg-slate-50
        flex
        items-center
        justify-center
        p-4
    ">

            <div className="w-full max-w-md">

                <div className="
                bg-white
                rounded-3xl
                shadow-xl
                p-8
                text-center
            ">

                    <div className="
                    w-20
                    h-20
                    mx-auto
                    rounded-full
                    bg-green-100
                    text-green-600
                    flex
                    items-center
                    justify-center
                    text-4xl
                ">

                        <FaCheckCircle />

                    </div>

                    <h1 className="
                    text-3xl
                    font-bold
                    text-slate-900
                    mt-6
                ">

                        Payment Successful

                    </h1>

                    <p className="
                        text-slate-500
                        mt-3
                    ">

                        Your payment has been successfully verified.

                    </p>

                    <div className="
                        mt-6
                        rounded-2xl
                        bg-green-50
                        border
                        border-green-200
                        p-5
                   ">

                        <p className="
                        text-sm
                        text-green-700
                    ">

                            Amount Funded

                        </p>

                        <h2 className="
                        text-4xl
                        font-bold
                        text-green-700
                        mt-2
                    ">

                            ₦{Number(
                                payment?.amount || 0
                            ).toLocaleString()}

                        </h2>

                    </div>

                    <div className="
                    mt-5
                    text-sm
                    text-slate-500
                ">

                        <p>
                            Payment Status:
                            <span className="
                            ml-2
                            font-semibold
                            text-green-600
                        ">
                                {payment?.status}
                            </span>
                        </p>

                        <p className="mt-2">
                            Reference:
                        </p>

                        <p className="
                        mt-1
                        break-all
                        font-mono
                        text-xs
                        text-slate-600
                    ">
                            {payment?.sessionId}
                        </p>

                    </div>

                    <div className="mt-4 rounded-2xl bg-blue-50 p-5">
                        <p className="text-sm text-blue-700">
                            New Wallet Balance
                        </p>

                        <h2 className="text-3xl font-bold text-blue-700 mt-1">
                            ₦{Number(wallet?.balance || 0).toLocaleString()}
                        </h2>
                    </div>

                    <button
                        onClick={() =>
                            navigate("/user/dashboard")
                        }
                        className="
                        mt-7
                        w-full
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-blue-700
                        hover:bg-blue-800
                        text-white
                        rounded-xl
                        py-4
                        font-semibold
                        transition
                    "
                    >

                        <FaArrowLeft />

                        Back to Dashboard

                    </button>

                </div>

            </div>

        </div>

    );


}

export default Success;
