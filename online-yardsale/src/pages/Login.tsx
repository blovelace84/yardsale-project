import { useState } from "react";
import type { ComponentProps } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authServices";
import { getAuthErrorMessage } from "../utils/firebaseErrors";

type FormSubmitHandler = NonNullable<
  ComponentProps<"form">["onSubmit"]
>;

interface LoginLocationState {
  from?: {
    pathname?: string;
    search?: string;
    hash?: string;
  };
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationState =
    location.state as LoginLocationState | null;

  const redirectPath = locationState?.from
    ? `${locationState.from.pathname ?? ""}${
        locationState.from.search ?? ""
      }${locationState.from.hash ?? ""}`
    : "/dashboard";

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

      navigate(redirectPath, {
        replace: true,
      });
    } catch (loginError: unknown) {
      setError(getAuthErrorMessage(loginError));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div
            className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600"
            aria-hidden="true"
          />

          <p className="mt-4 text-slate-600">
            Checking your account...
          </p>
        </div>
      </section>
    );
  }

  if (user) {
    return (
      <Navigate
        to={redirectPath}
        replace
      />
    );
  }

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

        {locationState?.from && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Log in to continue to the page you requested.
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit}
        >
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
              onChange={(event) =>
                setEmail(event.target.value)
              }
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
              onChange={(event) =>
                setPassword(event.target.value)
              }
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
            state={location.state}
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