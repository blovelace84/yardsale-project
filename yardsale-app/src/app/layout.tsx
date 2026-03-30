import "./globals.css";
import ToastProvider from "@/app/toast-provider";
import Navbar from "./components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
