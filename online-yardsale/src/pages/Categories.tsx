import {
  Bike,
  BookOpen,
  Gamepad2,
  House,
  Laptop,
  Shirt,
  Sofa,
  Wrench,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ListingGrid from "../components/listings/ListingGrid";
import { getListingsByCategory } from "../services/listingServices";
import type { Listing } from "../types/listing";

const categories = [
  {
    name: "Furniture",
    description: "Tables, chairs, sofas, storage, and décor.",
    icon: Sofa,
  },
  {
    name: "Electronics",
    description: "Computers, televisions, phones, and accessories.",
    icon: Laptop,
  },
  {
    name: "Clothing",
    description: "Clothes, shoes, bags, and accessories.",
    icon: Shirt,
  },
  {
    name: "Home & Garden",
    description: "Appliances, garden equipment, and household goods.",
    icon: House,
  },
  {
    name: "Games",
    description: "Video games, board games, consoles, and collectibles.",
    icon: Gamepad2,
  },
  {
    name: "Books",
    description: "Books, textbooks, magazines, and learning materials.",
    icon: BookOpen,
  },
  {
    name: "Sporting Goods",
    description: "Bikes, fitness equipment, and outdoor gear.",
    icon: Bike,
  },
  {
    name: "Tools",
    description: "Hand tools, power tools, and workshop equipment.",
    icon: Wrench,
  },
];

function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") ?? "";

  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCategoryListings = useCallback(async (category: string) => {
    if (!category) {
      setListings([]);
      setError("");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const categoryListings = await getListingsByCategory(category);

      setListings(categoryListings);
    } catch (caughtError: unknown) {
      console.error("Unable to load category listings:", caughtError);

      setListings([]);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The listings could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategoryListings(selectedCategory);
  }, [selectedCategory, loadCategoryListings]);

  function selectCategory(categoryName: string): void {
    setSearchParams({
      category: categoryName,
    });
  }

  function clearCategory(): void {
    setSearchParams({});
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section>
        <p className="font-semibold text-emerald-700">Browse the marketplace</p>

        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Shop by category
            </h1>

            <p className="mt-3 text-slate-600">
              Choose a category to find items that match what you are looking
              for.
            </p>
          </div>

          {selectedCategory && (
            <button
              type="button"
              onClick={clearCategory}
              className="self-start rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 sm:self-auto"
            >
              View all categories
            </button>
          )}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.name;

            return (
              <button
                key={category.name}
                type="button"
                onClick={() => selectCategory(category.name)}
                aria-pressed={isSelected}
                className={[
                  "rounded-2xl border p-6 text-left shadow-sm transition",
                  isSelected
                    ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-100"
                    : "border-slate-200 bg-white hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    isSelected
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-100 text-emerald-700",
                  ].join(" ")}
                >
                  <Icon size={24} aria-hidden="true" />
                </span>

                <h2 className="mt-5 text-lg font-bold text-slate-900">
                  {category.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {category.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {selectedCategory && (
        <section className="mt-14 border-t border-slate-200 pt-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Category
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {selectedCategory} listings
            </h2>

            {!isLoading && !error && (
              <p className="mt-2 text-slate-600">
                {listings.length === 1
                  ? "1 active listing found."
                  : `${listings.length} active listings found.`}
              </p>
            )}
          </div>

          {isLoading && (
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({
                length: 3,
              }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="aspect-square animate-pulse bg-slate-200" />

                  <div className="space-y-3 p-5">
                    <div className="h-6 w-28 animate-pulse rounded bg-slate-200" />
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
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <h3 className="text-xl font-bold text-slate-900">
                No {selectedCategory.toLowerCase()} listings yet
              </h3>

              <p className="mt-2 text-slate-600">
                Check another category or return later for new listings.
              </p>
            </div>
          )}

          {!isLoading && !error && listings.length > 0 && (
            <div className="mt-8">
              <ListingGrid listings={listings} />
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default Categories;
