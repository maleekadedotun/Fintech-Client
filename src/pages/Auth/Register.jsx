import HeroSection from "../../components/auth/HeroSection";
import LoginForm from "../../components/auth/LoginForm";

import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaUserPlus,
    FaPhoneAlt,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import {
    // loginStart,
    // loginFailure,
    registerFailure,
    registerSuccess,
    registerStart,
} from "../../features/auth/authSlice";

import { register } from "../../features/auth/authService";

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const { loading, error } = useSelector(
    //     (state) => state.auth
    // );
    const { registerLoading, registerError } = useSelector(
  (state) => state.auth
);

    const [showPassword, setShowPassword] = useState(false);

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // REGISTER USER
    // const onSubmit = async (data) => {
    //     dispatch(loginStart());

    //     try {
    //         const response = await register(data);

    //         console.log("Registration successful:", response);

    //         // Registration successful
    //         navigate("/");

    //     } catch (error) {
    //         console.error("Registration Error:", error);

    //         dispatch(
    //             loginFailure(
    //                 error.response?.data?.message ||
    //                 error.message ||
    //                 "Registration failed"
    //             )
    //         );
    //     }
    // };

    const onSubmit = async (data) => {
        dispatch(registerStart());

        try {
            console.log("Creating account...");

            const response = await register(data);

            console.log("Registration Response:", response);

            dispatch(registerSuccess(response));
            navigate("/");

            console.log("Redux registerSuccess dispatched:", response);

        }
        // catch (error) {
        //     console.error("Registration Error:", error);

        //     dispatch(
        //         registerFailure(
        //             error.response?.data?.message ||
        //             error.message ||
        //             "Registration failed"
        //         )
        //     );
        // }
        catch (error) {
            console.log(
                "REGISTER ERROR RESPONSE:",
                error.response?.data
            );

            dispatch(
                registerFailure(
                    error.response?.data?.message ||
                    error.message ||
                    "Registration failed"
                )
            );
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">

            {/* LEFT SIDE */}
            <HeroSection />

            {/* RIGHT SIDE */}
            <LoginForm>

                {/* HEADER */}
                <div className="text-center mb-8">

                    <div
                        className="
                            w-20
                            h-20
                            rounded-full
                            bg-blue-100
                            mx-auto
                            flex
                            items-center
                            justify-center
                            text-blue-700
                            text-3xl
                        "
                    >
                        <FaUserPlus />
                    </div>

                    <h2 className="text-4xl font-bold mt-6 text-slate-900">

                        Create Account

                    </h2>

                    <p className="text-slate-500 mt-2">

                        Start your secure financial journey today

                    </p>

                </div>


                {/* ERROR MESSAGE */}
                {registerError && (
                    <div
                        className="
                            mb-5
                            p-4
                            rounded-xl
                            bg-red-50
                            border
                            border-red-200
                            text-red-600
                            text-sm
                        "
                    >
                        {registerError}
                    </div>
                )}


                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)}>


                    {/* NAME */}
                    <div className="mb-5">

                        <label className="block mb-2 font-medium text-gray-700">

                            Full Name

                        </label>

                        <div className="relative">

                            <FaUser
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                    text-lg
                                "
                            />

                            <input
                                type="text"
                                placeholder="Enter your full name"

                                {...registerField("name", {
                                    required: "Full name is required",
                                })}

                                className="
                                    w-full
                                    pl-12
                                    pr-4
                                    py-4
                                    rounded-xl
                                    border
                                    border-gray-300
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                    focus:border-blue-500
                                    transition
                                "
                            />

                        </div>

                        {errors.name && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.name.message}
                            </p>
                        )}

                    </div>


                    {/* EMAIL */}
                    <div className="mb-5">

                        <label className="block mb-2 font-medium text-gray-700">

                            Email Address

                        </label>

                        <div className="relative">

                            <FaEnvelope
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                    text-lg
                                "
                            />

                            <input
                                type="email"
                                placeholder="Enter your email"

                                {...registerField("email", {
                                    required: "Email is required",
                                })}

                                className="
                                    w-full
                                    pl-12
                                    pr-4
                                    py-4
                                    rounded-xl
                                    border
                                    border-gray-300
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                    focus:border-blue-500
                                    transition
                                "
                            />

                        </div>

                        {errors.email && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}

                    </div>


                    {/* PHONE NUMBER */}
                    <div className="mb-5">

                        <label className="block mb-2 font-medium text-gray-700">

                            Phone Number

                        </label>

                        <div className="relative">

                            <FaPhoneAlt
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                    text-lg
                                "
                            />

                            <input
                                type="tel"
                                placeholder="Enter your phone number"

                                {...registerField("phoneNumber", {
                                    required: "Phone number is required",
                                    minLength: {
                                        value: 10,
                                        message:
                                            "Please enter a valid phone number",
                                    },
                                })}

                                className="
                                    w-full
                                    pl-12
                                    pr-4
                                    py-4
                                    rounded-xl
                                    border
                                    border-gray-300
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                    focus:border-blue-500
                                    transition
                                "
                            />

                        </div>

                        {errors.phoneNumber && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.phoneNumber.message}
                            </p>
                        )}

                    </div>


                    {/* PASSWORD */}
                    <div className="mb-6">

                        <label className="block mb-2 font-medium text-gray-700">

                            Password

                        </label>

                        <div className="relative">

                            <FaLock
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                    text-lg
                                "
                            />

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }

                                placeholder="Create a secure password"

                                {...registerField("password", {
                                    required: "Password is required",

                                    minLength: {
                                        value: 6,
                                        message:
                                            "Password must be at least 6 characters",
                                    },
                                })}

                                className="
                                    w-full
                                    pl-12
                                    pr-12
                                    py-4
                                    rounded-xl
                                    border
                                    border-gray-300
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                    focus:border-blue-500
                                    transition
                                    "
                            />

                            {/* SHOW PASSWORD BUTTON */}
                            <button
                                type="button"

                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }

                                className="
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                    hover:text-blue-600
                                    transition
                                    "
                            >

                                {showPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}

                            </button>

                        </div>

                        {errors.password && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}

                    </div>


                    {/* REGISTER BUTTON */}
                    <button
                        type="submit"
                        disabled={registerLoading}

                        className="
                            w-full
                            p-4
                            rounded-xl
                            text-white
                            font-semibold
                            bg-gradient-to-r
                            from-blue-700
                            to-cyan-500
                            hover:scale-[1.02]
                            hover:shadow-lg
                            transition
                            duration-300
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                            disabled:hover:scale-100
                            "
                    >

                        {registerLoading
                            ? "Creating Account..."
                            : "Create Account"
                        }

                    </button>


                    {/* LOGIN LINK */}
                    <p className="text-center text-slate-500 mt-6">

                        Already have an account?

                        <Link
                            to="/"

                            className="
                                ml-2
                                text-blue-600
                                font-semibold
                                hover:text-blue-800
                                transition
                            "
                        >
                            Login
                        </Link>

                    </p>

                </form>

            </LoginForm>

        </div>
    );
}

export default Register;