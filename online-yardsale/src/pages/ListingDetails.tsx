import { useParams } from "react-router-dom";

function ListingDetails() {
  const { id } = useParams();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold">Listing details</h1>
      <p className="mt-2 text-slate-600">Listing ID: {id}</p>
    </section>
  );
}

export default ListingDetails;