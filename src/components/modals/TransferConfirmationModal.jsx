import { useState } from "react";

function TransferConfirmationModal({

    open,

    onClose,

    onConfirm,

    account,

    amount,

    narration,

    loading,
}) {
    const [transactionPin, setTransactionPin] = useState("");

    if (!open) return null;

    return (

        <div
            className="
                fixed
                inset-0
                bg-black/50

                flex

                items-center

                justify-center

                z-50
            "
        >

            <div
                className="
                    bg-white

                    rounded-3xl

                    p-8

                    w-full

                    max-w-md
                "
            >

                <h2
                    className="
                        text-2xl
                        font-bold
                        mb-6
                    "
                >

                    Confirm Transfer

                </h2>

                <div className="space-y-4">

                    <div>

                        <p className="text-slate-500">

                            Recipient

                        </p>

                        <h3 className="font-semibold">

                            {account.accountName}

                        </h3>

                    </div>

                    <div>

                        <p className="text-slate-500">

                            Account Number

                        </p>

                        <h3>

                            {account.accountNumber}

                        </h3>

                    </div>

                    <div>

                        <p className="text-slate-500">

                            Amount

                        </p>

                        <h3 className="text-green-700 text-xl font-bold">

                            ₦{Number(amount).toLocaleString()}

                        </h3>

                    </div>

                    <div>

                        <p className="text-slate-500">

                            Narration

                        </p>

                        <h3>

                            {narration || "-"}

                        </h3>

                    </div>

                    <div>
                        <input
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            value={transactionPin}
                            onChange={(e) => setTransactionPin(e.target.value)}
                            placeholder="Enter 4-digit PIN"
                            className="w-full border rounded-xl p-4 mt-2"
                        />
                    </div>

                </div>

                <div className="flex gap-4 mt-8">

                    <button

                        onClick={onClose}

                        className="
                            flex-1

                            border

                            rounded-xl

                            py-3
                        "

                    >

                        Cancel

                    </button>

                    {/* <button

                        onClick={onConfirm}

                        className="
                            flex-1

                            bg-blue-700

                            text-white

                            rounded-xl

                            py-3
                        "

                    >

                        Confirm

                    </button> */}

                    {/* <button
                        onClick={() => onConfirm(transactionPin)}
                        className="flex-1 bg-blue-700 text-white rounded-xl py-3"
                    >
                        Confirm Transfer
                    </button> */}

                    <button
                        onClick={() => onConfirm(transactionPin)}
                        disabled={transactionPin.length !== 4 || loading}
                        className="flex-1 bg-blue-700 text-white rounded-xl py-3 disabled:bg-slate-300 disabled:cursor-not-allowed">
                            
                        {loading ? "Processing Transfer..." : "Confirm Transfer"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default TransferConfirmationModal;