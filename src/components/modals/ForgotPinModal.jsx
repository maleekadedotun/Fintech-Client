import { useState } from "react";
import { FaLock, FaTimes } from "react-icons/fa";

function ForgotPinModal({
    open,
    onClose,
    onReset,
    loading,
}) {

    const [step, setStep] = useState(1);

    const [otp, setOtp] = useState("");

    const [pin, setPin] = useState("");

    const [confirmPin, setConfirmPin] = useState("");

    const [error, setError] = useState("");

    if (!open) return null;

    const handleSubmit = (e) => {

        e.preventDefault();

        setError("");

        // STEP 1
        if (step === 1) {

            // OTP verification will be connected
            // to the backend next.

            if (!/^\d{6}$/.test(otp)) {

                setError("OTP must be 6 digits");

                return;

            }

            setStep(2);

            return;

        }

        // STEP 2
        if (!/^\d{4}$/.test(pin)) {

            setError("PIN must be exactly 4 digits");

            return;

        }

        if (pin !== confirmPin) {

            setError("PINs do not match");

            return;

        }

        onReset({
            otp,
            pin,
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

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        mb-6
                    "
                >

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

                            <h2 className="text-xl font-bold">

                                Forgot Transaction PIN

                            </h2>

                            <p className="text-sm text-slate-500">

                                Reset your transaction PIN

                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            text-slate-400
                            hover:text-slate-700
                        "
                    >

                        <FaTimes />

                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {step === 1 && (

                        <div>

                            <p className="text-slate-600 mb-4">

                                Enter the OTP sent to your
                                registered phone number.

                            </p>

                            <label className="block font-medium">

                                OTP

                            </label>

                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
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
                                    tracking-[0.5em]
                                "
                                placeholder="••••••"
                            />

                        </div>

                    )}

                    {step === 2 && (

                        <>

                            <div>

                                <label className="block font-medium">

                                    New Transaction PIN

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

                                    Confirm New PIN

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

                        </>

                    )}

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
                        "
                    >

                        {loading
                            ? "Processing..."
                            : step === 1
                                ? "Verify OTP"
                                : "Reset PIN"
                        }

                    </button>

                </form>

            </div>

        </div>

    );

}

export default ForgotPinModal;