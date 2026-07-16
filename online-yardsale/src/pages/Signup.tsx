import { useReducer } from "react";
import type { ComponentProps } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { createAccount } from "../services/authServices";
import { getAuthErrorMessage } from "../utils/firebaseErrors";

type FormSubmitHandler = NonNullable<
  ComponentProps<"form">["onSubmit"]
>;

type SignupField =
  | "name"
  | "email"
  | "password"
  | "confirmPassword";

interface SignupState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  error: string;
  isSubmitting: boolean;
}

type SignupAction =
  | {
      type: "UPDATE_FIELD";
      field: SignupField;
      value: string;
    }
  | {
      type: "SET_ERROR";
      error: string;
    }
  | {
      type: "START_SUBMIT";
    }
  | {
      type: "FINISH_SUBMIT";
    }
  | {
      type: "RESET";
    };

interface SignupLocationState {
  from?: {
    pathname?: string;
    search?: string;
    hash?: string;
  };
}

const initialSignupState: SignupState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  error: "",
  isSubmitting: false,
};

function signupReducer(
  state: SignupState,
  action: SignupAction,
): SignupState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
        error: "",
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
      };

    case "START_SUBMIT":
      return {
        ...state,
        error: "",
        isSubmitting: true,
      };

    case "FINISH_SUBMIT":
      return {
        ...state,
        isSubmitting: false,
      };

    case "RESET":
      return initialSignupState;

    default:
      return state;
  }
}

function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthLoading } = useAuth();

  const [state, dispatch] = useReducer(
    signupReducer,
    initialSignupState,
  );

  const {
    name,
    email,
    password,
    confirmPassword,
    error,
    isSubmitting,
  } = state;

  const locationState =
    location.state as SignupLocationState | null;

  const redirectPath = locationState?.from
    ? `${locationState.from.pathname ?? ""}${
        locationState.from.search ?? ""
      }${locationState.from.hash ?? ""}`
    : "/dashboard";

  function updateField(
    field: SignupField,
    value: string,
  ): void {
    dispatch({
      type: "UPDATE_FIELD",
      field,
      value,
    });
  }

  function validateForm(): string | null {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      return "Enter your name.";
    }

    if (trimmedName.length < 2) {
      return "Your name must contain at least 2 characters.";
    }

    if (!trimmedEmail) {
      return "Enter your email address.";
    }

    if (password.length < 6) {
      return "Your password must contain at least 6 characters.";
    }

    if (password !== confirmPassword) {
      return "Your passwords do not match.";
    }

    return null;
  }

  const handleSubmit: FormSubmitHandler = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      dispatch({
        type: "SET_ERROR",
        error: validationError,
      });

      return;
    }

    dispatch({
      type: "START_SUBMIT",
    });

    try {
      await createAccount(
        name.trim(),
        email.trim(),
        password,
      );

      dispatch({
        type: "RESET",
      });

      navigate(redirectPath, {
        replace: true,
      });
    } catch (signupError: unknown) {
      dispatch({
        type: "SET_ERROR",
        error: getAuthErrorMessage(signupError),
      });
    } finally {
      dispatch({
        type: "FINISH_SUBMIT",
      });
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
          Join the marketplace
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Create an account
        </h1>

        <p className="mt-2 text-slate-600">
          Sign up to buy, sell, save favorites, and manage
          your listings.
        </p>

        {locationState?.from && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Create an account to continue to the page you
            requested.
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
              onChange={(event) =>
                updateField("name", event.target.value)
              }
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
              onChange={(event) =>
                updateField("email", event.target.value)
              }
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
              onChange={(event) =>
                updateField("password", event.target.value)
              }
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
              onChange={(event) =>
                updateField(
                  "confirmPassword",
                  event.target.value,
                )
              }
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
            {isSubmitting
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            state={location.state}
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

