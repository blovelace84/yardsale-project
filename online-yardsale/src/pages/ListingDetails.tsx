import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Tag,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getListingById } from "../services/listingServices";
import type { Listing } from "../types/listing";

function formatCondition(condition: Listing["condition"]): string {
  switch (condition) {
    case "NEW":
      return "New";

    case "USED":
      return "Used";

    case "AS_IS":
      return "As-is";

    default:
      return condition;
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function formatDate(listing: Listing): string {
  if (!listing.createdAt) {
    return "Just posted";
  }

  return listing.createdAt.toDate().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function ListingDetails() {
  const { id } = useParams<{ id: string }>();

  const [listing, setListing] = useState<Listing | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadListing() {
      setIsLoading(true);
      setError("");

      if (!id) {
        setError("The listing ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const result = await getListingById(id);

        if (isCancelled) {
          return;
        }

        if (!result) {
          setError("This listing could not be found.");
          setListing(null);
          return;
        }

        setListing(result);
        setSelectedImage(result.imageUrls[0] ?? "");
      } catch (loadError: unknown) {
        console.error("Unable to load listing:", loadError);

        if (!isCancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "The listing could not be loaded.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadListing();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <div className="text-center">
          <div
            className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600"
            aria-hidden="true"
          />

          <p className="mt-4 text-slate-600">
            Loading listing...
          </p>
        </div>
      </section>
    );
  }

  if (error || !listing) {
    return (
      <section className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="font-semibold text-emerald-700">
          Listing unavailable
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          We could not display this listing
        </h1>

        <p className="mt-4 text-slate-600">
          {error || "This listing does not exist."}
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Return home
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 font-medium text-slate-600 transition hover:text-emerald-700"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Back to listings
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={listing.title}
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center text-slate-500">
                No image available
              </div>
            )}
          </div>

          {listing.imageUrls.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
              {listing.imageUrls.map((imageUrl, index) => (
                <button
                  key={imageUrl}
                  type="button"
                  onClick={() => setSelectedImage(imageUrl)}
                  className={[
                    "overflow-hidden rounded-xl border-2 bg-slate-100 transition",
                    selectedImage === imageUrl
                      ? "border-emerald-600"
                      : "border-transparent hover:border-emerald-300",
                  ].join(" ")}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={imageUrl}
                    alt={`${listing.title} preview ${index + 1}`}
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <aside>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                {listing.category}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {formatCondition(listing.condition)}
              </span>

              {listing.status === "SOLD" && (
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                  Sold
                </span>
              )}
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
              {listing.title}
            </h1>

            <p className="mt-4 text-3xl font-bold text-emerald-700">
              {formatPrice(listing.price)}
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <MapPin
                  size={18}
                  className="text-emerald-700"
                  aria-hidden="true"
                />
                {listing.city}
              </p>

              <p className="flex items-center gap-2">
                <CalendarDays
                  size={18}
                  className="text-emerald-700"
                  aria-hidden="true"
                />
                Posted {formatDate(listing)}
              </p>

              <p className="flex items-center gap-2">
                <Tag
                  size={18}
                  className="text-emerald-700"
                  aria-hidden="true"
                />
                {listing.category}
              </p>
            </div>

            <div className="my-7 border-t border-slate-200" />

            <h2 className="text-lg font-bold text-slate-900">
              Description
            </h2>

            <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
              {listing.description}
            </p>

            <div className="my-7 border-t border-slate-200" />

            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <UserRound size={24} aria-hidden="true" />
              </span>

              <div>
                <p className="text-sm text-slate-500">
                  Seller
                </p>

                <p className="font-semibold text-slate-900">
                  {listing.sellerName}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="mt-7 w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Contact seller
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default ListingDetails;