"use client";

import { useState } from "react";
import { goeyToast as toast } from "goey-toast";

export default function ContactSeller({
  sellerEmail,
  listingTitle,
  sellerId,
  listingId,
}: {
  sellerEmail: string;
  listingTitle: string;
  sellerId: string;
  listingId: string;
}) {
  const [message, setMessage] = useState("");

  async function handleContact() {
    if (!message) {
      toast.error("Please enter a message");
      return;
    }

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
        receiverId: sellerId,
        listingId,
      }),
    });

    const payload = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMessage =
        payload && typeof payload.error === "string"
          ? payload.error
          : "Could not send message";

      toast.error(errorMessage);
      return;
    }

    toast.success("Message sent!");
    setMessage("");
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-lg font-semibold text-slate-900">
            Contact seller
          </h3>
          <p className="text-sm text-slate-600">
            Ask if this is still available
          </p>
        </div>
        <div className="h-10 w-10 rounded-full bg-[#e7f3ff]" />
      </div>

      <textarea
        className="min-h-28 w-full resize-y rounded-xl border border-slate-300 bg-white p-3 text-slate-800 outline-none ring-[#1877f2] transition focus:border-[#1877f2] focus:ring-2"
        placeholder={`Message to ${listingTitle}`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="inline-flex w-full items-center cursor-pointer justify-center rounded-xl bg-[#1877f2] px-4 py-3 font-semibold text-white shadow-sm hover:bg-[#1668d4] active:scale-[0.99]"
        onClick={handleContact}
      >
        Send Message
      </button>
    </div>
  );
}
