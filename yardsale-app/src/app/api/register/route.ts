import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { registerSchema, validateRequestBody } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const result = await validateRequestBody(req, registerSchema);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { name, email, password } = result.data;

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await hashPassword(password);

  const user = await db.user.create({
    data: {
      email,
      name: name || null,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  return NextResponse.json(user, { status: 201 });
}