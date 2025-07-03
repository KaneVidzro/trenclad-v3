import { notFound } from "next/navigation";
import AdsDetails from "@/components/main/AdsDetails";

interface Ad {
  id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  category?: string;
  subcategory?: string;
  region?: string;
  city?: string;
  isNegotiable?: boolean;
  contactPhone?: string;
  contactEmail?: string;
}

async function getAd(id: string): Promise<Ad | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/ads/${id}`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function AdDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const ad = await getAd(params.id);
  if (!ad) return notFound();

  return <AdsDetails ad={ad} />;
}
