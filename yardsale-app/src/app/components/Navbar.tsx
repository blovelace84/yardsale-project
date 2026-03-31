"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut, signIn } from "next-auth/react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-800">
            Tee Dee Street Yardsale
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-gray-600 text-gray-800">
              Home
            </Link>
            <Link href="/create" className="hover:text-gray-600 text-gray-800">
              Sell
            </Link>

            {session ? (
              <button
                onClick={() => signOut()}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex items-center"
          >
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-black"></span>
              <span className="block w-6 h-0.5 bg-black"></span>
              <span className="block w-6 h-0.5 bg-black"></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          <Link href="/" className="block">
            Home
          </Link>
          <Link href="/create" className="block">
            Sell
          </Link>

          <button className="w-full bg-black text-white px-4 py-2 rounded-lg">
            Login
          </button>
        </div>
      )}
    </nav>
  );
}
