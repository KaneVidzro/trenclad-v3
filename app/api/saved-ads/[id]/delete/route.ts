import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const savedAd = await prisma.savedAd.findUnique({ where: { id: params.id } });
  if (!savedAd || savedAd.userId !== user.id) {
    return NextResponse.json(
      { error: "Not found or forbidden" },
      { status: 403 },
    );
  }
  await prisma.savedAd.delete({ where: { id: params.id } });
  return redirect("/dashboard/saved-ads");
}
