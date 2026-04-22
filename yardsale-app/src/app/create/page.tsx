import CreateListingForm from "../components/create-listing-form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function CreatePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/create");
  }

  return (
    <main className="min-h-screen bg-[#f0f2f5] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto mb-4 flex w-full max-w-5xl items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">Marketplace</p>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1877f2] ring-1 ring-slate-200">
          Create new listing
        </span>
      </div>

      <CreateListingForm />
    </main>
  );
}
