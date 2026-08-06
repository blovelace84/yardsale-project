import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

import FavoriteButton from "../components/listings/FavoriteButton";
import { useAuth } from "../context/AuthContext";
import { getFavoriteListings } from "../services/favoriteService";
import type { Listing } from "../types/listing";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";

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
        <ErrorMessage title="Couldn't load your favorites" message={error} />
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
        <EmptyState
          icon={<Heart className="h-6 w-6 text-red-500" />}
          title="No favorites yet"
          description="Browse listings and select the heart button to save items you may want to revisit."
          actionText="Browse listings"
          actionTo="/"
        />
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
