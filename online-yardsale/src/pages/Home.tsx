import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingGrid from "../components/listings/ListingGrid";
import { getActiveListings } from "../services/listingServices";
import type { Listing } from "../types/listing";


function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadListings() {
      try {
        setIsLoading(true);
        setError("");

        const activeListings = await getActiveListings();

        if (!isCancelled) {
          setListings(activeListings);
        }
      } catch (loadError: unknown) {
        console.error("Unable to load listings:", loadError);

        if (!isCancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Listings could not be loaded.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadListings();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="rounded-3xl bg-emerald-700 px-6 py-16 text-center text-white">
        <p className="font-semibold uppercase tracking-wider text-emerald-200">
          Local marketplace
        </p>

        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Buy and sell items near you
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-emerald-100">
          Find furniture, electronics, clothing, collectibles, and more.
        </p>

        <Link
          to="/create"
          className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700"
        >
          Sell an item
        </Link>
      </div>

      <section className="py-16">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Recent listings
            </h2>

            <p className="mt-2 text-slate-600">
              Browse newly posted items in your area.
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="aspect-[4/3] animate-pulse bg-slate-200" />
                <div className="space-y-3 p-4">
                  <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div
            role="alert"
            className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700"
          >
            {error}
          </div>
        )}

        {!isLoading && !error && listings.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="text-xl font-bold text-slate-900">
              No listings yet
            </h3>

            <p className="mt-2 text-slate-600">
              Be the first person to post an item.
            </p>

            <Link
              to="/create"
              className="mt-6 inline-block rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white"
            >
              Create a listing
            </Link>
          </div>
        )}

        {!isLoading && !error && listings.length > 0 && (
          <div className="mt-8">
            <ListingGrid
              listings={listings}
            />
          </div>
        )}
      </section>
    </section>
  );
}

export default Home;