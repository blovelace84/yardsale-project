import {
  addDoc,
  collection,
  serverTimestamp,
  type DocumentReference,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";
import type { CreateListingData } from "../types/listing";

export async function createListing(
  listing: CreateListingData,
): Promise<DocumentReference> {
  return addDoc(collection(db, "listings"), {
    ...listing,
    status: "ACTIVE",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}