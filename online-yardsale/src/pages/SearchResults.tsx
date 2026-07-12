import { useSearchParams } from "react-router-dom";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") ?? "";

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Search results</h1>

      {searchTerm ? (
        <p className="mt-3 text-slate-600">
          Showing future results for{" "}
          <span className="font-semibold text-slate-900">
            “{searchTerm}”
          </span>
          .
        </p>
      ) : (
        <p className="mt-3 text-slate-600">
          Enter a search term using the navigation bar.
        </p>
      )}

      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        Search results will appear here after Firebase is connected.
      </div>
    </section>
  );
}

export default SearchResults;