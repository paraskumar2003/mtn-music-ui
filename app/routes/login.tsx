import type { Route } from "./+types/login";
import { Form, useActionData, redirect } from "react-router";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { AuthServices } from "../services/auth/auth.service";
import { accessTokenCookie } from "~/cookies/server";
import DisclaimerModal from "~/components/Modal/DisclaimerModal";
import ConsentModal from "~/components/Modal/ConsentModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login | MTN Profiling" },
    { name: "description", content: "Login using email and OTP" },
  ];
}

export default function Login() {
  const actionData = useActionData<{
    error?: string;
    step?: "email" | "otp";
    email?: string;
    message?: string;
  }>();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [agreements, setAgreements] = useState({
    disclaimer: false,
    consent: false,
  });

  const [formValues, setFormValues] = useState<{
    name: string;
    dateOfBirth: string;
    gender: string;
    educationLevel: string;
    currentRole: string;
    organization: string;
    assessmentPurpose: string;
    email: string;
    mobile: string;
    workExperience: string;
    priorTests: string;
    date_of_birth: string;
  }>({
    name: "",
    dateOfBirth: "",
    gender: "",
    educationLevel: "",
    currentRole: "",
    organization: "",
    assessmentPurpose: "",
    email: "",
    mobile: "",
    workExperience: "",
    priorTests: "",
    date_of_birth: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const isOtpStep = actionData?.step === "otp";

  // Reset email field after switching to OTP step
  useEffect(() => {
    if (isOtpStep && actionData?.email) {
      setEmail(actionData.email);
    }
  }, [isOtpStep, actionData]);

  // Education level options
  const educationOptions = [
    "High School",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate",
    "Diploma/Certificate",
    "Other",
  ];

  // Assessment purpose options
  const purposeOptions = [
    "Hiring / Role Alignment",
    "Career Direction",
    "Academic / School",
    "Personal Understanding",
  ];

  // Gender options
  const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];

  const handleDisclaimerAgree = () => {
    setAgreements((prev) => ({ ...prev, disclaimer: true }));
    setShowDisclaimer(false);
  };

  const handleConsentAgree = () => {
    setAgreements((prev) => ({ ...prev, consent: true }));
    setShowConsent(false);
  };

  const isFormValid = () => {
    if (isOtpStep) return true;

    // Check if all required fields are filled
    const requiredFields = [
      "name",
      "dateOfBirth",
      "gender",
      "educationLevel",
      "currentRole",
      "assessmentPurpose",
      "email",
      "priorTests",
    ];

    const allRequiredFilled = requiredFields.every(
      (field) => formValues[field as keyof typeof formValues]?.trim() !== "",
    );

    // Check both agreements
    const allAgreementsAccepted = agreements.disclaimer && agreements.consent;

    return allRequiredFilled && allAgreementsAccepted;
  };

  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl border border-gray-100 max-h-[80vh] overflow-y-auto scrollbar-hide">
          <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
            Sign Up & Verify Your Identity
          </h1>

          <Form method="post" className="space-y-6">
            {!isOtpStep ? (
              <>
                {/* Full Name */}
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-700"
                    htmlFor="name"
                  >
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formValues.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Date of Birth / Age */}
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-700"
                      htmlFor="dateOfBirth"
                    >
                      Date of Birth *
                    </label>

                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      required
                      max={new Date().toISOString().split("T")[0]} // no future date
                      value={formValues.dateOfBirth || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3
                 focus:ring-2 focus:ring-blue-500 focus:outline-none
                 text-black"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-700"
                      htmlFor="gender"
                    >
                      Gender *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      value={formValues.gender}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                    >
                      <option value="">Select Gender</option>
                      {genderOptions.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Education Level */}
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-700"
                    htmlFor="educationLevel"
                  >
                    Highest Education Level *
                  </label>
                  <select
                    id="educationLevel"
                    name="educationLevel"
                    required
                    value={formValues.educationLevel}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                  >
                    <option value="">Select Education Level</option>
                    {educationOptions.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Current Role / Area of Study */}
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-700"
                    htmlFor="currentRole"
                  >
                    Current Role / Area of Study *
                  </label>
                  <input
                    id="currentRole"
                    name="currentRole"
                    type="text"
                    required
                    value={formValues.currentRole}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                    placeholder="e.g., Software Engineer, Student, Marketing Manager"
                  />
                </div>

                {/* Organization / Institution */}
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-700"
                    htmlFor="organization"
                  >
                    Organisation / Institution (if applicable)
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    value={formValues.organization}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                    placeholder="e.g., Google, Harvard University"
                  />
                </div>

                {/* Purpose of Assessment */}
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-700"
                    htmlFor="assessmentPurpose"
                  >
                    Purpose of Assessment *
                  </label>
                  <select
                    id="assessmentPurpose"
                    name="assessmentPurpose"
                    required
                    value={formValues.assessmentPurpose}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                  >
                    <option value="">Select Purpose</option>
                    {purposeOptions.map((purpose) => (
                      <option key={purpose} value={purpose}>
                        {purpose}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-700"
                      htmlFor="email"
                    >
                      Email ID *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formValues.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                      placeholder="you@example.com"
                    />
                  </div>

                  {/* Phone Number (Optional) */}
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-700"
                      htmlFor="mobile"
                    >
                      Phone Number (Optional)
                    </label>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={formValues.mobile}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                      placeholder="1234567890"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Years of Work Experience */}
                  <div className="space-y-2">
                    <label
                      className="block text-sm font-medium text-gray-700 leading-tight"
                      htmlFor="workExperience"
                    >
                      Years of Work Experience
                      <span className="text-gray-500 font-normal">
                        {" "}
                        (if applicable)
                      </span>
                    </label>
                    <select
                      id="workExperience"
                      name="workExperience"
                      value={formValues.workExperience}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                    >
                      <option value="">Select Experience</option>
                      <option value="0">0 (Fresher)</option>
                      <option value="1-3">1-3 years</option>
                      <option value="4-7">4-7 years</option>
                      <option value="8-12">8-12 years</option>
                      <option value="13+">13+ years</option>
                    </select>
                  </div>

                  {/* Prior Tests */}
                  <div className="space-y-2">
                    <label
                      className="block text-sm font-medium text-gray-700 leading-tight"
                      htmlFor="priorTests"
                    >
                      Prior psychometric/aptitude tests taken? *
                    </label>
                    <select
                      id="priorTests"
                      name="priorTests"
                      required
                      value={formValues.priorTests}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                {/* Mandatory Agreements */}
                <div className="pt-6 border-t border-gray-200 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Mandatory Agreements
                  </h3>

                  {/* Disclaimer Agreement */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="disclaimerAgreement"
                      name="disclaimerAgreement"
                      checked={agreements.disclaimer}
                      onChange={(e) => {
                        if (!e.target.checked) {
                          setAgreements((prev) => ({
                            ...prev,
                            disclaimer: false,
                          }));
                        } else {
                          // setShowDisclaimer(true);
                          setAgreements((prev) => ({
                            ...prev,
                            disclaimer: true,
                          }));
                        }
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1 w-[70vh]">
                      <label
                        htmlFor="disclaimerAgreement"
                        className="font-medium text-gray-800 cursor-pointer"
                      >
                        I agree to the Mandatory Note
                      </label>
                      <p className="text-gray-600 mt-1 text-sm">
                        This is NOT a musical assessment. I will focus only on
                        visual structures and patterns.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowDisclaimer(true)}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium mt-2"
                      >
                        View Mandatory Note →
                      </button>
                    </div>
                    {agreements.disclaimer && (
                      <span className="text-green-600 font-medium text-sm">
                        ✓ Agreed
                      </span>
                    )}
                  </div>

                  {/* Consent Agreement */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="consentAgreement"
                      name="consentAgreement"
                      checked={agreements.consent}
                      onChange={(e) => {
                        if (!e.target.checked) {
                          setAgreements((prev) => ({
                            ...prev,
                            consent: false,
                          }));
                        } else {
                          setAgreements((prev) => ({
                            ...prev,
                            consent: true,
                          }));
                        }
                      }}
                      className="mt-1"
                    />
                    <div className="flex-1 w-[70vh]">
                      <label
                        htmlFor="consentAgreement"
                        className="font-medium text-gray-800 cursor-pointer"
                      >
                        I agree to the Mandatory Research Consent
                      </label>
                      <p className="text-gray-600 mt-1 text-sm">
                        I consent to my anonymous responses being used for
                        research purposes.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowConsent(true)}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium mt-2"
                      >
                        View Research Consent →
                      </button>
                    </div>
                    {agreements.consent && (
                      <span className="text-green-600 font-medium text-sm">
                        ✓ Agreed
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 pt-2">
                    Both agreements must be accepted to proceed with
                    registration.
                  </p>
                </div>

                <button
                  type="submit"
                  name="_action"
                  value="sendOtp"
                  disabled={!isFormValid()}
                  className={`w-full py-3 font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-transparent cursor-pointer ${
                    isFormValid()
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <input
                  type="hidden"
                  className="hidden"
                  name="email"
                  value={actionData?.email || email}
                />

                {/* Include all form data as hidden inputs */}
                <input type="hidden" name="name" value={formValues.name} />
                <input
                  type="hidden"
                  name="dateOfBirth"
                  value={formValues.dateOfBirth}
                />
                <input type="hidden" name="gender" value={formValues.gender} />
                <input
                  type="hidden"
                  name="educationLevel"
                  value={formValues.educationLevel}
                />
                <input
                  type="hidden"
                  name="currentRole"
                  value={formValues.currentRole}
                />
                <input
                  type="hidden"
                  name="organization"
                  value={formValues.organization}
                />
                <input
                  type="hidden"
                  name="assessmentPurpose"
                  value={formValues.assessmentPurpose}
                />
                <input type="hidden" name="mobile" value={formValues.mobile} />
                <input
                  type="hidden"
                  name="workExperience"
                  value={formValues.workExperience}
                />
                <input
                  type="hidden"
                  name="priorTests"
                  value={formValues.priorTests}
                />

                {/* OTP Info */}
                <p className="text-center text-gray-700 text-sm mb-4">
                  An OTP has been sent to <br />
                  <span className="font-semibold text-gray-900">
                    {actionData?.email || email}
                  </span>
                </p>

                {/* OTP Input */}
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-700"
                    htmlFor="otp"
                  >
                    Enter OTP *
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                  />
                </div>
                <button
                  type="submit"
                  name="_action"
                  value="verifyOtp"
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-transparent cursor-pointer"
                >
                  Verify & Continue
                </button>
              </>
            )}

            {actionData?.error && (
              <p className="text-red-600 text-center mt-4">
                {actionData.message || actionData.error}
              </p>
            )}
          </Form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in
            </a>
          </p>
        </div>
      </main>

      {/* Modals */}
      {showDisclaimer && (
        <DisclaimerModal
          onAgree={handleDisclaimerAgree}
          onBack={() => setShowDisclaimer(false)}
        />
      )}

      {showConsent && (
        <ConsentModal
          onAgree={handleConsentAgree}
          onBack={() => setShowConsent(false)}
        />
      )}
    </>
  );
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  // Yup validation schemas
  const sendOtpSchema = yup.object({
    name: yup
      .string()
      .min(2, "Name must be at least 2 characters")
      .required("Full Name is required"),
    dateOfBirth: yup
      .string()
      .required("Date of Birth is required")
      .test("is-adult", "You must be at least 18 years old", (value) => {
        if (!value) return false;
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        return age >= 18;
      }),
    gender: yup
      .string()
      .required("Gender is required")
      .oneOf(
        ["Male", "Female", "Non-binary", "Prefer not to say"],
        "Please select a valid gender",
      ),
    educationLevel: yup
      .string()
      .required("Education Level is required")
      .oneOf(
        [
          "High School",
          "Associate Degree",
          "Bachelor's Degree",
          "Master's Degree",
          "Doctorate",
          "Diploma/Certificate",
          "Other",
        ],
        "Please select a valid education level",
      ),
    currentRole: yup
      .string()
      .min(2, "Current Role must be at least 2 characters")
      .required("Current Role is required"),
    organization: yup.string().optional(),
    assessmentPurpose: yup
      .string()
      .required("Purpose of Assessment is required")
      .oneOf(
        [
          "Hiring / Role Alignment",
          "Career Direction",
          "Academic / School",
          "Personal Understanding",
        ],
        "Please select a valid purpose",
      ),
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    mobile: yup
      .string()
      .optional()
      .test("mobile-format", "Mobile number must be 10 digits", (value) => {
        if (!value) return true; // optional
        return /^\d{10}$/.test(value);
      }),
    workExperience: yup
      .string()
      .optional()
      .oneOf(
        ["", "0", "1-3", "4-7", "8-12", "13+"],
        "Please select a valid experience range",
      ),
    priorTests: yup
      .string()
      .required("Prior tests information is required")
      .oneOf(["yes", "no"], "Please select Yes or No"),
    agreement: yup.boolean(),
  });

  const otpSchema = yup.object({
    otp: yup
      .string()
      .matches(/^\d{6}$/, "OTP must be a 6-digit number")
      .required("OTP is required"),
  });

  console.log("consent", formData.get("consentAgreement"));
  console.log("disclaimerAgreement", formData.get("disclaimerAgreement"));
  console.log("dateOfBirth", formData.get("dateOfBirth"));

  if (actionType === "sendOtp") {
    try {
      const formValues = {
        name: formData.get("name")?.toString() || "",
        dateOfBirth: formData.get("dateOfBirth")?.toString() || "",
        gender: formData.get("gender")?.toString() || "",
        educationLevel: formData.get("educationLevel")?.toString() || "",
        currentRole: formData.get("currentRole")?.toString() || "",
        organization: formData.get("organization")?.toString() || "",
        assessmentPurpose: formData.get("assessmentPurpose")?.toString() || "",
        email: formData.get("email")?.toString() || "",
        mobile: formData.get("mobile")?.toString() || "",
        workExperience: formData.get("workExperience")?.toString() || "",
        priorTests: formData.get("priorTests")?.toString() || "",
        agreement: !!(
          formData.get("consentAgreement") === "on" &&
          formData.get("disclaimerAgreement") === "on"
        ),
      };

      // Validate all fields
      await sendOtpSchema.validate(formValues, { abortEarly: false });

      // Call login service with all data
      let result = await AuthServices.loginWeb({
        email: formValues.email,
        mobile: formValues.mobile || "", // optional
        name: formValues.name,
        dateOfBirth: formValues.dateOfBirth,
        gender: formValues.gender,
        educationLevel: formValues.educationLevel,
        currentRole: formValues.currentRole,
        organization: formValues.organization,
        assessmentPurpose: formValues.assessmentPurpose,
        workExperience: formValues.workExperience,
        priorTests: formValues.priorTests === "yes",
        agreement: formValues.agreement,
      });

      if (result?.err) {
        return { error: result.err, message: result.message, step: "email" };
      }

      if (result?.data?.data?.otp_sent) {
        return { step: "otp", email: formValues.email };
      } else {
        return { error: "OTP not sent", step: "email" };
      }
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        return { error: err.errors[0], step: "email" };
      }
      return { error: "Unexpected error", step: "email" };
    }
  }

  if (actionType === "verifyOtp") {
    const otp = formData.get("otp")?.toString();
    const email = formData.get("email")?.toString();

    try {
      // Validate OTP
      await otpSchema.validate({ otp }, { abortEarly: false });

      if (!email) {
        return { error: "Email is required", step: "otp", email: "" };
      }

      // Get all form data for verification
      const userData = {
        name: formData.get("name")?.toString() || "",
        dateOfBirth: formData.get("dateOfBirth")?.toString() || "",
        gender: formData.get("gender")?.toString() || "",
        educationLevel: formData.get("educationLevel")?.toString() || "",
        currentRole: formData.get("currentRole")?.toString() || "",
        organization: formData.get("organization")?.toString() || "",
        assessmentPurpose: formData.get("assessmentPurpose")?.toString() || "",
        mobile: formData.get("mobile")?.toString() || "",
        workExperience: formData.get("workExperience")?.toString() || "",
        priorTests: formData.get("priorTests")?.toString() || "",
      };

      // Call verify OTP service with all data
      let result = await AuthServices.verifyOtp({
        email: email!,
        otp: otp!,
      });

      if (result?.err) {
        return {
          error: result.err,
          message: result.message,
          step: "otp",
          email,
        };
      }

      if (result?.data?.data?.otp_verified) {
        return redirect("/quiz", {
          headers: {
            "Set-Cookie": await accessTokenCookie.serialize(
              result?.data?.data?.access_token,
            ),
          },
        });
      } else {
        return { error: "Invalid OTP", step: "otp", email };
      }
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        return { error: err.errors[0], step: "otp", email };
      }
      return { error: "Unexpected error", step: "otp", email };
    }
  }

  return null;
}
