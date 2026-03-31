import "./globals.css";
import ToastProvider from "@/app/toast-provider";
import Navbar from "./components/Navbar";
import { Providers } from "./components/Providers";
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
