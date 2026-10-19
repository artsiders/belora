import { MainNav } from "@/components/layout/main-nav";
import { HeroCentered } from "@/components/home/hero-centered";
import { EditorialMarquee } from "@/components/home/editorial-marquee";
import { CategoryCircles } from "@/components/home/category-circles";
import { SignatureRituals } from "@/components/home/signature-rituals";
import { UniverseShowcase } from "@/components/home/universe-showcase";
import { SanctuaryExperience } from "@/components/home/sanctuary-experience";
import { CuratedVenues } from "@/components/home/curated-venues";
import { ArtisanSpotlight } from "@/components/home/artisan-spotlight";
import { ResultsGallery } from "@/components/home/results-gallery";
import { ProBanner } from "@/components/home/pro-banner";
import { CityDirectory } from "@/components/home/city-directory";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary-100 selection:text-primary-900 bg-sand-100 text-sand-900">
      {/* 1. Header & Navigation Moderne & Épurée */}
      <MainNav />

      {/* 2. Hero Centré Pleine Largeur avec Recherche */}
      <HeroCentered />

      {/* 3. Ruban de Réassurance Moderne avec Masque de Fondu */}
      <EditorialMarquee />

      {/* 4. Explorer par Univers de Soins (Vignettes Circulaires) */}
      <CategoryCircles />

      {/* 5. Prestations Signatures & Protocoles d'Artisans (01, 02, 03) */}
      <SignatureRituals />

      {/* 6. Atelier des Savoir-Faire (Interactif avec très grandes photos) */}
      <UniverseShowcase />

      {/* 7. L'Expérience Sanctuaire (Charte d'Excellence & Intérieur Architectural) */}
      <SanctuaryExperience />

      {/* 8. Maisons & Ateliers Recommandés (Sélection Audités) */}
      <CuratedVenues />

      {/* 9. Rencontre avec les Maîtres Artisans (Portraits & Citations) */}
      <ArtisanSpotlight />

      {/* 10. Le Geste en Image (Mosaïque de Réalisations & Résultats Réels) */}
      <ResultsGallery />

      {/* 11. Belora Pro (Pour les Artisans & Gérants d'Établissements) */}
      <ProBanner />

      {/* 12. Répertoire par Villes */}
      <CityDirectory />

      {/* 13. Pied de Page Institutionnel */}
      <Footer />
    </div>
  );
}
