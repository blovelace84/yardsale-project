import { useState } from "react";
import type { ComponentProps } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createAccount } from "../services/authServices";
import { getAuthErrorMessage } from "../utils/firebaseErrors";

type FormSubmitHandler = NonNullable<
  ComponentProps<"form">["onSubmit"]
>;

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: FormSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Enter your name.");
      return;
    }

    if (!trimmedEmail) {
      setError("Enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError("Your password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createAccount(trimmedName, trimmedEmail, password);

      navigate("/dashboard");
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="font-semibold text-emerald-700">
          Join the marketplace
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Create an account
        </h1>

        <p className="mt-2 text-slate-600">
          Sign up to buy, sell, save favorites, and manage your listings.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="signup-name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Name
            </label>

            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email address
            </label>

            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="signup-confirm-password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Confirm password
            </label>

            <input
              id="signup-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Enter your password again"
              required
              minLength={6}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Signup;