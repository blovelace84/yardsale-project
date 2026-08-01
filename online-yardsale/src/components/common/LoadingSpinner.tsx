import { LoaderCircle, ShoppingBag } from "lucide-react";

interface LoadingSpinnerProps {
  title?: string;
  message?: string;
  fullscreen?: boolean;
}

function LoadingSpinner({
  title = "Loading",
  message = "Please wait while we get things ready for you.",
  fullscreen = false,
}: LoadingSpinnerProps) {
  const containerClasses = fullscreen
    ? "fixed inset-0 flex flex-col items-center justify-center bg-white z-50"
    : "flex flex-col items-center justify-center";

  return (
    <section className={containerClasses} aria-live="polite" aria-busy="true">
      <div className="w-full max-w-sm text-center">
       <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
  {/* Background circle */}
  <div className="absolute inset-0 rounded-full bg-emerald-100" />

  {/* Spinning outer ring */}
  <LoaderCircle
    size={96}
    className="absolute animate-spin text-emerald-600"
    strokeWidth={1.5}
    aria-hidden="true"
  />

  {/* YardSale shopping bag */}
  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
    <ShoppingBag
      size={28}
      className="text-emerald-700"
      aria-hidden="true"
    />
  </div>
</div>

      <h2 className="mt-6 text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-slate-600">{message}</p>

      <div className="mx-auto mt-5 flex w-24 justify-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
        <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse delay-150"></span>
        <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse delay-300"></span>
      </div>
      </div>
    </section>
  );
}

export default LoadingSpinner;
