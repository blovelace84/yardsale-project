import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const receiverId =
    typeof body.receiverId === "string" ? body.receiverId.trim() : "";
  const listingId = typeof body.listingId === "string" ? body.listingId.trim() : "";

  if (!content || !receiverId || !listingId) {
    return NextResponse.json({ error: "Invalid message data" }, { status: 400 });
  }

  const sender = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!sender) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const message = await db.message.create({
    data: {
      content,
      senderId: sender.id,
      receiverId,
      listingId,
    },
  });

  return NextResponse.json(message);
}