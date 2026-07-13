import {
  ImagePlus,
  LoaderCircle,
  MapPin,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { ChangeEvent, ComponentProps } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createListing } from "../services/listingServices";
import {
  uploadListingImages,
  validateListingImage,
} from "../services/uploadService";
import type {
  ListingCondition,
} from "../types/listing";

type FormSubmitHandler = NonNullable<
  ComponentProps<"form">["onSubmit"]
>;

const categories = [
  "Furniture",
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Games",
  "Books",
  "Sporting Goods",
  "Tools",
  "Collectibles",
  "Other",
];

const MAX_IMAGES = 5;

function CreateListing() {
  const navigate = useNavigate();
  const { user, isAuthLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] =
    useState<ListingCondition>("USED");
  const [city, setCity] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewUrls = useMemo(
    () => images.map((image) => URL.createObjectURL(image)),
    [images],
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setError("");

    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    if (images.length + selectedFiles.length > MAX_IMAGES) {
      setError(`You may upload up to ${MAX_IMAGES} images.`);
      event.target.value = "";
      return;
    }

    try {
      selectedFiles.forEach(validateListingImage);

      setImages((currentImages) => [
        ...currentImages,
        ...selectedFiles,
      ]);
    } catch (imageError) {
      setError(
        imageError instanceof Error
          ? imageError.message
          : "One or more images could not be added.",
      );
    } finally {
      event.target.value = "";
    }
  }

  function removeImage(indexToRemove: number) {
    setImages((currentImages) =>
      currentImages.filter((_, index) => index !== indexToRemove),
    );
  }

  const handleSubmit: FormSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");

    if (!user) {
      setError("You must log in before creating a listing.");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedCity = city.trim();
    const numericPrice = Number(price);

    if (!trimmedTitle) {
      setError("Enter a title for your listing.");
      return;
    }

    if (trimmedTitle.length < 3) {
      setError("The title must contain at least 3 characters.");
      return;
    }

    if (!trimmedDescription) {
      setError("Enter a description for your item.");
      return;
    }

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      setError("Enter a valid price.");
      return;
    }

    if (!category) {
      setError("Select a category.");
      return;
    }

    if (!trimmedCity) {
      setError("Enter the city where the item is located.");
      return;
    }

    if (images.length === 0) {
      setError("Add at least one image.");
      return;
    }

    try {
      setIsSubmitting(true);

      const listingUploadId = crypto.randomUUID();

      const uploadedImages = await uploadListingImages(
        images,
        user.uid,
        listingUploadId,
      );

      const listingReference = await createListing({
        title: trimmedTitle,
        description: trimmedDescription,
        price: numericPrice,
        category,
        condition,
        city: trimmedCity,
        imageUrls: uploadedImages.map((image) => image.url),
        imagePaths: uploadedImages.map((image) => image.path),
        sellerId: user.uid,
        sellerName:
          user.displayName?.trim() ||
          user.email?.split("@")[0] ||
          "YardSale seller",
        sellerEmail: user.email ?? "",
      });

      navigate(`/listing/${listingReference.id}`);
    } catch (submissionError) {
      console.error("Create listing error:", submissionError);

      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Your listing could not be created.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <section className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Log in to sell an item
        </h1>

        <p className="mt-3 text-slate-600">
          You need an account before you can create a listing.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/login"
            className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Log in
          </Link>

          <Link
            to="/signup"
            className="rounded-xl border border-emerald-600 px-5 py-3 font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            Create account
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="font-semibold text-emerald-700">
          Sell on YardSale
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Create a listing
        </h1>

        <p className="mt-2 text-slate-600">
          Add clear information and photos to help buyers understand
          what you are selling.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form
        className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        onSubmit={handleSubmit}
      >
        <div>
          <label
            htmlFor="listing-title"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Title
          </label>

          <input
            id="listing-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Example: Solid wood dining table"
            maxLength={100}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
          />

          <p className="mt-1 text-right text-xs text-slate-500">
            {title.length}/100
          </p>
        </div>

        <div>
          <label
            htmlFor="listing-description"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Description
          </label>

          <textarea
            id="listing-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the condition, size, age, and any important details."
            rows={6}
            maxLength={2000}
            disabled={isSubmitting}
            className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
          />

          <p className="mt-1 text-right text-xs text-slate-500">
            {description.length}/2000
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="listing-price"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Price
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                $
              </span>

              <input
                id="listing-price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="0.00"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-300 py-3 pl-8 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="listing-category"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Category
            </label>

            <select
              id="listing-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
            >
              <option value="">Select a category</option>

              {categories.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-700">
            Condition
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {(
              [
                ["NEW", "New"],
                ["USED", "Used"],
                ["AS_IS", "As-is"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={[
                  "cursor-pointer rounded-xl border px-4 py-3 text-center font-medium transition",
                  condition === value
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 text-slate-700 hover:border-emerald-300",
                  isSubmitting
                    ? "cursor-not-allowed opacity-60"
                    : "",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="condition"
                  value={value}
                  checked={condition === value}
                  onChange={() => setCondition(value)}
                  disabled={isSubmitting}
                  className="sr-only"
                />

                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="listing-city"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Item location
          </label>

          <div className="relative">
            <MapPin
              size={19}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="listing-city"
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Example: Raleigh, NC"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
            />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Listing images
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Add up to {MAX_IMAGES} JPG, PNG, or WebP images.
              </p>
            </div>

            <span className="text-sm text-slate-500">
              {images.length}/{MAX_IMAGES}
            </span>
          </div>

          <label
            htmlFor="listing-images"
            className={[
              "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition",
              isSubmitting || images.length >= MAX_IMAGES
                ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                : "border-slate-300 hover:border-emerald-400 hover:bg-emerald-50",
            ].join(" ")}
          >
            <ImagePlus
              size={34}
              aria-hidden="true"
              className="text-emerald-600"
            />

            <span className="mt-3 font-semibold text-slate-800">
              Select images
            </span>

            <span className="mt-1 text-sm text-slate-500">
              Maximum size: 5 MB per image
            </span>

            <input
              id="listing-images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={
                isSubmitting || images.length >= MAX_IMAGES
              }
              onChange={handleImageChange}
              className="sr-only"
            />
          </label>

          {images.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {images.map((image, index) => (
                <div
                  key={`${image.name}-${image.lastModified}-${index}`}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                >
                  <img
                    src={previewUrls[index]}
                    alt={`Preview of ${image.name}`}
                    className="aspect-square w-full object-cover"
                  />

                  {index === 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-slate-900/80 px-2 py-1 text-xs font-semibold text-white">
                      Cover
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={isSubmitting}
                    aria-label={`Remove ${image.name}`}
                    className="absolute right-2 top-2 rounded-full bg-white/95 p-2 text-red-600 shadow transition hover:bg-red-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={17} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
        >
          {isSubmitting && (
            <LoaderCircle
              size={20}
              aria-hidden="true"
              className="animate-spin"
            />
          )}

          {isSubmitting
            ? "Uploading and publishing..."
            : "Publish listing"}
        </button>
      </form>
    </section>
  );
}

export default CreateListing;