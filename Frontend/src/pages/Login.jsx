
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  MapPin,
} from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // Normalize email, but never trim the password.
      const loginData = {
        email: data.email.trim(),
        password: data.password,
      };

      console.log("Login Data:", loginData);

      // Connect your actual backend here:
      //
      // const response = await axios.post(
      //   "http://localhost:5000/api/auth/login",
      //   loginData
      // );

      // Example placeholder:
      // Remove this when connecting your API.
      // await loginUser(loginData);

    } catch (error) {
      // Example: handle invalid credentials returned by your API.
      if (error.response?.status === 401) {
        setError("root.server", {
          type: "server",
          message: "Invalid email or password.",
        });
      } else {
        setError("root.server", {
          type: "server",
          message: "Unable to login. Please try again.",
        });
      }
    }
  };

  const emailRegister = register("email", {
    required: "Email address is required.",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address.",
    },
    maxLength: {
      value: 254,
      message: "Email cannot exceed 254 characters.",
    },
    validate: (value) =>
      value.trim() === value ||
      "Email cannot start or end with spaces.",
  });

  const passwordRegister = register("password", {
    required: "Password is required.",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters.",
    },
    maxLength: {
      value: 128,
      message: "Password cannot exceed 128 characters.",
    },
  });

  const inputClass = (hasError) =>
    `w-full h-14 pl-12 pr-12 rounded-xl border ${
      hasError
        ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100"
        : "border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-100"
    } text-gray-800 outline-none transition focus:ring-4`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-[1050px] grid lg:grid-cols-2 bg-white rounded-3xl shadow-[0_15px_60px_rgba(0,0,0,0.08)] overflow-hidden">

          {/* Left Side */}
          <div className="hidden lg:flex relative bg-blue-600 p-12 flex-col justify-between overflow-hidden">
            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-blue-500 opacity-40" />

            <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-blue-700 opacity-40" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-8">
                <MapPin className="text-white" size={28} />
              </div>

              <h2 className="text-4xl font-extrabold text-white leading-tight">
                Trusted Services,
                <br />
                Just a Click Away.
              </h2>

              <p className="text-blue-100 mt-6 text-lg leading-7 max-w-md">
                Connect with verified local professionals for your home
                and everyday service needs.
              </p>
            </div>

            <div className="relative z-10">
              <p className="text-blue-100 text-sm">
                Plumbers • Electricians • Painters • Cleaners
              </p>

              <p className="text-blue-200 text-sm mt-2">
                SEVANEAR — Local Services, Trusted People.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="p-8 sm:p-12 lg:p-14">
            <div className="max-w-md mx-auto">

              {/* Heading */}
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  Welcome Back
                </h1>

                <p className="mt-2 text-gray-500">
                  Login to continue using SEVANEAR
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-6"
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      {...emailRegister}
                      onChange={(e) => {
                        emailRegister.onChange(e);
                        clearErrors("root.server");
                      }}
                      className={`w-full h-14 pl-12 pr-4 rounded-xl border ${
                        errors.email
                          ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-100"
                      } text-gray-800 outline-none transition focus:ring-4`}
                    />
                  </div>

                  {errors.email && (
                    <p
                      id="email-error"
                      role="alert"
                      className="mt-2 text-sm text-red-600"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-bold text-gray-700"
                    >
                      Password
                    </label>

                    <a
                      href="/forgot-password"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <div className="relative">
                    <Lock
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                      {...passwordRegister}
                      onChange={(e) => {
                        passwordRegister.onChange(e);
                        clearErrors("root.server");
                      }}
                      className={inputClass(!!errors.password)}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p
                      id="password-error"
                      role="alert"
                      className="mt-2 text-sm text-red-600"
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 accent-blue-600"
                  />

                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-600"
                  >
                    Remember me
                  </label>
                </div>

                {/* Server Error */}
                {errors.root?.server && (
                  <p
                    role="alert"
                    className="text-sm text-red-600 bg-red-50 rounded-lg p-3"
                  >
                    {errors.root.server.message}
                  </p>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base flex items-center justify-center gap-2 transition shadow-sm"
                >
                  {isSubmitting ? "Logging in..." : "Login"}

                  {!isSubmitting && <ArrowRight size={20} />}
                </button>
              </form>

              {/* Signup */}
              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                  Don't have an account?{" "}

                  <a
                    href="/signup"
                    className="font-bold text-blue-600 hover:text-blue-700"
                  >
                    Create an account
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;