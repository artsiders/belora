import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MainNav } from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { getVenueBySlug, VENUES } from "@/lib/data/venues";
import { BookClient } from "./book-client";

interface BookPageProps {
  params: Promise<{
    venueSlug: string;
  }>;
}

export async function generateStaticParams() {
  return VENUES.map((venue) => ({
    venueSlug: venue.slug,
  }));
}

export default async function BookPage({ params }: BookPageProps) {
  const { venueSlug } = await params;
  const venue = getVenueBySlug(venueSlug);

  if (!venue) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-sand-900 selection:bg-primary-100 selection:text-primary-900">
      <MainNav />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="container-belora py-16 text-center text-xs text-sand-500">
              Chargement de la réservation...
            </div>
          }
        >
          <BookClient venue={venue} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
