import { FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Success() {

    const navigate = useNavigate();

    return (

        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">

            <div className="w-full max-w-md">

                <div className="bg-white rounded-3xl shadow-xl p-8 text-center">

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

                    <h1 className="text-3xl font-bold text-slate-900 mt-6">
                        Payment not completed
                    </h1>

                    <p className="text-slate-500 mt-3">
                        Your wallet funding payment is not completed
                    </p>

                    <div className="
                        mt-6
                        rounded-2xl
                        bg-green-50
                        border
                        border-green-200
                        p-5
                    ">

                        <p className="text-sm text-green-700">
                            Wallet Funding
                        </p>

                        <h2 className="
                            text-3xl
                            font-bold
                            text-green-700
                            mt-1
                        ">
                            Payment Cancelled
                        </h2>

                    </div>

                    <p className="text-sm text-slate-500 mt-5">
                        Your wallet balance is not funded
                    </p>

                    <button
                        onClick={() => navigate("/user/dashboard")}
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
