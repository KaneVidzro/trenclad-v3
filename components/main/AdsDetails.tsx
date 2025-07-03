import { Card, CardContent } from "@/components/ui/card";

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
}

export default function AdsDetails({ ad }: { ad: Ad }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Card>
        <CardContent className="p-6">
          {/* Images Gallery */}
          <div className="mb-6">
            {ad.images && ad.images.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto">
                {ad.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={ad.title}
                    className="w-40 h-40 object-cover rounded border"
                  />
                ))}
              </div>
            ) : (
              <div className="w-40 h-40 flex items-center justify-center bg-gray-100 text-gray-400 rounded border">
                No Image
              </div>
            )}
          </div>

          {/* Title & Price */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <h1 className="text-2xl font-bold mb-2 sm:mb-0">{ad.title}</h1>
            <div className="text-primary font-bold text-xl">
              GH₵ {ad.price}
              {ad.isNegotiable && (
                <span className="ml-2 text-sm text-green-600">Negotiable</span>
              )}
            </div>
          </div>

          {/* Category, Location */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <span>Category: {ad.category || "-"}</span>
            {ad.subcategory && <span>Subcategory: {ad.subcategory}</span>}
            <span>
              Location: {ad.region || "-"}, {ad.city || "-"}
            </span>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h2 className="font-semibold mb-1">Description</h2>
            <p className="text-gray-800 whitespace-pre-line">
              {ad.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
