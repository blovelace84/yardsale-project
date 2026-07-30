import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { firestore } from "../firebase/firebaseApp";
import type { Listing } from "../types/listing";

export interface FavoriteRecord {
  listingId: string;
  createdAt: unknown;
}

/**
 * Returns the reference path:
 * users/{userId}/favorites/{listingId}
 */
function getFavoriteDocumentReference(
  userId: string,
  listingId: string,
) {
  return doc(
    firestore,
    "users",
    userId,
    "favorites",
    listingId,
  );
}

/**
 * Adds a listing to a user's favorites.
 */
export async function addFavorite(
  userId: string,
  listingId: string,
): Promise<void> {
  if (!userId) {
    throw new Error("A user ID is required.");
  }

  if (!listingId) {
    throw new Error("A listing ID is required.");
  }

  const favoriteReference =
    getFavoriteDocumentReference(userId, listingId);

  await setDoc(favoriteReference, {
    listingId,
    createdAt: serverTimestamp(),
  });
}

/**
 * Removes a listing from a user's favorites.
 */
export async function removeFavorite(
  userId: string,
  listingId: string,
): Promise<void> {
  if (!userId) {
    throw new Error("A user ID is required.");
  }

  if (!listingId) {
    throw new Error("A listing ID is required.");
  }

  const favoriteReference =
    getFavoriteDocumentReference(userId, listingId);

  await deleteDoc(favoriteReference);
}

/**
 * Checks whether a listing is currently favorited.
 */
export async function isListingFavorite(
  userId: string,
  listingId: string,
): Promise<boolean> {
  if (!userId || !listingId) {
    return false;
  }

  const favoriteReference =
    getFavoriteDocumentReference(userId, listingId);

  const favoriteSnapshot = await getDoc(
    favoriteReference,
  );

  return favoriteSnapshot.exists();
}

/**
 * Returns all listing IDs favorited by a user.
 */
export async function getFavoriteListingIds(
  userId: string,
): Promise<string[]> {
  if (!userId) {
    return [];
  }

  const favoritesQuery = query(
    collection(
      firestore,
      "users",
      userId,
      "favorites",
    ),
    orderBy("createdAt", "desc"),
  );

  const favoritesSnapshot = await getDocs(
    favoritesQuery,
  );

  return favoritesSnapshot.docs.map(
    (favoriteDocument) =>
      favoriteDocument.data().listingId as string,
  );
}

/**
 * Retrieves the complete listing documents for a user's favorites.
 *
 * This performs one listing read for each favorite.
 */
export async function getFavoriteListings(
  userId: string,
): Promise<Listing[]> {
  const listingIds =
    await getFavoriteListingIds(userId);

  if (listingIds.length === 0) {
    return [];
  }

  const listingSnapshots = await Promise.all(
    listingIds.map((listingId) =>
      getDoc(
        doc(firestore, "listings", listingId),
      ),
    ),
  );

  return listingSnapshots
    .filter((listingSnapshot) =>
      listingSnapshot.exists(),
    )
    .map(
      (listingSnapshot) =>
        ({
          id: listingSnapshot.id,
          ...listingSnapshot.data(),
        }) as Listing,
    );
}

/**
 * Toggles a favorite and returns the new state.
 */
export async function toggleFavorite(
  userId: string,
  listingId: string,
): Promise<boolean> {
  const currentlyFavorite =
    await isListingFavorite(userId, listingId);

  if (currentlyFavorite) {
    await removeFavorite(userId, listingId);
    return false;
  }

  await addFavorite(userId, listingId);
  return true;
}