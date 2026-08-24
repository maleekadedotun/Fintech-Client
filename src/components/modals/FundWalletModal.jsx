import { useState } from "react";

function FundWalletModal({
    open,
    onClose,
    onSubmit,
    loading = false,
}) {

    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");

    if (!open) {
        return null;
    }

    const handleSubmit = (e) => {

        e.preventDefault();

        setError("");

        if (!amount) {
            setError("Amount is required");
            return;
        }

        if (Number(amount) < 100) {
            setError("Minimum funding amount is ₦100");
            return;
        }

        onSubmit({
            amount: Number(amount),
        });

    };

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
                p-4
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    bg-white
                    rounded-3xl
                    shadow-2xl
                    p-6
                "
            >

                <div className="flex justify-between items-center mb-6">

                    <div>

                        <h2 className="text-2xl font-bold">
                            Fund Wallet
                        </h2>

                        <p className="text-slate-500 text-sm mt-1">
                            Add money to your wallet
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            text-2xl
                            text-slate-400
                            hover:text-slate-700
                        "
                    >
                        ×
                    </button>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <label className="
                            block
                            font-medium
                            text-slate-700
                            mb-2
                        ">
                            Amount
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

                            {/* <input
                                type="number"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(e.target.value)
                                }
                                placeholder="5000"
                                min="100"
                                className="
                                    w-full
                                    border
                                    border-slate-200
                                    rounded-xl
                                    py-4
                                    pl-10
                                    pr-4
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                            /> */}
                            {/* <input
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    console.log("Amount:", e.target.value);
                                    setAmount(e.target.value);
                                }}
                                placeholder="5000"
                                min="100"
                                className="
                                    w-full
                                    border
                                    border-slate-900
                                    rounded-xl
                                    py-4
                                    pl-10
                                    pr-4
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                            /> */}
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    // console.log("Amount :", e.target.value);
                                    
                                    setAmount(e.target.value);
                                }}
                                placeholder="5000"
                                min="100"
                                className="
                                    w-full
                                    border
                                    border-slate-200
                                    rounded-xl
                                    py-4
                                    pl-10
                                    pr-4
                                    bg-white
                                    text-slate-900
                                    placeholder:text-slate-400
                                    outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                "
                            />

                        </div>

                        {error && (

                            <p className="
                                mt-2
                                text-sm
                                text-red-600
                            ">
                                {error}
                            </p>

                        )}

                    </div>


                    <div className="
                        rounded-xl
                        bg-blue-50
                        border
                        border-blue-100
                        p-4
                    ">

                        <p className="
                            text-sm
                            text-blue-700
                        ">
                            Minimum wallet funding amount is ₦100.
                        </p>

                    </div>


                    <div className="flex gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                flex-1
                                border
                                border-slate-200
                                rounded-xl
                                py-3
                                font-semibold
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                flex-1
                                bg-blue-700
                                hover:bg-blue-800
                                text-white
                                rounded-xl
                                py-3
                                font-semibold
                                disabled:bg-slate-300
                                disabled:cursor-not-allowed
                            "
                        >

                            {loading
                                ? "Processing..."
                                : "Continue"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

export default FundWalletModal;