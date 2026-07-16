import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  type UploadMetadata,
} from "firebase/storage";

import { storage } from "../firebase/firebaseApp";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export interface UploadedImage {
  url: string;
  path: string;
}

function createId(): string {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

export function validateListingImage(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error(
      `${file.name} must be a JPG, PNG, or WebP image.`,
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `${file.name} must be smaller than 5 MB.`,
    );
  }
}

export async function uploadListingImage(
  file: File,
  userId: string,
  listingUploadId: string,
): Promise<UploadedImage> {
  validateListingImage(file);

  const safeName = sanitizeFileName(file.name);
  const imagePath =
    `listing-images/${userId}/${listingUploadId}/${createId()}-${safeName}`;

  const imageReference = ref(storage, imagePath);

  const metadata: UploadMetadata = {
    contentType: file.type,
    customMetadata: {
      ownerId: userId,
    },
  };

  await uploadBytes(imageReference, file, metadata);

  const url = await getDownloadURL(imageReference);

  return {
    url,
    path: imagePath,
  };
}

export async function uploadListingImages(
  files: File[],
  userId: string,
  listingUploadId: string,
): Promise<UploadedImage[]> {
  return Promise.all(
    files.map((file) =>
      uploadListingImage(
        file,
        userId,
        listingUploadId,
      ),
    ),
  );
}

export async function deleteListingImages(
  imagePaths: string[],
): Promise<void> {
  await Promise.all(
    imagePaths.map((path) =>
      deleteObject(ref(storage, path)),
    ),
  );
}