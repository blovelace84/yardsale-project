import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createListingSchema, validateRequestBody } from "@/lib/validation";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// GET all listings
export async function GET() {
  const listings = await db.listing.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      imageUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(listings);
}

// POST new listing
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await validateRequestBody(req, createListingSchema);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const imageUrl =
    typeof result.data.imageUrl === "string" && result.data.imageUrl.length > 0
      ? result.data.imageUrl
      : null;

  const listing = await db.listing.create({
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      imageUrl: true,
      createdAt: true,
    },
    data: {
      title: result.data.title,
      description: result.data.description,
      price: result.data.price,
      imageUrl,
      userId: session.user.id,
    },
  });

  return NextResponse.json(listing, { status: 201 });
}