import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface AdsCardProps {
  ad: {
    id: string;
    title: string;
    price: number;
    images: string[];
    region?: string;
    city?: string;
    category?: string;
  };
}

export default function AdsCard({ ad }: AdsCardProps) {
  return (
    <Link href={`/ads/${ad.id}`} className="block">
      <Card className="hover:shadow-lg transition border rounded-lg overflow-hidden">
        <div className="h-40 bg-gray-100 flex items-center justify-center mb-3">
          {ad.images && ad.images.length > 0 ? (
            <img
              src={ad.images[0]}
              alt={ad.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>
        <CardContent className="p-2">
          <div className="font-semibold text-lg mb-1 truncate">{ad.title}</div>
          <div className="text-primary font-bold mb-1">GH₵ {ad.price}</div>
          <div className="text-sm text-gray-600">
            {ad.region || "-"}, {ad.city || "-"}
          </div>
          <div className="text-xs text-gray-400 mt-1">{ad.category}</div>
        </CardContent>
      </Card>
    </Link>
  );
}
