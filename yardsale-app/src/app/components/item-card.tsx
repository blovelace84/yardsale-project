import Link from "next/link";

type ItemCardProps = {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  createdAt: Date;
};

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

export default function ItemCard({
  id,
  title,
  price,
  imageUrl,
  createdAt,
}: ItemCardProps) {
  return (
    <Link href={`/listings/${id}`} className="group block h-full">
      <article className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-sm ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
              <span className="text-3xl">📦</span>
              <span className="text-sm font-medium">No image yet</span>
            </div>
          )}

          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur">
            Fresh listing
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-2 text-sm font-semibold text-slate-900 sm:text-base">
              {title}
            </h2>
            <span className="shrink-0 rounded-full bg-[#e7f3ff] px-2.5 py-1 text-sm font-bold text-[#1877f2]">
              {priceFormatter.format(price)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
              {dateFormatter.format(new Date(createdAt))}
            </span>
            <span className="font-semibold text-slate-700 group-hover:text-[#1877f2]">
              View item →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
