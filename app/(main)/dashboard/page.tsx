import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardHome() {
  const user = await getUser();
  const [ads, savedAds] = await Promise.all([
    prisma.ad.count({ where: { userId: user?.id } }),
    prisma.savedAd.count({ where: { userId: user?.id } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome to your Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className=" border rounded shadow p-6">
          <div className="text-gray-500">My Ads</div>
          <div className="text-3xl font-bold">{ads}</div>
        </div>
        <div className="border rounded shadow p-6">
          <div className="text-gray-500">Saved Ads</div>
          <div className="text-3xl font-bold">{savedAds}</div>
        </div>
      </div>
      <div className="flex gap-4">
        <Link href="/dashboard/post-ad">
          <Button>Post New Ad</Button>
        </Link>
        <Link href="/dashboard/profile">
          <Button variant="outline">Edit Profile</Button>
        </Link>
      </div>
    </div>
  );
}
