import { useState } from "react";
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Phone, MessageCircle, CheckCircle2, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Listing } from "../types";

const petBadgeStyles: Record<string, string> = {
  "Pets Allowed": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "No Pets Allowed": "bg-rose-50 text-rose-700 border border-rose-200",
  "On Request": "bg-amber-50 text-amber-700 border border-amber-200",
};

function formatNaira(price: number): string {
  return "₦" + price.toLocaleString("en-NG");
}

export function ListingDetail({
  listing,
  onBack,
}: {
  listing: Listing;
  onBack: () => void;
}) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 text-slate-600 hover:text-emerald-700"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl bg-slate-900">
            <img
              src={listing.images[activeImage]}
              alt={listing.title}
              className="h-96 w-full object-cover"
            />
          </div>

          {listing.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {listing.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    activeImage === idx
                      ? "border-emerald-600 ring-2 ring-emerald-200"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-slate-900">{listing.title}</h2>
            <div className="mt-2 flex items-center gap-2 text-slate-500">
              <MapPin className="h-4 w-4" />
              <span>
                {listing.city}, {listing.state}, Nigeria
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 border-y border-slate-100 py-4">
              {listing.houseSubType && (
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">{listing.houseSubType}</span>
                </div>
              )}
              {listing.bedrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">
                    {listing.bedrooms} Bedrooms
                  </span>
                </div>
              )}
              {listing.bathrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">
                    {listing.bathrooms} Bathrooms
                  </span>
                </div>
              )}
              {listing.kitchenCount !== undefined && listing.kitchenCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    🍳 {listing.kitchenCount} Kitchen{listing.kitchenCount > 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {listing.sizeSqm !== undefined && (
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">
                    {listing.sizeSqm} m²
                  </span>
                </div>
              )}
            </div>

            <h3 className="mt-6 text-lg font-bold text-slate-900">Description</h3>
            <p className="mt-2 leading-relaxed text-slate-600">{listing.description}</p>

            {listing.amenities.length > 0 && (
              <>
                <h3 className="mt-6 text-lg font-bold text-slate-900">Amenities</h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {listing.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </>
            )}

            {listing.features.length > 0 && (
              <>
                <h3 className="mt-6 text-lg font-bold text-slate-900">Features & Documents</h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {listing.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      {feature}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4 rounded-2xl border-emerald-100 bg-emerald-50/50 shadow-md">
            <CardHeader>
              <Badge className="w-fit bg-emerald-600 text-white">{listing.status}</Badge>
              <CardTitle className="mt-2 text-3xl font-bold text-emerald-700">
                {formatNaira(listing.price)}
              </CardTitle>
              {listing.status === "RENT" && (
                <p className="text-sm text-slate-500">per annum</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${petBadgeStyles[listing.petPolicy]}`}>
                {listing.petPolicy === "Pets Allowed" ? "🐾 Pets Allowed" : listing.petPolicy === "No Pets Allowed" ? "🚫 No Pets Allowed" : "🐾 Pets On Request"}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Listed By</p>
                <p className="mt-1 font-semibold text-slate-900">{listing.ownerName}</p>
                <p className="text-sm text-slate-500">Property Owner</p>
              </div>

              <a href={`tel:${listing.ownerPhone}`} className="block">
                <Button className="w-full bg-emerald-600 py-6 text-base hover:bg-emerald-700">
                  <Phone className="mr-2 h-5 w-5" /> Call Owner
                </Button>
              </a>
              <a
                href={`https://wa.me/${listing.ownerWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-green-500 py-6 text-base hover:bg-green-600">
                  <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp Owner
                </Button>
              </a>

              <div className="rounded-xl bg-slate-100 p-3 text-center text-xs text-slate-500">
                Posted on {new Date(listing.postedAt).toLocaleDateString("en-NG")}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}