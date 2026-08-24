import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaShieldAlt, FaLock } from "react-icons/fa";

import CreatePinModal from "../../components/modals/CreatePinModal";

import {
    pinStart,
    pinSuccess,
    pinFailure,
} from "../../features/pin/pinSlice";

import {
    createTransactionPin, sendPinResetOtp, resetTransactionPin,
} from "../../features/pin/pinService";
import ForgotPinModal from "../../components/modals/ForgotPinModal";

function Security() {

    const dispatch = useDispatch();

    const [showPinModal, setShowPinModal] = useState(false);
    const [showForgotPinModal, setShowForgotPinModal] = useState(false);

    const {
        loading,
        success,
        message,
        error,
    } = useSelector(
        (state) => state.pin
    );

    const handleCreatePin = async (pin) => {

        dispatch(pinStart());

        try {

            const response = await createTransactionPin(pin);

            dispatch(
                pinSuccess(response)
            );

            setShowPinModal(false);

        } catch (error) {

            dispatch(
                pinFailure(
                    error.response?.data?.message ||
                    "Failed to create transaction PIN"
                )
            );

        }

    };

    // Forgot Pin
    const handleForgotPin = async (data) => {

        dispatch(pinStart());

        try {

            const response = await resetTransactionPin(data);

            dispatch(
                pinSuccess(response)
            );

            setShowForgotPinModal(false);

        } catch (error) {

            dispatch(
                pinFailure(
                    error.response?.data?.message ||
                    "Failed to reset transaction PIN"
                )
            );

        }

    };

    // reset pin otp
    const resetOtpCode = async () => {

        dispatch(pinStart());

        try {

            const response = await sendPinResetOtp();


            dispatch(
                pinSuccess(response)
            );

            setShowForgotPinModal(true);

        } catch (error) {

            dispatch(
                pinFailure(
                    error.response?.data?.message ||
                    "Unable to send OTP"
                )
            );

        }

    }

    return (

        <div className="max-w-3xl mx-auto">

            <div className="mb-8">

                <h1 className="text-3xl font-bold">

                    Security

                </h1>

                <p className="text-slate-500 mt-2">

                    Manage your account security.

                </p>

            </div>

            <div
                className="
                    bg-white
                    rounded-3xl
                    shadow-sm
                    p-6
                    md:p-8
                "
            >

                <div className="flex items-center gap-4">

                    <div
                        className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-blue-100
                            text-blue-600
                            flex
                            items-center
                            justify-center
                            text-xl
                        "
                    >

                        <FaShieldAlt />

                    </div>

                    <div>

                        <h2 className="text-xl font-bold">

                            Transaction PIN

                        </h2>

                        <p className="text-slate-500">

                            Protect your transfers with a secure PIN.

                        </p>

                    </div>

                </div>

                <button
                    onClick={() => setShowPinModal(true)}
                    className="
                        mt-6

                        flex
                        items-center
                        justify-center
                        gap-2

                        w-full
                        sm:w-auto

                        bg-blue-700
                        hover:bg-blue-800

                        text-white

                        px-6
                        py-3

                        rounded-xl

                        font-semibold

                        transition
                    "
                >

                    <FaLock />

                    Create Transaction PIN

                </button>

                {success && (

                    <div
                        className="
                            mt-5
                            bg-green-50
                            border
                            border-green-200
                            text-green-700
                            rounded-xl
                            p-4
                        "
                    >

                        {message}

                    </div>

                )}

                {error && (

                    <div
                        className="
                            mt-5
                            bg-red-50
                            border
                            border-red-200
                            text-red-700
                            rounded-xl
                            p-4
                        "
                    >

                        {error}

                    </div>

                )}

                {/* <button
                    onClick={() => setShowForgotPinModal(true)}
                    className="mt-4 block text-sm text-blue-700 hover:underline">

                    Forgot Transaction PIN?
                </button> */}

                <button
                    onClick={resetOtpCode}
                    className="
                        mt-4
                        text-sm
                        text-blue-700
                        hover:underline
                    "
                >
                    Forgot Transaction PIN?
                </button>



            </div>
            {/* <div>
                <button
                    onClick={() => setShowForgotPinModal(true)}
                    className="mt-4 block text-sm text-blue-700 hover:underline">

                    Forgot Transaction PIN?
                </button>
            </div> */}

            <CreatePinModal

                open={showPinModal}

                onClose={() =>
                    setShowPinModal(false)
                }

                onSubmit={handleCreatePin}

                loading={loading}

            />
            <ForgotPinModal

                open={showForgotPinModal}

                onClose={() =>
                    setShowForgotPinModal(false)
                }

                // onReset={(data) => {

                //     console.log("Reset PIN data:", data);

                // }}
                onReset={handleForgotPin}

                loading={false}

            />

        </div>

    );

}

export default Security;