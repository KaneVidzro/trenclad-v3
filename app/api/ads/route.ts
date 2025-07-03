import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

// GET: List all ads
export async function GET(req: NextRequest) {
  // TODO: Add filtering, pagination, etc.
  const ads = await prisma.ad.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(ads);
}

// POST: Create a new ad
export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Add authentication, validation, image upload, etc.
  const data = await req.json();
  // Example: const ad = await prisma.ad.create({ data });
  return NextResponse.json({ message: "Ad created (placeholder)", data });
}
