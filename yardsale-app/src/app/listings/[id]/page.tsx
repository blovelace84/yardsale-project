import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ContactSeller from "@/app/components/contact-seller";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) return notFound();

  const listing = await db.listing.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!listing) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        {/* image */}
        <div className="bg-white rounded-2xl overflow-hidden">
          {listing.imageUrl ? (
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full h-100 object-cover"
            />
          ) : (
            <div className="h-100 flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}
        </div>

        {/* details */}
        <section className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{listing.title}</h1>
              <span className="shrink-0 rounded-full bg-[#e7f3ff] px-3 py-1 text-base font-bold text-[#1877f2]">
                {priceFormatter.format(listing.price)}
              </span>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">
                Listed {dateFormatter.format(new Date(listing.createdAt))}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">
                Item ID: {listing.id.slice(0, 8)}
              </span>
            </div>

            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Description
              </h2>
              <p className="whitespace-pre-line leading-7 text-slate-700">
                {listing.description}
              </p>
            </div>
          </div>

          <ContactSeller
            sellerEmail={listing.user?.email || ""}
            listingTitle={listing.title}
          />
        </section>
      </div>
    </main>
  );
}
