import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MainNav } from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { CATEGORIES_DATA } from "@/lib/data/categories";
import { CategorySwitcher } from "@/components/category/category-switcher";
import { CategoryHero } from "@/components/category/category-hero";
import { CategoryCities } from "@/components/category/category-cities";
import { CategoryVenuesPreview } from "@/components/category/category-venues-preview";
import { CategoryEditorial } from "@/components/category/category-editorial";
import { CategoryGuide } from "@/components/category/category-guide";
import { CategoryProCta } from "@/components/category/category-pro-cta";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIES_DATA).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES_DATA[slug];

  if (!category) {
    return {
      title: "Catégorie non trouvée | Belora",
    };
  }

  return {
    title: `${category.heroTitle} | Belora International`,
    description: `${category.heroSubtitle} Découvrez les meilleurs salons et artisans à Paris, New York, Londres, Tokyo et Milan sur Belora.`,
    openGraph: {
      title: `${category.name} | Belora`,
      description: category.heroSubtitle,
      images: [category.story.image],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES_DATA[slug];

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-sand-900 selection:bg-primary-100 selection:text-primary-900">
      {/* 1. Header & Navigation Institutionnelle */}
      <MainNav />

      {/* 2. Barre de navigation rapide entre univers */}
      <CategorySwitcher currentSlug={slug} />

      <main className="flex-1">
        {/* 3. Hero avec Titre dynamique & Capsule de Recherche */}
        <CategoryHero category={category} />

        {/* 4. Répertoire de Métropoles Internationales avec photos et compteurs */}
        <CategoryCities category={category} />

        {/* 5. Havres & Ateliers Certifiés Recommandés */}
        <CategoryVenuesPreview category={category} />

        {/* 6. Section Éditoriale & Recherches Fréquentes (Style Planity) */}
        <CategoryEditorial category={category} />

        {/* 7. Guide & Conseils d'Experts */}
        <CategoryGuide category={category} />

        {/* 8. Appel à l'action pour les Établissements Partenaires */}
        <CategoryProCta category={category} />
      </main>

      {/* 9. Pied de Page Institutionnel */}
      <Footer />
    </div>
  );
}
