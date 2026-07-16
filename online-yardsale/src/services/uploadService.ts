import {
  getDownloadURL,
  ref,
  uploadBytes,
  type UploadMetadata,
} from "firebase/storage";

import { storage } from "../firebase/firebaseApp";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export interface UploadedImage {
  url: string;
  path: string;
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

function createUniqueId(): string {
  return crypto.randomUUID();
}

export function validateListingImage(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      `${file.name} is not supported. Upload JPG, PNG, or WebP images.`,
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`${file.name} is larger than 5 MB.`);
  }
}

export async function uploadListingImage(
  file: File,
  userId: string,
  listingUploadId: string,
): Promise<UploadedImage> {
  validateListingImage(file);

  const safeFileName = sanitizeFileName(file.name);
  const uniqueFileName = `${createUniqueId()}-${safeFileName}`;

  const path =
    `listing-images/${userId}/${listingUploadId}/${uniqueFileName}`;

  const imageReference = ref(storage, path);

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
    path,
  };
}

export async function uploadListingImages(
  files: File[],
  userId: string,
  listingUploadId: string,
): Promise<UploadedImage[]> {
  return Promise.all(
    files.map((file) =>
      uploadListingImage(file, userId, listingUploadId),
    ),
  );
}