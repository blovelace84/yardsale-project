import type { Timestamp } from "firebase/firestore";

export type ListingCondition = "NEW" | "USED" | "AS_IS";

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: ListingCondition;
  city: string;
  imageUrls: string[];
  imagePaths: string[];
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  status: "ACTIVE" | "SOLD";
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface CreateListingData {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: ListingCondition;
  city: string;
  imageUrls: string[];
  imagePaths: string[];
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
}