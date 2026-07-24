import { Link } from "react-router-dom";

import type { Listing } from "../../types/listing";

interface DashboardListingCardProps {
  listing: Listing;
  isUpdating: boolean;
  onMarkSold: (listingId: string) => void;
  onDelete: (listingId: string) => void;
}

function DashboardListingCard({
  listing,
  isUpdating,
  onMarkSold,
  onDelete,
}: DashboardListingCardProps) {
  const imageUrl = listing.imageUrls?.[0];

  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={listing.title}
            className="h-full w-full object-contain p-3"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No image available
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          {listing.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xl font-bold text-emerald-700">
          ${Number(listing.price).toFixed(2)}
        </p>

        <h2 className="mt-2 line-clamp-2 text-lg font-semibold text-slate-900">
          {listing.title}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {listing.city}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
          <Link
            to={`/edit/${listing.id}`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Edit
          </Link>

          <Link
            to={`/listing/${listing.id}`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View
          </Link>

          {listing.status !== "SOLD" && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onMarkSold(listing.id)}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Mark sold"}
            </button>
          )}

          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onDelete(listing.id)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? "Working..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default DashboardListingCard;