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
  await prisma.ad.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
