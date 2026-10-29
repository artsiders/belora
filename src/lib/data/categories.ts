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
}

export interface CategoryData {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  cities: InternationalCity[];
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
  nails: {
    id: "nails",
    slug: "nails",
    name: "Onglerie & Manucure",
    shortName: "Manucure",
    eyebrow: "Soin des mains & pieds",
    heroTitle: "Réserver en ligne un RDV pour une manucure",
    heroSubtitle: "Des bars à ongles de prestige et des artisans prothésistes certifiés au cœur des plus grandes capitales.",
    searchPlaceholder: "Manucure russe, vernis semi-permanent, nail art...",
    cities: INTERNATIONAL_CITIES_GLOBAL,
    story: {
      title: "L'explosion des nail bars contemporains",
      lead: "Autrefois confinée aux salons généralistes, la manucure s'est élevée au rang d'art minutieux et de rituel d'estime de soi incontournable.",
      paragraphs: [
        "Aujourd'hui, les studios d'onglerie allient précision architecturale, protocoles d'hygiène stricts et design créatif sur-mesure. De Paris à Séoul, en passant par Manhattan, les créateurs réinventent l'art de sublimer l'ongle tout en préservant son intégrité biologique.",
        "Les techniques modernes privilégient désormais des vernis bio-sourcés, des formules sans perturbateurs endocriniens et des soins fortifiants à la kératine pure pour des mains durablement impeccables.",
      ],
      image: "/images/editorial/nails-detail.jpg",
      imageAlt: "Geste précis de manucure et soin des cuticules en atelier",
      caption: "L'art du détail et de la précision gestuelle",
    },
    frequentSearches: {
      col1: [
        { title: "Manucure russe sans cuticules", query: "manucure russe" },
        { title: "Pose de vernis semi-permanent", query: "vernis semi-permanent" },
        { title: "Nail art graphique & minimaliste", query: "nail art" },
        { title: "Dépose douce & soin fortifiant", query: "depose soin fortifiant" },
        { title: "Beauté des pieds spa & gommage", query: "beaute des pieds spa" },
      ],
      col2: [
        { title: "French manucure contemporaine", query: "french manucure" },
        { title: "Rallongement gel porcelaine", query: "gel porcelaine" },
        { title: "Soin des cuticules à l'huile végétale", query: "soin cuticules" },
        { title: "Pédicure relaxante aux sels marins", query: "pedicure relaxante" },
        { title: "Vernis classique vegan longue tenue", query: "vernis vegan" },
      ],
    },
    guide: {
      mainTitle: "Pourquoi faut-il entretenir ses mains et ses pieds ?",
      intro: "Vos mains et vos pieds sont vos ambassadeurs au quotidien. Découvrez pourquoi un accompagnement professionnel régulier fait toute la différence.",
      sections: [
        {
          title: "La manucure : un rituel de santé avant d'être esthétique",
          content: "Constamment exposées aux agressions climatiques, aux lavages répétés et aux produits ménagers, les mains subissent un vieillissement prématuré. Une manucure soignée ne se limite pas à l'application d'une couleur : elle régénère les cuticules, équilibre l'hydratation de la plaque unguéale et stimule la microcirculation pour des ongles plus robustes.",
        },
        {
          title: "Le soin des pieds : légèreté et bien-être global",
          content: "Soutenant l'ensemble de notre posture corporelle, les pieds méritent une attention experte. Un protocole spa professionnel prévient les callosités et les tensions musculaires, tout en réactivant la circulation lymphatique pour une sensation de légèreté immédiate et durable.",
        },
      ],
    },
    pro: {
      title: "Vous êtes gérant d'un salon de manucure ou d'un nail bar ?",
      description: "Rejoignez la communauté Belora et mettez votre savoir-faire en valeur auprès d'une clientèle locale et internationale à la recherche d'adresses d'exception.",
      ctaText: "Rejoindre Belora Pro",
      ctaHref: "/pro",
      image: "/images/editorial/pro-manager.jpg",
      imageAlt: "Gérante d'institut de beauté utilisant l'espace Belora Pro",
    },
  },
  hair: {
    id: "hair",
    slug: "hair",
    name: "Coiffure & Coloration",
    shortName: "Coiffure",
    eyebrow: "Artisanat capillaire",
    heroTitle: "Réserver en ligne un RDV chez un artisan coiffeur",
    heroSubtitle: "Salons d'auteur, coloristes experts et maîtres coupeurs dans les métropoles les plus inspirantes.",
    searchPlaceholder: "Balayage minéral, coupe à sec, couleur végétale...",
    cities: INTERNATIONAL_CITIES_GLOBAL,
    story: {
      title: "Le renouveau de la coiffure d'auteur et végétale",
      lead: "Loin des chaînes standardisées, la coiffure retrouve sa noblesse artisanale grâce à des rituels sur-mesure et respectueux de la fibre.",
      paragraphs: [
        "Les coiffeurs d'auteur contemporains considèrent chaque chevelure comme une matière vivante unique. La coupe sur cheveux secs permet d'anticiper le tombant naturel, tandis que la coloration aux poudres de plantes et aux pigments minéraux illumine les reflets sans altérer la kératine.",
        "Entre Paris, Milan et Tokyo, les ateliers sélectionnés par Belora privilégient le diagnostic personnalisé et l'écoute approfondie dans des espaces calmes et feutrés.",
      ],
      image: "/images/editorial/hair-detail.jpg",
      imageAlt: "Coupe artisanale et coiffure de précision",
      caption: "Respect de la fibre et harmonie des volumes",
    },
    frequentSearches: {
      col1: [
        { title: "Balayage minéral & reflets naturels", query: "balayage mineral" },
        { title: "Coupe sur cheveux secs sur-mesure", query: "coupe cheveux secs" },
        { title: "Coloration végétale 100% bio", query: "coloration vegetale" },
        { title: "Soin botox capillaire restructurant", query: "soin botox capillaire" },
        { title: "Lissage doux aux acides aminés", query: "lissage doux" },
      ],
      col2: [
        { title: "Diagnostic morphologique & conseil", query: "diagnostic morphologique" },
        { title: "Détox du cuir chevelu & gommage", query: "detox cuir chevelu" },
        { title: "Patine brillance & gloss éclat", query: "patine gloss" },
        { title: "Brushing sculpté longue durée", query: "brushing sculpte" },
        { title: "Coiffure mariage & chignon d'art", query: "chignon mariage" },
      ],
    },
    guide: {
      mainTitle: "Pourquoi confier ses cheveux à un artisan coiffeur ?",
      intro: "La beauté d'une coupe réside dans son équilibre avec vos traits et votre style de vie. Découvrez l'approche des maîtres coiffeurs partenaires.",
      sections: [
        {
          title: "La santé du cheveu avant la transformation",
          content: "Un maître coiffeur analyse l'état de votre cuir chevelu, la porosité de la tige et l'historique de vos colorations avant d'engager le moindre protocole. Cette exigence garantit un résultat pérenne et une repousse fluide.",
        },
        {
          title: "L'art de la coupe personnalisée",
          content: "Une coupe réussie s'adapte à vos mouvements naturels et ne réclame pas des heures de coiffage le matin. Elle sublime l'ovale du visage tout en respectant l'implantation des épis.",
        },
      ],
    },
    pro: {
      title: "Vous dirigez un salon de coiffure d'exception ?",
      description: "Valorisez vos créations, votre équipe et vos rituels exclusifs auprès d'une communauté sensible à l'excellence artisanale.",
      ctaText: "Rejoindre Belora Pro",
      ctaHref: "/pro",
      image: "/images/editorial/pro-manager.jpg",
      imageAlt: "Responsable de salon gérant ses rendez-vous sur Belora Pro",
    },
  },
  facial: {
    id: "facial",
    slug: "facial",
    name: "Soins Visage & Esthétique",
    shortName: "Esthétique",
    eyebrow: "Dermo-esthétique holistique",
    heroTitle: "Réserver en ligne un soin du visage d'exception",
    heroSubtitle: "Instituts haut de gamme, praticiennes facialistes et protocoles sur-mesure pour sublimer votre peau.",
    searchPlaceholder: "Kobido, soin régénérant, drainage lymphatique...",
    cities: INTERNATIONAL_CITIES_GLOBAL,
    story: {
      title: "L'avènement des rituels holistiques et de la clean beauty",
      lead: "Les protocoles contemporains conjuguent techniques manuelles millénaires et technologies non invasives de pointe.",
      paragraphs: [
        "Le massage facialiste Kobido japonais, le drainage lymphatique doux et l'usage de pierres semi-précieuses comme le Gua Sha permettent de sculpter l'ovale du visage et d'oxygéner les tissus en profondeur.",
        "Associés à des sérums aux actifs botaniques concentrés, ces rituels redonnent à la peau son éclat natif sans agression chimique, pour un effet liftant naturel et durable.",
      ],
      image: "/images/editorial/facial-detail.jpg",
      imageAlt: "Soin du visage apaisant et rituel facialiste",
      caption: "L'alliance de la gestuelle experte et des actifs purs",
    },
    frequentSearches: {
      col1: [
        { title: "Massage facialiste Kobido liftant", query: "kobido" },
        { title: "Soin purifiant & éclat profond", query: "soin purifiant" },
        { title: "Drainage lymphatique du visage", query: "drainage lymphatique visage" },
        { title: "Gua Sha & quartz de massage", query: "gua sha" },
        { title: "Épilation au fil des sourcils", query: "epilation au fil" },
      ],
      col2: [
        { title: "Peeling doux aux acides de fruits", query: "peeling doux" },
        { title: "Soin anti-âge cryo tenseur", query: "soin anti age" },
        { title: "Rehaussement de cils & teinture végétale", query: "rehaussement cils" },
        { title: "Micro-hydratation & masque collagène", query: "masque collagene" },
        { title: "Restructuration architecturale du sourcil", query: "restructuration sourcils" },
      ],
    },
    guide: {
      mainTitle: "Pourquoi intégrer un soin du visage dans votre routine ?",
      intro: "La peau du visage réagit aux variations de saisons, au stress urbain et à la fatigue. Un accompagnement expert restaure son équilibre.",
      sections: [
        {
          title: "Stimuler le renouvellement cellulaire profond",
          content: "Les manœuvres facialistes expertes stimulent les fibroblastes, favorisant la production naturelle d'élastine et de collagène pour une peau visiblement repulpée et lumineuse.",
        },
        {
          title: "Protéger la barrière cutanée",
          content: "L'application de soins professionnels adaptés renforce le film hydrolipidique et prévient les rougeurs, la déshydratation et l'oxydation causées par la pollution urbaine.",
        },
      ],
    },
    pro: {
      title: "Vous dirigez un institut de soin ou une clinique esthétique ?",
      description: "Donnez à vos rituels dermo-esthétiques la vitrine qu'ils méritent et développez votre clientèle haut de gamme sans effort.",
      ctaText: "Rejoindre Belora Pro",
      ctaHref: "/pro",
      image: "/images/editorial/pro-manager.jpg",
      imageAlt: "Praticienne en institut utilisant les outils Belora Pro",
    },
  },
  massage: {
    id: "massage",
    slug: "massage",
    name: "Massages & Rituels Corps",
    shortName: "Massages",
    eyebrow: "Parenthèse de sérénité",
    heroTitle: "Réserver en ligne une séance de massage bien-être",
    heroSubtitle: "Havres de paix, spas thermaux et praticiens certifiés dans les métropoles du monde entier.",
    searchPlaceholder: "Deep tissue, massage californien, rituel ayurvédique...",
    cities: INTERNATIONAL_CITIES_GLOBAL,
    story: {
      title: "L'art du toucher thérapeutique et des sanctuaires urbains",
      lead: "Dans un quotidien hyperactif, le massage corps s'impose comme une nécessité physiologique et psychologique fondamentale.",
      paragraphs: [
        "Chaque geste, du pétrissage décontracturant à l'effleurage enveloppant, participe à rétablir l'équilibre du système nerveux autonome. Les huiles végétales pures pressées à froid infusent leurs bienfaits nourrissants pendant que l'esprit s'apaise.",
        "Les sanctuaires partenaires de Belora sont pensés comme des bulles hors du temps, où le silence, la température idéale et les senteurs boisées créent un cocon de déconnexion totale.",
      ],
      image: "/images/editorial/massage-detail.jpg",
      imageAlt: "Séance de massage relaxant dans un spa épuré",
      caption: "Relâchement musculaire et déconnexion sensorielle",
    },
    frequentSearches: {
      col1: [
        { title: "Massage Californien relaxant", query: "massage californien" },
        { title: "Rituel Deep Tissue décontracturant", query: "deep tissue" },
        { title: "Drainage lymphatique bien-être", query: "drainage lymphatique" },
        { title: "Massage ayurvédique aux huiles tièdes", query: "massage ayurvedique" },
        { title: "Hammam privé & gommage doux", query: "hammam gommage" },
      ],
      col2: [
        { title: "Massage aux pierres de basalte chaudes", query: "pierres chaudes" },
        { title: "Shiatsu traditionnel sur futon", query: "shiatsu" },
        { title: "Massage Thaïlandais d'étirements", query: "massage thai" },
        { title: "Massage prénatal femme enceinte", query: "massage prenatal" },
        { title: "Réflexologie plantaire ciblée", query: "reflexologie" },
      ],
    },
    guide: {
      mainTitle: "Comment le massage transforme votre vitalité ?",
      intro: "Au-delà du simple moment de détente, les bienfaits physiologiques d'un massage régulier sont scientifiquement reconnus.",
      sections: [
        {
          title: "Décompression musculaire et posture",
          content: "Le travail sur les fascias et les points de tension libère les raideurs dorsales et cervicales accumulées par les longues heures passées devant les écrans.",
        },
        {
          title: "Régulation du stress et sommeil réparateur",
          content: "En abaissant le taux de cortisol sanguin et en stimulant la libération d'endorphines, le massage favorise un endormissement paisible et un repos profond.",
        },
      ],
    },
    pro: {
      title: "Vous êtes praticien indépendant ou gérant de spa ?",
      description: "Proposez vos créneaux et accueillez des résidents et voyageurs internationaux désireux de s'offrir un moment de ressourcement d'exception.",
      ctaText: "Rejoindre Belora Pro",
      ctaHref: "/pro",
      image: "/images/editorial/pro-manager.jpg",
      imageAlt: "Espace spa partenaire Belora Pro",
    },
  },
  barber: {
    id: "barber",
    slug: "barber",
    name: "Barbier & Soins Homme",
    shortName: "Barbier",
    eyebrow: "Tradition & modernité",
    heroTitle: "Réserver en ligne chez un barbier traditionnel d'exception",
    heroSubtitle: "Barbiers de métier, coupe-choux traditionnels et soins masculins sur-mesure dans les grandes métropoles.",
    searchPlaceholder: "Taille de barbe, rasage traditionnel, dégradé...",
    cities: INTERNATIONAL_CITIES_GLOBAL,
    story: {
      title: "L'élégance du rasage à l'ancienne et le grooming contemporain",
      lead: "Le barbershop s'est réinventé comme un club intime où le soin au masculin s'exprime avec raffinement et précision.",
      paragraphs: [
        "Serviettes chaudes infusées à l'eucalyptus, mousse onctueuse montée au blaireau en poils naturels et passage millimétré de la lame : le rituel du rasage traditionnel offre un confort de peau incomparable.",
        "Les barbiers d'aujourd'hui complètent ce savoir-faire historique par des conseils d'entretien morphologique et des soins purifiants adaptés à la peau des hommes.",
      ],
      image: "/images/editorial/barber-detail.jpg",
      imageAlt: "Rituel de rasage traditionnel chez un barbier",
      caption: "La noblesse du geste et la précision du tracé",
    },
    frequentSearches: {
      col1: [
        { title: "Taille de barbe au coupe-choux", query: "taille de barbe" },
        { title: "Rasage complet à la serviette chaude", query: "rasage traditionnel" },
        { title: "Coupe homme sculptée aux ciseaux", query: "coupe homme ciseaux" },
        { title: "Dégradé à blanc américain moderne", query: "degrade americain" },
        { title: "Soin vapeur & masque purifiant", query: "soin vapeur barbe" },
      ],
      col2: [
        { title: "Camouflage subtil des poils blancs", query: "teinture barbe" },
        { title: "Contours précis à la cire tiède", query: "contours barbe" },
        { title: "Massage crânien énergisant", query: "massage cranien homme" },
        { title: "Taille de moustache sur-mesure", query: "taille moustache" },
        { title: "Soin anti-poils incarnés & apaisant", query: "soin anti poils incarnes" },
      ],
    },
    guide: {
      mainTitle: "Pourquoi confier l'entretien de sa barbe à un professionnel ?",
      intro: "Une barbe soignée reflète votre personnalité et sublime les lignes de votre mâchoire. L'expertise du barbier fait toute la différence.",
      sections: [
        {
          title: "Un tracé harmonieux avec la morphologie",
          content: "L'artisan barbier détermine la hauteur exacte des lignes de joues et du cou pour allonger ou adoucir le visage selon sa structure osseuse naturelle.",
        },
        {
          title: "Une peau protégée contre les irritations",
          content: "L'application des compresses chaudes et d'huiles pré-rasage protège l'épiderme du feu du rasoir et prévient l'apparition des rougeurs.",
        },
      ],
    },
    pro: {
      title: "Vous possédez un barbershop de renom ?",
      description: "Intégrez le réseau Belora et simplifiez la prise de rendez-vous pour votre clientèle fidèle comme pour les voyageurs de passage.",
      ctaText: "Rejoindre Belora Pro",
      ctaHref: "/pro",
      image: "/images/editorial/pro-manager.jpg",
      imageAlt: "Barbier professionnel utilisant l'application Belora Pro",
    },
  },
  home: {
    id: "home",
    slug: "home",
    name: "Prestations à Domicile",
    shortName: "À domicile",
    eyebrow: "Privilège privé",
    heroTitle: "Réserver une prestation de beauté & bien-être chez vous",
    heroSubtitle: "Des artisans et praticiens sélectionnés qui se déplacent chez vous, à l'hôtel ou sur votre lieu de séjour.",
    searchPlaceholder: "Coiffure privée, manucure à domicile, massage spa...",
    cities: INTERNATIONAL_CITIES_GLOBAL,
    story: {
      title: "Le confort absolu du service privé sur-mesure",
      lead: "Gagnez un temps précieux sans jamais renoncer au niveau d'exigence d'un grand salon.",
      paragraphs: [
        "Que vous soyez en déplacement professionnel, avec des enfants en bas âge ou simplement désireux de prolonger votre sérénité chez vous, les artisans mobiles Belora arrivent avec tout leur matériel professionnel d'exception.",
        "Chaque praticien est rigoureusement audité pour son professionnalisme, sa ponctualité et sa discrétion, assurant un moment de ressourcement dans l'intimité de votre intérieur.",
      ],
      image: "/images/heroes/hero-image.jpeg",
      imageAlt: "Praticienne préparant un rituel de beauté à domicile",
      caption: "L'excellence des soins dans l'intimité de votre espace",
    },
    frequentSearches: {
      col1: [
        { title: "Coiffure événementielle & brushing privé", query: "coiffure a domicile" },
        { title: "Manucure & pédicure spa à domicile", query: "manucure a domicile" },
        { title: "Massage californien sur table pliante", query: "massage a domicile" },
        { title: "Maquillage cocktail & soirée privé", query: "maquillage a domicile" },
        { title: "Épilation douce à domicile", query: "epilation a domicile" },
      ],
      col2: [
        { title: "Soin visage régénérant chez soi", query: "soin visage a domicile" },
        { title: "Rituel barbier complet à domicile", query: "barbier a domicile" },
        { title: "Coiffure mariée avec essai privé", query: "coiffure mariee domicile" },
        { title: "Massage duo relaxant à domicile", query: "massage duo domicile" },
        { title: "Forfait bien-être demi-journée", query: "forfait bien etre domicile" },
      ],
    },
    guide: {
      mainTitle: "Comment se déroule une prestation Belora à domicile ?",
      intro: "Une expérience fluide, sans stress et préparée avec le plus grand soin par des professionnels rodés aux standards de l'hôtellerie de luxe.",
      sections: [
        {
          title: "Un équipement autonome et complet",
          content: "L'artisan apporte serviettes stériles, table de massage professionnelle ou matériel de coiffure autonome, sans nécessiter d'installation complexe de votre part.",
        },
        {
          title: "Ponctualité et respect de votre intimité",
          content: "Nos partenaires s'engagent à respecter les horaires convenus et à laisser les lieux aussi impeccables qu'à leur arrivée.",
        },
      ],
    },
    pro: {
      title: "Vous êtes artisan indépendant ou praticien mobile ?",
      description: "Bénéficiez d'un agenda intelligent avec temps de trajet intégrés et touchez une clientèle qui valorise le service sur-mesure à sa juste valeur.",
      ctaText: "Rejoindre Belora Pro",
      ctaHref: "/pro",
      image: "/images/editorial/pro-manager.jpg",
      imageAlt: "Praticien itinérant planifiant ses déplacements sur Belora Pro",
    },
  },
};
