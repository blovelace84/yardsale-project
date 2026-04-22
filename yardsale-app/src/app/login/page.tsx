"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { goeyToast as toast } from "goey-toast";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target as HTMLFormElement);

    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid credentials");
    } else {
      toast.success("Logged in!");
      window.location.href = "/";
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f2f5] px-4 py-10">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_420px]">
        <div className="hidden rounded-[28px] bg-[#1877f2] p-8 text-white shadow-xl lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
            Welcome back
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight">
            Buy, sell, and message neighbors with ease.
          </h1>
          <p className="mt-4 max-w-md text-sm text-blue-50">
            A cleaner, friendlier marketplace look helps your community feel
            active and trustworthy.
          </p>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
          <h1 className="text-3xl font-bold text-slate-900">Login</h1>
          <p className="mt-2 text-sm text-slate-500">
            Check the latest listings and connect with local sellers.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <input
              name="email"
              placeholder="Email"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 caret-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-[#1877f2]"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 caret-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-[#1877f2]"
              required
            />

            <button className="w-full rounded-2xl bg-[#1877f2] py-3 font-semibold text-white shadow-sm cursor-pointer">
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <button
            onClick={() => signIn("google")}
            className="mt-3 w-full rounded-2xl border border-slate-200 py-3 font-medium text-slate-700 cursor-pointer"
          >
            Continue with Google
          </button>

          <p className="mt-4 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#1877f2] cursor-pointer"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
