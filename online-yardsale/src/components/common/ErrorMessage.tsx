import { TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";

interface ErrorMessageProps {
  title?: string;
  message?: string;

  retryText?: string;
  onRetry?: () => void;

  secondaryActionText?: string;
  secondaryActionTo?: string;
}

function ErrorMessage({
  title = "Something went wrong",
  message,
  retryText = "Try again",
  onRetry,
  secondaryActionText,
  secondaryActionTo,
}: ErrorMessageProps) {
  return (
    <section
      className="flex w-full justify-center px-4 py-16"
      role="alert"
      aria-live="assertive"
    >
      {/* Error Icon */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
        <TriangleAlert size={36} className="text-red-600" aria-hidden="true" />
      </div>

      {/* Error information */}
      <h2 className="mt-6 text-2xl font-bold text-slate-900">{title}</h2>

      <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
        {message}
      </p>
      {/* Retry and secondary actions could go here */}
      {(onRetry || (secondaryActionText && secondaryActionTo)) && (
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              {retryText}
            </button>
          )}

          {secondaryActionText && secondaryActionTo && (
            <Link
              to={secondaryActionTo}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              {secondaryActionText}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

export default ErrorMessage;
