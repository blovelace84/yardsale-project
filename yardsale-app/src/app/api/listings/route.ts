import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// GET all listings
export async function GET() {
  const listings = await db.listing.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(listings);
}

// POST new listing
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const price = Number(body.price);
  const imageUrl =
    typeof body.imageUrl === "string" && body.imageUrl.trim()
      ? body.imageUrl
      : null;

  if (!title || !description || !Number.isFinite(price)) {
    return NextResponse.json({ error: "Invalid listing data" }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const listing = await db.listing.create({
    data: {
      title,
      description,
      price,
      imageUrl,
      userId: user.id,
    },
  });

  return NextResponse.json(listing, { status: 201 });
}