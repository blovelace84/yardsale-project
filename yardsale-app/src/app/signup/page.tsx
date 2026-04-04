"use client";

import Link from "next/link";
import { useState } from "react";
import { goeyToast as toast } from "goey-toast";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target as HTMLFormElement);

    const data = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const result = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      toast.error(result?.error ?? "Could not create account");
    } else {
      toast.success("Account created 🎉");
      window.location.href = "/login";
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f2f5] px-4 py-10">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[420px_1.1fr]">
        <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
          <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
          <p className="mt-2 text-sm text-slate-500">
            Join your neighborhood marketplace and start posting in minutes.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <input
              name="name"
              placeholder="Name"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 caret-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1877f2]"
            />

            <input
              name="email"
              placeholder="Email"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 caret-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1877f2]"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 caret-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1877f2]"
              required
            />

            <button className="w-full rounded-2xl bg-[#1877f2] py-3 font-semibold text-white shadow-sm">
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#1877f2]">
              Log in
            </Link>
          </p>
        </div>

        <div className="hidden rounded-[28px] bg-slate-900 p-8 text-white shadow-xl lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
            Start selling
          </p>
          <h2 className="mt-3 text-4xl font-bold leading-tight">
            Make your listings feel more polished from day one.
          </h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-200">
            <li>• Cleaner cards for browsing local deals</li>
            <li>• Friendlier entry points for buyers and sellers</li>
            <li>• A more modern social-marketplace vibe</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
