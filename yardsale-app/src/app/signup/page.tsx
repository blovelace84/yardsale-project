import type { Metadata } from "next";
import SignupClientPage from "@/app/components/signup-page-client";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account on Yardsale",
};

export default function SignupPage() {
  return <SignupClientPage />;
}
