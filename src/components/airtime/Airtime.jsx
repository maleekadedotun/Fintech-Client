import { useEffect, useState } from "react";
import {
    FaMobileAlt,
    FaBolt,
    FaHistory,
    FaShieldAlt,
    FaCheck,
} from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";

import {
    airtimeStart,
    airtimeSuccess,
    airtimeFailure,
} from "../../features/airtime/airtimeSlice";

import { buyAirtime, getAirtimeNetworks, } from "../../features/airtime/airtimeService";

import { fetchTransactions } from "../../features/transactions/transactionSlice";
import toast from "react-hot-toast";

export const Airtime = () => {

    // dispatch
    const dispatch = useDispatch();

    const [network, setNetwork] = useState("");
    const [networks, setNetworks] = useState([]);
    const [networksLoading, setNetworksLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [showPinModal, setShowPinModal] = useState(false);
    const [transactionPin, setTransactionPin] = useState("");



    // const payload = {
    //     phoneNumber,
    //     networkId: network,
    //     amount: Number(amount),
    //     transactionPin,
    // };
    // useEffect(() => {
    //     const fetchNetworks = async () => {
    //         setNetworksLoading(true);

    //         try {
    //             const response = await getAirtimeNetworks();

    //             console.log("Airtime networks:", response);

    //             const formattedNetworks = Object.entries(
    //                 response.networks || {}
    //             ).map(([id, name]) => ({
    //                 id: Number(id),
    //                 name,
    //             }));

    //             setNetworks(formattedNetworks);

    //         } catch (error) {
    //             console.error(
    //                 "Failed to fetch airtime networks:",
    //                 error.response?.data || error.message
    //             );

    //             toast.error(
    //                 "Unable to load airtime networks"
    //             );

    //         } finally {
    //             setNetworksLoading(false);
    //         }
    //     };

    //     fetchNetworks();
    // }, []);

    useEffect(() => {
        const fetchNetworks = async () => {
            setNetworksLoading(true);

            try {
                const response = await getAirtimeNetworks();

                console.log("Airtime networks:", response);

                setNetworks(response.networks || []);

            } catch (error) {
                console.error(
                    "Failed to fetch airtime networks:",
                    error.response?.data || error.message
                );

                toast.error("Unable to load airtime networks");

            } finally {
                setNetworksLoading(false);
            }
        };

        fetchNetworks();
    }, []);
    const { loading, error, success, message } = useSelector(
        (state) => state.airtime
    );

    // HandleAirtime
    // const handleBuyAirtime = () => {
    //     if (!network) {
    //         toast.error("Please select a network");
    //         return;
    //     }

    //     if (!phoneNumber) {
    //         toast.error("Please enter phone number");
    //         return;
    //     }

    //     if (phoneNumber.length !== 11) {
    //         toast.error("Enter a valid 11-digit phone number");
    //         return;
    //     }

    //     if (!amount || Number(amount) <= 0) {
    //         toast.error("Please enter a valid amount");
    //         return;
    //     }

    //     setShowPinModal(true);
    // };
    const handleBuyAirtime = () => {

        if (!network) {
            toast.error("Please select a network");
            return;
        }

        if (!phoneNumber) {
            toast.error("Please enter phone number");
            return;
        }

        if (!/^0\d{10}$/.test(phoneNumber)) {
            toast.error(
                "Please enter a valid 11-digit phone number"
            );
            return;
        }

        if (!amount || Number(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        setShowPinModal(true);
    };

    // confirm airtime purchase
    // const confirmAirtimePurchase = async () => {
    //     if (!transactionPin) {
    //         toast.error("Please enter your transaction PIN");
    //         return;
    //     }

    //     dispatch(airtimeStart());

    //     try {
    //         const payload = {
    //             phoneNumber,
    //             networkId: network,
    //             amount: Number(amount),
    //             pin: transactionPin,
    //         };

    //         console.log("Airtime payload:", payload);

    //         const response = await buyAirtime(payload);

    //         console.log("Airtime response:", response);

    //         dispatch(airtimeSuccess(response));

    //         // Refresh transactions
    //         dispatch(fetchTransactions());

    //         setShowPinModal(false);
    //         setTransactionPin("");

    //         setPhoneNumber("");
    //         setAmount("");
    //         setNetwork("");

    //         toast.success(
    //             response?.message ||
    //             "Airtime purchase successful"
    //         );

    //     } catch (error) {

    //         console.log(
    //             "Airtime error:",
    //             error.response?.data
    //         );

    //         const message =
    //             error.response?.data?.message ||
    //             "Airtime purchase failed";

    //         dispatch(airtimeFailure(message));

    //         toast.error(message);
    //     }
    // };

    const confirmAirtimePurchase = async () => {

        if (transactionPin.length !== 4) {
            toast.error(
                "Enter your 4-digit transaction PIN"
            );
            return;
        }

        dispatch(airtimeStart());

        try {

            const payload = {
                phoneNumber,
                // networkId: network,
                networkId: Number(network),
                amount: Number(amount),
                pin: transactionPin,
            };

            console.log(
                "Airtime purchase payload:",
                payload
            );

            const response = await buyAirtime(payload);

            console.log(
                "Airtime purchase response:",
                response
            );

            dispatch(
                airtimeSuccess(response)
            );

            // Refresh transaction Redux
            dispatch(fetchTransactions());

            setShowPinModal(false);

            setTransactionPin("");

            setPhoneNumber("");

            setAmount("");

            setNetwork("");

            toast.success(
                response?.message ||
                "Airtime purchase successful"
            );

        } catch (error) {

            console.error(
                "Airtime purchase error:",
                error.response?.data ||
                error.message
            );

            const message =
                error.response?.data?.message ||
                "Airtime purchase failed";

            dispatch(
                airtimeFailure(message)
            );

            toast.error(message);
        }
    };

    // const networks = [
    //     {
    //         name: "MTN",
    //         value: "mtn",
    //     },
    //     {
    //         name: "Airtel",
    //         value: "airtel",
    //     },
    //     {
    //         name: "Glo",
    //         value: "glo",
    //     },
    //     {
    //         name: "9mobile",
    //         value: "9mobile",
    //     },
    // ];

    // const networks = [
    //     {
    //         id: 1,
    //         name: "MTN",
    //     },
    //     {
    //         id: 2,
    //         name: "Airtel",
    //     },
    //     {
    //         id: 3,
    //         name: "T2",
    //     },
    //     {
    //         id: 4,
    //         name: "Glo",
    //     },
    // ];
    const presetAmounts = [
        100,
        200,
        500,
        1000,
        2000,
        5000,
    ];

    return (
        <DashboardLayout>

            <div className="space-y-6">

                {/* Header */}

                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Buy Airtime
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Recharge your phone instantly across all major
                        Nigerian networks.
                    </p>
                </div>


                {/* Main Grid */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Buy Airtime */}

                    <div className="
                        lg:col-span-2
                        bg-white
                        rounded-3xl
                        shadow-sm
                        border
                        border-slate-100
                        p-6
                    ">

                        {/* Card Header */}

                        <div className="flex items-center gap-4 mb-7">

                            <div className="
                                w-12
                                h-12
                                rounded-2xl
                                bg-blue-100
                                text-blue-600
                                flex
                                items-center
                                justify-center
                            ">
                                <FaMobileAlt />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold">
                                    Airtime Recharge
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Select a network and enter the amount
                                </p>
                            </div>

                        </div>


                        {/* Network */}

                        <div>

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-slate-700
                                mb-3
                            ">
                                Select Network
                            </label>

                            <div className="
                                grid
                                grid-cols-2
                                sm:grid-cols-4
                                gap-3
                            ">

                                {/* {networks.map((item) => (

                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() =>
                                            setNetwork(item.value)
                                        }
                                        className={`
                                            relative
                                            p-4
                                            rounded-2xl
                                            border
                                            text-sm
                                            font-semibold
                                            transition
                                            ${network === item.value
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-slate-200 hover:border-blue-300"
                                            }
                                        `}
                                    >

                                        {network === item.value && (
                                            <FaCheck
                                                className="
                                                    absolute
                                                    top-2
                                                    right-2
                                                    text-blue-600
                                                    text-xs
                                                "
                                            />
                                        )}

                                        {item.name}

                                    </button>

                                ))} */}

                                {/* {networks.map((item) => (

                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() =>
                                            setNetwork(item.id)
                                        }
                                        className={`
                                            relative
                                            p-4
                                            rounded-2xl
                                            border
                                            text-sm
                                            font-semibold
                                            transition

                                            ${network === item.id
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-slate-200 hover:border-blue-300"
                                            }
                                        `}
                                    >

                                        {network === item.id && (
                                            <FaCheck
                                                className="
                                                    absolute
                                                    top-2
                                                    right-2
                                                    text-blue-600
                                                    text-xs
                                                "
                                            />
                                        )}

                                        {item.name}

                                    </button>

                                ))} */}

                                {networks.map((item) => (

                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setNetwork(item.id)}
                                        className={`
                                            relative
                                            p-4
                                            rounded-2xl
                                            border
                                            text-sm
                                            font-semibold
                                            transition

                                            ${network === item.id
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-slate-200 hover:border-blue-300"
                                            }
                                        `}
                                    >

                                        {network === item.id && (
                                            <FaCheck
                                                className="
                                                    absolute
                                                    top-2
                                                    right-2
                                                    text-blue-600
                                                    text-xs
                                                "
                                            />
                                        )}

                                        {item.name}

                                    </button>

                                ))}

                            </div>

                        </div>


                        {/* Phone Number */}

                        <div className="mt-6">

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-slate-700
                                mb-2
                            ">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) =>
                                    setPhoneNumber(e.target.value)
                                }
                                placeholder="08012345678"
                                className="
                                    w-full
                                    px-4
                                    py-3
                                    rounded-xl
                                    border
                                    border-slate-200
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />

                        </div>


                        {/* Amount */}

                        <div className="mt-6">

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-slate-700
                                mb-3
                            ">
                                Select Amount
                            </label>

                            <div className="
                                grid
                                grid-cols-3
                                sm:grid-cols-6
                                gap-3
                            ">

                                {presetAmounts.map((value) => (

                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() =>
                                            setAmount(value)
                                        }
                                        className={`
                                            py-3
                                            rounded-xl
                                            border
                                            font-medium
                                            transition
                                            ${Number(amount) === value
                                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                                : "border-slate-200 hover:border-blue-300"
                                            }
                                        `}
                                    >
                                        ₦{value.toLocaleString()}
                                    </button>

                                ))}

                            </div>

                        </div>


                        {/* Custom Amount */}

                        <div className="mt-5">

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-slate-700
                                mb-2
                            ">
                                Or enter custom amount
                            </label>

                            <div className="relative">

                                <span className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-500
                                ">
                                    ₦
                                </span>

                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(e.target.value)
                                    }
                                    placeholder="Enter amount"
                                    className="
                                        w-full
                                        pl-9
                                        pr-4
                                        py-3
                                        rounded-xl
                                        border
                                        border-slate-200
                                        outline-none
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                    "
                                />

                            </div>

                        </div>


                        {/* Buy Button */}

                        {/* <button
                            type="button"
                            className="
                                w-full
                                mt-7
                                bg-slate-900
                                text-white
                                py-3.5
                                rounded-xl
                                font-semibold
                                hover:bg-slate-800
                                transition
                            "
                        >
                            <span className="flex items-center justify-center gap-2">
                                <FaBolt />
                                Buy Airtime
                            </span>
                        </button> */}
                        <button
                            type="button"
                            onClick={handleBuyAirtime}
                            disabled={loading}
                            className="
                                w-full
                                mt-7
                                bg-slate-900
                                text-white
                                py-3.5
                                rounded-xl
                                font-semibold
                                hover:bg-slate-800
                                transition
                                disabled:opacity-50
                            "
                        >
                            <span className="flex items-center justify-center gap-2">
                                <FaBolt />

                                {loading
                                    ? "Processing..."
                                    : "Buy Airtime"
                                }
                            </span>
                        </button>


                        {/* Security */}

                        <div className="
                            flex
                            items-start
                            gap-3
                            mt-5
                            p-4
                            rounded-xl
                            bg-slate-50
                        ">

                            <FaShieldAlt className="
                                text-blue-600
                                mt-1
                            " />

                            <div>

                                <p className="
                                    text-sm
                                    font-medium
                                    text-slate-700
                                ">
                                    Secure Transaction
                                </p>

                                <p className="
                                    text-xs
                                    text-slate-500
                                    mt-1
                                ">
                                    Your transaction is protected and
                                    requires your transaction PIN.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Recent Purchases */}

                    <div className="
                        bg-white
                        rounded-3xl
                        shadow-sm
                        border
                        border-slate-100
                        p-6
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                            mb-6
                        ">

                            <div className="flex items-center gap-3">

                                <div className="
                                    w-10
                                    h-10
                                    rounded-xl
                                    bg-purple-100
                                    text-purple-600
                                    flex
                                    items-center
                                    justify-center
                                ">
                                    <FaHistory />
                                </div>

                                <div>
                                    <h2 className="font-bold">
                                        Recent Purchases
                                    </h2>

                                    <p className="
                                        text-xs
                                        text-slate-500
                                    ">
                                        Your recent airtime
                                    </p>
                                </div>

                            </div>

                        </div>


                        {/* Empty State */}

                        <div className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            text-center
                            py-12
                        ">

                            <div className="
                                w-16
                                h-16
                                rounded-full
                                bg-slate-100
                                text-slate-400
                                flex
                                items-center
                                justify-center
                                text-xl
                            ">
                                <FaMobileAlt />
                            </div>

                            <h3 className="
                                font-semibold
                                text-slate-700
                                mt-4
                            ">
                                No recent purchases
                            </h3>

                            <p className="
                                text-sm
                                text-slate-500
                                mt-1
                                max-w-xs
                            ">
                                Your airtime purchases will appear
                                here after your first recharge.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* Modal */}
            {showPinModal && (

                <div className="
                    fixed
                    inset-0
                    z-50
                    bg-black/50
                    flex
                    items-center
                    justify-center
                    px-4
                ">

                    <div className="
                        bg-white
                        w-full
                        max-w-md
                        rounded-3xl
                        p-6
                        shadow-xl
                    ">

                        <div className="text-center">

                            <div className="
                                w-14
                                h-14
                                mx-auto
                                rounded-2xl
                                bg-blue-100
                                text-blue-600
                                flex
                                items-center
                                justify-center
                            ">
                                <FaShieldAlt />
                            </div>

                            <h2 className="
                                text-xl
                                font-bold
                                mt-4
                            ">
                                Confirm Airtime Purchase
                            </h2>

                            <p className="
                                text-sm
                                text-slate-500
                                mt-2
                            ">
                                Enter your transaction PIN to
                                complete this purchase.
                            </p>

                        </div>


                        <div className="mt-6">

                            <input
                                type="password"
                                inputMode="numeric"
                                maxLength={4}
                                value={transactionPin}
                                onChange={(e) =>
                                    setTransactionPin(
                                        e.target.value.replace(
                                            /\D/g,
                                            ""
                                        )
                                    )
                                }
                                placeholder="Enter 4-digit PIN"
                                className="
                                    w-full
                                    text-center
                                    tracking-[0.5em]
                                    text-xl
                                    px-4
                                    py-4
                                    rounded-xl
                                    border
                                    border-slate-200
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />

                        </div>


                        <div className="
                            flex
                            gap-3
                            mt-6
                        ">

                            <button
                                type="button"
                                onClick={() => {
                                    setShowPinModal(false);
                                    setTransactionPin("");
                                }}
                                className="
                                    flex-1
                                    py-3
                                    rounded-xl
                                    border
                                    border-slate-200
                                "
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                onClick={
                                    confirmAirtimePurchase
                                }
                                disabled={
                                    transactionPin.length !== 4 ||
                                    loading
                                }
                                className="
                                    flex-1
                                    py-3
                                    rounded-xl
                                    bg-slate-900
                                    text-white
                                    disabled:opacity-50
                                "
                            >
                                {loading
                                    ? "Processing..."
                                    : "Confirm"
                                }
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </DashboardLayout>
    );
};