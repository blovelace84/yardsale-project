import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { firestore } from "../firebase/firebaseApp";
import type { Listing } from "../types/listing";

interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  city: string;
  imageUrls: string[];
  imagePaths: string[];
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
}

/**
 * Creates a new listing in Firestore.
 */
export async function createListing(
  listingData: CreateListingInput,
) {
  const listingsCollection = collection(
    firestore,
    "listings",
  );

  const listingDocument = await addDoc(
    listingsCollection,
    {
      ...listingData,
      status: "ACTIVE",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );

  return listingDocument;
}

/**
 * Retrieves one listing using its Firestore document ID.
 */
export async function getListingById(
  listingId: string,
): Promise<Listing | null> {
  const listingReference = doc(
    firestore,
    "listings",
    listingId,
  );

  const listingSnapshot = await getDoc(
    listingReference,
  );

  if (!listingSnapshot.exists()) {
    return null;
  }

  return {
    id: listingSnapshot.id,
    ...listingSnapshot.data(),
  } as Listing;
}

/**
 * Retrieves all active listings for the homepage.
 */
export async function getActiveListings(): Promise<
  Listing[]
> {
  const listingsQuery = query(
    collection(firestore, "listings"),
    where("status", "==", "ACTIVE"),
    orderBy("createdAt", "desc"),
  );

  const listingsSnapshot = await getDocs(
    listingsQuery,
  );

  return listingsSnapshot.docs.map(
    (listingDocument) =>
      ({
        id: listingDocument.id,
        ...listingDocument.data(),
      }) as Listing,
  );
}

/**
 * Retrieves all listings created by a specific seller.
 *
 * This is used by the seller dashboard.
 */
export async function getListingsBySeller(
  sellerId: string,
): Promise<Listing[]> {
  if (!sellerId) {
    return [];
  }

  const sellerListingsQuery = query(
    collection(firestore, "listings"),
    where("sellerId", "==", sellerId),
    orderBy("createdAt", "desc"),
  );

  const listingsSnapshot = await getDocs(
    sellerListingsQuery,
  );

  return listingsSnapshot.docs.map(
    (listingDocument) =>
      ({
        id: listingDocument.id,
        ...listingDocument.data(),
      }) as Listing,
  );
}

/**
 * Changes a listing's status to SOLD.
 */
export async function markListingAsSold(
  listingId: string,
): Promise<void> {
  const listingReference = doc(
    firestore,
    "listings",
    listingId,
  );

  await updateDoc(listingReference, {
    status: "SOLD",
    updatedAt: serverTimestamp(),
  });
}

/**
 * Changes a sold listing back to ACTIVE.
 *
 * This is optional but useful if the seller marks
 * something as sold accidentally.
 */
export async function markListingAsActive(
  listingId: string,
): Promise<void> {
  const listingReference = doc(
    firestore,
    "listings",
    listingId,
  );

  await updateDoc(listingReference, {
    status: "ACTIVE",
    updatedAt: serverTimestamp(),
  });
}

/**
 * Updates an existing listing.
 */
export async function updateListing(
  listingId: string,
  listingData: Partial<
    Pick<
      Listing,
      | "title"
      | "description"
      | "price"
      | "category"
      | "condition"
      | "city"
      | "imageUrls"
      | "imagePaths"
      | "status"
    >
  >,
): Promise<void> {
  const listingReference = doc(
    firestore,
    "listings",
    listingId,
  );

  await updateDoc(listingReference, {
    ...listingData,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Deletes only the Firestore listing document.
 *
 * This does not delete images from Firebase Storage.
 */
export async function deleteListing(
  listingId: string,
): Promise<void> {
  const listingReference = doc(
    firestore,
    "listings",
    listingId,
  );

  await deleteDoc(listingReference);
}

/**
 * Backward-compatible alias.
 *
 * Keep this temporarily if another file still imports
 * deleteListingDocument.
 */
export async function deleteListingDocument(
  listingId: string,
): Promise<void> {
  await deleteListing(listingId);
}