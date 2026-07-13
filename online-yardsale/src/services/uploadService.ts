import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "../firebase/firebaseConfig";

export async function uploadListingImage(file: File) {
  const filename = `${Date.now()}-${file.name}`;

  const imageRef = ref(
    storage,
    `listing-images/${filename}`
  );

  await uploadBytes(imageRef, file);

  return getDownloadURL(imageRef);
}