import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { storage } from "../firebase/firebaseApp";
import { getListingById, updateListing } from "../services/listingServices";
import type { Listing, ListingCondition } from "../types/listing";

interface ExistingImage {
  url: string;
  path: string;
}

interface EditListingFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  city: string;
}

const MAX_IMAGES = 6;

const initialFormData: EditListingFormData = {
  title: "",
  description: "",
  price: "",
  category: "",
  condition: "",
  city: "",
};

const categories = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Home & Garden",
  "Tools",
  "Sports",
  "Toys & Games",
  "Books",
  "Collectibles",
  "Other",
];

const conditions = [
  {
    value: "NEW",
    label: "New",
  },
  {
    value: "USED",
    label: "Used",
  },
  {
    value: "AS_IS",
    label: "As Is",
  },
];

function EditListing() {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();
  const { user, isAuthLoading } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);

  const [formData, setFormData] =
    useState<EditListingFormData>(initialFormData);

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);

  const [removedImages, setRemovedImages] = useState<ExistingImage[]>([]);

  const [newImages, setNewImages] = useState<File[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");

  const newImagePreviews = useMemo(
    () =>
      newImages.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    [newImages],
  );

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, [newImagePreviews]);

  useEffect(() => {
    async function loadListing() {
      if (isAuthLoading) {
        return;
      }

      if (!user) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      if (!id) {
        setError("The listing ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const foundListing = await getListingById(id);

        if (!foundListing) {
          setError("The listing could not be found.");
          return;
        }

        if (foundListing.sellerId !== user.uid) {
          setError("You do not have permission to edit this listing.");

          return;
        }

        setListing(foundListing);

        setFormData({
          title: foundListing.title ?? "",
          description: foundListing.description ?? "",
          price: String(foundListing.price ?? ""),
          category: foundListing.category ?? "",
          condition: foundListing.condition ?? "",
          city: foundListing.city ?? "",
        });

        const currentImages = (foundListing.imageUrls ?? []).map(
          (url, index) => ({
            url,
            path: foundListing.imagePaths?.[index] ?? "",
          }),
        );

        setExistingImages(currentImages);
      } catch (caughtError) {
        console.error("Unable to load listing:", caughtError);

        setError("We could not load this listing. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadListing();
  }, [isAuthLoading, id, navigate, user]);

  const totalImageCount = existingImages.length + newImages.length;

  function handleInputChange(
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function handleImageSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    const availableSlots = MAX_IMAGES - totalImageCount;

    if (availableSlots <= 0) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images.`);

      event.target.value = "";
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      const isImage = file.type.startsWith("image/");

      const isUnderSizeLimit = file.size <= 5 * 1024 * 1024;

      return isImage && isUnderSizeLimit;
    });

    if (validFiles.length !== selectedFiles.length) {
      setError("Some files were skipped. Images must be 5 MB or smaller.");
    } else {
      setError("");
    }

    setNewImages((currentImages) => [
      ...currentImages,
      ...validFiles.slice(0, availableSlots),
    ]);

    event.target.value = "";
  }

  function removeExistingImage(imageToRemove: ExistingImage) {
    setExistingImages((currentImages) =>
      currentImages.filter((image) => image.url !== imageToRemove.url),
    );

    setRemovedImages((currentImages) => [...currentImages, imageToRemove]);
  }

  function restoreExistingImage(imageToRestore: ExistingImage) {
    if (existingImages.length + newImages.length >= MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} images.`);

      return;
    }

    setRemovedImages((currentImages) =>
      currentImages.filter((image) => image.url !== imageToRestore.url),
    );

    setExistingImages((currentImages) => [...currentImages, imageToRestore]);

    setError("");
  }

  function removeNewImage(imageIndex: number) {
    setNewImages((currentImages) =>
      currentImages.filter((_, index) => index !== imageIndex),
    );
  }

  function validateForm(): string | null {
    const trimmedTitle = formData.title.trim();

    const trimmedDescription = formData.description.trim();

    const trimmedCity = formData.city.trim();

    const numericPrice = Number(formData.price);

    if (trimmedTitle.length < 3) {
      return "The title must contain at least 3 characters.";
    }

    if (trimmedDescription.length < 10) {
      return "The description must contain at least 10 characters.";
    }

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return "Enter a valid price.";
    }

    if (!formData.category) {
      return "Select a category.";
    }

    if (!formData.condition) {
      return "Select the item's condition.";
    }

    if (!trimmedCity) {
      return "Enter a city.";
    }

    if (totalImageCount === 0) {
      return "Keep or upload at least one image.";
    }

    return null;
  }

  async function uploadNewImages(): Promise<{
    imageUrls: string[];
    imagePaths: string[];
  }> {
    if (!user || !listing) {
      throw new Error("Unable to determine the listing owner.");
    }

    const uploadResults = await Promise.all(
      newImages.map(async (file, index) => {
        const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");

        const uniqueFileName = `${Date.now()}-${index}-${safeFileName}`;

        const imagePath =
          `listing-images/${user.uid}/` + `${listing.id}/${uniqueFileName}`;

        const imageReference = ref(storage, imagePath);

        await uploadBytes(imageReference, file, {
          contentType: file.type,
        });

        const imageUrl = await getDownloadURL(imageReference);

        return {
          imageUrl,
          imagePath,
        };
      }),
    );

    return {
      imageUrls: uploadResults.map((result) => result.imageUrl),
      imagePaths: uploadResults.map((result) => result.imagePath),
    };
  }

  async function deleteRemovedImages() {
    const deletionResults = await Promise.allSettled(
      removedImages
        .filter((image) => image.path)
        .map((image) => deleteObject(ref(storage, image.path))),
    );

    const failedDeletions = deletionResults.filter(
      (result) => result.status === "rejected",
    );

    if (failedDeletions.length > 0) {
      console.warn(
        "Some removed images could not be deleted:",
        failedDeletions,
      );
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !id || !listing) {
      setError("The listing could not be updated.");

      return;
    }

    if (listing.sellerId !== user.uid) {
      setError("You do not have permission to edit this listing.");

      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const uploadedImagePaths: string[] = [];

    try {
      setIsSaving(true);
      setError("");

      const uploadedImages = await uploadNewImages();

      uploadedImagePaths.push(...uploadedImages.imagePaths);

      const retainedImageUrls = existingImages.map((image) => image.url);

      const retainedImagePaths = existingImages.map((image) => image.path);

      await updateListing(listing.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        condition: formData.condition as ListingCondition,
        city: formData.city.trim(),
        imageUrls: [...retainedImageUrls, ...uploadedImages.imageUrls],
        imagePaths: [...retainedImagePaths, ...uploadedImages.imagePaths],
      });

      await deleteRemovedImages();

      navigate("/dashboard", {
        replace: true,
      });
    } catch (caughtError) {
      console.error("Unable to update listing:", caughtError);

      /*
       * If the upload succeeded but Firestore failed,
       * remove the newly uploaded files so they do not
       * become unused Storage files.
       */
      if (uploadedImagePaths.length > 0) {
        await Promise.allSettled(
          uploadedImagePaths.map((path) => deleteObject(ref(storage, path))),
        );
      }

      setError("The listing could not be updated. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isAuthLoading || isLoading) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-slate-600">Loading listing...</p>
        </div>
      </main>
    );
  }

  if (error && !listing) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-bold text-red-800">
            Unable to edit listing
          </h1>

          <p className="mt-3 text-red-700">{error}</p>

          <Link
            to="/dashboard"
            className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Return to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          ← Back to dashboard
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-slate-900">Edit listing</h1>

        <p className="mt-2 text-slate-600">
          Update your item details and images.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">Listing details</h2>

          <div className="mt-6 space-y-6">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                maxLength={100}
                required
                disabled={isSaving}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                maxLength={2000}
                required
                disabled={isSaving}
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
              />

              <p className="mt-1 text-right text-xs text-slate-500">
                {formData.description.length}/2000
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Price
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    $
                  </span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    disabled={isSaving}
                    className="w-full rounded-xl border border-slate-300 py-3 pl-8 pr-4 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  maxLength={100}
                  required
                  disabled={isSaving}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  disabled={isSaving}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                >
                  <option value="">Select a category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="condition"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Condition
                </label>

                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  disabled={isSaving}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                >
                  <option value="">Select a condition</option>

                  {conditions.map((condition) => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Listing images
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Keep, remove, or add images.
              </p>
            </div>

            <p className="text-sm font-medium text-slate-600">
              {totalImageCount}/{MAX_IMAGES} images
            </p>
          </div>

          {existingImages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-700">
                Current images
              </h3>

              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {existingImages.map((image) => (
                  <div
                    key={image.url}
                    className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                  >
                    <div className="aspect-square">
                      <img
                        src={image.url}
                        alt="Current listing"
                        className="h-full w-full object-contain p-2"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeExistingImage(image)}
                      disabled={isSaving}
                      className="absolute right-2 top-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-red-700 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {newImagePreviews.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-700">
                New images
              </h3>

              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {newImagePreviews.map((image, index) => (
                  <div
                    key={`${image.file.name}-${index}`}
                    className="relative overflow-hidden rounded-xl border border-emerald-200 bg-slate-100"
                  >
                    <div className="aspect-square">
                      <img
                        src={image.previewUrl}
                        alt={image.file.name}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>

                    <span className="absolute left-2 top-2 rounded-lg bg-emerald-700 px-2 py-1 text-xs font-semibold text-white">
                      New
                    </span>

                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      disabled={isSaving}
                      className="absolute right-2 top-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-red-700 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {removedImages.length > 0 && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">
                Images marked for removal
              </p>

              <div className="mt-3 flex flex-wrap gap-3">
                {removedImages.map((image) => (
                  <button
                    key={image.url}
                    type="button"
                    onClick={() => restoreExistingImage(image)}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-lg border border-amber-300 bg-white p-2 text-sm font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-50"
                  >
                    <img
                      src={image.url}
                      alt=""
                      className="h-10 w-10 rounded object-cover"
                    />
                    Restore
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <label
              htmlFor="newImages"
              className="inline-flex cursor-pointer rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Add images
            </label>

            <input
              id="newImages"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelection}
              disabled={isSaving || totalImageCount >= MAX_IMAGES}
              className="sr-only"
            />

            <p className="mt-2 text-sm text-slate-500">
              Upload JPEG, PNG, WebP, or other image files up to 5 MB each.
            </p>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/dashboard"
            className="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving changes..." : "Save changes"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default EditListing;
