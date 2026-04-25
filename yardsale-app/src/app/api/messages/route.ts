import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createMessageSchema, validateRequestBody } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await validateRequestBody(req, createMessageSchema);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { content, receiverId, listingId } = result.data;

  if (session.user.id === receiverId) {
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
      select: {
        id: true,
        content: true,
        listingId: true,
        createdAt: true,
      },
      data: {
        content,
        senderId: session.user.id,
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