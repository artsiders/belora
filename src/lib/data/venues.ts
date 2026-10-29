export interface Service {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  priceEuros: number;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export interface VenueReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  service: string;
}

export interface Venue {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  category: "hair" | "facial" | "massage" | "barber" | "nails" | "wellness";
  categoryLabel: string;
  city: string;
  district: string;
  address: string;
  rating: string;
  reviewCount: number;
  startingPrice: string;
  image: string;
  gallery: string[];
  features: string[];
  openingHours: { day: string; hours: string }[];
  team: TeamMember[];
  services: Service[];
  reviews: VenueReview[];
}

export const VENUES: Venue[] = [
  {
    id: "v1",
    slug: "atelier-botanique-paris",
    name: "L’Atelier Botanique",
    tagline: "Coiffure végétale, coupe à sec & balayage minéral",
    description:
      "Niché dans une cour pavée du Marais, L’Atelier Botanique célèbre la beauté originelle du cheveu à travers des rituels naturels, des pigments végétaux sans ammoniaque et une coupe à sec respectueuse des volumes naturels.",
    badge: "Maison d’artisan",
    category: "hair",
    categoryLabel: "Coiffure d’auteur",
    city: "Paris",
    district: "Le Marais (3e)",
    address: "18 Rue de Turenne, 75003 Paris",
    rating: "4,9",
    reviewCount: 142,
    startingPrice: "55 €",
    image: "/images/venues/atelier-botanique.jpg",
    gallery: [
      "/images/venues/atelier-botanique.jpg",
      "/images/venues/gallery-1.jpg",
      "/images/gallery/gallery-hair.jpg",
      "/images/venues/gallery-3.jpg",
    ],
    features: [
      "Pigments 100% végétaux et biologiques",
      "Diagnostic morphologique personnalisé",
      "Coupe sur cheveux secs pour respecter le tombant naturel",
      "Espace feutré d'une grande quiétude sonore",
    ],
    openingHours: [
      { day: "Lundi", hours: "Fermé" },
      { day: "Mardi", hours: "10h00 - 19h30" },
      { day: "Mercredi", hours: "10h00 - 19h30" },
      { day: "Jeudi", hours: "10h00 - 20h00" },
      { day: "Vendredi", hours: "10h00 - 20h00" },
      { day: "Samedi", hours: "09h30 - 19h00" },
      { day: "Dimanche", hours: "Fermé" },
    ],
    team: [
      {
        id: "t1",
        name: "Hélène de Valois",
        role: "Artisan Coloriste & Fondatrice",
        bio: "Formée aux techniques de coloration végétale à Tokyo et Paris, Hélène sculpte la lumière naturelle du cheveu avec délicatesse.",
        avatar: "/images/artisans/artisan-helene.jpg",
      },
      {
        id: "t2",
        name: "Clément Roux",
        role: "Maître Styliste Coupe à Sec",
        bio: "Passionné par l'architecture du visage, Clément adapte chaque ligne de coupe à la gestuelle quotidienne de ses clients.",
        avatar: "/images/artisans/artisan-marc.jpg",
      },
    ],
    services: [
      {
        id: "s1",
        name: "Coupe Signature à Sec & Rituel Botanique",
        category: "Coupes & Rituels",
        durationMinutes: 60,
        priceEuros: 75,
        description:
          "Diagnostic du cuir chevelu, coupe sur cheveu sec, shampoing aux poudres ayurvédiques, massage crânien et coiffage naturel.",
      },
      {
        id: "s2",
        name: "Balayage Minéral à l'Argile Blanche",
        category: "Colorations Végétales",
        durationMinutes: 120,
        priceEuros: 140,
        description:
          "Éclaircissement délicat à base d'argiles pures et d'huiles végétales. Respecte la fibre et apporte des reflets subtils dorés.",
      },
      {
        id: "s3",
        name: "Coloration Végétale Intégrale aux Plantes",
        category: "Colorations Végétales",
        durationMinutes: 90,
        priceEuros: 95,
        description:
          "Enrobage protecteur de la fibre avec henné pur, indigo et camomille pour gainer et sublimer la chevelure.",
      },
      {
        id: "s4",
        name: "Soin Profond Reconstructeur aux Baumes",
        category: "Soins Profonds",
        durationMinutes: 45,
        priceEuros: 55,
        description:
          "Bain d'huiles tièdes pressées à froid sous serviette chaude et massage apaisant des trapèzes.",
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Sophie M.",
        rating: 5,
        date: "14 octobre 2026",
        comment:
          "L'Atelier Botanique est une parenthèse de paix inouïe. Hélène a su comprendre la texture exacte de mes boucles sans jamais les forcer. Le balayage est lumineux et naturel.",
        service: "Balayage Minéral à l'Argile Blanche",
      },
      {
        id: "r2",
        author: "Camille D.",
        rating: 5,
        date: "28 septembre 2026",
        comment:
          "Zéro bruit de sèche-cheveux agressif, thé délicieux et coupe à sec impeccable qui repousse à merveille depuis 3 semaines.",
        service: "Coupe Signature à Sec & Rituel Botanique",
      },
    ],
  },
  {
    id: "v2",
    slug: "maison-albar-soins",
    name: "Maison Albar Institut & Spa",
    tagline: "Soin visage holistique, diagnostic cutané & Kobido",
    description:
      "Demeure historique de la Presqu’île lyonnaise, Maison Albar conjugue la précision des techniques ancestrales japonaises et la rigueur de la dermo-cosmétique contemporaine pour réveiller l'éclat cellulaire.",
    badge: "Sanctuaire d'Excellence",
    category: "facial",
    categoryLabel: "Soins Visage",
    city: "Lyon",
    district: "Presqu’île",
    address: "24 Rue de la République, 69002 Lyon",
    rating: "5,0",
    reviewCount: 96,
    startingPrice: "80 €",
    image: "/images/venues/maison-albar.jpg",
    gallery: [
      "/images/venues/maison-albar.jpg",
      "/images/sanctuaries/sanctuary-architecture.jpg",
      "/images/gallery/gallery-facial.jpg",
      "/images/venues/gallery-1.jpg",
    ],
    features: [
      "Praticienne certifiée Maître Kobido",
      "Cosméceutiques sans perturbateurs endocriniens",
      "Cabines insonorisées au design minéral",
      "Diagnostic de peau haute résolution offert",
    ],
    openingHours: [
      { day: "Lundi", hours: "11h00 - 19h00" },
      { day: "Mardi", hours: "09h30 - 19h30" },
      { day: "Mercredi", hours: "09h30 - 19h30" },
      { day: "Jeudi", hours: "09h30 - 20h00" },
      { day: "Vendredi", hours: "09h30 - 20h00" },
      { day: "Samedi", hours: "10h00 - 18h30" },
      { day: "Dimanche", hours: "Fermé" },
    ],
    team: [
      {
        id: "t3",
        name: "Nour Kaddour",
        role: "Praticienne Facialiste & Kobido",
        bio: "Formée aux rituels faciaux de haute précision, Nour détend les fascias et stimule la microcirculation pour un teint immédiatement repulpé.",
        avatar: "/images/artisans/artisan-nour.jpg",
      },
    ],
    services: [
      {
        id: "s5",
        name: "Grand Rituel Kobido Traditionnel",
        category: "Soins du Visage",
        durationMinutes: 75,
        priceEuros: 115,
        description:
          "Séquence de percussions, lissages et pincements précis des méridiens du visage pour drainer et tonifier les volumes.",
      },
      {
        id: "s6",
        name: "Soin Visage Détox Minérale & Quartz",
        category: "Soins du Visage",
        durationMinutes: 60,
        priceEuros: 85,
        description:
          "Nettoyage aux vapeurs d'eucalyptus, gommage enzymatique doux et lissage aux rouleaux de quartz rose glacé.",
      },
      {
        id: "s7",
        name: "Rituel Éclat & Gua Sha Holistique",
        category: "Soins du Visage",
        durationMinutes: 60,
        priceEuros: 90,
        description:
          "Massage drainant profond au Gua Sha en corne végétale et application de sérums riches en antioxydants.",
      },
    ],
    reviews: [
      {
        id: "r3",
        author: "Élodie B.",
        rating: 5,
        date: "02 octobre 2026",
        comment:
          "Le soin Kobido de Nour est un chef-d'œuvre. Mes traits étaient reposés comme après deux semaines de vacances.",
        service: "Grand Rituel Kobido Traditionnel",
      },
    ],
  },
  {
    id: "v3",
    slug: "barbier-saint-germain",
    name: "Le Salon Saint-Germain",
    tagline: "Taille de barbe millimétrée & serviette chaude",
    description:
      "Installé dans le Triangle d'Or bordelais, Le Salon Saint-Germain perpétue la tradition du rasage au coupe-choux dans un décor chaleureux de bois sombre et de cuir d'époque.",
    badge: "Atelier Barbier",
    category: "barber",
    categoryLabel: "Barbiers & Homme",
    city: "Bordeaux",
    district: "Triangle d’Or",
    address: "12 Place des Grands Hommes, 33000 Bordeaux",
    rating: "4,9",
    reviewCount: 218,
    startingPrice: "38 €",
    image: "/images/venues/salon-saint-germain.jpg",
    gallery: [
      "/images/venues/salon-saint-germain.jpg",
      "/images/gallery/gallery-barber.jpg",
      "/images/venues/gallery-2.jpg",
      "/images/categories/category-barber.jpg",
    ],
    features: [
      "Rasage à l'ancienne avec lame neuve stérile",
      "Serviettes chaudes parfumées aux huiles essentielles",
      "Fauteuils de barbier d'époque restaurés",
      "Café de spécialité offert à chaque visite",
    ],
    openingHours: [
      { day: "Lundi", hours: "Fermé" },
      { day: "Mardi", hours: "09h00 - 19h00" },
      { day: "Mercredi", hours: "09h00 - 19h00" },
      { day: "Jeudi", hours: "09h00 - 20h00" },
      { day: "Vendredi", hours: "09h00 - 20h00" },
      { day: "Samedi", hours: "09h00 - 18h00" },
      { day: "Dimanche", hours: "Fermé" },
    ],
    team: [
      {
        id: "t4",
        name: "Marc Sémard",
        role: "Maître Barbier Traditionnel",
        bio: "18 ans de métier consacrés à l'art du rasage classique, de la taille sculptée et du soin de la peau masculine.",
        avatar: "/images/artisans/artisan-marc.jpg",
      },
    ],
    services: [
      {
        id: "s8",
        name: "Rasage Traditionnel à l'Ancienne",
        category: "Barbe & Rasage",
        durationMinutes: 45,
        priceEuros: 48,
        description:
          "Préparation de la peau à l'huile végétale, blaireau monté à la main, rasage au coupe-choux, serviette chaude et baume apaisant.",
      },
      {
        id: "s9",
        name: "Taille de Barbe & Soin Hydratant",
        category: "Barbe & Rasage",
        durationMinutes: 35,
        priceEuros: 38,
        description:
          "Sculpture de la barbe aux ciseaux et tondeuse, finitions des contours au rasoir et baume nourrissant au bois de cèdre.",
      },
      {
        id: "s10",
        name: "Coupe Homme aux Ciseaux & Coiffage",
        category: "Coupes Homme",
        durationMinutes: 40,
        priceEuros: 42,
        description:
          "Shampoing purifiant, coupe précise aux ciseaux et finitions nettes de la nuque.",
      },
    ],
    reviews: [
      {
        id: "r4",
        author: "Antoine L.",
        rating: 5,
        date: "05 octobre 2026",
        comment:
          "Marc est un véritable maître du geste. Le rasage est d'une douceur absolue et le moment de la serviette chaude est un vrai régal.",
        service: "Rasage Traditionnel à l'Ancienne",
      },
    ],
  },
  {
    id: "v4",
    slug: "bain-de-vapeur-sequoia",
    name: "Studio Séquoia",
    tagline: "Massage relaxant & rituel corporel aux huiles tièdes",
    description:
      "À deux pas du Vieux-Port marseillais, Studio Séquoia est un havre méditerranéen aux murs de chaux et bois clair, dédié à la décompression musculaire et aux massages botaniques profonds.",
    badge: "Espace Spa",
    category: "massage",
    categoryLabel: "Massages & Spas",
    city: "Marseille",
    district: "Vieux-Port",
    address: "8 Quai de Rive Neuve, 13007 Marseille",
    rating: "4,8",
    reviewCount: 88,
    startingPrice: "75 €",
    image: "/images/venues/studio-sequoia.jpg",
    gallery: [
      "/images/venues/studio-sequoia.jpg",
      "/images/gallery/gallery-massage.jpg",
      "/images/categories/category-massage.jpg",
      "/images/venues/gallery-3.jpg",
    ],
    features: [
      "Huiles vierges biologiques pressées à froid",
      "Matelas chauffants ergonomiques à mémoire de forme",
      "Infusion aux herbes de Provence offerte après la séance",
      "Zéro produit de synthèse ou parfums artificiels",
    ],
    openingHours: [
      { day: "Lundi", hours: "10h00 - 19h00" },
      { day: "Mardi", hours: "10h00 - 19h00" },
      { day: "Mercredi", hours: "10h00 - 19h00" },
      { day: "Jeudi", hours: "10h00 - 20h00" },
      { day: "Vendredi", hours: "10h00 - 20h00" },
      { day: "Samedi", hours: "10h00 - 19h00" },
      { day: "Dimanche", hours: "11h00 - 18h00" },
    ],
    team: [
      {
        id: "t5",
        name: "Léa Provençal",
        role: "Masseuse & Praticienne Holistique",
        bio: "Spécialisée en relâchement myofascial et rituels relaxants aux huiles tièdes infusées à la lavande et romarin.",
        avatar: "/images/artisans/artisan-helene.jpg",
      },
    ],
    services: [
      {
        id: "s11",
        name: "Massage Signature Décompression Profonde",
        category: "Massages Corporels",
        durationMinutes: 60,
        priceEuros: 85,
        description:
          "Pressions progressives et étirements doux pour dénouer les tensions musculaires du dos, du cou et des épaules.",
      },
      {
        id: "s12",
        name: "Rituel Sommeil & Huile de Lavande Tiède",
        category: "Massages Corporels",
        durationMinutes: 75,
        priceEuros: 105,
        description:
          "Mouvements enveloppants continus sur tout le corps favorisant un lâcher-prise neurologique immédiat.",
      },
    ],
    reviews: [
      {
        id: "r5",
        author: "Julien V.",
        rating: 5,
        date: "11 octobre 2026",
        comment:
          "Un calme souverain en plein cœur de Marseille. L'accueil est parfait et le massage a dénoué toutes mes tensions lombaires.",
        service: "Massage Signature Décompression Profonde",
      },
    ],
  },
  {
    id: "v6",
    slug: "maison-vernis-paris",
    name: "Maison Vernis & Soin",
    tagline: "Manucure russe haute précision, gel porcelaine & rituels spa bio",
    description:
      "Installé à deux pas de la place Vendôme, Maison Vernis & Soin est un écrin dédié à la beauté des mains et des pieds. Protocoles d'hygiène stricts sous autoclave, vernis bio-sourcés et prothésistes formées aux techniques russes les plus exigeantes.",
    badge: "Excellence Onglerie",
    category: "nails",
    categoryLabel: "Onglerie de Haute Volée",
    city: "Paris",
    district: "Place Vendôme (1er)",
    address: "12 Rue de la Paix, 75001 Paris",
    rating: "4,9",
    reviewCount: 98,
    startingPrice: "45 €",
    image: "/images/editorial/nails-detail.jpg",
    gallery: [
      "/images/editorial/nails-detail.jpg",
      "/images/editorial/nails-salon.jpg",
      "/images/gallery/gallery-nails.jpg",
    ],
    features: [
      "Stérilisation médicale sous autoclave de classe B",
      "Vernis 10-Free sans perturbateurs endocriniens",
      "Technique de manucure russe combinée sans douleur",
      "Fauteuils spa massants ergonomiques pour les pieds",
    ],
    openingHours: [
      { day: "Lundi", hours: "10h00 - 19h00" },
      { day: "Mardi", hours: "10h00 - 20h00" },
      { day: "Mercredi", hours: "10h00 - 20h00" },
      { day: "Jeudi", hours: "10h00 - 20h00" },
      { day: "Vendredi", hours: "10h00 - 20h30" },
      { day: "Samedi", hours: "09h30 - 19h30" },
      { day: "Dimanche", hours: "Fermé" },
    ],
    team: [
      {
        id: "t6",
        name: "Camille Lesueur",
        role: "Maître Prothésiste Ongulaire & Formatrice",
        bio: "Formée à Saint-Pétersbourg et Paris, Camille maîtrise le travail millimétré des cuticules et le nail art architectural.",
        avatar: "/images/artisans/artisan-3.jpg",
      },
    ],
    services: [
      {
        id: "s13",
        name: "Manucure Russe Signature & Vernis Semi-Permanent",
        category: "Manucure & Mains",
        durationMinutes: 60,
        priceEuros: 65,
        description:
          "Nettoyage minutieux des cuticules à l'embout diamant, mise en forme et pose sous cuticule pour 4 semaines de perfection.",
      },
      {
        id: "s14",
        name: "Beauté des Pieds Spa & Bain aux Sels Détox",
        category: "Pédicure & Pieds",
        durationMinutes: 50,
        priceEuros: 70,
        description:
          "Bain aux huiles essentielles, gommage doux aux sels d'Epsom, élimination des callosités et modelage nourrissant.",
      },
      {
        id: "s15",
        name: "Rallongement Gel Porcelaine Naturel",
        category: "Rallongement & Gel",
        durationMinutes: 90,
        priceEuros: 110,
        description:
          "Sculpture sur chablon sans capsule, pour un galbe ultra fin, solide et indétectable.",
      },
    ],
    reviews: [
      {
        id: "r6",
        author: "Sophie M.",
        rating: 5,
        date: "22 octobre 2026",
        comment:
          "La meilleure manucure russe de Paris sans hésiter. Mes ongles n'ont jamais été aussi sains et le vernis tient plus de 4 semaines sans s'écailler.",
        service: "Manucure Russe Signature & Vernis Semi-Permanent",
      },
    ],
  },
  {
    id: "v7",
    slug: "soho-nail-atelier-newyork",
    name: "SoHo Nail Atelier",
    tagline: "Minimalist Japanese nail art & organic restorative hand spas",
    description:
      "Situé au cœur de SoHo à New York, cet atelier d'inspiration tokyoïte propose un nail art architectural avant-gardiste et des rituels de soin des mains d'une pureté absolue.",
    badge: "Sélection Internationale",
    category: "nails",
    categoryLabel: "Art Architectural Ongulaire",
    city: "New York",
    district: "SoHo, Manhattan",
    address: "42 Mercer St, New York, NY 10013",
    rating: "4,9",
    reviewCount: 115,
    startingPrice: "55 $",
    image: "/images/editorial/nails-salon.jpg",
    gallery: [
      "/images/editorial/nails-salon.jpg",
      "/images/editorial/nails-detail.jpg",
      "/images/cities/new-york.jpg",
    ],
    features: [
      "Vernis et gels importés directement de Tokyo",
      "Protocoles de soin 100% sans solvants toxiques",
      "Espace épuré zen en bois de cèdre et pierre naturelle",
      "Service de thé matcha de cérémonie offert",
    ],
    openingHours: [
      { day: "Lundi", hours: "10h00 - 19h00" },
      { day: "Mardi", hours: "10h00 - 19h00" },
      { day: "Mercredi", hours: "10h00 - 20h00" },
      { day: "Jeudi", hours: "10h00 - 20h00" },
      { day: "Vendredi", hours: "10h00 - 20h00" },
      { day: "Samedi", hours: "09h00 - 19h00" },
      { day: "Dimanche", hours: "11h00 - 18h00" },
    ],
    team: [
      {
        id: "t7",
        name: "Yuki Tanaka",
        role: "Head Nail Artist",
        bio: "Artiste renommée à Ginza et Manhattan, réputée pour ses lignes fines et ses finitions chromées discrètes.",
        avatar: "/images/artisans/artisan-2.jpg",
      },
    ],
    services: [
      {
        id: "s16",
        name: "Japanese Minimalist Gel Manicure",
        category: "Manucure & Gel",
        durationMinutes: 60,
        priceEuros: 75,
        description:
          "Soin doux des ongles naturels avec gel japonais respirant haute brillance.",
      },
      {
        id: "s17",
        name: "Bespoke Architectural Nail Art",
        category: "Nail Art",
        durationMinutes: 75,
        priceEuros: 95,
        description:
          "Création graphique personnalisée : lignes pures, dégradés d'aquarelle et accents dorés fins.",
      },
    ],
    reviews: [
      {
        id: "r7",
        author: "Emily R.",
        rating: 5,
        date: "18 octobre 2026",
        comment:
          "The precision of Yuki's work is unmatched anywhere in NYC. An incredible calming sanctuary in the middle of SoHo.",
        service: "Japanese Minimalist Gel Manicure",
      },
    ],
  },
];

export function getVenueBySlug(slug: string): Venue | undefined {
  return VENUES.find((v) => v.slug === slug);
}

