
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Wrench,
  MapPin,
  FileText,
  Send,
  ChevronRight,
  CheckCircle2,
  Info,
  LoaderCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const services = [
  "Plumbing",
  "Electrician",
  "Painting",
  "Cleaning",
  "Carpentry",
  "AC Repair",
  "Appliance Repair",
];

const addresses = [
  {
    id: "address1",
    label: "Home",
    address: "123 Green Park, Mumbai, Maharashtra",
  },
  {
    id: "address2",
    label: "Work",
    address: "456 Business Park, Mumbai, Maharashtra",
  },
];

const Application = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      service: "",
      selectedAddress: "",
      additionalDetails: "",
    },
  });

  const values = useWatch({ control });

  const selectedService = services.find(
    (service) => service === values.service
  );

  const selectedAddress = addresses.find(
    (address) => address.id === values.selectedAddress
  );

  const additionalDetails = values.additionalDetails || "";

  const onSubmit = async (data) => {
    setSubmitted(false);

    const applicationData = {
      service: data.service,
      selectedAddress: data.selectedAddress,
      additionalDetails: data.additionalDetails.trim(),
    };

    // Replace these values with MongoDB ObjectIds from your API.
    // The backend should derive the user ID from authentication.
    console.log("Application Data:", applicationData);

    // Example:
    // await axios.post("/api/applications", applicationData);

    setSubmitted(true);
  };

  const fieldClass = (hasError) =>
    `w-full h-14 rounded-xl border ${
      hasError
        ? "border-red-500 bg-red-50"
        : "border-gray-200 bg-gray-50"
    } text-gray-800 outline-none transition
    focus:border-blue-500 focus:ring-4 focus:ring-blue-100`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* Header */}
      <header className="h-[72px] bg-white border-b border-gray-200 flex items-center px-6 sm:px-10">
        <a href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center">
            <MapPin className="text-white" size={26} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-blue-800 tracking-wide">
              SEVANEAR
            </h1>
            <p className="text-xs text-gray-500">
              Local Services, Trusted People.
            </p>
          </div>
        </a>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a href="/dashboard" className="hover:text-blue-600">
            Dashboard
          </a>
          <ChevronRight size={16} />
          <span className="text-blue-600 font-medium">
            New Application
          </span>
        </div>

        {/* Page Heading */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full mb-3">
            <FileText size={14} />
            Service Request
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Apply for a Service
          </h2>

          <p className="mt-3 text-gray-500 max-w-2xl leading-6">
            Tell us what you need. Our team will review your application
            and assign a trusted professional once it is approved.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-[1.5fr_0.85fr] gap-6 lg:gap-8 items-start">

          {/* Application Form */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            <div className="p-6 sm:p-8 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FileText className="text-blue-600" size={24} />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    New Service Application
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Complete the form to submit your request.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="p-6 sm:p-8 space-y-7"
            >

              {/* Service */}
              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Select Service <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Wrench
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />

                  <select
                    id="service"
                    {...register("service", {
                      required: "Please select a service.",
                    })}
                    aria-invalid={!!errors.service}
                    className={`${fieldClass(!!errors.service)} pl-12 pr-4 appearance-none cursor-pointer`}
                  >
                    <option value="">Choose a service</option>

                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>

                  <ChevronRight
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none"
                  />
                </div>

                {errors.service && (
                  <p className="text-sm text-red-600 mt-2" role="alert">
                    {errors.service.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="selectedAddress"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Select Address <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <MapPin
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />

                  <select
                    id="selectedAddress"
                    {...register("selectedAddress", {
                      required: "Please select a service address.",
                    })}
                    aria-invalid={!!errors.selectedAddress}
                    className={`${fieldClass(!!errors.selectedAddress)} pl-12 pr-4 appearance-none cursor-pointer`}
                  >
                    <option value="">Choose your address</option>

                    {addresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.label} - {address.address}
                      </option>
                    ))}
                  </select>

                  <ChevronRight
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none"
                  />
                </div>

                {errors.selectedAddress && (
                  <p className="text-sm text-red-600 mt-2" role="alert">
                    {errors.selectedAddress.message}
                  </p>
                )}

                <NavLink
                  to="/addresses"
                  className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  <MapPin size={15} />
                  Manage saved addresses
                  <ChevronRight size={15} />
                </NavLink>
              </div>

              {/* Additional Details */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="additionalDetails"
                    className="text-sm font-bold text-gray-700"
                  >
                    Additional Details
                    <span className="text-gray-400 font-normal ml-2">
                      (Optional)
                    </span>
                  </label>
                </div>

                <textarea
                  id="additionalDetails"
                  rows={5}
                  maxLength={500}
                  placeholder="Describe your requirement, issue, preferred time, or any special instructions..."
                  {...register("additionalDetails", {
                    maxLength: {
                      value: 500,
                      message: "Maximum 500 characters allowed.",
                    },
                  })}
                  aria-invalid={!!errors.additionalDetails}
                  className={`w-full rounded-xl border ${
                    errors.additionalDetails
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 bg-gray-50"
                  } p-4 text-gray-800 placeholder:text-gray-400 outline-none resize-y transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100`}
                />

                <div className="flex justify-between items-center mt-2">
                  {errors.additionalDetails ? (
                    <p className="text-sm text-red-600" role="alert">
                      {errors.additionalDetails.message}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Share any details that can help us understand your needs.
                    </p>
                  )}

                  <span className="text-xs text-gray-400 tabular-nums">
                    {additionalDetails.length}/500
                  </span>
                </div>
              </div>

             

              {/* Success Message */}
              {submitted && (
                <div
                  role="status"
                  className="flex gap-3 rounded-xl bg-green-50 border border-green-200 p-4 text-green-800"
                >
                  <CheckCircle2 size={21} className="shrink-0" />
                  <div>
                    <p className="font-bold text-sm">
                      Form submitted successfully!
                    </p>
                    <p className="text-sm mt-1">
                      This is a frontend demo. Connect your backend
                      to save the application.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold flex items-center justify-center gap-2 transition shadow-sm shadow-orange-100"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle size={20} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={19} />
                    Submit Application
                    <ArrowRightIcon />
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-400">
                Please check your details before submitting.
              </p>
            </form>
          </section>

          {/* Application Summary */}
          <aside className="space-y-5">

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

              <div className="p-6 bg-blue-50 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                    <FileText size={24} className="text-blue-600" />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      Application Summary
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Review your selected details.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">

                {/* Service Summary */}
                <SummaryItem
                  icon={<Wrench size={20} />}
                  label="Selected Service"
                  value={selectedService || "Not selected"}
                  selected={!!selectedService}
                />

                <div className="border-t border-gray-100" />

                {/* Address Summary */}
                <SummaryItem
                  icon={<MapPin size={20} />}
                  label="Service Address"
                  value={
                    selectedAddress
                      ? `${selectedAddress.label} - ${selectedAddress.address}`
                      : "Not selected"
                  }
                  selected={!!selectedAddress}
                />

                <div className="border-t border-gray-100" />

                {/* Details Summary */}
                <SummaryItem
                  icon={<FileText size={20} />}
                  label="Additional Details"
                  value={
                    additionalDetails.trim() ||
                    "No additional details"
                  }
                  selected={!!additionalDetails.trim()}
                />

              </div>
            </div>

            {/* Process Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-5">
                Application Process
              </h3>

              <div className="space-y-5">
                <ProcessStep
                  number="01"
                  title="Submit Application"
                  description="Choose your service and address."
                  active
                />

                <ProcessStep
                  number="02"
                  title="Admin Review"
                  description="Our team reviews your request."
                />

                <ProcessStep
                  number="03"
                  title="Partner Assignment"
                  description="A partner is assigned after approval."
                />
              </div>
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
};

// Summary item
const SummaryItem = ({ icon, label, value, selected }) => (
  <div className="flex items-start gap-4">
    <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
      {icon}
    </div>

    <div className="min-w-0">
      <p className="text-sm font-bold text-gray-800">{label}</p>

      <p
        className={`text-sm mt-1 leading-6 break-words ${
          selected ? "text-gray-700" : "text-gray-400"
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

// Process step
const ProcessStep = ({ number, title, description, active }) => (
  <div className="flex items-start gap-3">
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {number}
    </div>

    <div>
      <p className="text-sm font-bold text-gray-800">{title}</p>
      <p className="text-sm text-gray-500 mt-1 leading-5">
        {description}
      </p>
    </div>
  </div>
);

// Small arrow icon
const ArrowRightIcon = () => (
  <ChevronRight size={20} />
);

export default Application;