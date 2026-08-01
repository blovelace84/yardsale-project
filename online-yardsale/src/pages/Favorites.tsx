import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

import FavoriteButton from "../components/listings/FavoriteButton";
import { useAuth } from "../context/AuthContext";
import { getFavoriteListings } from "../services/favoriteService";
import type { Listing } from "../types/listing";
import LoadingSpinner from "../components/common/LoadingSpinner";

function Favorites() {
  const { user } = useAuth();

  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFavorites() {
      if (!user) {
        setListings([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const favoriteListings = await getFavoriteListings(user.uid);

        setListings(favoriteListings);
      } catch (favoriteError) {
        console.error("Unable to load favorite listings:", favoriteError);

        setError("We could not load your favorites. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadFavorites();
  }, [user]);

  function handleFavoriteChange(listingId: string, isFavorite: boolean) {
    if (!isFavorite) {
      setListings((currentListings) =>
        currentListings.filter((listing) => listing.id !== listingId),
      );
    }
  }

  if (isLoading) {
    return <LoadingSpinner fullscreen title="Loading your favorites" />;
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Favorites</h1>

        <p className="mt-2 text-slate-600">
          Listings you have saved for later.
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Heart className="h-8 w-8 text-red-500" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-900">
            No favorites yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-slate-600">
            Browse listings and select the heart button to save items you may
            want to revisit.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
          >
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <article
              key={listing.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                <Link
                  to={`/listing/${listing.id}`}
                  className="block h-full w-full"
                >
                  {listing.imageUrls?.[0] ? (
                    <img
                      src={listing.imageUrls[0]}
                      alt={listing.title}
                      loading="lazy"
                      className="h-full w-full object-contain p-3"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                      No image available
                    </div>
                  )}
                </Link>

                <div className="absolute right-3 top-3">
                  <FavoriteButton
                    listingId={listing.id}
                    onFavoriteChange={handleFavoriteChange}
                  />
                </div>
              </div>

              <div className="p-4">
                <Link to={`/listing/${listing.id}`}>
                  <h2 className="line-clamp-1 text-lg font-semibold text-slate-900 hover:text-emerald-700">
                    {listing.title}
                  </h2>
                </Link>

                <p className="mt-2 text-xl font-bold text-slate-900">
                  ${Number(listing.price).toFixed(2)}
                </p>

                <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-500">
                  <span className="truncate">{listing.city}</span>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1">
                    {listing.condition}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;
