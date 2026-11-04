export interface ProEstablishment {
  id: string;
  name: string;
  slug: string;
  category: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  siret: string;
  vatNumber: string;
  description: string;
  depositPercentage: number;
  cancellationDelayHours: number;
  openingHours: {
    day: string;
    dayIndex: number;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  }[];
}

export interface ProStaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  color: string; // token accent
  active: boolean;
  presenceToday: {
    plannedStart: string;
    plannedEnd: string;
    clockedIn: boolean;
    clockInTime?: string;
    totalLogged: string;
  };
}

export interface ProResource {
  id: string;
  name: string;
  type: "cabin" | "chair" | "room";
  color: string;
  active: boolean;
}

export interface ProService {
  id: string;
  name: string;
  categoryId: string;
  durationMinutes: number;
  breakDurationMinutes?: number; // temps de pose libérant le praticien
  priceEuros: number;
  depositRequired: boolean;
  depositAmountEuros: number;
  assignedStaffIds: string[];
  requiredResourceId?: string;
  description: string;
}

export interface ProServiceCategory {
  id: string;
  name: string;
  order: number;
  colorIndicator: string;
}

export interface ProAppointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  resourceId?: string;
  resourceName?: string;
  date: string; // "2026-11-04"
  startTime: string; // "10:00"
  endTime: string; // "10:45"
  price: number;
  depositPaid: number;
  status: "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";
  isRecurring?: boolean;
  notes?: string;
}

export interface ProClient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  createdAt: string;
  lastVisit: string;
  totalVisits: number;
  totalSpent: number;
  isVip?: boolean;
  notes?: string;
  techSheet?: {
    hairType?: string;
    naturalBase?: string;
    sensitivities?: string;
    lastFormulas: {
      date: string;
      service: string;
      formula: string;
      leaveInTime: string;
      colorist: string;
    }[];
  };
}

export interface ProSaleTicket {
  id: string;
  date: string;
  time: string;
  clientId: string;
  clientName: string;
  staffId: string;
  staffName: string;
  appointmentId?: string;
  items: {
    title: string;
    type: "service" | "product";
    price: number;
    quantity: number;
  }[];
  depositDeducted: number;
  subtotalHt: number;
  vatAmount: number;
  totalTtc: number;
  paymentMethod: "card" | "cash" | "mixed" | "stripe";
  cardAmount?: number;
  cashAmount?: number;
}

// --------------------------------------------------------------------------
// MOCK DATA INITIALE
// --------------------------------------------------------------------------

export const MOCK_ESTABLISHMENT: ProEstablishment = {
  id: "est-1",
  name: "L’Atelier Botanique",
  slug: "atelier-botanique-paris",
  category: "Coiffure & Coloration Végétale",
  address: "18 Rue de Turenne",
  postalCode: "75003",
  city: "Paris",
  phone: "01 42 68 90 12",
  email: "contact@atelierbotanique-paris.fr",
  siret: "849 203 912 00018",
  vatNumber: "FR 82 849203912",
  description:
    "Maison d'artisan dédiée aux rituels végétaux, balayages minéraux et coupes à sec respectueuses de la matière.",
  depositPercentage: 30,
  cancellationDelayHours: 24,
  openingHours: [
    {
      day: "Lundi",
      dayIndex: 1,
      isOpen: false,
      openTime: "09:00",
      closeTime: "19:00",
    },
    {
      day: "Mardi",
      dayIndex: 2,
      isOpen: true,
      openTime: "09:30",
      closeTime: "19:30",
    },
    {
      day: "Mercredi",
      dayIndex: 3,
      isOpen: true,
      openTime: "09:30",
      closeTime: "19:30",
    },
    {
      day: "Jeudi",
      dayIndex: 4,
      isOpen: true,
      openTime: "09:30",
      closeTime: "20:00",
    },
    {
      day: "Vendredi",
      dayIndex: 5,
      isOpen: true,
      openTime: "09:30",
      closeTime: "20:00",
    },
    {
      day: "Samedi",
      dayIndex: 6,
      isOpen: true,
      openTime: "09:00",
      closeTime: "19:00",
    },
    {
      day: "Dimanche",
      dayIndex: 0,
      isOpen: false,
      openTime: "10:00",
      closeTime: "18:00",
    },
  ],
};

export const MOCK_STAFF: ProStaffMember[] = [
  {
    id: "staff-1",
    name: "Hélène de Valois",
    role: "Artisan Coloriste & Fondatrice",
    email: "helene@atelierbotanique.fr",
    phone: "06 12 34 56 01",
    avatar: "/images/artisans/artisan-1.jpg",
    color: "#82385a", // Figue
    active: true,
    presenceToday: {
      plannedStart: "09:30",
      plannedEnd: "19:30",
      clockedIn: true,
      clockInTime: "09:22",
      totalLogged: "05:40 / 10:00",
    },
  },
  {
    id: "staff-2",
    name: "Clément Roux",
    role: "Maître Coiffeur Créateur",
    email: "clement@atelierbotanique.fr",
    phone: "06 12 34 56 02",
    avatar: "/images/artisans/artisan-2.jpg",
    color: "#27272a", // Noir zinc
    active: true,
    presenceToday: {
      plannedStart: "10:00",
      plannedEnd: "19:30",
      clockedIn: true,
      clockInTime: "09:55",
      totalLogged: "05:10 / 09:30",
    },
  },
  {
    id: "staff-3",
    name: "Élodie Martin",
    role: "Praticienne & Soins Holistiques",
    email: "elodie@atelierbotanique.fr",
    phone: "06 12 34 56 03",
    avatar: "/images/artisans/artisan-3.jpg",
    color: "#a04f6d", // Figue claire
    active: true,
    presenceToday: {
      plannedStart: "10:00",
      plannedEnd: "18:00",
      clockedIn: true,
      clockInTime: "09:50",
      totalLogged: "05:15 / 08:00",
    },
  },
  {
    id: "staff-4",
    name: "Thomas Mercier",
    role: "Coloriste Junior",
    email: "thomas@atelierbotanique.fr",
    phone: "06 12 34 56 04",
    avatar: "/images/artisans/artisan-1.jpg",
    color: "#52525b", // Gris zinc
    active: true,
    presenceToday: {
      plannedStart: "11:00",
      plannedEnd: "20:00",
      clockedIn: false,
      totalLogged: "00:00 / 09:00",
    },
  },
];

export const MOCK_RESOURCES: ProResource[] = [
  {
    id: "res-1",
    name: "Fauteuil Coupe 1 (Belza)",
    type: "chair",
    color: "#71717a",
    active: true,
  },
  {
    id: "res-2",
    name: "Fauteuil Coloration 2 (Monoï)",
    type: "chair",
    color: "#a1a1aa",
    active: true,
  },
  {
    id: "res-3",
    name: "Cabine Sérénité (Milady)",
    type: "cabin",
    color: "#d4d4d8",
    active: true,
  },
];

export const MOCK_CATEGORIES: ProServiceCategory[] = [
  {
    id: "cat-1",
    name: "Les Incontournables",
    order: 1,
    colorIndicator: "border-l-primary-600",
  },
  {
    id: "cat-2",
    name: "Coloration Végétale & Balayage",
    order: 2,
    colorIndicator: "border-l-neutral-800",
  },
  {
    id: "cat-3",
    name: "Rituels Soins & Massages",
    order: 3,
    colorIndicator: "border-l-primary-400",
  },
];

export const MOCK_SERVICES: ProService[] = [
  // Les Incontournables
  {
    id: "srv-1",
    name: "Shampoing + Coupe + Coiffage Signature",
    categoryId: "cat-1",
    durationMinutes: 45,
    priceEuros: 50,
    depositRequired: true,
    depositAmountEuros: 15,
    assignedStaffIds: ["staff-1", "staff-2", "staff-4"],
    requiredResourceId: "res-1",
    description:
      "Diagnostic morphologique, lavage aux poudres ayurvédiques, coupe sur cheveux secs et mise en forme délicate.",
  },
  {
    id: "srv-2",
    name: "Coupe + Soin Profond + Brushing",
    categoryId: "cat-1",
    durationMinutes: 60,
    priceEuros: 75,
    depositRequired: true,
    depositAmountEuros: 25,
    assignedStaffIds: ["staff-1", "staff-2"],
    requiredResourceId: "res-1",
    description:
      "Coupe d'auteur accompagnée d'un masque restructurant sous vapeur tiède.",
  },
  {
    id: "srv-3",
    name: "Coupe & Coiffage Entretien",
    categoryId: "cat-1",
    durationMinutes: 30,
    priceEuros: 35,
    depositRequired: false,
    depositAmountEuros: 0,
    assignedStaffIds: ["staff-2", "staff-4"],
    requiredResourceId: "res-1",
    description: "Rafraîchissement des pointes et contours pour habitué.",
  },
  // Coloration Végétale
  {
    id: "srv-4",
    name: "Première Visite Bain Végétal (1 Temps)",
    categoryId: "cat-2",
    durationMinutes: 190, // 3h10
    breakDurationMinutes: 45, // 45 min de temps de pose
    priceEuros: 142,
    depositRequired: true,
    depositAmountEuros: 45,
    assignedStaffIds: ["staff-1", "staff-4"],
    requiredResourceId: "res-2",
    description:
      "Bilan couleur exhaustif, gommage à l'argile, application des pigments 100% naturels et séchage texturé.",
  },
  {
    id: "srv-5",
    name: "Balayage Minéral & Brushing d'Auteur",
    categoryId: "cat-2",
    durationMinutes: 150, // 2h30
    breakDurationMinutes: 30,
    priceEuros: 185,
    depositRequired: true,
    depositAmountEuros: 60,
    assignedStaffIds: ["staff-1"],
    requiredResourceId: "res-2",
    description:
      "Éclaircissement sans ammoniaque à base de silice et d'argile blanche. Nuances fondues et reflets soyeux.",
  },
  {
    id: "srv-6",
    name: "Gloss Végétal & Bain de Lumière",
    categoryId: "cat-2",
    durationMinutes: 45,
    priceEuros: 65,
    depositRequired: true,
    depositAmountEuros: 20,
    assignedStaffIds: ["staff-1", "staff-4"],
    requiredResourceId: "res-2",
    description:
      "Rituel d'entretien pour réveiller la brillance naturelle et gainer la fibre capillaire.",
  },
  // Rituels Soins
  {
    id: "srv-7",
    name: "Grand Rituel Kobido Visage & Cuir Chevelu",
    categoryId: "cat-3",
    durationMinutes: 75,
    priceEuros: 120,
    depositRequired: true,
    depositAmountEuros: 40,
    assignedStaffIds: ["staff-3"],
    requiredResourceId: "res-3",
    description:
      "Massage ancestral lifting naturel combinant pressions faciales et décontraction de la nuque en cabine privée.",
  },
  {
    id: "srv-8",
    name: "Soin Détox Cuir Chevelu à l’Argile Pure",
    categoryId: "cat-3",
    durationMinutes: 45,
    priceEuros: 55,
    depositRequired: false,
    depositAmountEuros: 0,
    assignedStaffIds: ["staff-3", "staff-1"],
    requiredResourceId: "res-3",
    description:
      "Purification en profondeur, application d'un cataplasme chaud et massage crânien apaisant.",
  },
];

export const MOCK_CLIENTS: ProClient[] = [
  {
    id: "cli-1",
    firstName: "Juliane",
    lastName: "Lecomte",
    phone: "06 23 45 67 89",
    email: "juliane.lecomte@email.fr",
    createdAt: "2025-04-12",
    lastVisit: "2026-11-04",
    totalVisits: 8,
    totalSpent: 680,
    isVip: true,
    notes: "Préfère l'eau tiède lors du rinçage. Sensible aux odeurs fortes.",
    techSheet: {
      hairType: "Ondulé, mi-long, porosité moyenne",
      naturalBase: "Châtain clair (hauteur de ton 5)",
      sensitivities: "Légère sensibilité cuir chevelu en hiver",
      lastFormulas: [
        {
          date: "11/10/2026",
          service: "Bain Végétal",
          formula: "70% Henné cuivré d'Inde + 30% Brou de noix (eau à 50°C)",
          leaveInTime: "40 min sous serviette tiède",
          colorist: "Hélène de Valois",
        },
      ],
    },
  },
  {
    id: "cli-2",
    firstName: "Antoine",
    lastName: "Dupont",
    phone: "06 98 76 54 32",
    email: "antoine.dupont@email.fr",
    createdAt: "2025-08-20",
    lastVisit: "2026-11-04",
    totalVisits: 4,
    totalSpent: 340,
    isVip: false,
    notes: "Vient généralement entre 12h et 14h. Très ponctuel.",
    techSheet: {
      hairType: "Épais, raide, coupe transformation",
      naturalBase: "Brun foncé (3)",
      sensitivities: "Aucune",
      lastFormulas: [],
    },
  },
  {
    id: "cli-3",
    firstName: "Léa",
    lastName: "Pelaez",
    phone: "06 45 67 89 01",
    email: "lea.pelaez@email.fr",
    createdAt: "2025-01-15",
    lastVisit: "2026-11-04",
    totalVisits: 14,
    totalSpent: 1450,
    isVip: true,
    notes: "Boit du thé vert genmaicha. Client fidèle depuis l'ouverture.",
    techSheet: {
      hairType: "Fin, balayé, méché régulièrement",
      naturalBase: "Blond foncé (6)",
      sensitivities: "Fragile sur les pointes",
      lastFormulas: [
        {
          date: "04/09/2026",
          service: "Balayage Minéral",
          formula: "Pâte d'argile blanche + activateur 20 vol + patine perle 9.2",
          leaveInTime: "30 min à l'air libre",
          colorist: "Hélène de Valois",
        },
      ],
    },
  },
  {
    id: "cli-4",
    firstName: "Alexandre",
    lastName: "Garnier",
    phone: "06 55 44 33 22",
    email: "alexandre.garnier@email.fr",
    createdAt: "2026-02-10",
    lastVisit: "2026-10-18",
    totalVisits: 3,
    totalSpent: 165,
    isVip: false,
    notes: "Coupe ciseaux uniquement, pas de tondeuse.",
  },
  {
    id: "cli-5",
    firstName: "Sophie",
    lastName: "Martin",
    phone: "06 12 34 56 78",
    email: "sophie.martin@exemple.fr",
    createdAt: "2026-01-08",
    lastVisit: "2026-10-24",
    totalVisits: 6,
    totalSpent: 520,
    isVip: true,
    notes: "Adore les massages crâniens appuyés.",
  },
  {
    id: "cli-6",
    firstName: "Marc",
    lastName: "Lemoine",
    phone: "06 77 88 99 00",
    email: "marc.lemoine@email.fr",
    createdAt: "2026-09-01",
    lastVisit: "2026-10-02",
    totalVisits: 1,
    totalSpent: 50,
    isVip: false,
  },
];

export const MOCK_APPOINTMENTS: ProAppointment[] = [
  {
    id: "apt-1",
    clientId: "cli-1",
    clientName: "Juliane Lecomte",
    clientPhone: "06 23 45 67 89",
    clientEmail: "juliane.lecomte@email.fr",
    serviceId: "srv-1",
    serviceName: "Shampoing + Coupe + Coiffage Signature",
    staffId: "staff-1",
    staffName: "Hélène de Valois",
    resourceId: "res-1",
    resourceName: "Fauteuil Coupe 1 (Belza)",
    date: "2026-11-04",
    startTime: "10:00",
    endTime: "10:45",
    price: 50,
    depositPaid: 15,
    status: "completed",
    isRecurring: true,
    notes: "Coupe d'entretien des pointes",
  },
  {
    id: "apt-2",
    clientId: "cli-2",
    clientName: "Antoine Dupont",
    clientPhone: "06 98 76 54 32",
    clientEmail: "antoine.dupont@email.fr",
    serviceId: "srv-4",
    serviceName: "Bain Végétal Racine & Brushing",
    staffId: "staff-2",
    staffName: "Clément Roux",
    resourceId: "res-2",
    resourceName: "Fauteuil Coloration 2 (Monoï)",
    date: "2026-11-04",
    startTime: "10:00",
    endTime: "11:55",
    price: 115,
    depositPaid: 35,
    status: "completed",
    notes: "Double poste : Coiffeur + Cabine",
  },
  {
    id: "apt-3",
    clientId: "cli-2",
    clientName: "Antoine Dupont",
    clientPhone: "06 98 76 54 32",
    clientEmail: "antoine.dupont@email.fr",
    serviceId: "srv-2",
    serviceName: "La Coupe Transformation",
    staffId: "staff-2",
    staffName: "Clément Roux",
    resourceId: "res-1",
    resourceName: "Fauteuil Coupe 1 (Belza)",
    date: "2026-11-04",
    startTime: "12:00",
    endTime: "13:20",
    price: 85,
    depositPaid: 25,
    status: "completed",
  },
  {
    id: "apt-4",
    clientId: "cli-5",
    clientName: "Sophie Martin",
    clientPhone: "06 12 34 56 78",
    clientEmail: "sophie.martin@exemple.fr",
    serviceId: "srv-7",
    serviceName: "Grand Rituel Kobido Visage",
    staffId: "staff-3",
    staffName: "Élodie Martin",
    resourceId: "res-3",
    resourceName: "Cabine Sérénité (Milady)",
    date: "2026-11-04",
    startTime: "14:00",
    endTime: "15:15",
    price: 120,
    depositPaid: 40,
    status: "in_progress",
    notes: "Cabine chauffée à 22°C souhaitée",
  },
  {
    id: "apt-5",
    clientId: "cli-3",
    clientName: "Léa Pelaez",
    clientPhone: "06 45 67 89 01",
    clientEmail: "lea.pelaez@email.fr",
    serviceId: "srv-5",
    serviceName: "Balayage Minéral & Brushing",
    staffId: "staff-1",
    staffName: "Hélène de Valois",
    resourceId: "res-2",
    resourceName: "Fauteuil Coloration 2 (Monoï)",
    date: "2026-11-04",
    startTime: "15:30",
    endTime: "18:00",
    price: 185,
    depositPaid: 60,
    status: "confirmed",
    isRecurring: true,
  },
  {
    id: "apt-6",
    clientId: "cli-4",
    clientName: "Alexandre Garnier",
    clientPhone: "06 55 44 33 22",
    clientEmail: "alexandre.garnier@email.fr",
    serviceId: "srv-3",
    serviceName: "Coupe & Coiffage Entretien",
    staffId: "staff-2",
    staffName: "Clément Roux",
    resourceId: "res-1",
    resourceName: "Fauteuil Coupe 1 (Belza)",
    date: "2026-11-04",
    startTime: "16:00",
    endTime: "16:30",
    price: 35,
    depositPaid: 0,
    status: "confirmed",
  },
  {
    id: "apt-7",
    clientId: "cli-6",
    clientName: "Marc Lemoine",
    clientPhone: "06 77 88 99 00",
    clientEmail: "marc.lemoine@email.fr",
    serviceId: "srv-8",
    serviceName: "Soin Détox Cuir Chevelu",
    staffId: "staff-3",
    staffName: "Élodie Martin",
    resourceId: "res-3",
    resourceName: "Cabine Sérénité (Milady)",
    date: "2026-11-04",
    startTime: "17:00",
    endTime: "17:45",
    price: 55,
    depositPaid: 0,
    status: "confirmed",
  },
  {
    id: "apt-8",
    clientId: "cli-3",
    clientName: "Léa Pelaez",
    clientPhone: "06 45 67 89 01",
    clientEmail: "lea.pelaez@email.fr",
    serviceId: "srv-6",
    serviceName: "Gloss Végétal & Bain de Lumière",
    staffId: "staff-4",
    staffName: "Thomas Mercier",
    resourceId: "res-2",
    resourceName: "Fauteuil Coloration 2 (Monoï)",
    date: "2026-11-04",
    startTime: "18:30",
    endTime: "19:15",
    price: 65,
    depositPaid: 20,
    status: "confirmed",
    isRecurring: true,
  },
];

export const MOCK_TICKETS: ProSaleTicket[] = [
  {
    id: "tkt-101",
    date: "2026-11-04",
    time: "10:50",
    clientId: "cli-1",
    clientName: "Juliane Lecomte",
    staffId: "staff-1",
    staffName: "Hélène de Valois",
    appointmentId: "apt-1",
    items: [
      {
        title: "Shampoing + Coupe + Coiffage Signature",
        type: "service",
        price: 50,
        quantity: 1,
      },
      {
        title: "Huile Botanique Nourrissante 50ml",
        type: "product",
        price: 32,
        quantity: 1,
      },
    ],
    depositDeducted: 15,
    subtotalHt: 55.83,
    vatAmount: 11.17,
    totalTtc: 67, // (50 + 32) - 15 = 67
    paymentMethod: "card",
  },
  {
    id: "tkt-102",
    date: "2026-11-04",
    time: "13:30",
    clientId: "cli-2",
    clientName: "Antoine Dupont",
    staffId: "staff-2",
    staffName: "Clément Roux",
    appointmentId: "apt-3",
    items: [
      {
        title: "La Coupe Transformation",
        type: "service",
        price: 85,
        quantity: 1,
      },
    ],
    depositDeducted: 25,
    subtotalHt: 50.0,
    vatAmount: 10.0,
    totalTtc: 60,
    paymentMethod: "mixed",
    cardAmount: 40,
    cashAmount: 20,
  },
];
