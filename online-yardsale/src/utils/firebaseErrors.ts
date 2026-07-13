import { FirebaseError } from "firebase/app";

export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return "Something went wrong. Please try again.";
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "An account already exists with this email address.";

    case "auth/invalid-email":
      return "Enter a valid email address.";

    case "auth/weak-password":
      return "Your password is too weak. Use at least 6 characters.";

    case "auth/invalid-credential":
      return "The email address or password is incorrect.";

    case "auth/user-disabled":
      return "This account has been disabled.";

    case "auth/too-many-requests":
      return "Too many attempts were made. Please try again later.";

    case "auth/network-request-failed":
      return "A network error occurred. Check your internet connection.";

    default:
      console.error("Firebase authentication error:", error);
      return "Authentication failed. Please try again.";
  }
}