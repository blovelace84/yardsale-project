import {
  Heart,
  ImageOff,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { Listing } from "../../types/listing";

interface ListingCardProps {
  listing: Listing;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function formatCondition(
  condition: Listing["condition"],
): string {
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

function formatPostedDate(listing: Listing): string {
  if (!listing.createdAt) {
    return "Just posted";
  }

  const createdDate = listing.createdAt.toDate();
  const now = new Date();

  const differenceInMilliseconds =
    now.getTime() - createdDate.getTime();

  if (differenceInMilliseconds < 0) {
    return "Just posted";
  }

  const differenceInMinutes = Math.floor(
    differenceInMilliseconds / 60_000,
  );

  const differenceInHours = Math.floor(
    differenceInMinutes / 60,
  );

  const differenceInDays = Math.floor(
    differenceInHours / 24,
  );

  if (differenceInMinutes < 1) {
    return "Just posted";
  }

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes}m ago`;
  }

  if (differenceInHours < 24) {
    return `${differenceInHours}h ago`;
  }

  if (differenceInDays < 7) {
    return `${differenceInDays}d ago`;
  }

  return createdDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function ListingCard({
  listing,
}: ListingCardProps) {
  const coverImage = listing.imageUrls[0] ?? "";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <Link
        to={`/listing/${listing.id}`}
        className="block"
        aria-label={`View ${listing.title}`}
      >
        <div className="relative overflow-hidden bg-slate-100">
          {coverImage ? (
            <img
              src={coverImage}
              alt={listing.title}
              loading="lazy"
              className="block aspect-[4/3] w-full object-contain transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center text-slate-400">
              <div className="text-center">
                <ImageOff
                  size={32}
                  className="mx-auto"
                  aria-hidden="true"
                />

                <p className="mt-2 text-sm">
                  No image
                </p>
              </div>
            </div>
          )}

          {listing.status === "SOLD" && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                Sold
              </span>
            </div>
          )}

          <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
            {formatCondition(listing.condition)}
          </span>
        </div>

        <div className="p-4">
          <p className="text-xl font-bold text-emerald-700">
            {formatPrice(listing.price)}
          </p>

          <h2 className="mt-2 line-clamp-2 min-h-12 text-lg font-bold leading-6 text-slate-900 transition group-hover:text-emerald-700">
            {listing.title}
          </h2>

          <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
            <span className="flex min-w-0 items-center gap-1.5">
              <MapPin
                size={16}
                className="shrink-0 text-emerald-700"
                aria-hidden="true"
              />

              <span className="truncate">
                {listing.city}
              </span>
            </span>

            <span className="shrink-0">
              {formatPostedDate(listing)}
            </span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        aria-label={`Save ${listing.title} to favorites`}
        className="absolute right-3 top-3 rounded-full bg-white/95 p-2.5 text-slate-600 shadow-md transition hover:bg-white hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        onClick={() => {
          console.log(
            `Favorite clicked for listing ${listing.id}`,
          );
        }}
      >
        <Heart size={20} aria-hidden="true" />
      </button>
    </article>
  );
}

export default ListingCard;