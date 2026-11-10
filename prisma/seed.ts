import { PrismaClient, Role, VenueStatus, BookingStatus, PaymentStatus, PaymentMethod } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Belora database seed...");

  // 1. Nettoyage ordonné des données existantes (pour idempotence du seed)
  await prisma.review.deleteMany();
  await prisma.saleTicket.deleteMany();
  await prisma.dailyClosing.deleteMany();
  await prisma.holdingLock.deleteMany();
  await prisma.bookingItem.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.customerCRM.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.staffClockIn.deleteMany();
  await prisma.staffTimeOff.deleteMany();
  await prisma.staffSchedule.deleteMany();
  await prisma.staffMember.deleteMany();
  await prisma.venueOpeningHour.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.platformSetting.deleteMany();

  console.log("🧹 Previous tables cleaned.");

  // 2. Création des Paramètres Plateforme Belora
  await prisma.platformSetting.create({
    data: {
      defaultCommissionRate: 0.018, // 1.8%
      maintenanceMode: false,
    },
  });

  // 3. Mots de passe sécurisés hashés par bcrypt ("@Motdepass1" pour tous les comptes)
  const salt = await bcrypt.genSalt(10);
  const commonPasswordHash = await bcrypt.hash("@Motdepass1", salt);

  // 4. Utilisateurs Clés (Admin, Pro, Client) avec adresses @yopmail.com
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@yopmail.com",
      passwordHash: commonPasswordHash,
      firstName: "Alexandre",
      lastName: "De Belora",
      phone: "01 89 00 00 01",
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });

  const proUser = await prisma.user.create({
    data: {
      email: "pro@yopmail.com",
      passwordHash: commonPasswordHash,
      firstName: "Hélène",
      lastName: "de Valois",
      phone: "06 12 34 56 01",
      role: Role.PRO,
      emailVerified: new Date(),
    },
  });

  const clientUser = await prisma.user.create({
    data: {
      email: "client@yopmail.com",
      passwordHash: commonPasswordHash,
      firstName: "Camille",
      lastName: "Dupont",
      phone: "06 98 76 54 32",
      role: Role.CUSTOMER,
      emailVerified: new Date(),
    },
  });

  console.log("👤 Created 3 core users (ADMIN, PRO, CUSTOMER).");

  // 5. Salon Vitrine : L'Atelier Botanique (Paris 3e)
  const venue = await prisma.venue.create({
    data: {
      slug: "atelier-botanique-paris",
      name: "L’Atelier Botanique",
      tagline: "Maison d'Artisan Coiffeur & Soins Végétaux",
      description:
        "Maison d'artisan dédiée aux rituels végétaux, balayages minéraux à l'argile et coupes à sec sur-mesure respectueuses de la matière du cheveu.",
      address: "18 Rue de Turenne",
      city: "Paris",
      postalCode: "75003",
      countryCode: "FR",
      latitude: 48.8566,
      longitude: 2.3622,
      phone: "01 42 68 90 12",
      email: "contact.atelierbotanique@yopmail.com",
      currency: "EUR",
      timezone: "Europe/Paris",
      status: VenueStatus.PUBLISHED,
      commissionRate: 0.018,
      ownerId: proUser.id,
      siret: "849 201 942 00019",
      vatNumber: "FR 82 849201942",
      cancellationDelayHours: 24,
      depositPercentage: 30,
      cashSettings: {
        acceptCard: true,
        acceptCash: true,
        acceptCheck: false,
        ticketFooter: "Merci de votre visite et de votre confiance. Prenez soin de vous !",
      },
      notificationSettings: {
        emailConfirmEnabled: true,
        sms24hEnabled: true,
        sms2hEnabled: false,
        smsTemplate:
          "Bonjour {client_name}, votre rendez-vous chez {venue_name} pour {service_name} est confirmé le {date} à {time}. En cas d'empêchement, vous pouvez modifier votre créneau ici : {link}",
      },
    },
  });

  // 6. Horaires d'Ouverture de l'Établissement (du Mardi au Samedi)
  // dayOfWeek : 0 = Dimanche, 1 = Lundi, 2 = Mardi, etc.
  const openingHoursData = [
    { dayOfWeek: 0, openTime: "10:00", closeTime: "18:00", isOpen: false }, // Dimanche (Fermé)
    { dayOfWeek: 1, openTime: "09:00", closeTime: "19:00", isOpen: false }, // Lundi (Fermé)
    { dayOfWeek: 2, openTime: "09:30", closeTime: "19:30", isOpen: true },  // Mardi
    { dayOfWeek: 3, openTime: "09:30", closeTime: "19:30", isOpen: true },  // Mercredi
    { dayOfWeek: 4, openTime: "09:30", closeTime: "20:00", isOpen: true },  // Jeudi (Nocturne)
    { dayOfWeek: 5, openTime: "09:30", closeTime: "20:00", isOpen: true },  // Vendredi (Nocturne)
    { dayOfWeek: 6, openTime: "09:00", closeTime: "19:00", isOpen: true },  // Samedi
  ];

  for (const item of openingHoursData) {
    await prisma.venueOpeningHour.create({
      data: {
        venueId: venue.id,
        ...item,
      },
    });
  }

  // 7. Collaborateurs / Artisans de l'Atelier avec comptes utilisateurs PRO
  const clementUser = await prisma.user.create({
    data: {
      email: "clement.roux@yopmail.com",
      passwordHash: commonPasswordHash,
      firstName: "Clément",
      lastName: "Roux",
      phone: "06 12 34 56 02",
      role: Role.PRO,
      emailVerified: new Date(),
    },
  });

  const elodieUser = await prisma.user.create({
    data: {
      email: "elodie.martin@yopmail.com",
      passwordHash: commonPasswordHash,
      firstName: "Élodie",
      lastName: "Martin",
      phone: "06 12 34 56 03",
      role: Role.PRO,
      emailVerified: new Date(),
    },
  });

  const thomasUser = await prisma.user.create({
    data: {
      email: "thomas.mercier@yopmail.com",
      passwordHash: commonPasswordHash,
      firstName: "Thomas",
      lastName: "Mercier",
      phone: "06 12 34 56 04",
      role: Role.PRO,
      emailVerified: new Date(),
    },
  });

  const staffHelene = await prisma.staffMember.create({
    data: {
      venueId: venue.id,
      userId: proUser.id,
      name: "Hélène de Valois",
      role: "Artisan Coloriste & Fondatrice",
      color: "#82385a", // Figue signature
      avatarUrl: "/images/artisans/artisan-1.jpg",
      isActive: true,
    },
  });

  const staffClement = await prisma.staffMember.create({
    data: {
      venueId: venue.id,
      userId: clementUser.id,
      name: "Clément Roux",
      role: "Maître Coiffeur Créateur",
      color: "#27272a", // Encre sombre
      avatarUrl: "/images/artisans/artisan-2.jpg",
      isActive: true,
    },
  });

  const staffElodie = await prisma.staffMember.create({
    data: {
      venueId: venue.id,
      userId: elodieUser.id,
      name: "Élodie Martin",
      role: "Praticienne Soins Holistiques & Cuir Chevelu",
      color: "#a04f6d", // Figue claire
      avatarUrl: "/images/artisans/artisan-3.jpg",
      isActive: true,
    },
  });

  const staffThomas = await prisma.staffMember.create({
    data: {
      venueId: venue.id,
      userId: thomasUser.id,
      name: "Thomas Mercier",
      role: "Artisan Coloriste Junior",
      color: "#52525b", // Zinc
      avatarUrl: "/images/artisans/artisan-1.jpg",
      isActive: true,
    },
  });

  // Plannings hebdomadaires des collaborateurs (Mardi à Samedi)
  const staffMembers = [staffHelene, staffClement, staffElodie, staffThomas];
  for (const staff of staffMembers) {
    for (let day = 2; day <= 6; day++) {
      await prisma.staffSchedule.create({
        data: {
          staffId: staff.id,
          dayOfWeek: day,
          plannedStart: "09:30",
          plannedEnd: day === 4 || day === 5 ? "20:00" : "19:30",
          breakStart: "13:00",
          breakEnd: "14:00",
          isActive: true,
        },
      });
    }
  }

  // Pointage du jour (ClockIn)
  const today = new Date();
  await prisma.staffClockIn.create({
    data: {
      staffId: staffHelene.id,
      date: today,
      clockInTime: new Date(new Date().setHours(9, 22, 0, 0)),
    },
  });
  await prisma.staffClockIn.create({
    data: {
      staffId: staffClement.id,
      date: today,
      clockInTime: new Date(new Date().setHours(9, 55, 0, 0)),
    },
  });
  await prisma.staffClockIn.create({
    data: {
      staffId: staffElodie.id,
      date: today,
      clockInTime: new Date(new Date().setHours(9, 50, 0, 0)),
    },
  });

  // 8. Ressources Matérielles (Fauteuils, Cabines, Bacs)
  const resFauteuil1 = await prisma.resource.create({
    data: {
      venueId: venue.id,
      name: "Fauteuil Coupe 1 (Belza)",
      type: "Fauteuil",
      color: "#71717a",
      isActive: true,
    },
  });

  const resFauteuil2 = await prisma.resource.create({
    data: {
      venueId: venue.id,
      name: "Fauteuil Coloration 2 (Monoï)",
      type: "Fauteuil",
      color: "#a1a1aa",
      isActive: true,
    },
  });

  const resCabine = await prisma.resource.create({
    data: {
      venueId: venue.id,
      name: "Cabine Sérénité (Milady)",
      type: "Cabine",
      color: "#d4d4d8",
      isActive: true,
    },
  });

  // 9. Catégories & Prestations (Services)
  const catIncontournables = await prisma.serviceCategory.create({
    data: {
      venueId: venue.id,
      name: "Les Incontournables",
      order: 1,
    },
  });

  const catColoration = await prisma.serviceCategory.create({
    data: {
      venueId: venue.id,
      name: "Coloration Végétale & Balayage",
      order: 2,
    },
  });

  const catSoins = await prisma.serviceCategory.create({
    data: {
      venueId: venue.id,
      name: "Rituels Soins & Massages Cuir Chevelu",
      order: 3,
    },
  });

  // Prestations détaillées
  const srvCoupe = await prisma.service.create({
    data: {
      venueId: venue.id,
      categoryId: catIncontournables.id,
      name: "Shampoing + Coupe + Coiffage Signature",
      description: "Diagnostic morphologique, lavage aux poudres ayurvédiques, coupe sur cheveux secs et mise en forme délicate.",
      durationMinutes: 45,
      processingTimeMinutes: 0,
      priceCents: 5000, // 50.00 €
      depositRequired: true,
      depositCents: 1500, // 15.00 €
      order: 1,
      isActive: true,
    },
  });

  const srvCoupeSoin = await prisma.service.create({
    data: {
      venueId: venue.id,
      categoryId: catIncontournables.id,
      name: "Coupe + Soin Profond + Brushing",
      description: "Rituel complet avec masque aux huiles précieuses de camélia et mise en pli naturelle au diffuseur.",
      durationMinutes: 60,
      processingTimeMinutes: 0,
      priceCents: 7500, // 75.00 €
      depositRequired: true,
      depositCents: 2500, // 25.00 €
      order: 2,
      isActive: true,
    },
  });

  const srvBrushing = await prisma.service.create({
    data: {
      venueId: venue.id,
      categoryId: catIncontournables.id,
      name: "Brushing & Mise en Forme Délicate",
      description: "Shampoing végétal doux et brushing souple respectueux de la fibre.",
      durationMinutes: 30,
      processingTimeMinutes: 0,
      priceCents: 3500, // 35.00 €
      depositRequired: true,
      depositCents: 1000, // 10.00 €
      order: 3,
      isActive: true,
    },
  });

  const srvColoration = await prisma.service.create({
    data: {
      venueId: venue.id,
      categoryId: catColoration.id,
      name: "Coloration Végétale Botanique & Brushing",
      description: "Application personnalisée de poudres tinctoriales 100% bio (henné, indigo, garance) avec temps de pose relaxant sous serviette chaude.",
      durationMinutes: 90,
      processingTimeMinutes: 30, // 30 min de pose libérant le coiffeur
      priceCents: 9500, // 95.00 €
      depositRequired: true,
      depositCents: 3000, // 30.00 €
      order: 1,
      isActive: true,
    },
  });

  const srvBalayage = await prisma.service.create({
    data: {
      venueId: venue.id,
      categoryId: catColoration.id,
      name: "Balayage Minéral à l'Argile & Patine",
      description: "Éclaircissement naturel sans ammoniaque à base d'argile blanche et patine gloss protectrice.",
      durationMinutes: 120,
      processingTimeMinutes: 40, // 40 min de pose
      priceCents: 14000, // 140.00 €
      depositRequired: true,
      depositCents: 4500, // 45.00 €
      order: 2,
      isActive: true,
    },
  });

  const srvGloss = await prisma.service.create({
    data: {
      venueId: venue.id,
      categoryId: catColoration.id,
      name: "Gloss Végétal Brillance Éclat",
      description: "Soin illuminate de reflets sans effet racine, gaine la fibre et scelle les cuticules.",
      durationMinutes: 45,
      processingTimeMinutes: 15,
      priceCents: 5500, // 55.00 €
      depositRequired: true,
      depositCents: 1500, // 15.00 €
      order: 3,
      isActive: true,
    },
  });

  const srvShirodhara = await prisma.service.create({
    data: {
      venueId: venue.id,
      categoryId: catSoins.id,
      name: "Rituel Shirodhara Capillaire & Huiles Chaudes",
      description: "Écoulement continu d'huile ayurvédique tiède sur le front et cuir chevelu, digitopression des points marmas et bain de vapeur.",
      durationMinutes: 60,
      processingTimeMinutes: 0,
      priceCents: 8500, // 85.00 €
      depositRequired: true,
      depositCents: 2500, // 25.00 €
      order: 1,
      isActive: true,
    },
  });

  const srvDetox = await prisma.service.create({
    data: {
      venueId: venue.id,
      categoryId: catSoins.id,
      name: "Détox Cuir Chevelu à l'Argile Verte & Massage Crânien",
      description: "Gommage oxygénant doux, masque d'argile purifiante et massage shiatsu du crâne.",
      durationMinutes: 50,
      processingTimeMinutes: 15,
      priceCents: 7000, // 70.00 €
      depositRequired: true,
      depositCents: 2000, // 20.00 €
      order: 2,
      isActive: true,
    },
  });

  console.log("💆 Created 3 categories and 8 bespoke ritual services.");

  // 10. Fichier Clients CRM Réaliste (10 profils avec fiches techniques)
  const crmClientsData = [
    {
      firstName: "Claire",
      lastName: "Dumont",
      phone: "06 20 40 60 80",
      email: "claire.dumont@yopmail.com",
      isVip: true,
      notes: "Adepte exclusive des colorations végétales chaudes. Café noir sans sucre.",
      techFormulas: {
        hairType: "Ondulé, porosité moyenne",
        naturalBase: "Châtain clair (Base 5)",
        sensitivities: "Réaction aux sulfates, cuir chevelu sec",
        lastFormulas: [
          {
            date: "2026-10-14",
            service: "Coloration Végétale Botanique",
            formula: "Henné du Rajasthan 60g + Garance 25g + Infusion Camomille",
            leaveInTime: "40 min",
            colorist: "Hélène de Valois",
          },
        ],
      },
      totalVisits: 8,
      totalSpentCents: 76000, // 760.00 €
    },
    {
      firstName: "Marc",
      lastName: "Antoine",
      phone: "06 11 22 33 44",
      email: "marc.antoine@yopmail.com",
      isVip: false,
      notes: "Coupe aux ciseaux uniquement, pas de tondeuse.",
      techFormulas: {
        hairType: "Raide, épais",
        naturalBase: "Brun (Base 3)",
        sensitivities: "Aucune",
      },
      totalVisits: 5,
      totalSpentCents: 25000,
    },
    {
      firstName: "Sophie",
      lastName: "Lemoine",
      phone: "06 44 55 66 77",
      email: "sophie.lemoine@yopmail.com",
      isVip: true,
      notes: "Cheveux très longs et fragiles. Démêlage ultra doux recommandé.",
      techFormulas: {
        hairType: "Fin, ondulé",
        naturalBase: "Blond foncé (Base 6)",
        sensitivities: "Cuir chevelu ultra-sensible",
        lastFormulas: [
          {
            date: "2026-10-28",
            service: "Balayage Minéral à l'Argile",
            formula: "Poudre minérale Kaolin + Peroxyde végétal 20vol + Soin Aloé",
            leaveInTime: "35 min",
            colorist: "Thomas Mercier",
          },
        ],
      },
      totalVisits: 12,
      totalSpentCents: 154000,
    },
    {
      firstName: "Camille",
      lastName: "Dupont",
      phone: "06 98 76 54 32",
      email: "client@yopmail.com",
      userId: clientUser.id,
      isVip: false,
      notes: "Compte particulier test Belora. Première visite en cours.",
      techFormulas: {
        hairType: "Normal, souple",
        naturalBase: "Châtain moyen (Base 4)",
      },
      totalVisits: 1,
      totalSpentCents: 7500,
    },
    {
      firstName: "Juliette",
      lastName: "Roche",
      phone: "06 77 88 99 00",
      email: "juliette.roche@yopmail.com",
      isVip: true,
      notes: "Passionnée par le Shirodhara. Prendre le temps pour le rituel.",
      techFormulas: {
        hairType: "Bouclé, sec",
        naturalBase: "Châtain (Base 4)",
      },
      totalVisits: 9,
      totalSpentCents: 82000,
    },
    {
      firstName: "Antoine",
      lastName: "De La Tour",
      phone: "06 33 44 55 66",
      email: "antoine.delatour@yopmail.com",
      isVip: false,
      notes: "Rendez-vous souvent calés le jeudi soir pendant la nocturne.",
      totalVisits: 4,
      totalSpentCents: 20000,
    },
    {
      firstName: "Émilie",
      lastName: "Benoît",
      phone: "06 18 29 30 41",
      email: "emilie.benoit@yopmail.com",
      isVip: false,
      notes: "Soin régulier toutes les 6 semaines.",
      totalVisits: 6,
      totalSpentCents: 45000,
    },
    {
      firstName: "Guillaume",
      lastName: "Perrin",
      phone: "06 52 63 74 85",
      email: "guillaume.perrin@yopmail.com",
      isVip: false,
      notes: "Coupe classique dégradée.",
      totalVisits: 3,
      totalSpentCents: 15000,
    },
    {
      firstName: "Nathalie",
      lastName: "Vidal",
      phone: "06 91 82 73 64",
      email: "nathalie.vidal@yopmail.com",
      isVip: true,
      notes: "Balayage régulier avant chaque départ en vacances.",
      techFormulas: {
        hairType: "Mi-long, méché",
        naturalBase: "Châtain clair (Base 5)",
        lastFormulas: [
          {
            date: "2026-09-15",
            service: "Balayage Minéral",
            formula: "Argile blanche + Gloss miel",
            leaveInTime: "30 min",
            colorist: "Hélène de Valois",
          },
        ],
      },
      totalVisits: 11,
      totalSpentCents: 128000,
    },
    {
      firstName: "Léa",
      lastName: "Morin",
      phone: "06 45 78 12 90",
      email: "lea.morin@yopmail.com",
      isVip: false,
      notes: "Nouvelle cliente orientée via la marketplace Belora.",
      totalVisits: 2,
      totalSpentCents: 13500,
    },
  ];

  const createdCustomers: any[] = [];
  for (const c of crmClientsData) {
    // Créer ou récupérer le compte User correspondant pour permettre la connexion
    let userRecord = await prisma.user.findUnique({
      where: { email: c.email },
    });
    if (!userRecord) {
      userRecord = await prisma.user.create({
        data: {
          email: c.email,
          passwordHash: commonPasswordHash,
          firstName: c.firstName,
          lastName: c.lastName,
          phone: c.phone,
          role: Role.CUSTOMER,
          emailVerified: new Date(),
        },
      });
    }

    const { userId: explicitUserId, ...restData } = c as any;

    const created = await prisma.customerCRM.create({
      data: {
        venueId: venue.id,
        userId: explicitUserId || userRecord.id,
        ...restData,
      },
    });
    createdCustomers.push(created);
  }

  console.log(`📋 Created ${createdCustomers.length} CRM customer profiles with tech sheets.`);

  // 11. Réservations Réelles & Items d'Agenda (Planning du jour & passés)
  // Réservation 1 : Claire Dumont ce matin à 10:00 avec Hélène (Coloration)
  const startTimeRdv1 = new Date();
  startTimeRdv1.setHours(10, 0, 0, 0);
  const endTimeRdv1 = new Date(startTimeRdv1.getTime() + 90 * 60 * 1000); // +90 min

  const booking1 = await prisma.booking.create({
    data: {
      reference: "#BEL-8492",
      venueId: venue.id,
      customerId: createdCustomers[0].id, // Claire Dumont
      clientName: "Claire Dumont",
      clientPhone: "06 20 40 60 80",
      clientEmail: "claire.dumont@yopmail.com",
      status: BookingStatus.COMPLETED,
      totalPriceCents: 9500,
      depositCents: 3000,
      remainingCents: 6500,
      paymentStatus: PaymentStatus.SUCCEEDED,
      notes: "Cliente VIP, formule Rajasthan.",
      items: {
        create: {
          serviceId: srvColoration.id,
          staffId: staffHelene.id,
          resourceId: resFauteuil2.id,
          startTime: startTimeRdv1,
          endTime: endTimeRdv1,
          priceCents: 9500,
        },
      },
    },
  });

  // Ticket de caisse associé au Rdv 1
  await prisma.saleTicket.create({
    data: {
      ticketNumber: "TK-2026-0042",
      venueId: venue.id,
      bookingId: booking1.id,
      clientName: "Claire Dumont",
      totalTtcCents: 9500,
      subtotalHtCents: 7917,
      vatAmountCents: 1583,
      paymentMethod: PaymentMethod.CARD_TERMINAL,
      cardAmountCents: 6500,
      cashAmountCents: 0,
      depositDeductedCents: 3000,
    },
  });

  // Réservation 2 : Marc Antoine à 11:30 avec Clément (Coupe)
  const startTimeRdv2 = new Date();
  startTimeRdv2.setHours(11, 30, 0, 0);
  const endTimeRdv2 = new Date(startTimeRdv2.getTime() + 45 * 60 * 1000);

  const booking2 = await prisma.booking.create({
    data: {
      reference: "#BEL-8493",
      venueId: venue.id,
      customerId: createdCustomers[1].id, // Marc Antoine
      clientName: "Marc Antoine",
      clientPhone: "06 11 22 33 44",
      clientEmail: "marc.antoine@yopmail.com",
      status: BookingStatus.COMPLETED,
      totalPriceCents: 5000,
      depositCents: 1500,
      remainingCents: 3500,
      paymentStatus: PaymentStatus.SUCCEEDED,
      items: {
        create: {
          serviceId: srvCoupe.id,
          staffId: staffClement.id,
          resourceId: resFauteuil1.id,
          startTime: startTimeRdv2,
          endTime: endTimeRdv2,
          priceCents: 5000,
        },
      },
    },
  });

  // Réservation 3 : Sophie Lemoine cet après-midi à 14:30 avec Élodie (Shirodhara)
  const startTimeRdv3 = new Date();
  startTimeRdv3.setHours(14, 30, 0, 0);
  const endTimeRdv3 = new Date(startTimeRdv3.getTime() + 60 * 60 * 1000);

  await prisma.booking.create({
    data: {
      reference: "#BEL-8494",
      venueId: venue.id,
      customerId: createdCustomers[2].id, // Sophie Lemoine
      clientName: "Sophie Lemoine",
      clientPhone: "06 44 55 66 77",
      clientEmail: "sophie.lemoine@yopmail.com",
      status: BookingStatus.CONFIRMED,
      totalPriceCents: 8500,
      depositCents: 2500,
      remainingCents: 6000,
      paymentStatus: PaymentStatus.PENDING,
      notes: "Massage en cabine sérénité.",
      items: {
        create: {
          serviceId: srvShirodhara.id,
          staffId: staffElodie.id,
          resourceId: resCabine.id,
          startTime: startTimeRdv3,
          endTime: endTimeRdv3,
          priceCents: 8500,
        },
      },
    },
  });

  // Réservation 4 : Camille Dupont (notre client de test) demain à 11:00 avec Hélène
  const startTimeRdv4 = new Date(Date.now() + 24 * 60 * 60 * 1000);
  startTimeRdv4.setHours(11, 0, 0, 0);
  const endTimeRdv4 = new Date(startTimeRdv4.getTime() + 60 * 60 * 1000);

  await prisma.booking.create({
    data: {
      reference: "#BEL-8495",
      venueId: venue.id,
      customerId: createdCustomers[3].id, // Camille Dupont
      clientName: "Camille Dupont",
      clientPhone: "06 98 76 54 32",
      clientEmail: "client@yopmail.com",
      status: BookingStatus.CONFIRMED,
      totalPriceCents: 7500,
      depositCents: 2500,
      remainingCents: 5000,
      paymentStatus: PaymentStatus.PENDING,
      items: {
        create: {
          serviceId: srvCoupeSoin.id,
          staffId: staffHelene.id,
          resourceId: resFauteuil1.id,
          startTime: startTimeRdv4,
          endTime: endTimeRdv4,
          priceCents: 7500,
        },
      },
    },
  });

  console.log("📅 Created bookings & agenda appointments with staff & resource links.");

  // 12. Avis Clients Vérifiés
  await prisma.review.create({
    data: {
      venueId: venue.id,
      bookingId: booking1.id,
      userId: createdCustomers[0].userId,
      authorName: "Claire Dumont",
      rating: 5,
      comment:
        "Une expérience exceptionnelle comme toujours. La coloration végétale d'Hélène couvre parfaitement mes premiers cheveux blancs tout en laissant une brillance et une souplesse incomparables. Salon apaisant et thés délicieux.",
      isVerified: true,
      reply:
        "Merci infiniment chère Claire pour votre fidélité et ce mot chaleureux. Ce fut un plaisir de vous accueillir ce matin ! À très bientôt à l'Atelier.",
      replyAt: new Date(),
    },
  });

  await prisma.review.create({
    data: {
      venueId: venue.id,
      bookingId: booking2.id,
      userId: createdCustomers[1].userId,
      authorName: "Marc Antoine",
      rating: 5,
      comment:
        "Clément a un coup de ciseau d'une précision chirurgicale sur cheveux secs. Très bon moment et salon d'une propreté irréprochable.",
      isVerified: true,
      reply: "Merci Marc, ravi que la coupe vous convienne parfaitement !",
      replyAt: new Date(),
    },
  });

  console.log("⭐ Created verified reviews with owner replies.");
  console.log("✅ Belora seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
