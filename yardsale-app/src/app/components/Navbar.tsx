"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877f2] text-lg font-bold text-white shadow-sm">
                Y
              </span>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">
                  Tee Dee Street
                </p>
                <p className="text-xs text-slate-500">Yardsale Marketplace</p>
              </div>
            </Link>

            <div className="hidden md:flex">
              <div className="flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-500">
                <span className="mr-2">🔎</span>
                <span>Search listings</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Home
            </Link>
            <Link
              href="/create"
              className="rounded-full bg-[#e7f3ff] px-4 py-2 text-sm font-semibold text-[#1877f2] hover:bg-[#dbeafe]"
            >
              Sell
            </Link>

            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-[#1877f2] px-4 py-2 text-sm font-semibold text-white shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center rounded-full border border-slate-200 p-2 md:hidden"
            aria-label="Toggle menu"
          >
            <div className="space-y-1">
              <span className="block h-0.5 w-5 bg-slate-800"></span>
              <span className="block h-0.5 w-5 bg-slate-800"></span>
              <span className="block h-0.5 w-5 bg-slate-800"></span>
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto max-w-7xl space-y-2">
            <Link
              href="/"
              className="block rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100"
            >
              Home
            </Link>
            <Link
              href="/create"
              className="block rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100"
            >
              Sell
            </Link>

            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full rounded-xl bg-slate-900 px-4 py-2 text-white"
              >
                Logout
              </button>
            ) : (
              <div className="space-y-2 pt-2">
                <Link
                  href="/login"
                  className="block w-full rounded-xl border border-slate-200 px-4 py-2 text-center font-medium text-slate-700"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block w-full rounded-xl bg-[#1877f2] px-4 py-2 text-center font-medium text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
