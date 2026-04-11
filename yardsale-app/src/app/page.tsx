import { db } from "@/lib/db";
import ItemCard from "./components/item-card";

export default async function Home() {
  const listings = await db.listing.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-300 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-500">Browse Listings</h1>

      {listings.length === 0 ? (
        <p className="text-gray-500">No listings yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
    </main>
  );
}
