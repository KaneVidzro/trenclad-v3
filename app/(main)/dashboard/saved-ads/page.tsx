import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SavedAdsPage() {
  const user = await getUser();
  const savedAds = await prisma.savedAd.findMany({
    where: { userId: user?.id },
    include: { ad: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Saved Ads</h1>
      {savedAds.length === 0 ? (
        <div>You have not saved any ads yet.</div>
      ) : (
        <ul className="space-y-4">
          {savedAds.map((saved) => (
            <li
              key={saved.id}
              className="border rounded p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="font-semibold text-lg">{saved.ad.title}</div>
                <div className="text-gray-600">GH₵ {saved.ad.price}</div>
                <div className="text-xs text-gray-400">{saved.ad.status}</div>
              </div>
              <div className="mt-2 sm:mt-0 flex gap-2">
                <Link href={`/ads/${saved.ad.id}`}>
                  <Button size="sm">View</Button>
                </Link>
                <form
                  action={`/api/saved-ads/${saved.id}/delete`}
                  method="POST"
                  onSubmit={(e) => {
                    if (!confirm("Remove this ad from saved?"))
                      e.preventDefault();
                  }}
                >
                  <Button size="sm" variant="destructive" type="submit">
                    Remove
                  </Button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
