export interface InternationalCity {
  id: string;
  name: string;
  country: string;
  region: "Europe" | "Americas" | "Asia & Middle East";
  count: string;
  image: string;
}

export interface FrequentSearch {
  title: string;
  query: string;
  tag?: string;
}

export interface SanctuaryPillar {
  num: string;
  title: string;
  description: string;
}

export interface CategoryData {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  searchPlaceholder: string;
  cities: InternationalCity[];
  pillars: SanctuaryPillar[];
  story: {
    title: string;
    lead: string;
    paragraphs: string[];
    image: string;
    imageAlt: string;
    caption?: string;
  };
  frequentSearches: {
    col1: FrequentSearch[];
    col2: FrequentSearch[];
  };
  guide: {
    mainTitle: string;
    intro: string;
    sections: {
      title: string;
      content: string;
    }[];
  };
  pro: {
    title: string;
    description: string;
    ctaText: string;
    ctaHref: string;
    image: string;
    imageAlt: string;
  };
}

export const INTERNATIONAL_CITIES_GLOBAL: InternationalCity[] = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    region: "Europe",
    count: "340 ateliers d'art",
    image: "/images/cities/paris.jpg",
  },
  {
    id: "new-york",
    name: "New York",
    country: "États-Unis",
    region: "Americas",
    count: "420 salons certifiés",
    image: "/images/cities/new-york.jpg",
  },
  {
    id: "london",
    name: "Londres",
    country: "Royaume-Uni",
    region: "Europe",
    count: "290 studios de prestige",
    image: "/images/cities/london.jpg",
  },
  {
    id: "milan",
    name: "Milan",
    country: "Italie",
    region: "Europe",
    count: "215 adresses exclusives",
    image: "/images/cities/milan.jpg",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japon",
    region: "Asia & Middle East",
    count: "260 maîtres artisans",
    image: "/images/cities/tokyo.jpg",
  },
  {
    id: "dubai",
    name: "Dubaï",
    country: "Émirats Arabes Unis",
    region: "Asia & Middle East",
    count: "185 havres de luxe",
    image: "/images/cities/dubai.jpg",
  },
  {
    id: "los-angeles",
    name: "Los Angeles",
    country: "États-Unis",
    region: "Americas",
    count: "245 espaces d'exception",
    image: "/images/cities/los-angeles.jpg",
  },
  {
    id: "geneva",
    name: "Genève",
    country: "Suisse",
    region: "Europe",
    count: "110 sanctuaires privés",
    image: "/images/cities/geneva.jpg",
  },
  {
    id: "barcelona",
    name: "Barcelone",
    country: "Espagne",
    region: "Europe",
    count: "160 ateliers contemporains",
    image: "/images/cities/barcelona.jpg",
  },
  {
    id: "montreal",
    name: "Montréal",
    country: "Canada",
    region: "Americas",
    count: "140 studios d'auteur",
    image: "/images/cities/montreal.jpg",
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italie",
    region: "Europe",
    count: "175 maisons historiques",
    image: "/images/cities/rome.jpg",
  },
  {
    id: "seoul",
    name: "Séoul",
    country: "Corée du Sud",
    region: "Asia & Middle East",
    count: "230 instituts d'avant-garde",
    image: "/images/cities/seoul.jpg",
  },
];

export const CATEGORIES_DATA: Record<string, CategoryData> = {
  all: {
    id: "all",
    slug: "all",
    name: "Tous les univers",
    shortName: "Soins & Beauté",
    eyebrow: "L'artisanat du geste",
    titlePrefix: "Réserver en ligne les meilleurs havres",
    titleHighlight: "et artisans d'exception dans le monde.",
    heroTitle: "Réserver en ligne dans les meilleurs havres de soin",
    heroSubtitle: "Salons d'auteur, stylistes prothésistes, maîtres barbiers et sanctuaires spa dans les grandes capitales mondiales.",
    heroImage: "/images/heroes/hero-banner.webp",
    searchPlaceholder: "Coiffure, manucure, massage, barbier, soin visage...",
    cities: INTERNATIONAL_CITIES_GLOBAL,
    pillars: [
      {
        num: "01",
        title: "Artisans d'auteur certifiés",
        description: "Chaque praticien est audité sur place pour son excellence technique et son accueil.",
      },
      {
        num: "02",
        title: "Protocoles d'hygiène stricts",
        description: "Stérilisation médicale, formules saines et respect absolu de votre bien-être.",
      },
      {
        num: "03",
        title: "Accueil garanti sans attente",
        description: "Créneaux sanctuarisés et synchronisation temps réel pour une quiétude totale.",
      },
    ],
    story: {
      title: "L'artisanat du soin, l'avènement des sanctuaires urbains.",
      lead: "Belora réunit les ateliers et artisans indépendants qui hissent la beauté et le bien-être au rang d'art.",
      paragraphs: [
        "De Paris à Tokyo, nos maisons partenaires célèbrent le geste précis, les formules botaniques pures et l'hospitalité bienveillante dans des espaces conçus comme de véritables havres de déconnexion.",
      ],
      image: "/images/editorial/hair-detail.jpg",
      imageAlt: "Artisan de soin exerçant son geste dans un salon d'exception",
      caption: "L'excellence artisanale et l'accueil attentionné",
    },
    frequentSearches: {
      col1: [
        { title: "Manucure russe sans cuticules", query: "manucure russe", tag: "Signature" },
        { title: "Balayage minéral & reflets naturels", query: "balayage mineral", tag: "Lumière" },
        { title: "Massage facialiste Kobido liftant", query: "kobido", tag: "Japon" },
        { title: "Massage Deep Tissue décontracturant", query: "deep tissue", tag: "Musculaire" },
        { title: "Taille de barbe au coupe-choux", query: "taille de barbe", tag: "Tradition" },
      ],
      col2: [
        { title: "Coloration végétale 100% bio", query: "coloration vegetale", tag: "Bio" },
        { title: "Pose de vernis semi-permanent", query: "vernis semi-permanent", tag: "Populaire" },
        { title: "Drainage lymphatique du corps", query: "drainage lymphatique", tag: "Détox" },
        { title: "Coupe sur cheveux secs sur-mesure", query: "coupe cheveux secs", tag: "Artisan" },
        { title: "Rituel spa & massage pierres chaudes", query: "pierres chaudes", tag: "Spa" },
      ],
    },
    guide: {
      mainTitle: "Comment choisir votre havre de soin sur Belora ?",
      intro: "Chaque maison référencée répond à des critères d'audit rigoureux pour garantir une expérience irréprochable.",
      sections: [
        {
          title: "Des professionnels audités sur place",
          content: "Nous visitons et réévaluons chaque salon pour contrôler la qualité d'accueil et le savoir-faire des praticiens.",
        },
        {
          title: "Réservation fluide et sans attente",
          content: "Votre créneau est sanctuarisé dès la validation en ligne, avec rappels automatiques et prise en charge instantanée.",
        },
      ],
    },
    pro: {
      title: "Vous dirigez un établissement de beauté d'exception ?",
      description: "Rejoignez l'élite Belora Pro pour attirer une clientèle locale et internationale sans commissions abusives.",
      ctaText: "Rejoindre Belora Pro",
      ctaHref: "/pro",
      image: "/images/editorial/pro-manager.jpg",
      imageAlt: "Responsable d'établissement utilisant Belora Pro",
    },
  },
  nails: {
    id: "nails",
    slug: "nails",
    name: "Onglerie & Manucure",
    shortName: "Manucure",
    eyebrow: "Soin des mains & pieds",
    titlePrefix: "Réserver en ligne un rendez-vous",
    titleHighlight: "pour une manucure d'exception.",
    heroTitle: "Réserver en ligne un RDV pour une manucure",
    heroSubtitle: "Nail bars d'exception et stylistes prothésistes certifiés dans les grandes capitales mondiales.",
    heroImage: "/images/heroes/hero-nails.jpg",
    searchPlaceholder: "Manucure russe, vernis semi-permanent, nail art...",
    cities: INTERNATIONAL_CITIES_GLOBAL,
    pillars: [
      {
        num: "01",
        title: "Stérilisation autoclave",
        description: "Instruments décontaminés aux normes médicales strictes pour une hygiène totale.",
      },
      {
        num: "02",
        title: "Kératine préservée",
        description: "Formules sans solvants toxiques et soins doux qui respectent la santé de l'ongle.",
      },
      {
        num: "03",
        title: "Précision du galbe",
        description: "Tracé millimétré sous cuticule pour une tenue parfaite jusqu'à quatre semaines.",
      },
    ],
    story: {
      title: "L'art du geste minutieux, l'onglerie d'auteur.",
      lead: "La manucure contemporaine conjugue rigueur architecturale, hygiène absolue et créativité sur-mesure.",
      paragraphs: [
        "De Paris à Tokyo, nos nail bars partenaires privilégient des formules bio-sourcées et la précision du travail sous cuticule pour un galbe impeccable et durable.",
      ],
      image: "/images/editorial/nails-detail.jpg",
      imageAlt: "Geste précis de manucure et soin des cuticules en atelier",
      caption: "Précision millimétrée du geste",
    },
    frequentSearches: {
      col1: [
        { title: "Manucure russe sans cuticules", query: "manucure russe", tag: "Signature" },
        { title: "Pose de vernis semi-permanent", query: "vernis semi-permanent", tag: "Populaire" },
        { title: "Nail art graphique & minimaliste", query: "nail art", tag: "Tendance" },
        { title: "Dépose douce & soin fortifiant", query: "depose soin fortifiant", tag: "Soin" },
        { title: "Beauté des pieds spa & gommage", query: "beaute des pieds spa", tag: "Rituel" },
      ],
      col2: [
        { title: "French manucure contemporaine", query: "french manucure", tag: "Classique" },
        { title: "Rallongement gel porcelaine", query: "gel porcelaine", tag: "Extension" },
        { title: "Soin des cuticules à l'huile végétale", query: "soin cuticules", tag: "Bio" },
        { title: "Pédicure relaxante aux sels marins", query: "pedicure relaxante", tag: "Spa" },
        { title: "Vernis classique vegan longue tenue", query: "vernis vegan", tag: "Clean" },
      ],
    },
    guide: {
      mainTitle: "Entretenir ses mains et ses pieds au quotidien",
      intro: "Un accompagnement professionnel régulier protège vos ongles et revitalise vos extrémités.",
      sections: [
        {
          title: "Un rituel de santé préventif",
          content: "Une manucure experte régénère les cuticules, nourrit la plaque unguéale et stimule la microcirculation pour des ongles durablement forts.",
        },
        {
          title: "Soin des pieds & délassement",
          content: "Un protocole spa élimine les callosités et dénoue instantanément les tensions musculaires pour une sensation de légèreté immédiate.",
        },
      ],
    },
    pro: {
      title: "Vous dirigez un nail bar d'exception ?",
      description: "Rejoignez Belora Pro pour attirer une clientèle locale et internationale sans commissions abusives.",
      ctaText: "Rejoindre Belora Pro",
      ctaHref: "/pro",
      image: "/images/editorial/pro-nails.jpg",
      imageAlt: "Gérante d'institut de beauté utilisant l'espace Belora Pro",
    },
  },
  hair: {
    id: "hair",
    slug: "hair",
    name: "Coiffure & Coloration",
    shortName: "Coiffure",
    eyebrow: "Artisanat capillaire",
    titlePrefix: "Réserver en ligne un rendez-vous",
    titleHighlight: "chez un artisan coiffeur d'auteur.",
    heroTitle: "Réserver en ligne un RDV chez un artisan coiffeur",
    heroSubtitle: "Salons d'auteur, coloristes experts et maîtres coupeurs dans les capitales mondiales.",
    heroImage: "/images/heroes/hero-hair.jpg",
    searchPlaceholder: "Balayage minéral, coupe à sec, couleur végétale...",
    cities: INTERNATIONAL_CITIES_GLOBAL,
    pillars: [
      {
        num: "01",
        title: "Coupe sur cheveux secs",
        description: "Respect absolu du tombant naturel et de la morphologie propre à chaque visage.",
      },
      {
        num: "02",
        title: "Pigments botaniques",
        description: "Colorations végétales et balayages minéraux préservant la fibre capillaire.",
      },
      {
        num: "03",
        title: "Espaces confidentiels",
        description: "Des salons feutrés et calmes dédiés à un diagnostic personnalisé sans précipitation.",
      },
    ],
    story: {
      title: "Le cheveu vivant, l'artisanat de la coupe.",
      lead: "Loin des chaînes, nos maîtres coiffeurs partenaires réinventent la coiffure sur-mesure.",
      paragraphs: [
        "Chaque coupe est sculptée sur chevelure sèche pour anticiper le mouvement naturel. Les colorations aux poudres botaniques illuminent les reflets sans altérer la fibre.",
      ],
      image: "/images/editorial/hair-detail.jpg",
      imageAlt: "Coupe artisanale et coiffure de précision",
      caption: "Harmonie des volumes et éclat naturel",
    },
    frequentSearches: {
      col1: [
        { title: "Balayage minéral & reflets naturels", query: "balayage mineral", tag: "Lumière" },
        { title: "Coupe sur cheveux secs sur-mesure", query: "coupe cheveux secs", tag: "Signature" },
        { title: "Coloration végétale 100% bio", query: "coloration vegetale", tag: "Bio" },
        { title: "Soin botox capillaire restructurant", query: "soin botox capillaire", tag: "Réparation" },
        { title: "Lissage doux aux acides aminés", query: "lissage doux", tag: "Lissage" },
      ],
      col2: [
        { title: "Diagnostic morphologique & conseil", query: "diagnostic morphologique", tag: "Visage" },
        { title: "Détox du cuir chevelu & gommage", query: "detox cuir chevelu", tag: "Détox" },
        { title: "Patine brillance & gloss éclat", query: "patine gloss", tag: "Éclat" },
        { title: "Brushing sculpté longue durée", query: "brushing sculpte", tag: "Volume" },
        { title: "Coiffure mariage & chignon d'art", query: "chignon mariage", tag: "Mariage" },
      ],
    },
    guide: {
      mainTitle: "L'approche d'un maître coiffeur partenaire",
      intro: "Découvrez pourquoi une coupe d'auteur sculptée sur-mesure change durablement votre quotidien.",
      sections: [
        {
          title: "Diagnostic morphologique complet",
          content: "L'artisan analyse l'état du cuir chevelu, la porosité de la tige et l'implantation naturelle avant d'engager le moindre rituel.",
        },
        {
          title: "Coupe sculptée fluide et naturelle",
          content: "Une coupe réussie s'adapte au mouvement naturel et se recoiffe sans effort au saut du lit.",
        },
      ],
    },
    pro: {
      title: "Vous dirigez un salon de coiffure d'exception ?",
      description: "Valorisez vos créations et vos coloristes auprès d'une communauté sensible à l'excellence.",
      ctaText: "Rejoindre Belora Pro",
      ctaHref: "/pro",
      image: "/images/editorial/pro-hair.jpg",
      imageAlt: "Responsable de salon gérant ses rendez-vous sur Belora Pro",
    },
  },
  facial: {
    id: "facial",
    slug: "facial",
    name: "Soins Visage & Esthétique",
    shortName: "Esthétique",
    eyebrow: "Dermo-esthétique holistique",
    titlePrefix: "Réserver en ligne un rituel",
    titleHighlight: "de soin visage & dermo-esthétique.",
    heroTitle: "Réserver en ligne un soin du visage d'exception",
    heroSubtitle: "Instituts de prestige, praticiennes facialistes et rituels sur-mesure pour sublimer votre peau.",
    heroImage: "/images/heroes/hero-facial.jpg",
    searchPlaceholder: "Kobido, soin régénérant, drainage lymphatique...",
    cities: INTERNATIONAL_CITIES_GLOBAL,
    pillars: [
      {
        num: "01",
        title: "Gestuelle facialiste",
        description: "Lifting manuel ancestral Kobido pour stimuler naturellement l'élastine et le collagène.",
      },
      {
        num: "02",
        title: "Actifs purs concentrés",
        description: "Sérums botaniques et antioxydants précieux certifiés sans agents occlusifs.",
      },
      {
        num: "03",
        title: "Diagnostic cutané",
        description: "Analyse personnalisée des besoins saisonniers et du film hydrolipidique.",
      },
    ],
    story: {
      title: "L'éclat natif, la science du soin facialiste.",
      lead: "Les protocoles contemporains unissent gestuelle manuelle millénaire et dermo-esthétique non invasive.",
      paragraphs: [
        "Du massage Kobido japonais au drainage Gua Sha, nos praticiennes certifiées sculptent les contours du visage et réveillent l'éclat cellulaire en profondeur.",
      ],
      image: "/images/editorial/facial-detail.jpg",
      imageAlt: "Soin du visage apaisant et rituel facialiste",
      caption: "Gestuelle experte et actifs purs",
    },
    frequentSearches: {
      col1: [
        { title: "Massage facialiste Kobido liftant", query: "kobido", tag: "Japon" },
        { title: "Soin purifiant & éclat profond", query: "soin purifiant", tag: "Éclat" },
        { title: "Drainage lymphatique du visage", query: "drainage lymphatique visage", tag: "Détox" },
        { title: "Gua Sha & quartz de massage", query: "gua sha", tag: "Holistique" },
        { title: "Épilation au fil des sourcils", query: "epilation au fil", tag: "Ligne" },
      ],
      col2: [
        { title: "Peeling doux aux acides de fruits", query: "peeling doux", tag: "Régénération" },
        { title: "Soin anti-âge cryo tenseur", query: "soin anti age", tag: "Tenseur" },
        { title: "Rehaussement de cils & teinture végétale", query: "rehaussement cils", tag: "Regard" },
        { title: "Micro-hydratation & masque collagène", query: "masque collagene", tag: "Hydratation" },
        { title: "Restructuration architecturale du sourcil", query: "restructuration sourcils", tag: "Sourcils" },
      ],
    },
    guide: {
      mainTitle: "Intégrer un soin du visage dans votre routine",
      intro: "Face au stress et à la pollution urbaine, un rituel facialiste régulier restaure l'équilibre cutané.",
      sections: [
        {
          title: "Stimuler les fibroblastes en profondeur",
          content: "Le remodelage facialiste réactive la production naturelle de collagène pour un galbe tonifié et des traits défatigués.",
        },
        {
          title: "Protéger la barrière cutanée",
          content: "L'application d'actifs purs renforce le film hydrolipidique et prévient les rougeurs et la déshydratation.",
        },
      ],
    },
    pro: {
      title: "Vous dirigez un institut de soin ou clinique esthétique ?",
      description: "Offrez à vos rituels dermo-esthétiques une visibilité de prestige auprès d'une clientèle ciblée.",
      ctaText: "Rejoindre Belora Pro",
      ctaHref: "/pro",
      image: "/images/editorial/pro-facial.jpg",
      imageAlt: "Praticienne en institut utilisant les outils Belora Pro",
    },
  },
  massage: {
    id: "massage",
    slug: "massage",
    name: "Massages & Rituels Corps",
    shortName: "Massages",
    eyebrow: "Parenthèse de sérénité",
    titlePrefix: "Réserver en ligne une séance",
    titleHighlight: "de massage relaxant & sanctuaires spa.",
    heroTitle: "Réserver en ligne une séance de massage bien-être",
    heroSubtitle: "Havres de calme, spas thermaux et praticiens certifiés dans les métropoles du monde entier.",
    heroImage: "/images/heroes/hero-massage.jpg",
    searchPlaceholder: "Deep tissue, massage californien, rituel ayurvédique...",
    cities: INTERNATIONAL_CITIES_GLOBAL,
    pillars: [
      {
        num: "01",
        title: "Relâchement musculaire",
        description: "Pressions ciblées sur les fascias et méridiens pour dénouer le dos et la nuque.",
      },
      {
        num: "02",
        title: "Huiles pures tiédies",
        description: "Extraits botaniques pressés à froid et huiles essentielles apaisantes.",
      },
      {
        num: "03",
        title: "Sanctuaire feutré",
        description: "Espaces insonorisés à température enveloppante pour une déconnexion totale.",
      },
    ],
    story: {
      title: "L'apaisement des sens, l'harmonie du corps.",
      lead: "Dans un quotidien hyperactif, le massage corps s'impose comme une nécessité physiologique essentielle.",
      paragraphs: [
        "Dans des bulles préservées du tumulte urbain, nos praticiens certifiés allient pressions musculaires décontracturantes et huiles chaudes pour apaiser le système nerveux.",
      ],
      image: "/images/editorial/massage-detail.jpg",
      imageAlt: "Séance de massage relaxant dans un spa épuré",
      caption: "Décompression musculaire et sérénité",
    },
    frequentSearches: {
      col1: [
        { title: "Massage Californien relaxant", query: "massage californien", tag: "Relaxation" },
        { title: "Rituel Deep Tissue décontracturant", query: "deep tissue", tag: "Musculaire" },
        { title: "Drainage lymphatique bien-être", query: "drainage lymphatique", tag: "Légèreté" },
        { title: "Massage ayurvédique aux huiles tièdes", query: "massage ayurvedique", tag: "Énergie" },
        { title: "Hammam privé & gommage doux", query: "hammam gommage", tag: "Thermal" },
      ],
      col2: [
        { title: "Massage aux pierres de basalte chaudes", query: "pierres chaudes", tag: "Chaleur" },
        { title: "Shiatsu traditionnel sur futon", query: "shiatsu", tag: "Japon" },
        { title: "Massage Thaïlandais d'étirements", query: "massage thai", tag: "Posture" },
        { title: "Massage prénatal femme enceinte", query: "massage prenatal", tag: "Maternité" },
        { title: "Réflexologie plantaire ciblée", query: "reflexologie", tag: "Pieds" },
      ],
    },
    guide: {
      mainTitle: "Les bienfaits physiologiques du massage régulier",
      intro: "Au-delà de la relaxation, les vertus du massage sur la vitalité sont scientifiquement établies.",
      sections: [
        {
          title: "Décompression posturale immédiate",
          content: "Le relâchement des fascias libère les raideurs dorsales causées par les longues heures passées devant les écrans.",
        },
        {
          title: "Baisse du cortisol & sommeil réparateur",
          content: "En stimulant la libération d'endorphines, le massage favorise un endormissement paisible et un repos profond.",
        },
      ],
    },
    pro: {
      title: "Vous êtes praticien indépendant ou gérant de spa ?",
      description: "Optimisez votre planning et fidélisez une clientèle en quête de ressourcement haut de gamme.",
      ctaText: "Rejoindre Belora Pro",
      ctaHref: "/pro",
      image: "/images/editorial/pro-massage.jpg",
      imageAlt: "Espace spa partenaire Belora Pro",
    },
  },
  barber: {
    id: "barber",
    slug: "barber",
    name: "Barbier & Soins Homme",
    shortName: "Barbier",
    eyebrow: "Tradition & modernité",
    titlePrefix: "Réserver en ligne chez un barbier",
    titleHighlight: "de tradition & taille de barbe sur-mesure.",
    heroTitle: "Réserver en ligne chez un barbier traditionnel d'exception",
    heroSubtitle: "Barbiers de métier, rasage rituel au coupe-choux et soins masculins sur-mesure.",
    heroImage: "/images/heroes/hero-barber.jpg",
    searchPlaceholder: "Taille de barbe, rasage traditionnel, dégradé...",
    cities: INTERNATIONAL_CITIES_GLOBAL,
    pillars: [
      {
        num: "01",
        title: "Rasage rituel d'antan",
        description: "Serviettes chaudes à l'eucalyptus, mousse au blaireau et passage précis du coupe-choux.",
      },
      {
        num: "02",
        title: "Tracé morphologique",
        description: "Alignement net des joues et du cou pour structurer la mâchoire et valoriser le visage.",
      },
      {
        num: "03",
        title: "Soins de l'épiderme",
        description: "Vapeur ozonée et huiles de cèdre bio pour nourrir le poil et apaiser le feu du rasoir.",
      },
    ],
    story: {
      title: "La tradition du rasoir, le grooming contemporain.",
      lead: "Le barbershop moderne s'est réinventé comme un club intime alliant précision et savoir-faire.",
      paragraphs: [
        "Entre serviettes chaudes apaisantes et passage millimétré de la lame, nos barbiers d'art sculptent les volumes de votre barbe en accord parfait avec votre morphologie.",
      ],
      image: "/images/editorial/barber-detail.jpg",
      imageAlt: "Rituel de rasage traditionnel chez un barbier",
      caption: "Noblesse du geste et netteté du tracé",
    },
    frequentSearches: {
      col1: [
        { title: "Taille de barbe au coupe-choux", query: "taille de barbe", tag: "Tradition" },
        { title: "Rasage complet à la serviette chaude", query: "rasage traditionnel", tag: "Rituel" },
        { title: "Coupe homme sculptée aux ciseaux", query: "coupe homme ciseaux", tag: "Classique" },
        { title: "Dégradé à blanc américain moderne", query: "degrade americain", tag: "Tendance" },
        { title: "Soin vapeur & masque purifiant", query: "soin vapeur barbe", tag: "Peau" },
      ],
      col2: [
        { title: "Camouflage subtil des poils blancs", query: "teinture barbe", tag: "Naturel" },
        { title: "Contours précis à la cire tiède", query: "contours barbe", tag: "Net" },
        { title: "Massage crânien énergisant", query: "massage cranien homme", tag: "Détente" },
        { title: "Taille de moustache sur-mesure", query: "taille moustache", tag: "Style" },
        { title: "Soin anti-poils incarnés & apaisant", query: "soin anti poils incarnes", tag: "Confort" },
      ],
    },
    guide: {
      mainTitle: "Pourquoi confier sa barbe à un maître barbier ?",
      intro: "Une barbe structurée par un professionnel affirme vos traits tout en protégeant votre peau.",
      sections: [
        {
          title: "Tracé morphologique adapté",
          content: "L'artisan ajuste la hauteur des lignes pour allonger ou adoucir le visage selon sa structure osseuse.",
        },
        {
          title: "Protection contre les irritations",
          content: "L'application de compresses chaudes et d'huiles pré-rasage prévient le feu du rasoir et les rougeurs.",
        },
      ],
    },
    pro: {
      title: "Vous possédez un barbershop de renom ?",
      description: "Rejoignez le réseau Belora pour accueillir une clientèle fidèle locale et voyageuse.",
      ctaText: "Rejoindre Belora Pro",
      ctaHref: "/pro",
      image: "/images/editorial/pro-barber.jpg",
      imageAlt: "Barbier professionnel utilisant l'application Belora Pro",
    },
  },
  home: {
    id: "home",
    slug: "home",
    name: "Prestations à Domicile",
    shortName: "À domicile",
    eyebrow: "Privilège privé",
    titlePrefix: "Réserver une prestation sur-mesure",
    titleHighlight: "dans l'intimité de votre intérieur.",
    heroTitle: "Réserver une prestation de beauté chez vous",
    heroSubtitle: "Des artisans d'exception qui se déplacent chez vous, à l'hôtel ou sur votre lieu de séjour.",
    heroImage: "/images/heroes/hero-home.jpg",
    searchPlaceholder: "Coiffure privée, manucure à domicile, massage spa...",
    cities: INTERNATIONAL_CITIES_GLOBAL,
    pillars: [
      {
        num: "01",
        title: "Matériel autonome",
        description: "Tables ergonomiques pliantes et linge stérile sans encombrer votre intérieur.",
      },
      {
        num: "02",
        title: "Ponctualité & discrétion",
        description: "Artisans audités pour leur courtoisie et le respect rigoureux de votre intimité.",
      },
      {
        num: "03",
        title: "Sérénité sans transport",
        description: "Prolongez immédiatement les bienfaits du soin sans le stress des déplacements urbains.",
      },
    ],
    story: {
      title: "Le confort privé, l'exigence d'un grand salon.",
      lead: "Profitez d'un soin d'exception dans la sérénité et le calme de votre espace personnel.",
      paragraphs: [
        "Nos praticiens itinérants arrivent équipés d'un matériel professionnel complet pour recréer l'expérience d'un grand salon ou spa directement chez vous.",
      ],
      image: "/images/editorial/home-detail.jpg",
      imageAlt: "Praticienne préparant un rituel de beauté à domicile",
      caption: "L'excellence des soins chez vous",
    },
    frequentSearches: {
      col1: [
        { title: "Coiffure événementielle & brushing privé", query: "coiffure a domicile", tag: "Privé" },
        { title: "Manucure & pédicure spa à domicile", query: "manucure a domicile", tag: "Mains" },
        { title: "Massage californien sur table pliante", query: "massage a domicile", tag: "Détente" },
        { title: "Maquillage cocktail & soirée privé", query: "maquillage a domicile", tag: "Soirée" },
        { title: "Épilation douce à domicile", query: "epilation a domicile", tag: "Douceur" },
      ],
      col2: [
        { title: "Soin visage régénérant chez soi", query: "soin visage a domicile", tag: "Visage" },
        { title: "Rituel barbier complet à domicile", query: "barbier a domicile", tag: "Barbe" },
        { title: "Coiffure mariée avec essai privé", query: "coiffure mariee domicile", tag: "Mariage" },
        { title: "Massage duo relaxant à domicile", query: "massage duo domicile", tag: "Duo" },
        { title: "Forfait bien-être demi-journée", query: "forfait bien etre domicile", tag: "Exclusif" },
      ],
    },
    guide: {
      mainTitle: "Une prestation privée d'exception chez vous",
      intro: "Une expérience fluide et sans contrainte organisée selon les standards des conciergeries haut de gamme.",
      sections: [
        {
          title: "Installation autonome et soignée",
          content: "L'artisan installe son matériel en quelques minutes et laisse votre intérieur parfaitement impeccable.",
        },
        {
          title: "Sérénité et gain de temps",
          content: "Profitez pleinement de votre rituel sans transport ni attente, au rythme qui vous correspond.",
        },
      ],
    },
    pro: {
      title: "Vous êtes artisan ou praticien mobile ?",
      description: "Organisez vos déplacements avec notre agenda intelligent et touchez une clientèle privée exigeante.",
      ctaText: "Rejoindre Belora Pro",
      ctaHref: "/pro",
      image: "/images/editorial/pro-home.jpg",
      imageAlt: "Praticien itinérant planifiant ses déplacements sur Belora Pro",
    },
  },
};
