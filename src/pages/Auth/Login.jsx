import HeroSection from "../../components/auth/HeroSection";
import LoginForm from "../../components/auth/LoginForm";
import { FaEnvelope, FaFingerprint } from "react-icons/fa";
import { useForm } from "react-hook-form";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginStart, loginSuccess, loginFailure } from "../../features/auth/authSlice";
import { login } from "../../features/auth/authService";

function Login() {
  // dispatch
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {

    register,

    handleSubmit,

    formState: { errors },

  } = useForm();

  // const onSubmit = async (data) => {

  //   dispatch(loginStart());

  //   try {

  //     const response = await login(data);

  //     dispatch(loginSuccess(response));

  //     console.log(response);

  //   } catch (error) {

  //     dispatch(
  //       loginFailure(
  //         error.response?.data?.message || "Login failed"
  //       )
  //     );

  //   }
  // };


  const onSubmit = async (data) => {
    dispatch(loginStart());

    try {
      console.log("1. Calling login...");

      const response = await login(data);

      console.log("2. API Response:", response);

      console.log("3. Dispatching loginSuccess...");

      dispatch(loginSuccess(response));

      console.log("4. Dispatch completed.");
      // navigate("/dashboard");
      if (response.role === "admin") {
        navigate("/admin/dashboard");
      } 
      else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Caught Error:", error);

      dispatch(
        loginFailure(
          error.response?.data?.message || error.message
        )
      );
    }
  };
  return (

    <div className="min-h-screen grid lg:grid-cols-2">

      <HeroSection />

      <LoginForm>

        <div className="text-center mb-10">

          <div className="w-20 h-20 rounded-full bg-blue-100 mx-auto flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 mx-auto flex items-center justify-center text-blue-700 text-3xl">
              <FaFingerprint />
            </div>
            {/* 🔒 */}

          </div>

          <h2 className="text-4xl font-bold mt-6">

            Welcome Back

          </h2>

          <p className="text-slate-500 mt-2">

            Login to continue to your dashboard

          </p>

        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* <div className="mb-5">

            <label>Email Address</label>

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2  text-gray-400" />

              <input
                className="pl-12 ..."
                type="email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full mt-2 rounded-xl border p-4"
              placeholder="Enter your email"
              />
            </div>


          </div> */}

          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700">
              Email Address
            </label>

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
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

          <div className="mb-8">

            <label>Password</label>

            <input
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full mt-2 rounded-xl border p-4"
              placeholder="Enter your password"
            />

          </div>

          <button
            className="
              w-full
              p-4
              rounded-xl
              text-white
              font-semibold
              bg-gradient-to-r
              from-blue-700
              to-cyan-500
              hover:scale-105
              transition
            "
          >

            Login

          </button>

        </form>

      </LoginForm>

    </div>

  );

}

export default Login;