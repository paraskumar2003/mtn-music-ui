import type { Route } from "./+types/login";
import { Form, useActionData, redirect } from "react-router";
import * as yup from "yup";
import { useState, useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login | MyApp" },
    { name: "description", content: "Login using email and OTP" },
  ];
}

export default function Login() {
  const actionData = useActionData<{
    error?: string;
    step?: "email" | "otp";
    email?: string;
  }>();

  const [email, setEmail] = useState("");

  const isOtpStep = actionData?.step === "otp";

  // Reset email field after switching to OTP step
  useEffect(() => {
    if (isOtpStep && actionData?.email) {
      setEmail(actionData.email);
    }
  }, [isOtpStep, actionData]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          Sign In with OTP 🔐
        </h1>

        <Form method="post" className="space-y-6">
          {!isOtpStep ? (
            <>
              {/* Email Input */}
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                name="_action"
                value="sendOtp"
                className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-transparent"
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
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
                  Enter OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                  placeholder="Enter 6-digit OTP"
                />
              </div>
              <button
                type="submit"
                name="_action"
                value="verifyOtp"
                className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-transparent"
              >
                Verify & Continue
              </button>
            </>
          )}

          {actionData?.error && (
            <p className="text-red-600 text-center mt-4">{actionData.error}</p>
          )}
        </Form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("_action");
  const email = formData.get("email")?.toString();

  const emailSchema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email is required"),
  });

  const otpSchema = yup.object({
    otp: yup
      .string()
      .matches(/^\d{6}$/, "OTP must be a 6-digit number")
      .required("OTP is required"),
  });

  if (actionType === "sendOtp") {
    try {
      await emailSchema.validate({ email }, { abortEarly: false });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        return { error: err.errors[0], step: "email" };
      }
      return { error: "Unexpected error", step: "email" };
    }
    console.log("OTP sent to:", email);
    return { step: "otp", email };
  }

  if (actionType === "verifyOtp") {
    const otp = formData.get("otp")?.toString();
    try {
      await otpSchema.validate({ otp }, { abortEarly: false });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        return { error: err.errors[0], step: "otp", email };
      }
      return { error: "Unexpected error", step: "otp", email };
    }

    if (otp === "111111") {
      throw redirect("/quiz");
    }
    return { error: "Invalid OTP", step: "otp", email };
  }

  return null;
}
