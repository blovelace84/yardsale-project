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

  if (sender.id === receiverId) {
    return NextResponse.json(
      { error: "You cannot message yourself about your own listing" },
      { status: 400 }
    );
  }

  const [receiver, listing] = await Promise.all([
    db.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    }),
    db.listing.findUnique({
      where: { id: listingId },
      select: { id: true, userId: true },
    }),
  ]);

  if (!receiver) {
    return NextResponse.json({ error: "Seller not found" }, { status: 404 });
  }

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (listing.userId !== receiverId) {
    return NextResponse.json(
      { error: "Listing seller mismatch" },
      { status: 400 }
    );
  }

  try {
    const message = await db.message.create({
      data: {
        content,
        senderId: sender.id,
        receiverId,
        listingId,
      },
    });

    return NextResponse.json(message);
  } catch (err) {
    console.error("[POST /api/messages] db.message.create failed:", err);
    const errorCode =
      typeof err === "object" && err !== null && "code" in err
        ? err.code
        : undefined;

    return NextResponse.json(
      {
        error: "Failed to create message",
        code: errorCode,
      },
      { status: 500 }
    );
  }
}