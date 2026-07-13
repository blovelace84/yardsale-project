export interface Listing {
  id: string;

  title: string;

  description: string;

  price: number;

  category: string;

  condition: "NEW" | "USED" | "AS_IS";

  city: string;

  imageUrls: string[];

  sellerId: string;

  sellerName: string;

  createdAt: Date;
}