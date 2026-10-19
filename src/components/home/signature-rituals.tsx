import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";

interface Ritual {
  index: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  searchQuery: string;
}

const SIGNATURE_RITUALS: Ritual[] = [
  {
    index: "01",
    title: "Balayage Minéral & Coupe à Sec",
    category: "Coiffure d’auteur",
    description:
      "Éclaircissement délicat à base d’argile blanche et de pigments naturels. Respect absolu de la fibre capillaire pour un fondu lumineux.",
    duration: "2h15",
    price: "dès 110 €",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    searchQuery: "balayage",
  },
  {
    index: "02",
    title: "Rituel Kobido & Éclat Botanique",
    category: "Facialisme holistique",
    description:
      "Massage facial d’inspiration japonaise alliant percussions rythmées et drainage lymphatique pour défroisser les traits et oxygéner la peau.",
    duration: "1h15",
    price: "dès 95 €",
    image:
      "https://images.unsplash.com/photo-1512290900672-1f4861c8f49d?auto=format&fit=crop&w=800&q=80",
    searchQuery: "kobido",
  },
  {
    index: "03",
    title: "Rasage Traditionnel & Barbe au Coupe-Chou",
    category: "Barbier d'époque",
    description:
      "Préparation aux huiles essentielles de cèdre, protocole complet à la double serviette chaude et taille millimétrée aux ciseaux japonais.",
    duration: "50 min",
    price: "dès 42 €",
    image:
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
    searchQuery: "barbe",
  },
];

export function SignatureRituals() {
  return (
    <section className="section bg-sand-100" aria-labelledby="rituals-heading">
      <div className="container-belora">
        {/* En-tête typographique éditorial à fort contraste */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 pb-5 border-b border-sand-200/80">
          <div className="max-w-xl">
            <p className="eyebrow mb-2">Protocoles d’artisans</p>
            <h2 id="rituals-heading" className="display-lg text-sand-950 text-balance">
              L’art du geste,{" "}
              <span className="font-display italic text-primary-600 block sm:inline">
                prestations signatures.
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-sand-600 max-w-sm leading-relaxed">
            Chaque artisan partenaire cultive ses propres protocoles. Voici les soins
            les plus plébiscités pour leur exigence et leur résultat immédiat.
          </p>
        </div>

        {/* 3 Cartes Rituels de précision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SIGNATURE_RITUALS.map((ritual) => (
            <Link
              key={ritual.index}
              href={`/search?q=${ritual.searchQuery}`}
              className="group flex flex-col bg-sand-50 rounded-[var(--radius-sm)] border border-sand-300/80 overflow-hidden hover:border-sand-400 shadow-2xs hover:shadow-md transition-all duration-300"
            >
              {/* Photographie haute définition du geste avec bouton flèche */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-200">
                <Image
                  src={ritual.image}
                  alt={ritual.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Index discret en haut à gauche */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-[var(--radius-xs)] bg-sand-950/75 backdrop-blur-xs text-sand-50 text-[11px] font-semibold tracking-wider num">
                  {ritual.index}
                </div>

                {/* Pastille flèche ↗ en bas à droite */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-[var(--radius-xs)] bg-sand-50/95 backdrop-blur-xs text-sand-900 group-hover:bg-primary-600 group-hover:text-sand-50 flex items-center justify-center transition-colors shadow-2xs">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* Corps de la carte */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-primary-600 block mb-1.5">
                    {ritual.category}
                  </span>
                  <h3 className="font-display text-xl text-sand-950 group-hover:text-primary-600 transition-colors mb-2.5 leading-snug">
                    {ritual.title}
                  </h3>
                  <p className="text-xs text-sand-600 leading-relaxed font-normal mb-5 line-clamp-3">
                    {ritual.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-sand-200/80 flex items-center justify-between text-xs">
                  <span className="text-sand-500 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-sand-400" />
                    <span>{ritual.duration}</span>
                  </span>
                  <span className="font-semibold text-sand-950 num tracking-tight">
                    {ritual.price}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
