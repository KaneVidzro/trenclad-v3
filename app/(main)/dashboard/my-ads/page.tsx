import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function MyAdsPage() {
  const user = await getUser();
  const myAds = await prisma.ad.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">My Ads</h1>
      {myAds.length === 0 ? (
        <div>You have not posted any ads yet.</div>
      ) : (
        <ul className="space-y-4">
          {myAds.map((ad) => (
            <li
              key={ad.id}
              className="border rounded p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="font-semibold text-lg">{ad.title}</div>
                <div className="text-gray-600">GH₵ {ad.price}</div>
                <div className="text-xs text-gray-400">{ad.status}</div>
              </div>
              <div className="mt-2 sm:mt-0 flex gap-2">
                <Link href={`/ads/${ad.id}`}>
                  <Button size="sm">View</Button>
                </Link>
                <Link href={`/ads/${ad.id}/edit`}>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </Link>
                <form
                  action={`/api/ads/${ad.id}/delete`}
                  method="POST"
                  onSubmit={(e) => {
                    if (!confirm("Are you sure you want to delete this ad?"))
                      e.preventDefault();
                  }}
                >
                  <Button size="sm" variant="destructive" type="submit">
                    Delete
                  </Button>
                </form>
                {/* Placeholder for Promote/Mark as Sold */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
