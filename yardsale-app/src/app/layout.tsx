import "./globals.css";
import "goey-toast/styles.css";
import type { Metadata, Viewport } from "next";
import ToastProvider from "@/app/toast-provider";
import Navbar from "./components/Navbar";
import { Providers } from "./components/Providers";

export const metadata: Metadata = {
  title: "Tee Dee Street – Yardsale Marketplace",
  description: "Buy and sell locally in your neighborhood.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
