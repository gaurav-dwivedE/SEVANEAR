import { useForm } from "react-hook-form";
import { MapPin, LoaderCircle } from "lucide-react";

const Address = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      belongsTo: "user",
    },
  });

  // Add your current location logic here
  const handleCurrentLocation = () => {
    // Use setValue() to fill address fields
  };

  const onSubmit = (data) => {
    console.log("Address:", data);
    // Connect your API here
  };

  const inputClass = (error) =>
    `w-full rounded-lg border ${
      error ? "border-red-500" : "border-gray-200"
    } px-3 py-3 text-sm outline-none focus:border-blue-500`;

  const FieldError = ({ error }) =>
    error && (
      <p className="mt-1 text-xs text-red-500">
        {error.message}
      </p>
    );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-lg">

        <h1 className="text-2xl font-bold text-gray-900">
          Add Address
        </h1>

        <p className="mt-1 mb-6 text-sm text-gray-500">
          Enter where you need the service.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
        >
          {/* Current Location */}
          <button
            type="button"
            onClick={handleCurrentLocation}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100"
          >
            <MapPin size={18} />
            Use Current Location
          </button>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              House / Street Address
            </label>

            <input
              {...register("street", {
                required: "Enter your street address",
                minLength: {
                  value: 3,
                  message: "Enter at least 3 characters",
                },
              })}
              placeholder="House no., street, area"
              className={inputClass(errors.street)}
            />

            <FieldError error={errors.street} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                City
              </label>

              <input
                {...register("city", {
                  required: "Enter your city",
                })}
                placeholder="City"
                className={inputClass(errors.city)}
              />

              <FieldError error={errors.city} />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                State
              </label>

              <input
                {...register("state", {
                  required: "Enter your state",
                })}
                placeholder="State"
                className={inputClass(errors.state)}
              />

              <FieldError error={errors.state} />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              PIN Code
            </label>

            <input
              {...register("zipCode", {
                required: "Enter your PIN code",
                pattern: {
                  value: /^[1-9][0-9]{5}$/,
                  message: "Enter a valid 6-digit PIN code",
                },
              })}
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit PIN code"
              className={inputClass(errors.zipCode)}
            />

            <FieldError error={errors.zipCode} />
          </div>

          {/* Address Type */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Address Type
            </label>

            <div className="flex gap-3">
              {[
                { value: "user", label: "Home" },
                { value: "partner", label: "Work / Office" },
              ].map(({ value, label }) => (
                <label
                  key={value}
                  className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-3 text-sm has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50"
                >
                  <input
                    type="radio"
                    value={value}
                    {...register("belongsTo")}
                    className="accent-blue-600"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Save */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-3.5 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {isSubmitting ? (
              <LoaderCircle size={20} className="animate-spin" />
            ) : (
              "Save Address"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Address;