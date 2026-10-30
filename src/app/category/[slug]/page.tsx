import { Suspense } from "react";
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

function CategoryLoadingFallback() {
  return (
    <>
      <CategorySwitcher currentSlug="" />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-white border-b border-neutral-200/80">
          <div className="container-belora py-10 lg:py-14">
            <div className="max-w-3xl space-y-4">
              <div className="h-4 w-28 bg-neutral-100 rounded animate-pulse" />
              <div className="h-10 w-2/3 bg-neutral-100 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-neutral-100 rounded animate-pulse" />
              <div className="h-14 w-full max-w-2xl bg-neutral-50 border border-neutral-200/80 rounded-2xl mt-4 animate-pulse" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-neutral-900 selection:bg-primary-100 selection:text-primary-900">
      {/* 1. Header & Navigation Institutionnelle */}
      <MainNav />

      {/* 2. Contenu dynamique encapsulé dans Suspense pour l'App Shell instantanée */}
      <Suspense fallback={<CategoryLoadingFallback />}>
        <CategoryDetails params={params} />
      </Suspense>

      {/* 3. Pied de Page Institutionnel */}
      <Footer />
    </div>
  );
}

async function CategoryDetails({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES_DATA[slug];

  if (!category) {
    notFound();
  }

  return (
    <>
      {/* Barre de navigation rapide entre univers */}
      <CategorySwitcher currentSlug={slug} />

      <main className="flex-1">
        {/* Hero avec Titre dynamique & Capsule de Recherche */}
        <CategoryHero category={category} />

        {/* Répertoire de Métropoles Internationales avec photos et compteurs */}
        <CategoryCities category={category} />

        {/* Havres & Ateliers Certifiés Recommandés */}
        <CategoryVenuesPreview category={category} />

        {/* Section Éditoriale & Recherches Fréquentes (Style Planity) */}
        <CategoryEditorial category={category} />

        {/* Guide & Conseils d'Experts */}
        <CategoryGuide category={category} />

        {/* Appel à l'action pour les Établissements Partenaires */}
        <CategoryProCta category={category} />
      </main>
    </>
  );
}
