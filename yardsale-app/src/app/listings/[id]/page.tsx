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
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      imageUrl: true,
      createdAt: true,
      userId: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!listing) return notFound();

  return (
    <main className="min-h-screen bg-[#f0f2f5] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto mb-3 flex w-full max-w-6xl items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">Marketplace</p>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1877f2] ring-1 ring-slate-200">
          Listing details
        </span>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.25fr_0.9fr]">
        {/* image */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-600">
            Photos
          </div>

          <div className="relative bg-slate-100">
            {listing.imageUrl ? (
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="h-105 w-full object-cover sm:h-140"
              />
            ) : (
              <div className="flex h-105 items-center justify-center text-slate-400 sm:h-140">
                No image available
              </div>
            )}

            <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              New listing
            </div>
          </div>
        </section>

        {/* details */}
        <section className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold leading-tight text-slate-900">
                {listing.title}
              </h1>
              <span className="shrink-0 rounded-full bg-[#e7f3ff] px-3 py-1 text-lg font-bold text-[#1877f2]">
                {priceFormatter.format(listing.price)}
              </span>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">
                Listed {dateFormatter.format(new Date(listing.createdAt))}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">
                Item ID: {listing.id.slice(0, 8)}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">
                Condition: Used
              </span>
            </div>

            <div>
              <h2 className="mb-2 text-sm font-bold text-slate-700">
                Description
              </h2>
              <p className="whitespace-pre-line rounded-xl bg-slate-50 p-4 leading-7 text-slate-700">
                {listing.description}
              </p>
            </div>
          </div>

          <ContactSeller
            sellerEmail={listing.user?.email || ""}
            listingTitle={listing.title}
            sellerId={listing.userId}
            listingId={listing.id}
          />
        </section>
      </div>
    </main>
  );
}
