import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast'; // Add Toaster
import "./globals.css";
import ClientBody from "./ClientBody";
import { AuthProvider } from "../context/AuthContext";
import { CartFavoritesProvider } from "../context/CartFavoritesContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reborn Bebê",
  description: "Um berçário repleto de bebês reborn, com preços que cabem no seu bolso.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="antialiased">
        <AuthProvider>
          <CartFavoritesProvider>
            <ClientBody>{children}</ClientBody>
            <Toaster position="top-right" />
          </CartFavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}