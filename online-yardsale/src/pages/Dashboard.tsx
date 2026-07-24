import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";

import DashboardListingCard from "../components/listings/DashboardListingCard";
import { useAuth } from "../context/AuthContext";
import {
  deleteListing,
  getListingsBySeller,
  markListingAsSold,
} from "../services/listingServices";
import type { Listing } from "../types/listing";

function Dashboard() {
  const { user } = useAuth();

  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingListingId, setUpdatingListingId] =
    useState<string | null>(null);
  const [error, setError] = useState("");

  const loadListings = useCallback(async () => {
    if (!user) {
      setListings([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      console.log("Signed-in user UID:", user.uid);

      const sellerListings = await getListingsBySeller(
        user.uid,
      );

      console.log(
        "Listings returned for dashboard:",
        sellerListings,
      );

      setListings(sellerListings);
    } catch (caughtError) {
      console.error(
        "Unable to load dashboard listings:",
        caughtError,
      );

      setError(
        "We could not load your listings. Check the browser console for more details.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadListings();
  }, [loadListings]);

  const statistics = useMemo(() => {
    const activeListings = listings.filter(
      (listing) => listing.status === "ACTIVE",
    ).length;

    const soldListings = listings.filter(
      (listing) => listing.status === "SOLD",
    ).length;

    return {
      total: listings.length,
      active: activeListings,
      sold: soldListings,
    };
  }, [listings]);

  async function handleMarkSold(
    listingId: string,
  ): Promise<void> {
    try {
      setUpdatingListingId(listingId);
      setError("");

      await markListingAsSold(listingId);

      setListings((currentListings) =>
        currentListings.map((listing) =>
          listing.id === listingId
            ? {
                ...listing,
                status: "SOLD",
              }
            : listing,
        ),
      );
    } catch (caughtError) {
      console.error(
        "Unable to mark listing as sold:",
        caughtError,
      );

      setError(
        "The listing could not be marked as sold.",
      );
    } finally {
      setUpdatingListingId(null);
    }
  }

  async function handleDelete(
    listingId: string,
  ): Promise<void> {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this listing?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setUpdatingListingId(listingId);
      setError("");

      await deleteListing(listingId);

      setListings((currentListings) =>
        currentListings.filter(
          (listing) => listing.id !== listingId,
        ),
      );
    } catch (caughtError) {
      console.error(
        "Unable to delete listing:",
        caughtError,
      );

      setError("The listing could not be deleted.");
    } finally {
      setUpdatingListingId(null);
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">
            Loading your listings...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Seller dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Manage your listings
          </h1>

          <p className="mt-2 text-slate-600">
            View, edit, mark as sold, or remove the
            items you posted.
          </p>
        </div>

        <Link
          to="/create"
          className="rounded-xl bg-emerald-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
        >
          Create listing
        </Link>
      </div>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Total listings
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {statistics.total}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Active
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-700">
            {statistics.active}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Sold
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {statistics.sold}
          </p>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
        >
          {error}
        </div>
      )}

      {listings.length === 0 ? (
        <section className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            No listings found
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-slate-600">
            No listings were found for the currently
            signed-in account. Create a new listing while
            signed in, or confirm that your existing
            Firestore documents contain the correct
            sellerId.
          </p>

          <Link
            to="/create"
            className="mt-6 inline-block rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
          >
            Create your first listing
          </Link>
        </section>
      ) : (
        <section className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">
              Your listings
            </h2>

            <button
              type="button"
              onClick={() => void loadListings()}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <DashboardListingCard
                key={listing.id}
                listing={listing}
                isUpdating={
                  updatingListingId === listing.id
                }
                onMarkSold={handleMarkSold}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default Dashboard;