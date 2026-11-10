import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MainNav } from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { db } from "@/lib/db";
import { getVenueBySlug, VENUES } from "@/lib/data/venues";
import { formatCentsToEuros } from "@/lib/utils/money";
import {
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Check,
  ArrowRight,
} from "lucide-react";

interface VenuePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const dbVenues = await db.venue.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });
    const allSlugs = new Set([
      ...dbVenues.map((v) => v.slug),
      ...VENUES.map((v) => v.slug),
    ]);
    return Array.from(allSlugs).map((slug) => ({ slug }));
  } catch {
    return VENUES.map((venue) => ({ slug: venue.slug }));
  }
}

export default function VenuePage({ params }: VenuePageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-neutral-900 selection:bg-primary-100 selection:text-primary-900">
      <MainNav />
      <Suspense
        fallback={
          <div className="flex-1 container-belora py-16 text-center text-sm text-neutral-500">
            Chargement de l&apos;établissement...
          </div>
        }
      >
        <VenueContent params={params} />
      </Suspense>
      <Footer />
    </div>
  );
}

const DAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

async function VenueContent({ params }: VenuePageProps) {
  const { slug } = await params;

  // 1. Recherche prioritaire dans la base de données PostgreSQL
  const dbVenue = await db.venue.findUnique({
    where: { slug: slug.toLowerCase().trim() },
    include: {
      openingHours: {
        orderBy: { dayOfWeek: "asc" },
      },
      serviceCategories: {
        orderBy: { order: "asc" },
        include: {
          services: {
            where: { isActive: true },
            orderBy: { order: "asc" },
          },
        },
      },
      staff: {
        where: { isActive: true },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // 2. Si non trouvé en base, fallback sur les données mock de référence
  const mockVenue = !dbVenue ? getVenueBySlug(slug) : null;

  if (!dbVenue && !mockVenue) {
    notFound();
  }

  // Normalisation des données pour un affichage unifié
  const name = dbVenue?.name || mockVenue!.name;
  const tagline = dbVenue?.tagline || mockVenue!.tagline;
  const description = dbVenue?.description || mockVenue!.description;
  const address = dbVenue ? `${dbVenue.address}, ${dbVenue.postalCode} ${dbVenue.city}` : mockVenue!.address;
  const city = dbVenue?.city || mockVenue!.city;
  const categoryLabel = dbVenue?.serviceCategories[0]?.name || mockVenue!.categoryLabel;

  const reviewCount = dbVenue ? dbVenue.reviews.length : mockVenue!.reviewCount;
  const averageRating = dbVenue
    ? reviewCount > 0
      ? (dbVenue.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1)
      : "5.0"
    : mockVenue!.rating;

  // Calcul du tarif d'appel
  const startingPrice = dbVenue
    ? (() => {
        const allServices = dbVenue.serviceCategories.flatMap((c) => c.services);
        if (allServices.length === 0) return "35 €";
        const minCents = Math.min(...allServices.map((s) => s.priceCents));
        return formatCentsToEuros(minCents, false);
      })()
    : mockVenue!.startingPrice;

  // Horaires formatés
  const openingHours = dbVenue
    ? dbVenue.openingHours.map((h) => ({
        day: DAY_NAMES[h.dayOfWeek],
        hours: h.isOpen ? `${h.openTime} - ${h.closeTime}` : "Fermé",
      }))
    : mockVenue!.openingHours;

  // Prestations
  const servicesList = dbVenue
    ? dbVenue.serviceCategories.flatMap((cat) =>
        cat.services.map((srv) => ({
          id: srv.id,
          name: srv.name,
          category: cat.name,
          durationMinutes: srv.durationMinutes,
          priceDisplay: formatCentsToEuros(srv.priceCents, false),
          description: srv.description || "",
        }))
      )
    : mockVenue!.services.map((srv) => ({
        id: srv.id,
        name: srv.name,
        category: srv.category,
        durationMinutes: srv.durationMinutes,
        priceDisplay: `${srv.priceEuros} €`,
        description: srv.description,
      }));

  // Équipe
  const teamList = dbVenue
    ? dbVenue.staff.map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        avatar: m.avatarUrl || "/images/artisans/artisan-1.jpg",
        bio: "Artisan qualifié de la Maison Belora.",
      }))
    : mockVenue!.team;

  // Avis
  const reviewsList = dbVenue
    ? dbVenue.reviews.map((r) => ({
        id: r.id,
        author: r.authorName,
        rating: r.rating,
        date: new Date(r.createdAt).toLocaleDateString("fr-FR", {
          month: "short",
          year: "numeric",
        }),
        comment: r.comment,
        service: "Prestation salon",
        reply: r.reply,
      }))
    : mockVenue!.reviews;

  const galleryImages = [
    "/images/venues/botanique-1.jpg",
    "/images/venues/botanique-2.jpg",
    "/images/venues/botanique-3.jpg",
  ];

  return (
    <>
      {/* 1. Fil d'Ariane épuré */}
      <div className="border-b border-primary-200/80 bg-primary-600 py-3 text-sm text-white/80">
        <div className="container-belora flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <Link
            href={`/search?city=${encodeURIComponent(city)}`}
            className="hover:text-white transition-colors"
          >
            {city}
          </Link>
          <span>/</span>
          <span className="text-white font-medium truncate">{name}</span>
        </div>
      </div>

      <main className="flex-1 pb-20">
        {/* 2. Galerie photographique éditoriale */}
        <section className="container-belora pt-6 sm:pt-8 mb-8 sm:mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 h-[340px] sm:h-[460px]">
            {/* Grande photo principale gauche */}
            <div className="relative md:col-span-8 h-full rounded-2xl overflow-hidden bg-neutral-200 border border-primary-300/80">
              <Image
                src={galleryImages[0]}
                alt={name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-neutral-950/80 backdrop-blur-xs text-neutral-50 text-sm uppercase font-semibold tracking-wider">
                Maison Recommandée
              </span>
            </div>

            {/* Mosaïque secondaire droite */}
            <div className="hidden md:grid md:col-span-4 grid-rows-2 gap-3 sm:gap-4 h-full">
              <div className="relative rounded-2xl overflow-hidden bg-neutral-200 border border-primary-300/80">
                <Image
                  src={galleryImages[1]}
                  alt={`${name} intérieur`}
                  fill
                  sizes="33vw"
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden bg-neutral-200 border border-primary-300/80">
                <Image
                  src={galleryImages[2]}
                  alt={`${name} geste`}
                  fill
                  sizes="33vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Contenu principal et panneau latéral de réservation */}
        <div className="container-belora">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Colonne gauche détaillée (8 colonnes) */}
            <div className="lg:col-span-8 space-y-12">
              {/* En-tête de l'établissement */}
              <div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500 mb-2">
                  <span className="flex items-center gap-1 font-semibold text-neutral-900 num">
                    <Star className="w-3.5 h-3.5 fill-primary-600 text-primary-600" />
                    <span>{averageRating}</span>
                  </span>
                  <span>•</span>
                  <span>{reviewCount} avis vérifiés</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{address}</span>
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-neutral-950 mb-3">
                  {name}
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl font-normal">
                  {tagline}
                </p>
              </div>

              {/* À propos & Philosophie */}
              <div className="pt-8 border-t border-primary-200/80">
                <h2 className="font-display text-2xl text-neutral-950 mb-3">
                  L’esprit du lieu
                </h2>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal mb-6">
                  {description}
                </p>

                {/* Engagements audités */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    "Colorations 100% végétales & sans ammoniaque",
                    "Coupes sur cheveux secs respectueuses de la matière",
                    "Diagnostic capillaire personnalisé avant chaque rituel",
                    "Accueil sans attente & créneaux respectés",
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-sm text-neutral-800 bg-primary-50 p-3 rounded-xl border border-primary-200/80"
                    >
                      <Check className="w-4 h-4 text-primary-600 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carte des prestations */}
              <div className="pt-8 border-t border-primary-200/80">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <span className="text-sm font-semibold uppercase tracking-wider text-primary-700 block mb-1">
                      Catalogue de soins
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl text-neutral-950">
                      Prestations & Rituels
                    </h2>
                  </div>
                  <span className="text-sm text-neutral-500">
                    {servicesList.length} soins disponibles
                  </span>
                </div>

                <div className="space-y-4">
                  {servicesList.map((service) => (
                    <div
                      key={service.id}
                      className="p-5 rounded-2xl bg-primary-50/10 border border-primary-200/80 hover:border-primary-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="max-w-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs uppercase font-semibold text-primary-700 tracking-wider">
                            {service.category}
                          </span>
                          <span className="text-neutral-300">•</span>
                          <span className="text-sm text-neutral-500 flex items-center gap-1 num">
                            <Clock className="w-3.5 h-3.5" />
                            {service.durationMinutes} min
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold text-neutral-950 mb-1">
                          {service.name}
                        </h3>
                        <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                          {service.description}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-primary-200/60">
                        <span className="font-semibold text-base text-neutral-950 num">
                          {service.priceDisplay}
                        </span>
                        <Link
                          href={`/book/${slug}?service=${service.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          <span>Réserver</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* L'équipe d'artisans */}
              <div className="pt-8 border-t border-primary-200/80">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary-700 block mb-1">
                  Savoir-faire
                </span>
                <h2 className="font-display text-2xl sm:text-3xl text-neutral-950 mb-6">
                  L’équipe d’artisans
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {teamList.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 rounded-xl bg-primary-50/10 border border-primary-200/80 flex items-start gap-4"
                    >
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-neutral-200 shrink-0 border border-primary-300">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-950">
                          {member.name}
                        </h3>
                        <p className="text-sm text-primary-700 font-medium mb-1">
                          {member.role}
                        </p>
                        <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avis clients certifiés */}
              <div className="pt-8 border-t border-primary-200/80">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <span className="text-sm font-semibold uppercase tracking-wider text-primary-700 block mb-1">
                      Retours d’expérience
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl text-neutral-950">
                      Avis vérifiés ({reviewCount})
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900 num">
                    <Star className="w-4 h-4 fill-primary-600 text-primary-600" />
                    <span>{averageRating} / 5</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviewsList.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-xl bg-primary-50/10 border border-primary-200/80 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-neutral-950">
                            {rev.author}
                          </span>
                          <span className="text-xs text-primary-700 font-medium bg-primary-50 px-2 py-0.5 rounded">
                            {rev.service}
                          </span>
                        </div>
                        <span className="text-sm text-neutral-400">{rev.date}</span>
                      </div>
                      <p className="text-sm text-neutral-700 leading-relaxed">
                        « {rev.comment} »
                      </p>
                      {(rev as any).reply && (
                        <div className="pl-4 border-l-2 border-primary-500 bg-neutral-50 p-3 rounded-r-lg text-sm">
                          <span className="font-semibold text-neutral-900 block mb-0.5">
                            Réponse de l’établissement :
                          </span>
                          <p className="text-neutral-600 font-normal">
                            {(rev as any).reply}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Colonne droite collante : Module de réservation (4 colonnes) */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="p-6 rounded-2xl bg-primary-50/10 border border-primary-300 shadow-sm space-y-6">
                <div>
                  <span className="text-sm uppercase font-semibold tracking-wider text-neutral-500 block mb-1">
                    Tarif indicatif
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl text-neutral-950 num">
                      dès {startingPrice}
                    </span>
                    <span className="text-sm text-neutral-500">selon prestation</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-primary-200/80 space-y-3 text-sm text-neutral-700">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Disponibilité</span>
                    <span className="font-medium text-emerald-800">
                      Créneaux cette semaine
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Politique d’annulation</span>
                    <span className="font-medium text-neutral-800">
                      Gratuite jusqu’à 24h
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Paiement</span>
                    <span className="font-medium text-neutral-800">
                      En ligne ou sur place
                    </span>
                  </div>
                </div>

                <Link
                  href={`/book/${slug}`}
                  className="w-full btn btn-primary flex items-center justify-center gap-2 py-3"
                >
                  <span>Prendre rendez-vous</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Réassurance de marque */}
                <div className="p-3.5 rounded-xl bg-neutral-100/70 text-sm text-neutral-600 space-y-1.5 border border-primary-200/60">
                  <div className="flex items-center gap-1.5 font-semibold text-neutral-800">
                    <ShieldCheck className="w-4 h-4 text-primary-600" />
                    <span>Garantie Sanctuaire Belora</span>
                  </div>
                  <p className="leading-snug">
                    Salon audité par nos équipes. Horaires strictement respectés et
                    accueil sans attente.
                  </p>
                </div>

                {/* Horaires hebdomadaires */}
                <div className="pt-4 border-t border-primary-200/80">
                  <span className="text-sm font-semibold text-neutral-900 block mb-2.5">
                    Horaires d’ouverture
                  </span>
                  <div className="space-y-1.5 text-sm text-neutral-600">
                    {openingHours.map((slot: any) => (
                      <div
                        key={slot.day}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="font-medium text-neutral-700">{slot.day}</span>
                        <span className="num">{slot.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
