export type ListingStatus = "SALE" | "RENT" | "LEASE";
export type PropertyType = "House" | "Land" | "Commercial";
export type DealType = "Buy" | "Sell" | "Rent" | "Lease";
export type HouseSubType = "Duplex" | "Bungalow" | "Block of Flats" | "Penthouse" | "Terrace" | "Semi-Detached" | "Detached";
export type PetPolicy = "Pets Allowed" | "No Pets Allowed" | "On Request";

export interface Listing {
  id: string;
  title: string;
  price: number;
  status: ListingStatus;
  city: string;
  state: string;
  propertyType: PropertyType;
  houseSubType?: HouseSubType;
  bedrooms?: number;
  bathrooms?: number;
  kitchenCount?: number;
  amenities: string[];
  petPolicy: PetPolicy;
  sizeSqm?: number;
  features: string[];
  description: string;
  images: string[];
  ownerName: string;
  ownerPhone: string;
  ownerWhatsapp: string;
  postedAt: string;
}

export interface Filters {
  deal: DealType;
  state: string;
  city: string;
  propertyType: PropertyType | "All";
  houseSubType: HouseSubType | "All";
  minBedrooms: string;
  minBathrooms: string;
  amenities: string[];
  petPolicy: PetPolicy | "All";
  minPrice: string;
  maxPrice: string;
}