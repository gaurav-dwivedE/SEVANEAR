
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  MapPin,
} from "lucide-react";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const signupData = {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
      };

      console.log("Signup Data:", signupData);

      // Connect your backend here:
      //
      // const response = await axios.post(
      //   "http://localhost:5000/api/auth/signup",
      //   signupData
      // );

    } catch (error) {
      if (error.response?.status === 409) {
        setError("email", {
          type: "server",
          message: "This email is already registered.",
        });
      } else {
        setError("root.server", {
          type: "server",
          message: "Unable to create your account. Please try again.",
        });
      }
    }
  };

  const inputClass = (hasError) =>
    `w-full h-14 pl-12 pr-12 rounded-xl border ${
      hasError
        ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100"
        : "border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-100"
    } text-gray-800 outline-none transition focus:ring-4`;

  const errorMessage = (id, error) =>
    error && (
      <p
        id={id}
        role="alert"
        className="mt-2 text-sm text-red-600"
      >
        {error.message}
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-12">
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
                Find Trusted
                <br />
                Local Services.
              </h2>

              <p className="text-blue-100 mt-6 text-lg leading-7 max-w-md">
                Create your SEVANEAR account and connect with reliable
                professionals for your everyday needs.
              </p>
            </div>

            <div className="relative z-10">
              <div className="flex flex-wrap gap-2">
                {["Plumber", "Electrician", "Painter", "Cleaner"].map(
                  (service) => (
                    <span
                      key={service}
                      className="px-3 py-2 rounded-lg bg-white/10 text-blue-50 text-sm"
                    >
                      {service}
                    </span>
                  )
                )}
              </div>

              <p className="text-blue-200 text-sm mt-5">
                SEVANEAR — Local Services, Trusted People.
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="p-8 sm:p-12 lg:p-14">
            <div className="max-w-md mx-auto">

              {/* Heading */}
              <div className="mb-7">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  Create Account
                </h1>

                <p className="mt-2 text-gray-500">
                  Join SEVANEAR and find trusted local services
                </p>
              </div>

              {/* Signup Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-5"
              >
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your full name"
                      aria-invalid={!!errors.name}
                      aria-describedby={
                        errors.name ? "name-error" : undefined
                      }
                      {...register("name", {
                        required: "Full name is required.",
                        maxLength: {
                          value: 80,
                          message: "Name cannot exceed 80 characters.",
                        },
                        validate: {
                          notEmpty: (value) =>
                            value.trim().length > 0 ||
                            "Name cannot be empty or only spaces.",

                          validName: (value) =>
                            /^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(
                              value.trim()
                            ) ||
                            "Enter a valid name using letters, spaces, hyphens, or apostrophes.",

                          minLength: (value) =>
                            value.trim().length >= 2 ||
                            "Name must contain at least 2 characters.",
                        },
                      })}
                      className={inputClass(!!errors.name)}
                    />
                  </div>

                  {errorMessage("name-error", errors.name)}
                </div>

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
                      {...register("email", {
                        required: "Email address is required.",
                        maxLength: {
                          value: 254,
                          message: "Email cannot exceed 254 characters.",
                        },
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address.",
                        },
                        validate: (value) =>
                          value.trim() === value ||
                          "Email cannot start or end with spaces.",
                      })}
                      className={inputClass(!!errors.email)}
                    />
                  </div>

                  {errorMessage("email-error", errors.email)}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      aria-invalid={!!errors.password}
                      aria-describedby="password-hint password-error"
                      {...register("password", {
                        required: "Password is required.",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters.",
                        },
                        maxLength: {
                          value: 128,
                          message: "Password cannot exceed 128 characters.",
                        },
                        validate: {
                          noSpaces: (value) =>
                            !/\s/.test(value) ||
                            "Password cannot contain spaces.",
                          hasLetter: (value) =>
                            /[A-Za-z]/.test(value) ||
                            "Password must contain at least one letter.",
                          hasNumber: (value) =>
                            /\d/.test(value) ||
                            "Password must contain at least one number.",
                        },
                      })}
                      className={inputClass(!!errors.password)}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
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

                  <p
                    id="password-hint"
                    className="text-xs text-gray-400 mt-1.5"
                  >
                    At least 8 characters, including a letter and a number.
                  </p>

                  {errorMessage("password-error", errors.password)}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword ? "text" : "password"
                      }
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={
                        errors.confirmPassword
                          ? "confirmPassword-error"
                          : undefined
                      }
                      {...register("confirmPassword", {
                        required: "Please confirm your password.",
                        validate: (value) =>
                          value === password ||
                          "Passwords do not match.",
                      })}
                      className={inputClass(
                        !!errors.confirmPassword
                      )}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      aria-pressed={showConfirmPassword}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  {errorMessage(
                    "confirmPassword-error",
                    errors.confirmPassword
                  )}
                </div>

                {/* Terms & Conditions */}
                <div className="pt-1">
                  <div className="flex items-start gap-2">
                    <input
                      id="terms"
                      type="checkbox"
                      aria-invalid={!!errors.terms}
                      aria-describedby={
                        errors.terms ? "terms-error" : undefined
                      }
                      {...register("terms", {
                        validate: (value) =>
                          value === true ||
                          "You must accept the Terms & Conditions.",
                      })}
                      className="w-4 h-4 mt-0.5 accent-blue-600"
                    />

                    <label
                      htmlFor="terms"
                      className="text-sm text-gray-500 leading-5"
                    >
                      I agree to the{" "}
                      <a
                        href="/terms"
                        className="text-blue-600 font-semibold"
                      >
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        className="text-blue-600 font-semibold"
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  {errorMessage("terms-error", errors.terms)}
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

                {/* Signup Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base flex items-center justify-center gap-2 transition shadow-sm"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}

                  {!isSubmitting && <ArrowRight size={20} />}
                </button>
              </form>

              {/* Login */}
              <div className="mt-7 text-center">
                <p className="text-gray-500 text-sm">
                  Already have an account?{" "}

                  <a
                    href="/login"
                    className="font-bold text-blue-600 hover:text-blue-700"
                  >
                    Login
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

export default Signup;