import { useParams } from "react-router-dom";

function EditListing() {
  const { id } = useParams();

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Edit listing</h1>
      <p className="mt-2 text-slate-600">Editing listing: {id}</p>
    </section>
  );
}

export default EditListing;