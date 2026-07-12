import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-emerald-700 px-6 py-16 text-center text-white sm:px-12">
        <p className="mb-3 font-semibold uppercase tracking-wider text-emerald-200">
          Local deals near you
        </p>

        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Give useful items a new home
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-emerald-100">
          Buy and sell furniture, electronics, clothing, collectibles, and
          other items in your community.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/create"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            Sell an item
          </Link>

          <a
            href="#recent-listings"
            className="rounded-xl border border-emerald-300 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
          >
            Browse listings
          </a>
        </div>
      </div>

      <section id="recent-listings" className="py-14">
        <h2 className="text-2xl font-bold">Recently listed</h2>

        <p className="mt-2 text-slate-600">
          Listings from Firebase will appear here.
        </p>
      </section>
    </section>
  );
}

export default Home;