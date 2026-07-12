import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="px-4 py-24 text-center">
      <p className="text-lg font-semibold text-emerald-700">404</p>
      <h1 className="mt-2 text-4xl font-bold">Page not found</h1>

      <p className="mt-4 text-slate-600">
        The page you requested does not exist.
      </p>

      <Link
        to="/"
        className="mt-8 inline-block rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white"
      >
        Return home
      </Link>
    </section>
  );
}

export default NotFound;