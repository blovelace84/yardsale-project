"use client";

import { useState } from "react";
import { goeyToast as toast } from "goey-toast";

export default function ContactSeller({
  sellerEmail,
  listingTitle,
}: {
  sellerEmail: string;
  listingTitle: string;
}) {
  const [message, setMessage] = useState("");

  function handleContact() {
    if (!message) {
      toast.error("Please enter a message");
      return;
    }

    // For now: simulate a sending message
    console.log("Message to:", sellerEmail);
    console.log("Message:", message);

    toast.success("Message sent to seller!");
    setMessage("");
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      <h3 className="font-semibold text-gray-800">Contact Seller</h3>

      <textarea
        className="w-full p-2 border rounded text-gray-800"
        placeholder={`Message to ${listingTitle}`}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleContact}
      >
        Send Message
      </button>
    </div>
  );
}
