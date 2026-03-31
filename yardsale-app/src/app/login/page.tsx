"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={() => signIn("google")}
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Continue with Google
      </button>
    </div>
  );
}
