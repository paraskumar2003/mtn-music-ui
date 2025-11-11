import type { Route } from "./+types/home";
import { Form, redirect, useActionData } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register | MyApp" },
    { name: "description", content: "Create a new account" },
  ];
}

export default function Register() {
  const actionData = useActionData<{ error?: string }>();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          Create Account ✨
        </h1>

        <Form method="post" className="space-y-6">
          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="mobile"
            >
              Mobile Number
            </label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              placeholder="+91 98765 43210"
            />
          </div>

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
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
          >
            Register
          </button>

          {actionData?.error && (
            <p className="text-red-600 text-center mt-4">{actionData.error}</p>
          )}
        </Form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign In
          </a>
        </p>
      </div>
    </main>
  );
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const mobile = formData.get("mobile");
  const email = formData.get("email");

  if (!name || !mobile || !email) {
    return { error: "All fields are required" };
  }

  // Simulate user creation
  console.log("New user registered:", { name, mobile, email });

  // Redirect to quiz after successful registration
  throw redirect("/quiz");
}
