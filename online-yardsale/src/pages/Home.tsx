import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="rounded-3xl bg-emerald-700 px-6 py-16 text-center text-white">
        <p className="font-semibold uppercase tracking-wider text-emerald-200">
          Local marketplace
        </p>

        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Buy and sell items near you
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-emerald-100">
          Find affordable furniture, electronics, clothing, collectibles, and
          other items in your community.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to="/create"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700"
          >
            Create your first listing
          </Link>
        </div>
      </div>

      <section className="py-12">
        <h2 className="text-2xl font-bold">Recent listings</h2>

        <p className="mt-2 text-slate-600">
          Listings will appear here after we connect Firebase.
        </p>
      </section>
    </section>
  );
}

export default Home;