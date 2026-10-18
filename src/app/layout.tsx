import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Belora — Réservation de soins beauté & bien-être",
  description:
    "Découvrez et réservez les meilleurs salons de coiffure, instituts, barbiers et spas indépendants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-bg text-fg">
        {children}
      </body>
    </html>
  );
}
