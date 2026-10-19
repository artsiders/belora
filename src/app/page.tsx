import { MainNav } from "@/components/layout/main-nav";
import { HeroCentered } from "@/components/home/hero-centered";
import { EditorialMarquee } from "@/components/home/editorial-marquee";
import { CategoryCircles } from "@/components/home/category-circles";
import { CuratedVenues } from "@/components/home/curated-venues";
import { ReassuranceBanner } from "@/components/home/reassurance-banner";
import { SanctuaryExperience } from "@/components/home/sanctuary-experience";
import { ArtisanSpotlight } from "@/components/home/artisan-spotlight";
import { ResultsGallery } from "@/components/home/results-gallery";
import { CityDirectory } from "@/components/home/city-directory";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary-100 selection:text-primary-900 bg-white text-sand-900">
      {/* 1. Header & Navigation Moderne & Épurée */}
      <MainNav />

      {/* 2. Hero Éditorial avec Formes en Arches (Arch) & Recherche */}
      <HeroCentered />

      {/* 3. Ruban de Réassurance Défilant */}
      <EditorialMarquee />

      {/* 4. Nos Univers : 5 Arches aux Teintes de Couleur de la Nouvelle DA */}
      <CategoryCircles />

      {/* 5. Nos Salons Populaires Près de Chez Vous (Cartes avec Favoris, Notes & Tags) */}
      <CuratedVenues />

      {/* 6. Bannière de Réassurance & Simplicité avec Arches Décoratives */}
      <ReassuranceBanner />

      {/* 7. L'Expérience Sanctuaire (Charte d'Excellence & Intérieur Architectural en Arche) */}
      <SanctuaryExperience />

      {/* 8. Rencontre avec les Maîtres Artisans (Portraits en Arches & Citations) */}
      <ArtisanSpotlight />

      {/* 9. Le Geste en Image (Mosaïque de Réalisations & Résultats Réels) */}
      <ResultsGallery />

      {/* 10. Répertoire par Villes */}
      <CityDirectory />

      {/* 11. Pied de Page Institutionnel */}
      <Footer />
    </div>
  );
}
