import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, Home, PlusCircle, Info, LogIn, Building2, Bed, Bath, Maximize,
  MapPin, Phone, MessageCircle, ArrowLeft, CheckCircle2, Upload, X,
  Bot, Send, Sparkles, Play, LogOut, LayoutDashboard, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// --- TYPES ---
type ListingStatus = "SALE" | "RENT" | "LEASE";
type PropertyType = "House" | "Land" | "Commercial";
type DealType = "Buy" | "Sell" | "Rent" | "Lease";
type HouseSubType = "Duplex" | "Bungalow" | "Block of Flats" | "Penthouse" | "Terrace" | "Semi-Detached" | "Detached";
type PetPolicy = "Pets Allowed" | "No Pets Allowed" | "On Request";
type AuthMode = "login" | "register";
type AccountType = "Buyer/Renter" | "Property Owner/Landlord" | "Agent";

interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface User {
  name: string;
  email: string;
  phone: string;
  accountType: AccountType;
}

interface Listing {
  id: string; title: string; price: number; status: ListingStatus;
  city: string; state: string; propertyType: PropertyType;
  houseSubType?: HouseSubType; bedrooms?: number; bathrooms?: number;
  kitchenCount?: number; amenities: string[]; petPolicy: PetPolicy;
  sizeSqm?: number; features: string[]; description: string;
  media: MediaItem[]; ownerName: string; ownerPhone: string;
  ownerWhatsapp: string; postedAt: string;
}

interface Filters {
  deal: DealType; state: string; city: string;
  propertyType: PropertyType | "All"; houseSubType: HouseSubType | "All";
  minBedrooms: string; minBathrooms: string; amenities: string[];
  petPolicy: PetPolicy | "All"; minPrice: string; maxPrice: string;
}

// --- DATA ---
const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const STATE_CITIES: Record<string, string[]> = {
  "Abia": ["Aba", "Umuahia", "Arochukwu", "Ohafia"], "Adamawa": ["Yola", "Mubi", "Jimeta", "Numan"], "Akwa Ibom": ["Uyo", "Ikot Ekpene", "Eket", "Oron"], "Anambra": ["Awka", "Onitsha", "Nnewi", "Aguata"], "Bauchi": ["Bauchi", "Azare", "Misau", "Jama'are"], "Bayelsa": ["Yenagoa", "Brass", "Sagbama", "Ogbia"], "Benue": ["Makurdi", "Gboko", "Otukpo", "Katsina-Ala"], "Borno": ["Maiduguri", "Biu", "Bama", "Damboa"], "Cross River": ["Calabar", "Ikom", "Ogoja", "Ugep"], "Delta": ["Asaba", "Warri", "Sapele", "Ughelli", "Agbor"], "Ebonyi": ["Abakaliki", "Afikpo", "Onueke", "Ishielu"], "Edo": ["Benin City", "Auchi", "Ekpoma", "Uromi"], "Ekiti": ["Ado Ekiti", "Ikere Ekiti", "Omuo", "Aramoko"], "Enugu": ["Enugu", "Nsukka", "Oji River", "Udi"], "FCT (Abuja)": ["Maitama", "Wuse", "Garki", "Gwarinpa", "Kubwa", "Asokoro"], "Gombe": ["Gombe", "Kumo", "Bajoga", "Deba"], "Imo": ["Owerri", "Orlu", "Okigwe", "Mbaise"], "Jigawa": ["Dutse", "Hadejia", "Kazaure", "Birnin Kudu"], "Kaduna": ["Kaduna", "Zaria", "Kafanchan", "Saminaka"], "Kano": ["Kano", "Wudil", "Bichi", "Rano"], "Katsina": ["Katsina", "Daura", "Funtua", "Malumfashi"], "Kebbi": ["Birnin Kebbi", "Argungu", "Yelwa", "Zuru"], "Kogi": ["Lokoja", "Okene", "Kabba", "Idah"], "Kwara": ["Ilorin", "Offa", "Jebba", "Omu-Aran"], "Lagos": ["Ikeja", "Lekki", "Victoria Island", "Surulere", "Epe", "Ikorodu", "Yaba", "Ajah"], "Nasarawa": ["Lafia", "Keffi", "Akwanga", "Karshi"], "Niger": ["Minna", "Suleja", "Bida", "Kontagora"], "Ogun": ["Abeokuta", "Sagamu", "Ijebu Ode", "Otta", "Mowe"], "Ondo": ["Akure", "Ondo City", "Owo", "Okitipupa"], "Osun": ["Osogbo", "Ilesa", "Ife", "Ila-Orangun"], "Oyo": ["Ibadan", "Ogbomoso", "Oyo Town", "Saki", "Iseyin"], "Plateau": ["Jos", "Bukuru", "Pankshin", "Shendam"], "Rivers": ["Port Harcourt", "Bonny", "Eleme", "Omoku"], "Sokoto": ["Sokoto", "Wamakko", "Tambuwal", "Gwadabawa"], "Taraba": ["Jalingo", "Wukari", "Serti", "Bali"], "Yobe": ["Damaturu", "Potiskum", "Gashua", "Nguru"], "Zamfara": ["Gusau", "Kaura Namoda", "Anka", "Talata Mafara"]
};

const HOUSE_SUB_TYPES: HouseSubType[] = ["Duplex", "Bungalow", "Block of Flats", "Penthouse", "Terrace", "Semi-Detached", "Detached"];
const HOUSE_AMENITIES = ["Balcony", "Garden", "Car Park / Parking Space", "Dining Area", "Laundry Room", "Store / Pantry", "Penthouse Suite Access"];

const MOCK_LISTINGS: Listing[] = [
  { id: "lst-001", title: "Modern 3-Bedroom Terrace Duplex", price: 85000000, status: "SALE", city: "Lekki", state: "Lagos", propertyType: "House", houseSubType: "Terrace", bedrooms: 3, bathrooms: 4, kitchenCount: 1, amenities: ["Kitchen", "Car Park / Parking Space", "Garden", "Security"], petPolicy: "Pets Allowed", sizeSqm: 220, description: "A newly built terrace duplex in a serene estate with 24/7 security, ample parking space, and modern finishes. The kitchen comes fully fitted with quality cabinets and appliances. All rooms are ensuite with fitted wardrobes.", features: ["C of O", "Electricity", "Water", "Security"], media: [{ url: "https://images.unsplash.com/photo-1564013799936-ab5827c0c558?w=1200&q=80", type: "image" }, { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80", type: "image" }, { url: "https://images.unsplash.com/photo-1600596542815-ffad4c0c9a01?w=1200&q=80", type: "image" }], ownerName: "Chidi Okafor", ownerPhone: "+2348012345678", ownerWhatsapp: "2348012345678", postedAt: "2024-01-15" },
  { id: "lst-002", title: "Luxury 4-Bedroom Detached House", price: 250000000, status: "SALE", city: "Maitama", state: "FCT (Abuja)", propertyType: "House", houseSubType: "Detached", bedrooms: 4, bathrooms: 5, kitchenCount: 2, amenities: ["Swimming Pool", "Gym", "Smart Home", "Car Park / Parking Space", "Garden", "Laundry Room"], petPolicy: "On Request", sizeSqm: 450, description: "Exquisite detached home in the heart of Maitama. Features a swimming pool, gym, and smart home automation. The property sits on a large plot with beautifully landscaped gardens.", features: ["C of O", "Electricity", "Water"], media: [{ url: "https://images.unsplash.com/photo-1613490493576-88fda9c1c60d?w=1200&q=80", type: "image" }, { url: "https://images.unsplash.com/photo-1600585154526-990dced4db54?w=1200&q=80", type: "image" }, { url: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80", type: "image" }], ownerName: "Aisha Bello", ownerPhone: "+2348023456789", ownerWhatsapp: "2348023456789", postedAt: "2024-02-20" },
  { id: "lst-003", title: "Cozy 2-Bedroom Apartment for Rent", price: 1500000, status: "RENT", city: "Yaba", state: "Lagos", propertyType: "House", houseSubType: "Block of Flats", bedrooms: 2, bathrooms: 2, kitchenCount: 1, amenities: ["Car Park / Parking Space", "Borehole", "Dining Area"], petPolicy: "No Pets Allowed", sizeSqm: 95, description: "Well-maintained 2-bedroom apartment in a quiet neighborhood. Close to shops, schools, and public transport. Perfect for young professionals or small families.", features: ["Electricity", "Water"], media: [{ url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80", type: "image" }, { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d9e578?w=1200&q=80", type: "image" }, { url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80", type: "image" }], ownerName: "Funke Adeyemi", ownerPhone: "+2348034567890", ownerWhatsapp: "2348034567890", postedAt: "2024-03-05" },
  { id: "lst-004", title: "Prime Commercial Land (1 Acre)", price: 120000000, status: "SALE", city: "Ibadan", state: "Oyo", propertyType: "Land", amenities: [], petPolicy: "Pets Allowed", sizeSqm: 4047, description: "Strategically located commercial land suitable for shopping mall, office complex, or mixed-use development. Directly facing the main road with high traffic visibility.", features: ["C of O", "Electricity", "Fenced", "Good Road Network"], media: [{ url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80", type: "image" }, { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c50?w=1200&q=80", type: "image" }], ownerName: "Kunle Raji", ownerPhone: "+2348045678901", ownerWhatsapp: "2348045678901", postedAt: "2024-03-10" },
  { id: "lst-005", title: "Office Space for Lease (Open Plan)", price: 5000000, status: "LEASE", city: "Victoria Island", state: "Lagos", propertyType: "Commercial", amenities: [], petPolicy: "No Pets Allowed", sizeSqm: 180, description: "Modern open-plan office space in a Grade A building. Comes with fitted kitchen, server room, and ample parking. Flexible lease terms available.", features: ["Electricity", "Water", "24/7 Security", "Air Conditioning", "Server Room"], media: [{ url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80", type: "image" }, { url: "https://images.unsplash.com/photo-1497366811353-6870743d04b2?w=1200&q=80", type: "image" }], ownerName: "Tunde Bakare", ownerPhone: "+2348056789012", ownerWhatsapp: "2348056789012", postedAt: "2024-03-15" },
  { id: "lst-006", title: "5-Bedroom Contemporary Mansion", price: 180000000, status: "SALE", city: "Ikeja GRA", state: "Lagos", propertyType: "House", houseSubType: "Duplex", bedrooms: 5, bathrooms: 6, kitchenCount: 2, amenities: ["Home Cinema", "Swimming Pool", "Gym", "Smart Home", "Garden", "Car Park / Parking Space", "Laundry Room", "Balcony"], petPolicy: "Pets Allowed", sizeSqm: 600, description: "Stunning contemporary mansion with state-of-the-art amenities. Features include a home cinema, indoor pool, and private gym. Located in the prestigious Ikeja GRA.", features: ["C of O", "Electricity", "Water"], media: [{ url: "https://images.unsplash.com/photo-1600585154363-67eb9e5e224a?w=1200&q=80", type: "image" }, { url: "https://images.unsplash.com/photo-1600566753086-00f18f6c1f1f?w=1200&q=80", type: "image" }, { url: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&q=80", type: "image" }], ownerName: "Ngozi Eze", ownerPhone: "+2348067890123", ownerWhatsapp: "2348067890123", postedAt: "2024-03-20" },
  { id: "lst-007", title: "Standard 600sqm Plot of Land", price: 25000000, status: "SALE", city: "Lekki", state: "Lagos", propertyType: "Land", amenities: [], petPolicy: "Pets Allowed", sizeSqm: 600, description: "Dry and well-located plot of land in Lekki Phase 1. Suitable for residential development. Has genuine title documents and is free from encumbrances.", features: ["C of O", "Dry Land", "Fenced", "Good Road"], media: [{ url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80", type: "image" }, { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c50?w=1200&q=80", type: "image" }], ownerName: "Emeka Nwosu", ownerPhone: "+2348078901234", ownerWhatsapp: "2348078901234", postedAt: "2024-03-25" },
  { id: "lst-008", title: "3-Bedroom Flat for Rent (Serviced)", price: 4500000, status: "RENT", city: "Wuse", state: "FCT (Abuja)", propertyType: "House", houseSubType: "Block of Flats", bedrooms: 3, bathrooms: 3, kitchenCount: 1, amenities: ["Air Conditioning", "Car Park / Parking Space", "Security", "Serviced", "Balcony", "Store / Pantry"], petPolicy: "On Request", sizeSqm: 160, description: "Fully serviced 3-bedroom flat in a secure compound. Comes with fitted kitchen, air conditioning, and dedicated parking. Rent includes service charges.", features: ["Electricity", "Water"], media: [{ url: "https://images.unsplash.com/photo-1560448204-e02b11c4307c?w=1200&q=80", type: "image" }, { url: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200&q=80", type: "image" }], ownerName: "Zainab Ibrahim", ownerPhone: "+2348089012345", ownerWhatsapp: "2348089012345", postedAt: "2024-04-01" },
];

// --- PET POLICY SELECTOR COMPONENT ---
const PET_OPTIONS: { value: PetPolicy | "All"; label: string; icon: string }[] = [
  { value: "All", label: "All", icon: "" },
  { value: "Pets Allowed", label: "Pets Allowed", icon: "🐾" },
  { value: "No Pets Allowed", label: "No Pets", icon: "🚫" },
  { value: "On Request", label: "On Request", icon: "🐾" },
];

function PetPolicySelector({ value, onChange, includeAll = false, size = "md" }: { value: PetPolicy | "All"; onChange: (value: PetPolicy | "All") => void; includeAll?: boolean; size?: "sm" | "md" }) {
  const visibleOptions = includeAll ? PET_OPTIONS : PET_OPTIONS.filter((o) => o.value !== "All");
  return (
    <div className="flex flex-wrap gap-2">
      {visibleOptions.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border-2 font-medium transition-all duration-200 active:scale-95",
              size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
              isActive
                ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            )}
          >
            {option.icon && <span className="text-sm">{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// --- LISTING CARD COMPONENT ---
const statusStyles: Record<string, string> = {
  SALE: "bg-emerald-600 text-white", RENT: "bg-amber-500 text-white", LEASE: "bg-sky-600 text-white",
};
const petBadgeStyles: Record<string, string> = {
  "Pets Allowed": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "No Pets Allowed": "bg-rose-50 text-rose-700 border border-rose-200",
  "On Request": "bg-amber-50 text-amber-700 border border-amber-200",
};

function formatNaira(price: number): string { return "₦" + price.toLocaleString("en-NG"); }

function ListingCard({ listing, onView }: { listing: Listing; onView: (id: string) => void }) {
  const firstImage = listing.media.find(m => m.type === "image") || listing.media[0];
  return (
    <Card className="group overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative cursor-pointer" onClick={() => onView(listing.id)}>
        {firstImage.type === "image" ? (
          <img src={firstImage.url} alt={listing.title} className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <video src={firstImage.url} className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105" muted />
        )}
        <Badge className={`absolute left-3 top-3 rounded-md px-3 py-1 text-xs font-bold tracking-wide ${statusStyles[listing.status]}`}>{listing.status}</Badge>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-xl font-bold text-white">{formatNaira(listing.price)}</p>
          {listing.status === "RENT" && <p className="text-xs text-slate-200">per annum</p>}
        </div>
      </div>
      <CardHeader className="pb-2">
        <h3 className="cursor-pointer text-lg font-bold leading-snug text-slate-900 hover:text-emerald-700" onClick={() => onView(listing.id)}>{listing.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5" /><span>{listing.city}, {listing.state}</span>
          </div>
          <Badge className={`rounded-md px-2 py-1 text-xs font-medium ${petBadgeStyles[listing.petPolicy]}`}>
            {listing.petPolicy === "Pets Allowed" ? "🐾 Pets Allowed" : listing.petPolicy === "No Pets Allowed" ? "🚫 No Pets" : "🐾 On Request"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
          {listing.houseSubType && <span className="flex items-center gap-1 font-medium text-slate-700"><Home className="h-4 w-4 text-emerald-600" /> {listing.houseSubType}</span>}
          {listing.bedrooms !== undefined && <span className="flex items-center gap-1"><Bed className="h-4 w-4 text-emerald-600" /> {listing.bedrooms} Beds</span>}
          {listing.bathrooms !== undefined && <span className="flex items-center gap-1"><Bath className="h-4 w-4 text-emerald-600" /> {listing.bathrooms} Baths</span>}
          {listing.sizeSqm !== undefined && <span className="flex items-center gap-1"><Maximize className="h-4 w-4 text-emerald-600" /> {listing.sizeSqm} m²</span>}
        </div>
        {listing.amenities.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {listing.amenities.slice(0, 4).map((a) => (<span key={a} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{a}</span>))}
            {listing.amenities.length > 4 && <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500">+{listing.amenities.length - 4} more</span>}
          </div>
        )}
      </CardContent>
      <CardFooter className="gap-2 border-t border-slate-100 pt-3">
        <a href={`tel:${listing.ownerPhone}`} className="flex-1"><Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="sm"><Phone className="mr-1 h-3.5 w-3.5" /> Call Owner</Button></a>
        <a href={`https://wa.me/${listing.ownerWhatsapp}`} target="_blank" rel="noopener noreferrer" className="flex-1"><Button className="w-full bg-green-500 hover:bg-green-600" size="sm"><MessageCircle className="mr-1 h-3.5 w-3.5" /> WhatsApp</Button></a>
      </CardFooter>
    </Card>
  );
}

// --- LISTING DETAIL COMPONENT ---
function ListingDetail({ listing, onBack }: { listing: Listing; onBack: () => void }) {
  const [activeMedia, setActiveMedia] = useState(0);
  const currentMedia = listing.media[activeMedia];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Button variant="ghost" onClick={onBack} className="mb-4 text-slate-600 hover:text-emerald-700"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings</Button>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl bg-slate-900">
            {currentMedia.type === "image" ? (
              <img src={currentMedia.url} alt={listing.title} className="h-96 w-full object-cover" />
            ) : (
              <video src={currentMedia.url} controls className="h-96 w-full object-cover" />
            )}
          </div>
          {listing.media.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {listing.media.map((m, idx) => (
                <button key={idx} onClick={() => setActiveMedia(idx)} className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${activeMedia === idx ? "border-emerald-600 ring-2 ring-emerald-200" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  {m.type === "image" ? (
                    <img src={m.url} alt={`View ${idx + 1}`} className="h-full w-full object-cover" />
                  ) : (
                    <video src={m.url} className="h-full w-full object-cover" muted />
                  )}
                  {m.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-6 w-6 text-white" fill="white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-slate-900">{listing.title}</h2>
            <div className="mt-2 flex items-center gap-2 text-slate-500"><MapPin className="h-4 w-4" /><span>{listing.city}, {listing.state}, Nigeria</span></div>
            <div className="mt-4 flex flex-wrap gap-4 border-y border-slate-100 py-4">
              {listing.houseSubType && <div className="flex items-center gap-2"><Home className="h-5 w-5 text-emerald-600" /><span className="text-sm font-medium text-slate-700">{listing.houseSubType}</span></div>}
              {listing.bedrooms !== undefined && <div className="flex items-center gap-2"><Bed className="h-5 w-5 text-emerald-600" /><span className="text-sm font-medium text-slate-700">{listing.bedrooms} Bedrooms</span></div>}
              {listing.bathrooms !== undefined && <div className="flex items-center gap-2"><Bath className="h-5 w-5 text-emerald-600" /><span className="text-sm font-medium text-slate-700">{listing.bathrooms} Bathrooms</span></div>}
              {listing.kitchenCount !== undefined && listing.kitchenCount > 0 && <div className="flex items-center gap-2"><span className="text-sm font-medium text-slate-700">🍳 {listing.kitchenCount} Kitchen{listing.kitchenCount > 1 ? "s" : ""}</span></div>}
              {listing.sizeSqm !== undefined && <div className="flex items-center gap-2"><Maximize className="h-5 w-5 text-emerald-600" /><span className="text-sm font-medium text-slate-700">{listing.sizeSqm} m²</span></div>}
            </div>
            <h3 className="mt-6 text-lg font-bold text-slate-900">Description</h3>
            <p className="mt-2 leading-relaxed text-slate-600">{listing.description}</p>
            {listing.amenities.length > 0 && (<><h3 className="mt-6 text-lg font-bold text-slate-900">Amenities</h3><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{listing.amenities.map((amenity) => (<div key={amenity} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-600" />{amenity}</div>))}</div></>)}
            {listing.features.length > 0 && (<><h3 className="mt-6 text-lg font-bold text-slate-900">Features & Documents</h3><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{listing.features.map((feature) => (<div key={feature} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-emerald-600" />{feature}</div>))}</div></>)}
          </div>
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-4 rounded-2xl border-emerald-100 bg-emerald-50/50 shadow-md">
            <CardHeader>
              <Badge className="w-fit bg-emerald-600 text-white">{listing.status}</Badge>
              <CardTitle className="mt-2 text-3xl font-bold text-emerald-700">{formatNaira(listing.price)}</CardTitle>
              {listing.status === "RENT" && <p className="text-sm text-slate-500">per annum</p>}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${petBadgeStyles[listing.petPolicy]}`}>{listing.petPolicy === "Pets Allowed" ? "🐾 Pets Allowed" : listing.petPolicy === "No Pets Allowed" ? "🚫 No Pets Allowed" : "🐾 Pets On Request"}</div>
              <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs uppercase tracking-wide text-slate-400">Listed By</p><p className="mt-1 font-semibold text-slate-900">{listing.ownerName}</p><p className="text-sm text-slate-500">Property Owner</p></div>
              <a href={`tel:${listing.ownerPhone}`} className="block"><Button className="w-full bg-emerald-600 py-6 text-base hover:bg-emerald-700"><Phone className="mr-2 h-5 w-5" /> Call Owner</Button></a>
              <a href={`https://wa.me/${listing.ownerWhatsapp}`} target="_blank" rel="noopener noreferrer" className="block"><Button className="w-full bg-green-500 py-6 text-base hover:bg-green-600"><MessageCircle className="mr-2 h-5 w-5" /> WhatsApp Owner</Button></a>
              <div className="rounded-xl bg-slate-100 p-3 text-center text-xs text-slate-500">Posted on {new Date(listing.postedAt).toLocaleDateString("en-NG")}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- POST PROPERTY FORM COMPONENT ---
function PostPropertyForm({ onSubmit, onCancel }: { onSubmit: (listing: Listing) => void; onCancel: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState({
    title: "", price: "", status: "SALE" as ListingStatus, city: "", state: "",
    propertyType: "House" as PropertyType, houseSubType: "" as HouseSubType | "",
    bedrooms: "", bathrooms: "", kitchenCount: "1", sizeSqm: "", description: "",
    features: "", petPolicy: "Pets Allowed" as PetPolicy, ownerName: "", ownerPhone: "", ownerWhatsapp: "",
  });

  const availableCities = form.state ? STATE_CITIES[form.state] || [] : [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newMedia: MediaItem[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        newMedia.push({
          url: URL.createObjectURL(file),
          type: file.type.startsWith("video/") ? "video" : "image"
        });
      }
    });
    setMediaItems((prev) => [...prev, ...newMedia].slice(0, 10));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeMedia = (index: number) => {
    setMediaItems((prev) => {
      const item = prev[index];
      if (item && item.url.startsWith("blob:")) {
        URL.revokeObjectURL(item.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allFeatures = form.features.split(",").map((f) => f.trim()).filter(Boolean);
    const finalMedia = mediaItems.length > 0 ? mediaItems : [{ url: "https://images.unsplash.com/photo-1564013799936-ab5827c0c558?w=1200&q=80", type: "image" as const }];
    
    const newListing: Listing = {
      id: "lst-" + Date.now(), title: form.title, price: parseInt(form.price) || 0, status: form.status,
      city: form.city, state: form.state, propertyType: form.propertyType,
      houseSubType: form.propertyType === "House" && form.houseSubType ? form.houseSubType : undefined,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : undefined,
      kitchenCount: form.propertyType === "House" && form.houseSubType ? parseInt(form.kitchenCount) : undefined,
      amenities: selectedAmenities, petPolicy: form.petPolicy,
      sizeSqm: form.sizeSqm ? parseInt(form.sizeSqm) : undefined, description: form.description,
      features: allFeatures, media: finalMedia,
      ownerName: form.ownerName, ownerPhone: form.ownerPhone,
      ownerWhatsapp: form.ownerWhatsapp.replace(/\D/g, ""), postedAt: new Date().toISOString().split("T")[0],
    };
    onSubmit(newListing); setSubmitted(true);
    setTimeout(() => { setSubmitted(false); onCancel(); }, 2000);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Card className="rounded-2xl border-slate-200 shadow-md">
        <CardHeader className="border-b border-slate-100 bg-emerald-50/50 rounded-t-2xl">
          <CardTitle className="font-serif text-2xl text-emerald-800">Post a New Property</CardTitle>
          <p className="text-sm text-slate-500">Fill in the details below to list your property.</p>
        </CardHeader>
        <CardContent className="pt-6">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-600" />
              <h3 className="mt-4 text-xl font-bold text-slate-900">Property Posted Successfully!</h3>
              <p className="mt-1 text-slate-500">Your listing is now live on Beecee Homes.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><Label htmlFor="title">Property Title *</Label><Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Modern 3-Bedroom Terrace Duplex" className="mt-1.5" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="price">Price (₦) *</Label><Input id="price" required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. 85000000" className="mt-1.5" /></div>
                <div><Label htmlFor="status">Status *</Label><Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ListingStatus })}><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select status" /></SelectTrigger><SelectContent><SelectItem value="SALE">For Sale</SelectItem><SelectItem value="RENT">For Rent</SelectItem><SelectItem value="LEASE">For Lease</SelectItem></SelectContent></Select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="state">State *</Label><Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v, city: "" })}><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select state" /></SelectTrigger><SelectContent>{NIGERIAN_STATES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent></Select></div>
                <div><Label htmlFor="city">City *</Label><Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })} disabled={!form.state}><SelectTrigger className="mt-1.5"><SelectValue placeholder={form.state ? "Select city" : "Select state first"} /></SelectTrigger><SelectContent>{availableCities.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent></Select></div>
              </div>
              <div><Label htmlFor="propertyType">Property Type *</Label><Select value={form.propertyType} onValueChange={(v) => setForm({ ...form, propertyType: v as PropertyType, houseSubType: "" })}><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="House">House</SelectItem><SelectItem value="Land">Land</SelectItem><SelectItem value="Commercial">Commercial</SelectItem></SelectContent></Select></div>
              
              {form.propertyType === "House" && (
                <div className="space-y-5 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                  <h3 className="font-semibold text-emerald-800">Type of Building</h3>
                  <div><Label htmlFor="houseSubType">Building Sub-Type</Label><Select value={form.houseSubType} onValueChange={(v) => setForm({ ...form, houseSubType: v as HouseSubType })}><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select building type" /></SelectTrigger><SelectContent>{HOUSE_SUB_TYPES.map((st) => (<SelectItem key={st} value={st}>{st}</SelectItem>))}</SelectContent></Select></div>
                  
                  {form.houseSubType && (
                    <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-4">
                      <h4 className="text-sm font-semibold text-slate-700">Building Specifications</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div><Label htmlFor="bedrooms" className="text-xs">Bedrooms</Label><Input id="bedrooms" type="number" min="0" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} placeholder="e.g. 3" className="mt-1" /></div>
                        <div><Label htmlFor="bathrooms" className="text-xs">Toilets & Baths</Label><Input id="bathrooms" type="number" min="0" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} placeholder="e.g. 4" className="mt-1" /></div>
                        <div><Label htmlFor="kitchenCount" className="text-xs">Kitchen</Label><Select value={form.kitchenCount} onValueChange={(v) => setForm({ ...form, kitchenCount: v })}><SelectTrigger className="mt-1"><SelectValue placeholder="Count" /></SelectTrigger><SelectContent><SelectItem value="0">No Kitchen</SelectItem><SelectItem value="1">1</SelectItem><SelectItem value="2">2</SelectItem><SelectItem value="3">3</SelectItem></SelectContent></Select></div>
                      </div>
                      <div><Label className="mb-2 block text-xs">Amenities</Label><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{HOUSE_AMENITIES.map((amenity) => (<div key={amenity} className="flex items-center space-x-2"><Checkbox id={`amen-${amenity}`} checked={selectedAmenities.includes(amenity)} onCheckedChange={() => toggleAmenity(amenity)} /><Label htmlFor={`amen-${amenity}`} className="cursor-pointer text-xs font-normal text-slate-700">{amenity}</Label></div>))}</div></div>
                      <div className="border-t border-slate-100 pt-3"><Label className="mb-2 block text-xs">Animals Allowed?</Label><PetPolicySelector value={form.petPolicy} onChange={(v) => setForm({ ...form, petPolicy: v as PetPolicy })} size="sm" /></div>
                    </div>
                  )}
                </div>
              )}

              {form.propertyType !== "House" && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><Label className="mb-3 block">Animals Allowed? *</Label><PetPolicySelector value={form.petPolicy} onChange={(v) => setForm({ ...form, petPolicy: v as PetPolicy })} /></div>
              )}

              <div><Label htmlFor="sizeSqm">Size (m²)</Label><Input id="sizeSqm" type="number" value={form.sizeSqm} onChange={(e) => setForm({ ...form, sizeSqm: e.target.value })} placeholder="e.g. 220" className="mt-1.5" /></div>
              <div><Label htmlFor="description">Description *</Label><Textarea id="description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the property..." className="mt-1.5" rows={4} /></div>
              <div><Label htmlFor="features">Additional Features (comma-separated)</Label><Input id="features" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="e.g. C of O, Electricity, Water, Borehole" className="mt-1.5" /></div>
              
              {/* Native File Uploader */}
              <div>
                <Label>Property Photos & Videos</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1.5 w-full border-dashed border-emerald-300 bg-emerald-50/50 py-8 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8" />
                    <span className="font-semibold">Click to upload photos or videos</span>
                    <span className="text-xs text-slate-500">PNG, JPG, MP4 up to 10 items</span>
                  </div>
                </Button>
                
                {mediaItems.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {mediaItems.map((item, idx) => (
                      <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200">
                        {item.type === "image" ? (
                          <img src={item.url} alt={`Upload ${idx + 1}`} className="h-full w-full object-cover" />
                        ) : (
                          <video src={item.url} className="h-full w-full object-cover" muted />
                        )}
                        {item.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="h-6 w-6 text-white" fill="white" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(idx)}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="mb-3 font-semibold text-slate-900">Owner Details</h3>
                <div className="space-y-4">
                  <div><Label htmlFor="ownerName">Owner Name *</Label><Input id="ownerName" required value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} placeholder="Full name" className="mt-1.5" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label htmlFor="ownerPhone">Phone *</Label><Input id="ownerPhone" required value={form.ownerPhone} onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })} placeholder="+234..." className="mt-1.5" /></div>
                    <div><Label htmlFor="ownerWhatsapp">WhatsApp No. *</Label><Input id="ownerWhatsapp" required value={form.ownerWhatsapp} onChange={(e) => setForm({ ...form, ownerWhatsapp: e.target.value })} placeholder="234..." className="mt-1.5" /></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 bg-emerald-600 py-6 hover:bg-emerald-700">Post Property</Button>
                <Button type="button" variant="outline" onClick={onCancel} className="px-6">Cancel</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- AUTH MODAL COMPONENT ---
function AuthModal({ open, onOpenChange, onLogin }: { open: boolean; onOpenChange: (open: boolean) => void; onLogin: (user: User) => void }) {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "", email: "", phone: "", password: "", accountType: "Buyer/Renter" as AccountType
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: loginForm.email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "User",
      email: loginForm.email,
      phone: "",
      accountType: "Buyer/Renter"
    });
    setLoginForm({ email: "", password: "" });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: registerForm.name,
      email: registerForm.email,
      phone: registerForm.phone,
      accountType: registerForm.accountType
    });
    setRegisterForm({ name: "", email: "", phone: "", password: "", accountType: "Buyer/Renter" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-emerald-800">
            {authMode === "login" ? "Login to Your Account" : "Create an Account"}
          </DialogTitle>
        </DialogHeader>
        
        {authMode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <Label htmlFor="login-email">Email</Label>
              <Input id="login-email" type="email" required placeholder="you@example.com" className="mt-1.5" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="login-password">Password</Label>
              <Input id="login-password" type="password" required placeholder="••••••••" className="mt-1.5" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
            </div>
            <Button type="submit" className="w-full bg-emerald-600 py-5 text-base hover:bg-emerald-700">Login</Button>
            <p className="text-center text-sm text-slate-500">
              New here?{" "}
              <button type="button" className="font-semibold text-emerald-700 hover:underline" onClick={() => setAuthMode("register")}>
                Create an account
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <Label htmlFor="reg-name">Full Name</Label>
              <Input id="reg-name" required placeholder="John Doe" className="mt-1.5" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="reg-email">Email Address</Label>
              <Input id="reg-email" type="email" required placeholder="you@example.com" className="mt-1.5" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="reg-phone">Phone / WhatsApp Number</Label>
              <Input id="reg-phone" required placeholder="+234..." className="mt-1.5" value={registerForm.phone} onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="reg-password">Password</Label>
              <Input id="reg-password" type="password" required placeholder="••••••••" className="mt-1.5" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="reg-account-type">Account Type</Label>
              <Select value={registerForm.accountType} onValueChange={(v) => setRegisterForm({ ...registerForm, accountType: v as AccountType })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Buyer/Renter">Buyer/Renter</SelectItem>
                  <SelectItem value="Property Owner/Landlord">Property Owner/Landlord</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-emerald-600 py-5 text-base hover:bg-emerald-700">Create Account</Button>
            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button type="button" className="font-semibold text-emerald-700 hover:underline" onClick={() => setAuthMode("login")}>
                Log in
              </button>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// --- BEECEE AI COMPONENT ---
function BeeceeAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hello! I'm BeeceeAI, your real estate assistant. How can I help you find your next home today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    
    setTimeout(() => {
      let botResponse = "I can help you with property searches, pricing, and locations across Nigeria. Try asking about properties in Lagos, Abuja, or Ibadan!";
      const lowerMsg = userMsg.toLowerCase();
      if (lowerMsg.includes("lagos")) botResponse = "We have amazing properties in Lagos! From luxury duplexes in Lekki to cozy apartments in Yaba. Use the state filter to see all Lagos listings.";
      else if (lowerMsg.includes("abuja")) botResponse = "Abuja has premium properties, especially in Maitama and Wuse. Check out our FCT listings for detached houses and serviced flats.";
      else if (lowerMsg.includes("ibadan")) botResponse = "Ibadan offers great value for money, especially for land acquisitions. Look at our Oyo State listings for commercial plots.";
      else if (lowerMsg.includes("pet") || lowerMsg.includes("animal")) botResponse = "You can filter properties by pet policy! Use the 'Pets / Animals Allowed?' filter to find homes that welcome your furry friends.";
      else if (lowerMsg.includes("rent")) botResponse = "Looking to rent? Switch to the 'Rent' tab to see all available rental properties. Prices are listed per annum.";
      else if (lowerMsg.includes("buy") || lowerMsg.includes("sale")) botResponse = "Ready to buy? Use the 'Buy' tab and filter by price range to find properties within your budget.";
      else if (lowerMsg.includes("contact") || lowerMsg.includes("owner")) botResponse = "Each listing has direct 'Call Owner' and 'WhatsApp Owner' buttons so you can reach out instantly!";
      else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) botResponse = "Hello there! Welcome to Beecee Homes. Are you looking to buy, rent, or lease a property in Nigeria?";
      setMessages((prev) => [...prev, { role: "bot", text: botResponse }]);
    }, 600);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-110 hover:bg-emerald-700"
        aria-label="Ask BeeceeAI"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-96 w-80 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:w-96">
          <div className="flex items-center gap-2 bg-emerald-600 px-4 py-3 text-white">
            <Sparkles className="h-5 w-5" />
            <div>
              <p className="font-bold leading-tight">BeeceeAI Assistant</p>
              <p className="text-xs text-emerald-100">Your real estate helper</p>
            </div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[80%] rounded-2xl px-3 py-2 text-sm", msg.role === "user" ? "bg-emerald-600 text-white" : "bg-white text-slate-700 border border-slate-200")}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-slate-200 bg-white p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about properties..."
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon" className="bg-emerald-600 hover:bg-emerald-700">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

// --- BADGE HELPER ---
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold", className)}>{children}</span>;
}

// --- HEADER & FOOTER ---
function Header({ user, onLogoClick, onPostClick, onAboutClick, onAuthClick, onLogout }: { user: User | null; onLogoClick: () => void; onPostClick: () => void; onAboutClick: () => void; onAuthClick: () => void; onLogout: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button onClick={onLogoClick} className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md"><Home className="h-5 w-5" /></div>
          <div className="text-left"><span className="font-serif text-xl font-bold text-slate-900">Beecee</span><span className="font-serif text-xl font-bold text-emerald-600">Homes</span></div>
        </button>
        <nav className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" onClick={onAboutClick} className="text-slate-600 hover:text-emerald-700"><Info className="mr-1 h-4 w-4" /> About Us</Button>
          <Button onClick={onPostClick} className="bg-emerald-600 px-4 hover:bg-emerald-700"><PlusCircle className="mr-1 h-4 w-4" /> Post Property</Button>
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <User className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.accountType}</p>
                </div>
              </div>
              <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50">
                <LayoutDashboard className="mr-1 h-4 w-4" /> Dashboard
              </Button>
              <Button variant="ghost" onClick={onLogout} className="text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                <LogOut className="mr-1 h-4 w-4" /> Logout
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={onAuthClick} className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"><LogIn className="mr-1 h-4 w-4" /> Login / Register</Button>
          )}
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <Button onClick={onPostClick} size="sm" className="bg-emerald-600 hover:bg-emerald-700"><PlusCircle className="h-4 w-4" /></Button>
          {user ? (
            <Button variant="ghost" onClick={onLogout} size="sm" className="text-rose-600 hover:bg-rose-50">
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="outline" onClick={onAuthClick} size="sm"><LogIn className="h-4 w-4" /></Button>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white"><Home className="h-4 w-4" /></div>
              <span className="font-serif text-lg font-bold text-white">Beecee Homes</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">Nigeria's trusted real estate marketplace. Find homes, land, and commercial properties with ease.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Support Contacts</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li><a href="tel:+447867051767" className="hover:text-emerald-400 transition-colors">📞 +447867051767</a></li>
              <li><a href="tel:+2348162549035" className="hover:text-emerald-400 transition-colors">📞 +2348162549035</a></li>
              <li><a href="mailto:beeceegroups@gmail.com" className="hover:text-emerald-400 transition-colors">✉️ beeceegroups@gmail.com</a></li>
              <li><a href="https://wa.me/447867051767" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">💬 WhatsApp: +447867051767</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Founder</h4>
            <div className="mt-3 rounded-xl bg-slate-800 p-4">
              <p className="font-semibold text-white">Lameed Adebisi Monsurat</p>
              <p className="mt-1 text-sm text-emerald-400">CEO, BeeCee Global Homes and Construction Limited</p>
              <p className="mt-2 text-xs text-slate-500">Dedicated to making Nigerian real estate accessible to all.</p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">© {new Date().getFullYear()} Beecee Homes. Founded by Lameed Adebisi Monsurat. All rights reserved.</div>
      </div>
    </footer>
  );
}

// --- MAIN APP ---
export default function App() {
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [filters, setFilters] = useState<Filters>({
    deal: "Buy", state: "All", city: "All", propertyType: "All", houseSubType: "All",
    minBedrooms: "", minBathrooms: "", amenities: [], petPolicy: "All", minPrice: "", maxPrice: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const availableCities = filters.state !== "All" ? STATE_CITIES[filters.state] || [] : [];

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchesSearch = searchQuery === "" || l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.city.toLowerCase().includes(searchQuery.toLowerCase()) || l.state.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDeal = (filters.deal === "Buy" && l.status === "SALE") || (filters.deal === "Sell" && l.status === "SALE") || (filters.deal === "Rent" && l.status === "RENT") || (filters.deal === "Lease" && l.status === "LEASE");
      const matchesState = filters.state === "All" || l.state === filters.state;
      const matchesCity = filters.city === "All" || l.city === filters.city;
      const matchesType = filters.propertyType === "All" || l.propertyType === filters.propertyType;
      const matchesSubType = filters.houseSubType === "All" || l.houseSubType === filters.houseSubType;
      const matchesPetPolicy = filters.petPolicy === "All" || l.petPolicy === filters.petPolicy;
      const minBed = filters.minBedrooms ? parseInt(filters.minBedrooms) : 0;
      const matchesBedrooms = (l.bedrooms || 0) >= minBed;
      const minBath = filters.minBathrooms ? parseInt(filters.minBathrooms) : 0;
      const matchesBathrooms = (l.bathrooms || 0) >= minBath;
      const matchesAmenities = filters.amenities.every((a) => l.amenities.includes(a));
      const min = filters.minPrice ? parseInt(filters.minPrice) : 0;
      const max = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity;
      const matchesPrice = l.price >= min && l.price <= max;
      return matchesSearch && matchesDeal && matchesState && matchesCity && matchesType && matchesSubType && matchesPetPolicy && matchesBedrooms && matchesBathrooms && matchesAmenities && matchesPrice;
    });
  }, [listings, filters, searchQuery]);

  const handleView = (id: string) => { const listing = listings.find((l) => l.id === id); if (listing) setSelectedListing(listing); };
  const handleNewListing = (listing: Listing) => { setListings([listing, ...listings]); };
  const toggleFilterAmenity = (amenity: string) => {
    setFilters((prev) => ({ ...prev, amenities: prev.amenities.includes(amenity) ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity] }));
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedListing(null);
    setShowPostForm(false);
  };

  if (selectedListing) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header user={user} onLogoClick={() => setSelectedListing(null)} onPostClick={() => setShowPostForm(true)} onAboutClick={() => setShowAbout(true)} onAuthClick={() => setShowAuth(true)} onLogout={handleLogout} />
        <ListingDetail listing={selectedListing} onBack={() => setSelectedListing(null)} />
        <Footer />
        <BeeceeAI />
        <AuthModal open={showAuth} onOpenChange={setShowAuth} onLogin={handleLogin} />
      </div>
    );
  }

  if (showPostForm) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header user={user} onLogoClick={() => setShowPostForm(false)} onPostClick={() => setShowPostForm(true)} onAboutClick={() => setShowAbout(true)} onAuthClick={() => setShowAuth(true)} onLogout={handleLogout} />
        <PostPropertyForm onSubmit={handleNewListing} onCancel={() => setShowPostForm(false)} />
        <Footer />
        <BeeceeAI />
        <AuthModal open={showAuth} onOpenChange={setShowAuth} onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onLogoClick={() => setSelectedListing(null)} onPostClick={() => setShowPostForm(true)} onAboutClick={() => setShowAbout(true)} onAuthClick={() => setShowAuth(true)} onLogout={handleLogout} />
      
      <div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-serif text-4xl font-bold text-white md:text-5xl">Find Your Next Home in Nigeria</h1>
          <p className="mt-2 text-lg text-emerald-100">Browse thousands of properties for sale, rent, and lease across the country.</p>
          
          <div className="mt-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search by location or property name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border-0 bg-white pl-10 py-6 text-base shadow-lg" />
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur md:p-6">
            <Tabs value={filters.deal} onValueChange={(v) => setFilters({ ...filters, deal: v as DealType })}>
              <TabsList className="grid w-full max-w-2xl grid-cols-4">
                <TabsTrigger value="Buy">Buy</TabsTrigger><TabsTrigger value="Sell">Sell</TabsTrigger><TabsTrigger value="Rent">Rent</TabsTrigger><TabsTrigger value="Lease">Lease</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="mt-4 grid gap-4 md:grid-cols-5">
              <div><Label className="text-xs text-slate-500">State</Label><Select value={filters.state} onValueChange={(v) => setFilters({ ...filters, state: v, city: "All" })}><SelectTrigger className="mt-1"><SelectValue placeholder="All States" /></SelectTrigger><SelectContent><SelectItem value="All">All States</SelectItem>{NIGERIAN_STATES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent></Select></div>
              <div><Label className="text-xs text-slate-500">City</Label><Select value={filters.city} onValueChange={(v) => setFilters({ ...filters, city: v })} disabled={filters.state === "All"}><SelectTrigger className="mt-1"><SelectValue placeholder={filters.state === "All" ? "Select state first" : "All Cities"} /></SelectTrigger><SelectContent><SelectItem value="All">All Cities</SelectItem>{availableCities.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent></Select></div>
              <div><Label className="text-xs text-slate-500">Property Type</Label><Select value={filters.propertyType} onValueChange={(v) => setFilters({ ...filters, propertyType: v as PropertyType | "All", houseSubType: "All" })}><SelectTrigger className="mt-1"><SelectValue placeholder="All Types" /></SelectTrigger><SelectContent><SelectItem value="All">All Types</SelectItem><SelectItem value="House">House</SelectItem><SelectItem value="Land">Land</SelectItem><SelectItem value="Commercial">Commercial</SelectItem></SelectContent></Select></div>
              <div><Label className="text-xs text-slate-500">Min Price (₦)</Label><Input type="number" placeholder="0" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} className="mt-1" /></div>
              <div><Label className="text-xs text-slate-500">Max Price (₦)</Label><Input type="number" placeholder="Any" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} className="mt-1" /></div>
            </div>

            {filters.propertyType === "House" && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div><Label className="text-xs text-slate-500">Type of Building</Label><Select value={filters.houseSubType} onValueChange={(v) => setFilters({ ...filters, houseSubType: v as HouseSubType | "All" })}><SelectTrigger className="mt-1"><SelectValue placeholder="All House Types" /></SelectTrigger><SelectContent><SelectItem value="All">All House Types</SelectItem>{HOUSE_SUB_TYPES.map((st) => (<SelectItem key={st} value={st}>{st}</SelectItem>))}</SelectContent></Select></div>
                  <div><Label className="text-xs text-slate-500">Min. Bedrooms</Label><Select value={filters.minBedrooms} onValueChange={(v) => setFilters({ ...filters, minBedrooms: v })}><SelectTrigger className="mt-1"><SelectValue placeholder="Any" /></SelectTrigger><SelectContent><SelectItem value="">Any</SelectItem><SelectItem value="1">1+</SelectItem><SelectItem value="2">2+</SelectItem><SelectItem value="3">3+</SelectItem><SelectItem value="4">4+</SelectItem><SelectItem value="5">5+</SelectItem></SelectContent></Select></div>
                  <div><Label className="text-xs text-slate-500">Min. Bathrooms</Label><Select value={filters.minBathrooms} onValueChange={(v) => setFilters({ ...filters, minBathrooms: v })}><SelectTrigger className="mt-1"><SelectValue placeholder="Any" /></SelectTrigger><SelectContent><SelectItem value="">Any</SelectItem><SelectItem value="1">1+</SelectItem><SelectItem value="2">2+</SelectItem><SelectItem value="3">3+</SelectItem><SelectItem value="4">4+</SelectItem><SelectItem value="5">5+</SelectItem></SelectContent></Select></div>
                </div>
                <div className="mt-4"><Label className="mb-2 block text-xs text-slate-500">Amenities</Label><div className="flex flex-wrap gap-3">{HOUSE_AMENITIES.map((amenity) => (<div key={amenity} className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5"><Checkbox id={`filter-amen-${amenity}`} checked={filters.amenities.includes(amenity)} onCheckedChange={() => toggleFilterAmenity(amenity)} /><Label htmlFor={`filter-amen-${amenity}`} className="cursor-pointer text-xs font-normal text-slate-700">{amenity}</Label></div>))}</div></div>
              </div>
            )}

            <div className="mt-4 border-t border-slate-100 pt-4">
              <Label className="mb-2 block text-xs text-slate-500">Pets / Animals Allowed?</Label>
              <PetPolicySelector value={filters.petPolicy} onChange={(v) => setFilters({ ...filters, petPolicy: v as PetPolicy | "All" })} includeAll />
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">{filtered.length} {filtered.length === 1 ? "Property" : "Properties"} Found</h2>
            <p className="text-sm text-slate-500">Showing {filters.deal === "Buy" ? "properties for sale" : `properties for ${filters.deal.toLowerCase()}`}</p>
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <Building2 className="h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-700">No properties found</h3>
            <p className="mt-1 text-sm text-slate-500">Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((listing) => (<ListingCard key={listing.id} listing={listing} onView={handleView} />))}
          </div>
        )}
      </main>

      <Footer />

      <Dialog open={showAbout} onOpenChange={setShowAbout}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-serif text-2xl text-emerald-800">About Beecee Homes</DialogTitle></DialogHeader>
          <div className="space-y-3 text-slate-600">
            <p>Beecee Homes is Nigeria's trusted real estate marketplace, connecting property owners with buyers, tenants, and lessees across the nation. From Lagos to Abuja and Ibadan, we make property discovery simple and direct.</p>
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="font-bold text-emerald-900">Lameed Adebisi Monsurat - CEO, BeeCee Global Homes and Construction Limited</p>
              <p className="mt-1 text-sm text-slate-600">Our mission is to make Nigerian real estate accessible, transparent, and hassle-free for everyone.</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 text-sm">
              <p className="font-semibold text-slate-700">Contact Us</p>
              <p className="mt-1 text-slate-600">📞 +447867051767 | +2348162549035</p>
              <p className="text-slate-600">✉️ <a href="mailto:beeceegroups@gmail.com" className="text-emerald-700 hover:underline">beeceegroups@gmail.com</a></p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AuthModal open={showAuth} onOpenChange={setShowAuth} onLogin={handleLogin} />

      <BeeceeAI />
    </div>
  );
}