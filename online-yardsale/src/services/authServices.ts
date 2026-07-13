import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type UserCredential,
} from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";

export async function createAccount(
  name: string,
  email: string,
  password: string,
): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  await updateProfile(credential.user, {
    displayName: name,
  });

  return credential;
}

export function loginUser(
  email: string,
  password: string,
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logoutUser(): Promise<void> {
  return signOut(auth);
}