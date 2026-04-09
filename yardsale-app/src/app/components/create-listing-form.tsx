"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { goeyToast as toast } from "goey-toast";

export default function CreateListingForm() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
        toast.success("Image selected 📸");
      } else {
        toast.error("Could not read image");
      }
    };

    reader.onerror = () => {
      toast.error("Could not read image");
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target as HTMLFormElement);

    const data = {
      title: form.get("title"),
      description: form.get("description"),
      price: Number(form.get("price")),
      imageUrl,
    };

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      toast.success("Listing created 🎉");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-blue-950">Create Listing</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block mb-1 text-sm font-medium text-blue-950">
            Upload Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border p-2 rounded text-blue-950"
          />

          {imageUrl && (
            <img
              src={imageUrl}
              className="mt-3 w-full h-48 object-cover rounded"
            />
          )}
        </div>

        {/* Title */}
        <input
          name="title"
          placeholder="Item title"
          className="w-full border p-2 rounded text-blue-950"
          required
        />

        {/* Price */}
        <input
          name="price"
          type="number"
          placeholder="Price"
          className="w-full border p-2 rounded text-blue-950"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2 rounded text-blue-950"
          required
        />

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          {loading ? "Creating..." : "Post Listing"}
        </button>
      </form>
    </div>
  );
}
