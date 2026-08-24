import { useState, useEffect } from "react";
import FundWalletModal from "../modals/FundWalletModal";
import { createCheckoutSession } from "../../features/payment/paymentService";
import { useNavigate } from "react-router-dom";
import {
    FaWallet,
    FaPlus,
    FaExchangeAlt,
    FaCreditCard,
    FaSyncAlt,
    FaEye,
    FaEyeSlash,
    FaCopy,
    FaCheck,
} from "react-icons/fa";

import { useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import { getWalletBalance } from "../../features/wallet/walletService";
import { getWalletBalance } from "../../features/transactions/transactionService";

export function WalletCard() {
    const navigate = useNavigate();

    const [wallet, setWallet] = useState(null);
    const [walletLoading, setWalletLoading] = useState(true);
    const [showFundModal, setShowFundModal] = useState(false);
    const [showBalance, setShowBalance] = useState(false);
    const [copied, setCopied] = useState(false);

    const [funding, setFunding] = useState(false);

    // copied
    const handleCopyAccount = async () => {

        if (!wallet?.accountNumber) {
            return;
        }

        try {

            await navigator.clipboard.writeText(
                wallet.accountNumber
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch (error) {

            console.error(
                "Unable to copy account number:",
                error
            );

        }

    };

    // Refresh button
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
    // Refresh
    useEffect(() => {
        fetchWallet();
    }, []);

    // User
    const user = useSelector(
        state => state.auth.user
    );

    // useEfect
    useEffect(() => {
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

        fetchWallet();
    }, []);

    const paymentHandler = async (data) => {

        try {

            setFunding(true);

            console.log(
                "Funding wallet:",
                data
            );

            const response =
                await createCheckoutSession(
                    data.amount
                );

            console.log(
                "Checkout response:",
                response
            );

            if (response.url) {

                window.location.href =
                    response.url;

            }

        } catch (error) {

            console.error(
                "Funding error:",
                error.response?.data ||
                error.message
            );

        } finally {

            setFunding(false);

        }

    }

    return (

        <>
            <div
                className="
                relative

                overflow-visible

                rounded-3xl

                p-8

                text-white

                bg-gradient-to-r
                from-slate-900
                via-blue-800
                to-cyan-600

                shadow-xl
            "
            >

                {/* Background Circle */}

                <div
                    className="
                    absolute

                    -right-10
                    -top-10

                    w-52
                    h-52

                    rounded-full

                    bg-white/10
                "
                />

                <div
                    className="
                    relative
                    z-10
                "
                >

                    <div
                        className="
                        flex
                        justify-between
                        items-center
                    "
                    >

                        <div>

                            <p
                                className="
                                text-slate-200
                            "
                            >

                                Available Balance

                            </p>

                            <button
                                onClick={fetchWallet}
                                disabled={walletLoading}
                                className="
                                    p-2
                                    rounded-full
                                    hover:bg-white/10
                                    transition
                                    disabled:opacity-50
                                "
                                title="Refresh wallet"
                            >
                                <FaSyncAlt className={walletLoading ? "animate-spin" : ""} />

                            </button>

                            {/* <h2
                                className="
                                text-5xl
                                font-bold
                                mt-2
                            "
                            >

                                ₦25,000.00

                            </h2> */}

                            {/* <h2 className="text-5xl font-bold mt-2">
                                {walletLoading
                                    ? "Loading..."
                                    : `₦${Number(
                                        wallet?.balance || 0
                                    ).toLocaleString("en-NG", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`
                                }
                            </h2> */}

                            <div className="flex items-center gap-4">
                                <h2 className="text-5xl font-bold mt-2">
                                    {walletLoading
                                        ? "Loading..."
                                        : showBalance
                                            ? `₦${Number(wallet?.balance || 0).toLocaleString("en-NG", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}`
                                            : "₦••••••"
                                    }
                                </h2>

                                <button
                                    type="button"
                                    onClick={() => setShowBalance(!showBalance)}
                                    className="mt-2 text-gray-500 hover:text-gray-700"
                                >
                                    {showBalance ? (
                                        <FaEyeSlash size={22} />
                                    ) : (
                                        <FaEye size={22} />
                                    )}
                                </button>
                            </div>

                        </div>

                        <FaWallet
                            className="
                            text-5xl
                            text-white/80
                        "
                        />

                    </div>

                    <div className="mt-10">

                        <p
                            className="
                            text-sm
                            text-slate-200
                        "
                        >

                            Account Number

                        </p>

                        {/* <h3
                            className="
                            text-2xl
                            tracking-widest
                            font-semibold
                            mt-2
                        "
                        >

                            9139 9738 32

                        </h3> */}
                        {/* <h3 className="text-2xl tracking-widest font-semibold mt-2">
                            {wallet?.accountNumber || "Loading..."}
                        </h3> */}
                        <div className="flex items-center gap-3 mt-2">

                            <h3 className="
                                text-2xl
                                tracking-widest
                                font-semibold
                            ">
                                {walletLoading
                                    ? "Loading..."
                                    : wallet?.accountNumber || "-"
                                }
                            </h3>

                            {!walletLoading && wallet?.accountNumber && (

                                <button
                                    type="button"
                                    onClick={handleCopyAccount}
                                    className="
                                        text-white/70
                                        hover:text-white
                                        transition
                                    "
                                    title="Copy account number"
                                >

                                    {copied
                                        ? <FaCheck className="text-green-300" />
                                        : <FaCopy />
                                    }

                                </button>

                            )}

                        </div>

                    </div>

                    <div
                        className="
                        mt-10

                        flex

                        gap-4

                        flex-wrap
                    "
                    >

                        {/* <button
                        className="
                            flex
                            items-center
                            gap-2

                            bg-white

                            text-slate-900

                            px-5
                            py-3

                            rounded-xl

                            font-semibold

                            hover:scale-105

                            transition
                        "
                    >

                        <FaPlus />

                        Add Money

                    </button> */}

                        <button
                            onClick={() => setShowFundModal(true)}
                            className="
                            flex
                            items-center
                            gap-2
                            bg-white
                            text-slate-900
                            px-5
                            py-3
                            rounded-xl
                            font-semibold
                            hover:scale-105
                            transition
                        "
                        >
                            <FaPlus />

                            Add Money
                        </button>

                        <button
                            onClick={() =>
                                navigate("/transfer")
                            }
                            className="flex items-center gap-2 border border-white/40 px-5 py-3 rounded-xl backdrop-blur-lg hover:bg-white/10 transition">

                            <FaExchangeAlt />

                            Transfer

                        </button>

                    </div>

                    <div className="mt-12 flex justify-between items-center border-t border-white/20   pt-6">

                        <div>

                            <p className=" text-xs text-slate-200">

                                Wallet Type

                            </p>

                            <h4>

                                NGN Wallet

                            </h4>

                        </div>

                        <div className="  flex items-center   gap-2">
                            <FaCreditCard />

                            Tier 1

                        </div>

                    </div>

                </div>

                <FundWalletModal
                    open={showFundModal}

                    onClose={() =>
                        setShowFundModal(false)
                    }

                    loading={funding}

                    onSubmit={paymentHandler}

                // onSubmit={(data) => {

                //     console.log(
                //         "Funding wallet:",
                //         data
                //     );

                // }}
                />

            </div>
        </>

    );

}

// export default WalletCard;