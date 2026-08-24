import { useEffect, useState } from "react";
import {
    FaWifi,
    FaMobileAlt,
    FaShieldAlt,
    FaCheck,
    FaLock,
} from "react-icons/fa";
// import { buyData } from "../../features/data/dataService";
import { useDispatch, useSelector } from "react-redux";
import {
    purchaseData,
    resetData,
} from "../../features/data/dataSlice";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

export const Data = () => {
    // dispatch
    const dispatch = useDispatch();

    // get data from store
    const {
        loading,
        success,
        message,
        error,
        reference,
    } = useSelector(
        (state) => state.data
    );

    const [network, setNetwork] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [plans, setPlans] = useState([]);

    const [pin, setPin] = useState("");

    // const [loading, setLoading] = useState(false);

    // const [message, setMessage] = useState("");
    // const [error, setError] = useState("");+

    // const handleBuyData = async () => {

    //     setMessage("");
    //     setError("");

    //     if (!network) {
    //         setError("Please select a network");
    //         return;
    //     }

    //     if (!phoneNumber) {
    //         setError("Please enter a phone number");
    //         return;
    //     }

    //     if (phoneNumber.length < 11) {
    //         setError("Please enter a valid phone number");
    //         return;
    //     }

    //     if (!selectedPlan) {
    //         setError("Please select a data plan");
    //         return;
    //     }

    //     if (!pin) {
    //         setError("Please enter your transaction PIN");
    //         return;
    //     }

    //     if (pin.length !== 4) {
    //         setError("Transaction PIN must be 4 digits");
    //         return;
    //     }

    //     try {

    //         setLoading(true);

    //         console.log("DATA PURCHASE PAYLOAD:", {
    //             phoneNumber,
    //             networkId: network,
    //             planId: selectedPlan.id,
    //         });

    //         const response = await buyData({

    //             phoneNumber,

    //             networkId: network,

    //             planId: selectedPlan.id,

    //             pin,

    //         });

    //         console.log(
    //             "DATA PURCHASE RESPONSE:",
    //             response
    //         );

    //         setMessage(
    //             response?.message ||
    //             "Data purchase successful"
    //         );

    //         setPin("");

    //         setSelectedPlan(null);

    //     } catch (error) {

    //         console.error(
    //             "DATA PURCHASE ERROR:",
    //             error.response?.data ||
    //             error.message
    //         );

    //         setError(
    //             error.response?.data?.message ||
    //             "Data purchase failed"
    //         );

    //     } finally {

    //         setLoading(false);

    //     }
    // };

    const handleBuyData = async () => {

        if (!network) {
            return;
        }

        if (!phoneNumber) {
            return;
        }

        if (!selectedPlan) {
            return;
        }

        if (pin.length !== 4) {
            return;
        }


        const result = await dispatch(
            purchaseData({

                phoneNumber,

                networkId: network,

                planId: selectedPlan.id,

                pin,

            })
        );


        if (
            purchaseData.fulfilled.match(result)
        ) {

            setPin("");

            setSelectedPlan(null);

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

    const networks = [
        {
            id: 1,
            name: "MTN",
        },
        {
            id: 2,
            name: "Airtel",
        },
        {
            id: 3,
            name: "Glo",
        },
        {
            id: 4,
            name: "9mobile",
        },
    ];

    // useEffect
    useEffect(() => {
        if (!network) {
            setPlans([]);
            return;
        }

        const fetchPlans = async () => {
            try {
                const response = await api.get(`/data/data-plans/${network}`);

                console.log("NETWORK:", network);
                console.log("PLANS RESPONSE:", response.data);

                setPlans(response.data.plans || []);
            } catch (error) {
                console.error(
                    "Failed to fetch plans:",
                    error.response?.data || error.message
                );

                setPlans([]);
            }
        };

        fetchPlans();
    }, [network]);

    // const plans = [
    //     {
    //         id: 1,
    //         name: "1GB",
    //         validity: "1 Day",
    //         price: 350,
    //     },
    //     {
    //         id: 2,
    //         name: "2GB",
    //         validity: "2 Days",
    //         price: 600,
    //     },
    //     {
    //         id: 3,
    //         name: "5GB",
    //         validity: "7 Days",
    //         price: 1500,
    //     },
    //     {
    //         id: 4,
    //         name: "10GB",
    //         validity: "30 Days",
    //         price: 3000,
    //     },
    // ];

    return (
        <>
            <DashboardLayout>
                <div className="space-y-6">

                    {/* ================= HEADER ================= */}

                    <div>
                        <div className="flex items-center gap-3">

                            <div
                                className="
                            w-12
                            h-12
                            rounded-2xl
                            bg-blue-100
                            text-blue-600
                            flex
                            items-center
                            justify-center
                            text-xl
                        "
                            >
                                <FaWifi />
                            </div>

                            <div>

                                <h1 className="text-2xl font-bold text-slate-900">
                                    Buy Data
                                </h1>

                                <p className="text-slate-500 text-sm mt-1">
                                    Purchase data bundles instantly
                                </p>

                            </div>

                        </div>
                    </div>


                    {/* ================= MAIN CONTENT ================= */}

                    <div
                        className="
                    grid
                    grid-cols-1
                    lg:grid-cols-3
                    gap-6
                "
                    >

                        {/* ================= LEFT CARD ================= */}

                        <div
                            className="
                        lg:col-span-2
                        bg-white
                        rounded-3xl
                        shadow-sm
                        border
                        border-slate-100
                        p-6
                    "
                        >

                            {/* ================= NETWORK ================= */}

                            <div>

                                <div
                                    className="
                                flex
                                items-center
                                justify-between
                                mb-3
                            "
                                >

                                    <label
                                        className="
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                                    >
                                        Select Network
                                    </label>

                                    <span
                                        className="
                                    text-xs
                                    text-slate-400
                                "
                                    >
                                        Required
                                    </span>

                                </div>


                                <div
                                    className="
                                grid
                                grid-cols-2
                                sm:grid-cols-4
                                gap-3
                            "
                                >

                                    {networks.map((item) => (

                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => {
                                                setNetwork(item.id);
                                                setSelectedPlan(null);
                                            }}
                                            className={`
                                        relative
                                        p-4
                                        rounded-2xl
                                        border
                                        font-semibold
                                        transition-all
                                        duration-200
                                        outline-none
                                        focus:outline-none
                                        focus:ring-0

                                        ${network === item.id
                                                    ? `
                                                border-blue-500
                                                bg-blue-50
                                                text-blue-700
                                                shadow-sm
                                            `
                                                    : `
                                                border-slate-200
                                                bg-white
                                                text-slate-700
                                                hover:border-blue-300
                                                hover:bg-slate-50
                                            `
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

                                            <p className="text-sm">
                                                {item.name}
                                            </p>

                                        </button>

                                    ))}

                                </div>

                            </div>


                            {/* ================= PHONE NUMBER ================= */}

                            <div className="mt-6">

                                <label
                                    className="
                                block
                                text-sm
                                font-semibold
                                text-slate-700
                                mb-2
                            "
                                >
                                    Phone Number
                                </label>

                                <div className="relative">

                                    <FaMobileAlt
                                        className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                                    />

                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) =>
                                            setPhoneNumber(e.target.value)
                                        }
                                        placeholder="08134567383"
                                        className="
                                    w-full
                                    pl-11
                                    pr-4
                                    py-3.5
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    text-slate-900
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                    transition
                                "
                                    />

                                </div>

                                <p className="
                            text-xs
                            text-slate-400
                            mt-2
                        ">
                                    Enter the number you want to purchase data for.
                                </p>

                            </div>


                            {/* ================= DATA PLANS ================= */}

                            {/* <div className="mt-7">

                        <div
                            className="
                                flex
                                justify-between
                                items-center
                                mb-3
                            "
                        >

                            <label
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Select Data Plan
                            </label>

                            <span
                                className="
                                    text-xs
                                    font-medium
                                    text-slate-400
                                "
                            >
                                {network
                                    ? network.toUpperCase()
                                    : "Select network"
                                }
                            </span>

                        </div>


                        {!network ? (

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-dashed
                                    border-slate-300
                                    p-8
                                    text-center
                                "
                            >

                                <FaWifi
                                    className="
                                        mx-auto
                                        text-3xl
                                        text-slate-300
                                        mb-3
                                    "
                                />

                                <p className="
                                    text-sm
                                    font-medium
                                    text-slate-600
                                ">
                                    Select a network first
                                </p>

                                <p className="
                                    text-xs
                                    text-slate-400
                                    mt-1
                                ">
                                    Available data plans will appear here.
                                </p>

                            </div>

                        ) : (

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    sm:grid-cols-2
                                    gap-3
                                "
                            >

                                {plans.map((plan) => (

                                    <button
                                        key={plan.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedPlan(plan)
                                        }
                                        className={`
                                            text-left
                                            p-4
                                            rounded-2xl
                                            border
                                            transition-all
                                            duration-200
                                            outline-none
                                            focus:outline-none
                                            focus:ring-0
                                            ${selectedPlan?.id === plan.id
                                                ? `
                                                        border-blue-500
                                                        bg-blue-50
                                                        text-blue-700
                                                        shadow-sm
                                                    `
                                                : `
                                                        border-slate-200
                                                        bg-white
                                                        text-slate-700
                                                        hover:border-blue-300
                                                        hover:bg-slate-50
                                                    `
                                            }
                                        `}
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                            "
                                        >

                                            

                                            <div>

                                                <p
                                                    className="
                                                        text-lg
                                                        font-bold
                                                    "
                                                >
                                                    {plan.name}
                                                </p>

                                                <p
                                                    className="
                                                        text-xs
                                                        text-slate-500
                                                        mt-1
                                                    "
                                                >
                                                    Valid for {plan.validity}
                                                </p>

                                            </div>


                                        

                                            <div className="text-right">

                                                <p
                                                    className="
                                                        font-bold
                                                        text-slate-900
                                                    "
                                                >
                                                    ₦
                                                    {plan.price.toLocaleString()}
                                                </p>

                                                {selectedPlan?.id === plan.id && (
                                                    <FaCheck
                                                        className="
                                                            ml-auto
                                                            mt-2
                                                            text-blue-600
                                                        "
                                                    />
                                                )}

                                            </div>

                                        </div>

                                    </button>

                                ))}

                            </div>

                        )}

                    </div> */}

                            <div className="mt-7">

                                <div
                                    className="
                                flex
                                justify-between
                                items-center
                                mb-3
                            "
                                >

                                    <label
                                        className="
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                                    >
                                        Select Data Plan
                                    </label>

                                    <span
                                        className="
                                    text-xs
                                    font-medium
                                    text-slate-400
                                "
                                    >
                                        {/* {network
                                    ? network.toUpperCase()
                                    : "Select network"
                                } */}
                                        {network
                                            ? networks.find((item) => item.id === network)?.name
                                            : "Select network"
                                        }
                                    </span>

                                </div>


                                {!network ? (

                                    <div
                                        className="
                                    rounded-2xl
                                    border
                                    border-dashed
                                    border-slate-300
                                    p-8
                                    text-center
                                "
                                    >

                                        <FaWifi
                                            className="
                                        mx-auto
                                        text-3xl
                                        text-slate-300
                                        mb-3
                                    "
                                        />

                                        <p
                                            className="
                                        text-sm
                                        font-medium
                                        text-slate-600
                                    "
                                        >
                                            Select a network first
                                        </p>

                                        <p
                                            className="
                                        text-xs
                                        text-slate-400
                                        mt-1
                                    "
                                        >
                                            Available data plans will appear here.
                                        </p>

                                    </div>

                                ) : plans.length === 0 ? (

                                    <div
                                        className="
                                    rounded-2xl
                                    border
                                    border-dashed
                                    border-slate-300
                                    p-8
                                    text-center
                                "
                                    >

                                        <p
                                            className="
                                        text-sm
                                        font-medium
                                        text-slate-500
                                    "
                                        >
                                            No data plans available for this network.
                                        </p>

                                    </div>

                                ) : (

                                    <div
                                        className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                gap-3
                            "
                                    >

                                        {plans
                                            .filter((plan) => Number(plan.price) > 0)
                                            .map((plan) => (

                                                <button
                                                    key={plan.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedPlan(plan)
                                                    }
                                                    className={`
                                                text-left
                                                p-4
                                                rounded-2xl
                                                border
                                                transition-all
                                                duration-200
                                                outline-none
                                                focus:outline-none
                                                focus:ring-0

                                                ${selectedPlan?.id === plan.id
                                                            ? `
                                                    border-blue-500
                                                    bg-blue-50
                                                    text-blue-700
                                                    shadow-sm
                                                `
                                                            : `
                                                    border-slate-200
                                                    bg-white
                                                    text-slate-700
                                                    hover:border-blue-300
                                                    hover:bg-slate-50
                                                `
                                                        }
                                            `}
                                                >

                                                    <div
                                                        className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                "
                                                    >



                                                        <div>

                                                            <p
                                                                className="
                                                            text-lg
                                                            font-bold
                                                        "
                                                            >
                                                                {plan.name}
                                                            </p>

                                                            <p
                                                                className="
                                                            text-xs
                                                            text-slate-500
                                                            mt-1
                                                        "
                                                            >
                                                                Dispense method: {plan.dispense_method}
                                                            </p>

                                                        </div>




                                                        <div className="text-right">

                                                            <p
                                                                className="
                                                            font-bold
                                                            text-slate-900
                                                        "
                                                            >
                                                                ₦{Number(plan.price).toLocaleString()}
                                                            </p>

                                                            {selectedPlan?.id === plan.id && (

                                                                <FaCheck
                                                                    className="
                                                                ml-auto
                                                                mt-2
                                                                text-blue-600
                                                            "
                                                                />

                                                            )}

                                                        </div>

                                                    </div>

                                                </button>

                                            ))}

                                    </div>

                                )}

                            </div>

                            {/* ================= TRANSACTION PIN ================= */}

                            <div className="mt-6">

                                <label
                                    className="
                                block
                                text-sm
                                font-semibold
                                text-slate-700
                                mb-2
                            "
                                >
                                    Transaction PIN
                                </label>

                                <div className="relative">

                                    <FaLock
                                        className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                                    />

                                    <input
                                        type="password"
                                        inputMode="numeric"
                                        maxLength={4}
                                        value={pin}
                                        onChange={(e) => {
                                            const value = e.target.value
                                                .replace(/\D/g, "");

                                            setPin(value);
                                        }}
                                        placeholder="Enter 4-digit PIN"
                                        className="
                                    w-full
                                    pl-11
                                    pr-4
                                    py-3.5
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    text-slate-900
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                                    />

                                </div>

                                <p className="text-xs text-slate-400 mt-2">
                                    Enter your transaction PIN to authorize this purchase.
                                </p>

                            </div>

                            {/* ================= MESSAGE ================= */}

                            {error && (
                                <div
                                    className="
                                mt-5
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                                text-sm
                                text-red-600
                            "
                                >
                                    {error}
                                </div>
                            )}

                            {message && (
                                <div
                                    className="
                                mt-5
                                rounded-xl
                                border
                                border-green-200
                                bg-green-50
                                px-4
                                py-3
                                text-sm
                                text-green-600
                            "
                                >
                                    {message}
                                </div>
                            )}

                            {/* ================= SUCCESS ================= */}

                            {success && (
                                <div
                                    className="
            mt-5
            rounded-xl
            border
            border-green-200
            bg-green-50
            px-4
            py-3
        "
                                >

                                    <p className="
            text-sm
            font-semibold
            text-green-700
        ">
                                        {message}
                                    </p>

                                    {reference && (
                                        <p className="
                text-xs
                text-green-600
                mt-1
            ">
                                            Reference: {reference}
                                        </p>
                                    )}

                                </div>
                            )}


                            {/* ================= ERROR ================= */}

                            {error && (
                                <div
                                    className="
                                mt-5
                                rounded-xl
                                border
                                border-red-200
                                bg-red-50
                                px-4
                                py-3
                            "
                                >

                                    <p className="
                                text-sm
                                font-semibold
                                text-red-600
                            ">
                                        {error}
                                    </p>

                                </div>
                            )}

                            {/* ================= BUY BUTTON ================= */}

                            {/* <button
                        type="button"
                        disabled={
                            !network ||
                            !phoneNumber ||
                            !selectedPlan
                        }
                        className="
                            w-full
                            mt-7
                            bg-slate-900
                            text-white
                            py-4
                            rounded-xl
                            font-semibold
                            transition-all
                            duration-200
                            hover:bg-slate-800
                            active:scale-[0.99]
                            disabled:opacity-40
                            disabled:cursor-not-allowed
                            disabled:hover:bg-slate-900
                        "
                    >
                        {selectedPlan
                            ? `Buy ${selectedPlan.name} for ₦${selectedPlan.price.toLocaleString()}`
                            : "Select a Data Plan"
                        }
                    </button> */}

                            {/* <button
                        type="button"
                        onClick={handleBuyData}
                        disabled={
                            loading ||
                            !network ||
                            !phoneNumber ||
                            !selectedPlan ||
                            pin.length !== 4
                        }
                        className="
                            w-full
                            mt-7
                            bg-slate-900
                            text-white
                            py-4
                            rounded-xl
                            font-semibold
                            transition-all
                            duration-200
                            hover:bg-slate-800
                            active:scale-[0.99]
                            disabled:opacity-40
                            disabled:cursor-not-allowed
                        "
                    >
                        {loading
                            ? "Processing..."
                            : selectedPlan
                                ? `Buy ${selectedPlan.name} for ₦${selectedPlan.price.toLocaleString()}`
                                : "Select a Data Plan"
                        }
                    </button> */}

                            <button
                                type="button"
                                onClick={handleBuyData}
                                disabled={
                                    loading ||
                                    !network ||
                                    !phoneNumber ||
                                    !selectedPlan ||
                                    pin.length !== 4
                                }
                                className="
                            w-full
                            mt-7
                            bg-slate-900
                            text-white
                            py-4
                            rounded-xl
                            font-semibold
                            transition-all
                            duration-200
                            hover:bg-slate-800
                            active:scale-[0.99]
                            disabled:opacity-40
                            disabled:cursor-not-allowed
                        "
                            >
                                {loading
                                    ? "Processing..."
                                    : selectedPlan
                                        ? `Buy ${selectedPlan.name} for ₦${selectedPlan.price.toLocaleString()}`
                                        : "Select a Data Plan"
                                }
                            </button>

                        </div>


                        {/* ================= ORDER SUMMARY ================= */}

                        <div
                            className="
                        bg-slate-900
                        text-white
                        rounded-3xl
                        p-6
                        h-fit
                    "
                        >

                            {/* Summary Header */}

                            <div
                                className="
                            flex
                            items-center
                            gap-3
                        "
                            >

                                <div
                                    className="
                                w-11
                                h-11
                                rounded-xl
                                bg-white/10
                                flex
                                items-center
                                justify-center
                            "
                                >
                                    <FaShieldAlt />
                                </div>

                                <div>

                                    <p className="font-semibold">
                                        Order Summary
                                    </p>

                                    <p
                                        className="
                                    text-xs
                                    text-slate-400
                                    mt-1
                                "
                                    >
                                        Review before payment
                                    </p>

                                </div>

                            </div>


                            {/* Summary Details */}

                            <div
                                className="
                            mt-6
                            space-y-5
                        "
                            >

                                {/* Network */}

                                {/* <div
                            className="
                                flex
                                justify-between
                                items-center
                                text-sm
                            "
                        >

                            <span className="text-slate-400">
                                Network
                            </span>

                            <span className="font-medium">
                                {network
                                    ? network.toUpperCase()
                                    : "-"
                                }
                            </span>

                        </div> */}

                                <div
                                    className="
                                flex
                                justify-between
                                items-center
                                text-sm
                            "
                                >
                                    <span className="text-slate-400">
                                        Network
                                    </span>

                                    <span className="font-medium">
                                        {
                                            networks.find(
                                                (item) => item.id === network
                                            )?.name || "-"
                                        }
                                    </span>
                                </div>

                                {/* Phone */}

                                <div
                                    className="
                                flex
                                justify-between
                                items-center
                                text-sm
                                gap-4
                            "
                                >

                                    <span className="text-slate-400">
                                        Phone
                                    </span>

                                    <span className="font-medium break-all">
                                        {phoneNumber || "-"}
                                    </span>

                                </div>


                                {/* Data */}

                                <div
                                    className="
                                flex
                                justify-between
                                items-center
                                text-sm
                            "
                                >

                                    <span className="text-slate-400">
                                        Data
                                    </span>

                                    <span className="font-medium">
                                        {selectedPlan?.name || "-"}
                                    </span>

                                </div>


                                {/* Validity */}

                                <div
                                    className="
                                flex
                                justify-between
                                items-center
                                text-sm
                            "
                                >

                                    <span className="text-slate-400">
                                        Validity
                                    </span>

                                    <span className="font-medium">
                                        {selectedPlan?.validity || "-"}
                                    </span>

                                </div>

                            </div>


                            {/* Total */}

                            <div
                                className="
                            border-t
                            border-white/10
                            mt-6
                            pt-6
                        "
                            >

                                <div
                                    className="
                                flex
                                justify-between
                                items-end
                            "
                                >

                                    <div>

                                        <p
                                            className="
                                        text-xs
                                        text-slate-400
                                    "
                                        >
                                            Total Amount
                                        </p>

                                        <p
                                            className="
                                        text-2xl
                                        font-bold
                                        mt-1
                                    "
                                        >
                                            ₦
                                            {selectedPlan
                                                ? selectedPlan.price.toLocaleString()
                                                : "0"
                                            }
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* Security */}

                            <div
                                className="
                            mt-6
                            pt-5
                            border-t
                            border-white/10
                        "
                            >

                                <div
                                    className="
                                flex
                                items-center
                                gap-2
                                text-xs
                                text-slate-400
                            "
                                >

                                    <FaShieldAlt />

                                    <span>
                                        Secure wallet payment
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </DashboardLayout>
        </>
    );
};