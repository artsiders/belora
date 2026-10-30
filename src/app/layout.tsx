import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Belora - Réservation de soins beauté & bien-être",
  description:
    "Découvrez et réservez les meilleurs salons de coiffure, instituts, barbiers et spas indépendants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`h-full antialiased ${montserrat.variable} ${playfair.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans bg-bg text-fg">
        <NextTopLoader
          color="#82385a"
          initialPosition={0.08}
          crawlSpeed={200}
          height={2.5}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px rgba(130, 56, 90, 0.4),0 0 5px rgba(130, 56, 90, 0.2)"
          zIndex={99999}
        />
        {children}
      </body>
    </html>
  );
}
