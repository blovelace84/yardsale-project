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

      if (res.status === 401) {
        toast.error("Please log in to create a listing");
        router.push("/login?callbackUrl=/create");
        return;
      }

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
    <section className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[1fr_1.25fr]">
      <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-2xl font-bold text-slate-900">
          Create listing
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Fill in your item details to reach local buyers quickly.
        </p>

        <div className="mt-6 space-y-2 text-sm text-slate-600">
          <p className="rounded-xl bg-slate-50 px-3 py-2">
            1. Add clear photos
          </p>
          <p className="rounded-xl bg-slate-50 px-3 py-2">
            2. Set a fair price
          </p>
          <p className="rounded-xl bg-slate-50 px-3 py-2">
            3. Write a useful description
          </p>
        </div>
      </aside>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="mb-5 text-lg font-semibold text-slate-900">
          Item details
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Photos
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-800 file:mr-3 file:rounded-lg file:border-0 file:bg-[#e7f3ff] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-[#1877f2]"
            />

            {imageUrl && (
              <img
                src={imageUrl}
                alt="Listing preview"
                className="mt-3 h-56 w-full rounded-xl object-cover"
              />
            )}
          </div>

          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Title
            </label>
            <input
              name="title"
              placeholder="What are you selling?"
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-800 outline-none ring-[#1877f2] transition focus:border-[#1877f2] focus:ring-2"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Price
            </label>
            <input
              name="price"
              type="number"
              placeholder="0"
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-800 outline-none ring-[#1877f2] transition focus:border-[#1877f2] focus:ring-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe condition, features, and pickup details"
              className="min-h-32 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-slate-800 outline-none ring-[#1877f2] transition focus:border-[#1877f2] focus:ring-2"
              required
            />
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="mt-2 inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#1877f2] px-4 py-3 font-semibold text-white shadow-sm hover:bg-[#1668d4] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating..." : "Publish listing"}
          </button>
        </form>
      </div>
    </section>
  );
}
