import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MainNav } from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { getVenueBySlug, VENUES } from "@/lib/data/venues";
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
  return VENUES.map((venue) => ({
    slug: venue.slug,
  }));
}

export default async function VenuePage({ params }: VenuePageProps) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);

  if (!venue) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-sand-100 text-sand-900 selection:bg-primary-100 selection:text-primary-900">
      <MainNav />

      {/* 1. Fil d'Ariane épuré */}
      <div className="border-b border-sand-200/80 bg-sand-50/60 py-3 text-xs text-sand-500">
        <div className="container-belora flex items-center gap-2">
          <Link href="/" className="hover:text-sand-900 transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <Link
            href={`/search?category=${venue.category}`}
            className="hover:text-sand-900 transition-colors"
          >
            {venue.categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-sand-900 font-medium truncate">{venue.name}</span>
        </div>
      </div>

      <main className="flex-1 pb-20">
        {/* 2. Galerie photographique éditoriale */}
        <section className="container-belora pt-6 sm:pt-8 mb-8 sm:mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 h-[340px] sm:h-[460px]">
            {/* Grande photo principale gauche */}
            <div className="relative md:col-span-8 h-full rounded-[var(--radius-photo)] overflow-hidden bg-sand-200 border border-sand-300/80">
              <Image
                src={venue.image}
                alt={venue.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-[var(--radius-xs)] bg-sand-950/80 backdrop-blur-xs text-sand-50 text-[10px] uppercase font-semibold tracking-wider">
                {venue.badge}
              </span>
            </div>

            {/* Mosaïque secondaire droite */}
            <div className="hidden md:grid md:col-span-4 grid-rows-2 gap-3 sm:gap-4 h-full">
              <div className="relative rounded-[var(--radius-photo)] overflow-hidden bg-sand-200 border border-sand-300/80">
                <Image
                  src={venue.gallery[1] || venue.image}
                  alt={`${venue.name} intérieur`}
                  fill
                  sizes="33vw"
                  className="object-cover"
                />
              </div>
              <div className="relative rounded-[var(--radius-photo)] overflow-hidden bg-sand-200 border border-sand-300/80">
                <Image
                  src={venue.gallery[2] || venue.image}
                  alt={`${venue.name} geste`}
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
                <div className="flex flex-wrap items-center gap-3 text-xs text-sand-500 mb-2">
                  <span className="flex items-center gap-1 font-semibold text-sand-900 num">
                    <Star className="w-3.5 h-3.5 fill-primary-600 text-primary-600" />
                    <span>{venue.rating}</span>
                  </span>
                  <span>•</span>
                  <span>{venue.reviewCount} avis certifiés</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sand-400" />
                    <span>{venue.address}</span>
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-sand-950 mb-3">
                  {venue.name}
                </h1>
                <p className="text-sm sm:text-base text-sand-600 leading-relaxed max-w-2xl font-normal">
                  {venue.tagline}
                </p>
              </div>

              {/* À propos & Philosophie */}
              <div className="pt-8 border-t border-sand-200/80">
                <h2 className="font-display text-2xl text-sand-950 mb-3">
                  L’esprit du lieu
                </h2>
                <p className="text-xs sm:text-sm text-sand-700 leading-relaxed font-normal mb-6">
                  {venue.description}
                </p>

                {/* Engagements audités */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {venue.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-xs text-sand-800 bg-sand-50 p-3 rounded-[var(--radius-sm)] border border-sand-200/80"
                    >
                      <Check className="w-4 h-4 text-primary-600 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carte des prestations */}
              <div className="pt-8 border-t border-sand-200/80">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="eyebrow mb-1">Catalogue de soins</p>
                    <h2 className="font-display text-2xl sm:text-3xl text-sand-950">
                      Prestations & Rituels
                    </h2>
                  </div>
                  <span className="text-xs text-sand-500">
                    {venue.services.length} soins disponibles
                  </span>
                </div>

                <div className="space-y-4">
                  {venue.services.map((service) => (
                    <div
                      key={service.id}
                      className="p-5 rounded-[var(--radius-sm)] bg-sand-50 border border-sand-200/80 hover:border-sand-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="max-w-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase font-semibold text-primary-700 tracking-wider">
                            {service.category}
                          </span>
                          <span className="text-sand-300">•</span>
                          <span className="text-xs text-sand-500 flex items-center gap-1 num">
                            <Clock className="w-3 h-3" />
                            {service.durationMinutes} min
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold text-sand-950 mb-1">
                          {service.name}
                        </h3>
                        <p className="text-xs text-sand-600 leading-relaxed font-normal">
                          {service.description}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-sand-200/60">
                        <span className="font-semibold text-base text-sand-950 num">
                          {service.priceEuros} €
                        </span>
                        <Link
                          href={`/book/${venue.slug}?service=${service.id}`}
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
              <div className="pt-8 border-t border-sand-200/80">
                <p className="eyebrow mb-1">Savoir-faire</p>
                <h2 className="font-display text-2xl sm:text-3xl text-sand-950 mb-6">
                  L’équipe d’artisans
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {venue.team.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 rounded-[var(--radius-sm)] bg-sand-50 border border-sand-200/80 flex items-start gap-4"
                    >
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-sand-200 shrink-0 border border-sand-300">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-sand-950">
                          {member.name}
                        </h3>
                        <p className="text-[11px] text-primary-700 font-medium mb-1">
                          {member.role}
                        </p>
                        <p className="text-xs text-sand-600 leading-relaxed font-normal">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avis clients certifiés */}
              <div className="pt-8 border-t border-sand-200/80">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="eyebrow mb-1">Retours d’expérience</p>
                    <h2 className="font-display text-2xl sm:text-3xl text-sand-950">
                      Avis certifiés ({venue.reviewCount})
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-sand-900 num">
                    <Star className="w-4 h-4 fill-primary-600 text-primary-600" />
                    <span>{venue.rating} / 5</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {venue.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-[var(--radius-sm)] bg-sand-50 border border-sand-200/80"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-sand-950">
                            {rev.author}
                          </span>
                          <span className="text-[10px] text-primary-700 font-medium bg-primary-50 px-2 py-0.5 rounded">
                            {rev.service}
                          </span>
                        </div>
                        <span className="text-[11px] text-sand-400">{rev.date}</span>
                      </div>
                      <p className="text-xs text-sand-700 leading-relaxed italic">
                        « {rev.comment} »
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Colonne droite collante : Module de réservation (4 colonnes) */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="p-6 rounded-[var(--radius-sm)] bg-sand-50 border border-sand-300 shadow-sm space-y-6">
                <div>
                  <span className="text-[11px] uppercase font-semibold tracking-wider text-sand-500 block mb-1">
                    Tarif indicatif
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl text-sand-950 num">
                      dès {venue.startingPrice}
                    </span>
                    <span className="text-xs text-sand-500">selon prestation</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-sand-200/80 space-y-3 text-xs text-sand-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sand-500">Disponibilité</span>
                    <span className="font-medium text-emerald-800">
                      Créneaux cette semaine
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sand-500">Politique d’annulation</span>
                    <span className="font-medium text-sand-800">
                      Gratuite jusqu’à 24h
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sand-500">Paiement</span>
                    <span className="font-medium text-sand-800">
                      En ligne ou sur place
                    </span>
                  </div>
                </div>

                <Link
                  href={`/book/${venue.slug}`}
                  className="w-full btn btn-primary flex items-center justify-center gap-2 py-3"
                >
                  <span>Prendre rendez-vous</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Réassurance de marque */}
                <div className="p-3.5 rounded bg-sand-100/70 text-[11px] text-sand-600 space-y-1.5 border border-sand-200/60">
                  <div className="flex items-center gap-1.5 font-semibold text-sand-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
                    <span>Garantie Sanctuaire Belora</span>
                  </div>
                  <p className="leading-snug">
                    Salon audité par nos équipes. Horaires strictement respectés et
                    accueil sans attente.
                  </p>
                </div>

                {/* Horaires hebdomadaires */}
                <div className="pt-4 border-t border-sand-200/80">
                  <span className="text-xs font-semibold text-sand-900 block mb-2.5">
                    Horaires d’ouverture
                  </span>
                  <div className="space-y-1.5 text-xs text-sand-600">
                    {venue.openingHours.map((slot) => (
                      <div
                        key={slot.day}
                        className="flex items-center justify-between text-[11px]"
                      >
                        <span className="font-medium text-sand-700">{slot.day}</span>
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

      <Footer />
    </div>
  );
}
