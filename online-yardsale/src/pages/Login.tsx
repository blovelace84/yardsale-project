import { useState } from "react";
import type { ComponentProps } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authServices";
import { getAuthErrorMessage } from "../utils/firebaseErrors";

type FormSubmitHandler = NonNullable<
  ComponentProps<"form">["onSubmit"]
>;

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: FormSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Enter your email address.");
      return;
    }

    if (!password) {
      setError("Enter your password.");
      return;
    }

    try {
      setIsSubmitting(true);

      await loginUser(trimmedEmail, password);

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
          Welcome back
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Log in
        </h1>

        <p className="mt-2 text-slate-600">
          Access your listings, favorites, and account.
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
              htmlFor="login-email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email address
            </label>

            <input
              id="login-email"
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
              htmlFor="login-password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;