import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Get a single ad by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  // TODO: Add error handling
  const ad = await prisma.ad.findUnique({ where: { id } });
  return NextResponse.json(ad);
}

// PUT: Update an ad by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const data = await req.json();
  // TODO: Add authentication, validation, etc.
  // Example: const ad = await prisma.ad.update({ where: { id }, data });
  return NextResponse.json({ message: "Ad updated (placeholder)", data });
}

// DELETE: Delete an ad by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  // TODO: Add authentication, authorization, etc.
  // Example: await prisma.ad.delete({ where: { id } });
  return NextResponse.json({ message: `Ad ${id} deleted (placeholder)` });
}
