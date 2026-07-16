import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  type DocumentReference,
} from "firebase/firestore";

import { firestore } from "../firebase/firebaseApp";
import type {
  CreateListingData,
  Listing,
} from "../types/listing";

export async function createListing(
  listing: CreateListingData,
): Promise<DocumentReference> {
  return addDoc(
    collection(firestore, "listings"),
    {
      ...listing,
      status: "ACTIVE",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );
}

export async function getListingById(
  listingId: string,
): Promise<Listing | null> {
  const listingReference = doc(
    firestore,
    "listings",
    listingId,
  );

  const snapshot = await getDoc(listingReference);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Listing;
}

export async function deleteListingDocument(
  listingId: string,
): Promise<void> {
  await deleteDoc(
    doc(firestore, "listings", listingId),
  );
}