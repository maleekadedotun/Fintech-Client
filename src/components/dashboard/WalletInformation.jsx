import { useEffect, useState } from "react";
import {
    FaUser,
    FaWallet,
    FaHashtag,
    FaMoneyBillWave,
    FaShieldAlt,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { getWalletBalance } from "../../features/transactions/transactionService";

export function WalletInformation() {

    // const {user} = useSelector(state => state.auth.user)
    const user = useSelector(
        state => state.auth.user
    );

    const [wallet, setWallet] = useState(null);
    const [walletLoading, setWalletLoading] = useState(null);

    const fetchWallet = async () => {
        try {
            setWalletLoading(true);

            const response = await getWalletBalance();

            console.log(
                "Wallet response:",
                response
            );

            setWallet(response);

        } catch (error) {

            console.error(
                "Wallet error:",
                error.response?.data ||
                error.message
            );

        } finally {
            setWalletLoading(false);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    return (

        <div className="bg-white rounded-3xl shadow-sm p-6">

            <div className="mb-6">

                <h2 className="text-2xl font-bold">
                    Wallet Information
                </h2>

                <p className="text-slate-500">
                    Your wallet and account details
                </p>

            </div>


            <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-4
            ">

                {/* Account Name */}

                <div className="
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    bg-slate-50
                    p-4
                ">

                    <div className="
                        w-12
                        h-12
                        rounded-xl
                        bg-blue-100
                        text-blue-600
                        flex
                        items-center
                        justify-center
                    ">
                        <FaUser />
                    </div>

                    <div>

                        <p className="text-sm text-slate-500">
                            Account Name
                        </p>

                        <p className="font-semibold">
                            {user?.name || "-"}
                        </p>

                    </div>

                </div>


                {/* Account Number */}

                <div className="
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    bg-slate-50
                    p-4
                ">

                    <div className="
                        w-12
                        h-12
                        rounded-xl
                        bg-green-100
                        text-green-600
                        flex
                        items-center
                        justify-center
                    ">
                        <FaHashtag />
                    </div>

                    <div>

                        <p className="text-sm text-slate-500">
                            Account Number
                        </p>

                        <p className="font-semibold tracking-wide">
                            {wallet?.accountNumber || "-"}
                        </p>




                    </div>

                </div>


                {/* Currency */}

                <div className="
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    bg-slate-50
                    p-4
                ">

                    <div className="
                        w-12
                        h-12
                        rounded-xl
                        bg-yellow-100
                        text-yellow-600
                        flex
                        items-center
                        justify-center
                    ">
                        <FaMoneyBillWave />
                    </div>

                    <div>

                        <p className="text-sm text-slate-500">
                            Currency
                        </p>

                        <p className="font-semibold">
                            {wallet?.currency || "NGN"}
                        </p>

                    </div>

                </div>


                {/* Wallet Type */}

                <div className="
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    bg-slate-50
                    p-4
                ">

                    <div className="
                        w-12
                        h-12
                        rounded-xl
                        bg-purple-100
                        text-purple-600
                        flex
                        items-center
                        justify-center
                    ">
                        <FaWallet />
                    </div>

                    <div>

                        <p className="text-sm text-slate-500">
                            Wallet Type
                        </p>

                        <p className="font-semibold">
                            NGN Wallet
                        </p>

                    </div>

                </div>


                {/* Security */}

                <div className="
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    bg-slate-50
                    p-4
                ">

                    <div className="
                        w-12
                        h-12
                        rounded-xl
                        bg-slate-200
                        text-slate-700
                        flex
                        items-center
                        justify-center
                    ">
                        <FaShieldAlt />
                    </div>

                    <div>

                        <p className="text-sm text-slate-500">
                            Security
                        </p>

                        <p className="font-semibold">
                            Protected
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}