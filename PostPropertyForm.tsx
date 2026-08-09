import { useState } from "react";
import { Upload, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Listing, ListingStatus, PropertyType, HouseSubType, PetPolicy } from "../types";
import { NIGERIAN_STATES, STATE_CITIES, HOUSE_SUB_TYPES, HOUSE_AMENITIES } from "../data";
import { PetPolicySelector } from "./PetPolicySelector";

export function PostPropertyForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (listing: Listing) => void;
  onCancel: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    price: "",
    status: "SALE" as ListingStatus,
    city: "",
    state: "",
    propertyType: "House" as PropertyType,
    houseSubType: "" as HouseSubType | "",
    bedrooms: "",
    bathrooms: "",
    kitchenCount: "1",
    sizeSqm: "",
    description: "",
    features: "",
    petPolicy: "Pets Allowed" as PetPolicy,
    ownerName: "",
    ownerPhone: "",
    ownerWhatsapp: "",
  });

  const availableCities = form.state ? STATE_CITIES[form.state] || [] : [];

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim() && imageUrls.length < 5) {
      setImageUrls([...imageUrls, imageUrlInput.trim()]);
      setImageUrlInput("");
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allFeatures = form.features.split(",").map((f) => f.trim()).filter(Boolean);

    const newListing: Listing = {
      id: "lst-" + Date.now(),
      title: form.title,
      price: parseInt(form.price) || 0,
      status: form.status,
      city: form.city,
      state: form.state,
      propertyType: form.propertyType,
      houseSubType: form.propertyType === "House" && form.houseSubType ? form.houseSubType : undefined,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : undefined,
      kitchenCount: form.propertyType === "House" && form.houseSubType ? parseInt(form.kitchenCount) : undefined,
      amenities: selectedAmenities,
      petPolicy: form.petPolicy,
      sizeSqm: form.sizeSqm ? parseInt(form.sizeSqm) : undefined,
      description: form.description,
      features: allFeatures,
      images: imageUrls.length > 0 ? imageUrls : ["https://images.unsplash.com/photo-1564013799936-ab5827c0c558?w=1200&q=80"],
      ownerName: form.ownerName,
      ownerPhone: form.ownerPhone,
      ownerWhatsapp: form.ownerWhatsapp.replace(/\D/g, ""),
      postedAt: new Date().toISOString().split("T")[0],
    };
    onSubmit(newListing);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onCancel();
    }, 2000);
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
              <div>
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Modern 3-Bedroom Terrace Duplex"
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₦) *</Label>
                  <Input
                    id="price"
                    required
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 85000000"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v as ListingStatus })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SALE">For Sale</SelectItem>
                      <SelectItem value="RENT">For Rent</SelectItem>
                      <SelectItem value="LEASE">For Lease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={form.state}
                    onValueChange={(v) => setForm({ ...form, state: v, city: "" })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGERIAN_STATES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Select
                    value={form.city}
                    onValueChange={(v) => setForm({ ...form, city: v })}
                    disabled={!form.state}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder={form.state ? "Select city" : "Select state first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select
                  value={form.propertyType}
                  onValueChange={(v) => setForm({ ...form, propertyType: v as PropertyType, houseSubType: "" })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Land">Land</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* LEVEL 1: Conditional House Sub-Type */}
              {form.propertyType === "House" && (
                <div className="space-y-5 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                  <h3 className="font-semibold text-emerald-800">Type of Building</h3>
                  
                  <div>
                    <Label htmlFor="houseSubType">Building Sub-Type</Label>
                    <Select
                      value={form.houseSubType}
                      onValueChange={(v) => setForm({ ...form, houseSubType: v as HouseSubType })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select building type" />
                      </SelectTrigger>
                      <SelectContent>
                        {HOUSE_SUB_TYPES.map((st) => (
                          <SelectItem key={st} value={st}>
                            {st}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* LEVEL 2: Conditional Building Specifics */}
                  {form.houseSubType && (
                    <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-4">
                      <h4 className="text-sm font-semibold text-slate-700">Building Specifications</h4>
                      
                      {/* Room Counters */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="bedrooms" className="text-xs">Bedrooms</Label>
                          <Input
                            id="bedrooms"
                            type="number"
                            min="0"
                            value={form.bedrooms}
                            onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                            placeholder="e.g. 3"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bathrooms" className="text-xs">Toilets & Baths</Label>
                          <Input
                            id="bathrooms"
                            type="number"
                            min="0"
                            value={form.bathrooms}
                            onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                            placeholder="e.g. 4"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="kitchenCount" className="text-xs">Kitchen</Label>
                          <Select
                            value={form.kitchenCount}
                            onValueChange={(v) => setForm({ ...form, kitchenCount: v })}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Count" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">No Kitchen</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Amenity Checkboxes */}
                      <div>
                        <Label className="mb-2 block text-xs">Amenities</Label>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {HOUSE_AMENITIES.map((amenity) => (
                            <div key={amenity} className="flex items-center space-x-2">
                              <Checkbox
                                id={`amen-${amenity}`}
                                checked={selectedAmenities.includes(amenity)}
                                onCheckedChange={() => toggleAmenity(amenity)}
                              />
                              <Label htmlFor={`amen-${amenity}`} className="cursor-pointer text-xs font-normal text-slate-700">
                                {amenity}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pet Policy inside House Details */}
                      <div className="border-t border-slate-100 pt-3">
                        <Label className="mb-2 block text-xs">Animals Allowed?</Label>
                        <PetPolicySelector
                          value={form.petPolicy}
                          onChange={(v) => setForm({ ...form, petPolicy: v as PetPolicy })}
                          size="sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Global Pet Policy for Non-House */}
              {form.propertyType !== "House" && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <Label className="mb-3 block">Animals Allowed? *</Label>
                  <PetPolicySelector
                    value={form.petPolicy}
                    onChange={(v) => setForm({ ...form, petPolicy: v as PetPolicy })}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="sizeSqm">Size (m²)</Label>
                <Input
                  id="sizeSqm"
                  type="number"
                  value={form.sizeSqm}
                  onChange={(e) => setForm({ ...form, sizeSqm: e.target.value })}
                  placeholder="e.g. 220"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the property..."
                  className="mt-1.5"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="features">Additional Features (comma-separated)</Label>
                <Input
                  id="features"
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder="e.g. C of O, Electricity, Water, Borehole"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Property Photos (URLs)</Label>
                <div className="mt-1.5 flex gap-2">
                  <Input
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Paste image URL here..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddImageUrl}
                    disabled={imageUrls.length >= 5}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {imageUrls.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {imageUrls.map((url, idx) => (
                      <div key={idx} className="relative h-20 w-28 overflow-hidden rounded-lg border border-slate-200">
                        <img src={url} alt={`Upload ${idx + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
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
                  <div>
                    <Label htmlFor="ownerName">Owner Name *</Label>
                    <Input
                      id="ownerName"
                      required
                      value={form.ownerName}
                      onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                      placeholder="Full name"
                      className="mt-1.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ownerPhone">Phone *</Label>
                      <Input
                        id="ownerPhone"
                        required
                        value={form.ownerPhone}
                        onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })}
                        placeholder="+234..."
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ownerWhatsapp">WhatsApp No. *</Label>
                      <Input
                        id="ownerWhatsapp"
                        required
                        value={form.ownerWhatsapp}
                        onChange={(e) => setForm({ ...form, ownerWhatsapp: e.target.value })}
                        placeholder="234..."
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 bg-emerald-600 py-6 hover:bg-emerald-700">
                  Post Property
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} className="px-6">
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}