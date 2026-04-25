import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function InboxPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) return <div>Login required</div>;

  const messages = await db.message.findMany({
    where: {
      receiverId: session.user.id,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      sender: {
        select: {
          email: true,
        },
      },
      listing: {
        select: {
          title: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#f0f2f5] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Inbox</h1>

        {messages.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            No messages yet.
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <p className="mb-1 text-xs font-semibold text-slate-500">
                  From: {msg.sender.email}
                </p>
                {msg.listing && (
                  <p className="mb-2 text-xs text-slate-400">
                    Re: {msg.listing.title}
                  </p>
                )}
                <p className="text-sm font-medium text-slate-800">
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
