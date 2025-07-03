import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ad = await prisma.ad.findUnique({ where: { id: params.id } });
  if (!ad || ad.userId !== user.id) {
    return NextResponse.json(
      { error: "Not found or forbidden" },
      { status: 403 },
    );
  }
  const data = await req.json();
  // TODO: Validate data
  await prisma.ad.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json({ success: true });
}
