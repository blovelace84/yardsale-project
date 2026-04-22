import { db } from "@/lib/db";
import ItemCard from "./components/item-card";

type HomeProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams?.q?.trim() ?? "";

  const listings = await db.listing.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-300 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="mb-2 text-2xl font-bold text-gray-600">
          Browse Listings
        </h1>
        {q ? (
          <p className="mb-7 text-sm text-gray-600">
            Showing results for <span className="font-semibold">"{q}"</span>
          </p>
        ) : (
          <div className="mb-7" />
        )}

        {listings.length === 0 ? (
          <p className="text-gray-500">
            {q ? "No listings match your search." : "No listings yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((item) => (
              <ItemCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                imageUrl={item.imageUrl ?? undefined}
                createdAt={item.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
