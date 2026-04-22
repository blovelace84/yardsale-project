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
    include: {
      sender: true,
      listing: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inbox</h1>

      {messages.map((msg) => (
        <div key={msg.id} className="border p-4 rounded mb-3">
          <p className="text-sm text-gray-500">
            From: {msg.sender.email}
          </p>
          <p className="font-medium">{msg.content}</p>
        </div>
      ))}
    </div>
  );
}