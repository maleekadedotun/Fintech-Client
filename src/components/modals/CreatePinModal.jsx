import { useState } from "react";
import { FaLock, FaTimes } from "react-icons/fa";

function CreatePinModal({
    open,
    onClose,
    onSubmit,
    loading,
}) {

    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [error, setError] = useState("");

    if (!open) return null;

    const handleSubmit = (e) => {

        e.preventDefault();

        setError("");

        if (!/^\d{4}$/.test(pin)) {

            setError("PIN must be exactly 4 digits");

            return;
        }

        if (pin !== confirmPin) {

            setError("PINs do not match");

            return;
        }

        onSubmit(pin);

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
                backdrop-blur-sm

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

                    p-8
                "
            >

                <div className="flex justify-between items-center mb-6">

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                w-12
                                h-12
                                rounded-xl

                                bg-blue-100

                                text-blue-600

                                flex
                                items-center
                                justify-center
                            "
                        >

                            <FaLock />

                        </div>

                        <div>

                            <h2 className="text-2xl font-bold">

                                Create Transaction PIN

                            </h2>

                            <p className="text-sm text-slate-500">

                                Secure your transfers

                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700"
                    >

                        <FaTimes />

                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <label className="block font-medium">

                            Enter 4-digit PIN

                        </label>

                        <input
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            value={pin}
                            onChange={(e) =>
                                setPin(
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                            className="
                                w-full
                                mt-2
                                border
                                rounded-xl
                                p-4
                                text-center
                                text-2xl
                                tracking-[0.7em]
                            "
                            placeholder="••••"
                        />

                    </div>

                    <div>

                        <label className="block font-medium">

                            Confirm PIN

                        </label>

                        <input
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            value={confirmPin}
                            onChange={(e) =>
                                setConfirmPin(
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                            className="
                                w-full
                                mt-2
                                border
                                rounded-xl
                                p-4
                                text-center
                                text-2xl
                                tracking-[0.7em]
                            "
                            placeholder="••••"
                        />

                    </div>

                    {error && (

                        <div
                            className="
                                bg-red-50
                                border
                                border-red-200
                                text-red-700
                                rounded-xl
                                p-3
                                text-sm
                            "
                        >

                            {error}

                        </div>

                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            bg-blue-700
                            hover:bg-blue-800
                            disabled:bg-slate-400

                            text-white

                            rounded-xl

                            py-4

                            font-semibold

                            transition
                        "
                    >

                        {loading
                            ? "Creating PIN..."
                            : "Create Transaction PIN"
                        }

                    </button>

                </form>

            </div>

        </div>

    );

}

export default CreatePinModal;