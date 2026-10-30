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

export default function BookPage({ params }: BookPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-neutral-900 selection:bg-primary-100 selection:text-primary-900">
      <MainNav />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="container-belora py-16 text-center text-xs text-neutral-500">
              Chargement de la réservation...
            </div>
          }
        >
          <BookContent params={params} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

async function BookContent({ params }: BookPageProps) {
  const { venueSlug } = await params;
  const venue = getVenueBySlug(venueSlug);

  if (!venue) {
    notFound();
  }

  return <BookClient venue={venue} />;
}
