import AdsCard from "@/components/main/AdsCard";

interface Ad {
  id: string;
  title: string;
  price: number;
  images: string[];
  region?: string;
  city?: string;
  category?: string;
}

async function getAds(): Promise<Ad[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/ads`, {
    cache: "no-store", // or "force-cache" for SSG
  });
  return res.json();
}

export default async function AdsPage() {
  const ads = await getAds();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Classified Ads</h1>
      {ads.length === 0 ? (
        <div>No ads found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <AdsCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  );
}
