import { Bed, Bath, Maximize, MapPin, Phone, MessageCircle, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Listing } from "../types";

const statusStyles: Record<string, string> = {
  SALE: "bg-emerald-600 text-white",
  RENT: "bg-amber-500 text-white",
  LEASE: "bg-sky-600 text-white",
};

const petBadgeStyles: Record<string, string> = {
  "Pets Allowed": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "No Pets Allowed": "bg-rose-50 text-rose-700 border border-rose-200",
  "On Request": "bg-amber-50 text-amber-700 border border-amber-200",
};

function formatNaira(price: number): string {
  return "₦" + price.toLocaleString("en-NG");
}

export function ListingCard({
  listing,
  onView,
}: {
  listing: Listing;
  onView: (id: string) => void;
}) {
  return (
    <Card className="group overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative cursor-pointer" onClick={() => onView(listing.id)}>
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge
          className={`absolute left-3 top-3 rounded-md px-3 py-1 text-xs font-bold tracking-wide ${statusStyles[listing.status]}`}
        >
          {listing.status}
        </Badge>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-xl font-bold text-white">{formatNaira(listing.price)}</p>
          {listing.status === "RENT" && (
            <p className="text-xs text-slate-200">per annum</p>
          )}
        </div>
      </div>

      <CardHeader className="pb-2">
        <h3
          className="cursor-pointer text-lg font-bold leading-snug text-slate-900 hover:text-emerald-700"
          onClick={() => onView(listing.id)}
        >
          {listing.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            <span>
              {listing.city}, {listing.state}
            </span>
          </div>
          <Badge className={`rounded-md px-2 py-1 text-xs font-medium ${petBadgeStyles[listing.petPolicy]}`}>
            {listing.petPolicy === "Pets Allowed" ? "🐾 Pets Allowed" : listing.petPolicy === "No Pets Allowed" ? "🚫 No Pets" : "🐾 On Request"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
          {listing.houseSubType && (
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <Home className="h-4 w-4 text-emerald-600" /> {listing.houseSubType}
            </span>
          )}
          {listing.bedrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-emerald-600" /> {listing.bedrooms} Beds
            </span>
          )}
          {listing.bathrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-emerald-600" /> {listing.bathrooms} Baths
            </span>
          )}
          {listing.sizeSqm !== undefined && (
            <span className="flex items-center gap-1">
              <Maximize className="h-4 w-4 text-emerald-600" /> {listing.sizeSqm} m²
            </span>
          )}
        </div>
        {listing.amenities.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {listing.amenities.slice(0, 4).map((a) => (
              <span key={a} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {a}
              </span>
            ))}
            {listing.amenities.length > 4 && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                +{listing.amenities.length - 4} more
              </span>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2 border-t border-slate-100 pt-3">
        <a href={`tel:${listing.ownerPhone}`} className="flex-1">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="sm">
            <Phone className="mr-1 h-3.5 w-3.5" /> Call Owner
          </Button>
        </a>
        <a
          href={`https://wa.me/${listing.ownerWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button className="w-full bg-green-500 hover:bg-green-600" size="sm">
            <MessageCircle className="mr-1 h-3.5 w-3.5" /> WhatsApp
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}