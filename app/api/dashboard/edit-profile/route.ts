import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const region = formData.get("region") as string;
  const city = formData.get("city") as string;
  const bio = formData.get("bio") as string;
  // Image upload handling (optional, not implemented here)

  // Update user name
  await prisma.user.update({
    where: { id: user.id },
    data: { name },
  });

  // Update or create profile
  await prisma.profile.upsert({
    where: { userId: user.id },
    update: { phoneNumber, region, city, bio },
    create: {
      userId: user.id,
      phoneNumber,
      region,
      city,
      bio,
      address: "",
      gpsAddress: "",
    },
  });

  return NextResponse.redirect("/dashboard/profile");
}
