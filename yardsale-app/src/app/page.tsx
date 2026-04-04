const quickFilters = [
  "Local pickup",
  "Under $50",
  "Furniture",
  "Electronics",
  "New today",
];

const categories = [
  "Vehicles",
  "Property Rentals",
  "Apparel",
  "Electronics",
  "Entertainment",
  "Family",
  "Free Stuff",
  "Garden & Outdoor",
  "Home Goods",
];

const featuredListings = [
  {
    title: "Patio chair set",
    price: "$120",
    location: "2 miles away",
    details: "Pickup today",
    badge: "Top pick",
    artClass: "bg-gradient-to-br from-sky-200 via-blue-100 to-white",
    emoji: "🪑",
  },
  {
    title: "Vintage record player",
    price: "$85",
    location: "Downtown",
    details: "Works perfectly",
    badge: "Trending",
    artClass: "bg-gradient-to-br from-violet-200 via-fuchsia-100 to-white",
    emoji: "🎵",
  },
  {
    title: "Kids bike",
    price: "$45",
    location: "Near the park",
    details: "Ready to ride",
    badge: "Great deal",
    artClass: "bg-gradient-to-br from-emerald-200 via-teal-100 to-white",
    emoji: "🚲",
  },
  {
    title: "Coffee table",
    price: "$60",
    location: "West side",
    details: "Solid wood",
    badge: "Popular",
    artClass: "bg-gradient-to-br from-amber-200 via-orange-100 to-white",
    emoji: "🛋️",
  },
  {
    title: "Gaming monitor",
    price: "$170",
    location: "5 miles away",
    details: "144Hz display",
    badge: "Hot item",
    artClass: "bg-gradient-to-br from-slate-300 via-slate-100 to-white",
    emoji: "🖥️",
  },
  {
    title: "Plant stand bundle",
    price: "$35",
    location: "Local seller",
    details: "Indoor + outdoor",
    badge: "Fresh listing",
    artClass: "bg-gradient-to-br from-lime-200 via-green-100 to-white",
    emoji: "🪴",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f0f2f5] text-slate-900">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Marketplace-inspired refresh
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Find great local deals around Tee Dee Street.
              </h1>
              <p className="mt-3 text-sm text-slate-600 sm:text-base">
                Browse nearby finds, message sellers quickly, and make your next
                yard sale post feel more polished.
              </p>
            </div>

            <div className="grid gap-3 rounded-2xl bg-[#f7faff] p-3 sm:min-w-[320px]">
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-blue-100">
                <p className="text-xs font-semibold text-slate-500">
                  Search your area
                </p>
                <p className="mt-1 text-sm text-slate-800">
                  🔎 Furniture, bikes, tools, décor...
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 rounded-full bg-[#1877f2] px-4 py-2 text-sm font-semibold text-white shadow-sm">
                  Browse listings
                </button>
                <button className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                  Sell an item
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {quickFilters.map((filter) => (
              <span
                key={filter}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
              >
                {filter}
              </span>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f7faff] p-4">
              <p className="text-sm text-slate-500">Today&apos;s picks</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">24 new</p>
            </div>
            <div className="rounded-2xl bg-[#f7faff] p-4">
              <p className="text-sm text-slate-500">Saved this week</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                112 items
              </p>
            </div>
            <div className="rounded-2xl bg-[#f7faff] p-4">
              <p className="text-sm text-slate-500">Fast replies</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                ~1 hr avg
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Browse categories
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Inspired by the familiar Marketplace layout.
              </p>
            </div>

            <div className="mt-4 space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <span>{category}</span>
                  <span className="text-slate-400">›</span>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#1877f2] p-4 text-white">
              <p className="text-sm font-semibold">Seller tip</p>
              <p className="mt-2 text-sm text-blue-50">
                Bright photos and a short title help your items stand out.
              </p>
            </div>
          </aside>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Today&apos;s picks
                </h2>
                <p className="text-sm text-slate-500">
                  Fresh, local-style listings with a cleaner card layout.
                </p>
              </div>
              <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-black/5">
                See all
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {featuredListings.map((item) => (
                <article
                  key={item.title}
                  className="overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div
                    className={`${item.artClass} flex h-44 items-start justify-between p-4`}
                  >
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                      {item.badge}
                    </span>
                    <span className="text-4xl">{item.emoji}</span>
                  </div>

                  <div className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {item.location}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-slate-900">
                        {item.price}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600">{item.details}</p>

                    <div className="flex items-center justify-between pt-2 text-xs font-medium text-slate-500">
                      <span>Listed 14 minutes ago</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                        Message seller
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
