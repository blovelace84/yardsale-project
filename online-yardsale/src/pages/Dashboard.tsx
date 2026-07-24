import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DashboardListingCard from "../components/listings/DashboardListingCard";
import { useAuth } from "../context/AuthContext";
import {
  markListingAsSold,
  getListingsBySeller,
  deleteListing,
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

      const sellerListings = await getListingsBySeller(
        user.uid,
      );

      setListings(sellerListings);
    } catch (caughtError) {
      console.error(caughtError);
      setError("We could not load your listings.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadListings();
  }, [loadListings]);

  const statistics = useMemo(() => {
    const active = listings.filter(
      (listing) => listing.status === "ACTIVE",
    ).length;

    const sold = listings.filter(
      (listing) => listing.status === "SOLD",
    ).length;

    return {
      total: listings.length,
      active,
      sold,
    };
  }, [listings]);

  async function handleMarkSold(listingId: string) {
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
      console.error(caughtError);
      setError("The listing could not be marked as sold.");
    } finally {
      setUpdatingListingId(null);
    }
  }

  async function handleDelete(listingId: string) {
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
      console.error(caughtError);
      setError("The listing could not be deleted.");
    } finally {
      setUpdatingListingId(null);
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-slate-600">
          Loading your dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Seller dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Manage your listings
          </h1>

          <p className="mt-2 text-slate-600">
            View, edit, sell, or remove items you posted.
          </p>
        </div>

        <Link
          to="/create"
          className="rounded-xl bg-emerald-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
        >
          Create listing
        </Link>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
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
            You have not posted anything yet
          </h2>

          <p className="mt-2 text-slate-600">
            Create your first listing to start selling.
          </p>

          <Link
            to="/create"
            className="mt-6 inline-block rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
          >
            Create your first listing
          </Link>
        </section>
      ) : (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">
            Your listings
          </h2>

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