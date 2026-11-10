import { db } from "@/lib/db";
import { formatUtcToLocalParts } from "@/modules/availability/time-utils";
import { CreateClientInput, UpdateClientInput } from "@/lib/validations/client.schema";
import { ProClient, ProAppointment } from "@/lib/data/pro-mock-data";

function formatTechSheet(raw: any): NonNullable<ProClient["techSheet"]> {
  return {
    hairType: raw?.hairType || "Non renseigné",
    naturalBase: raw?.naturalBase || "",
    sensitivities: raw?.sensitivities || "Aucune",
    lastFormulas: Array.isArray(raw?.lastFormulas)
      ? raw.lastFormulas.map((f: any) => ({
          date: f.date || "",
          service: f.service || "",
          formula: f.formula || "",
          leaveInTime: f.leaveInTime || "",
          colorist: f.colorist || "Artisan Belora",
        }))
      : [],
  };
}

/**
 * Récupère les clients CRM d'un salon avec segmentation intelligente et métriques globales.
 */
export async function getClientsCRM(
  venueId: string,
  params: {
    segment?: "all" | "vip" | "regulars" | "new" | "inactive";
    search?: string;
  } = {}
) {
  const { segment = "all", search } = params;

  // 1. Récupération de tous les clients du salon pour calculer les compteurs de segmentation
  const allCustomers = await db.customerCRM.findMany({
    where: { venueId },
    orderBy: { lastName: "asc" },
  });

  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 3600 * 1000);

  // Calcul des compteurs par segment
  const totalCount = allCustomers.length;
  const vipCount = allCustomers.filter((c) => c.isVip).length;
  const regularsCount = allCustomers.filter((c) => c.totalVisits >= 4).length;
  const newCount = allCustomers.filter((c) => c.totalVisits <= 1).length;
  const inactiveCount = allCustomers.filter(
    (c) => !c.lastVisitAt || c.lastVisitAt < sixtyDaysAgo || c.totalVisits === 0
  ).length;

  // Métriques financières
  const totalRevenueCents = allCustomers.reduce((acc, c) => acc + c.totalSpentCents, 0);
  const totalRevenue = totalRevenueCents / 100;
  const avgSpendPerClient = totalCount > 0 ? totalRevenue / totalCount : 0;
  const retentionRate =
    totalCount > 0 ? Math.round((regularsCount / totalCount) * 100) : 0;

  // 2. Filtrage selon le segment sélectionné et le terme de recherche
  let filtered = allCustomers;

  if (segment === "vip") {
    filtered = filtered.filter((c) => c.isVip);
  } else if (segment === "regulars") {
    filtered = filtered.filter((c) => c.totalVisits >= 4);
  } else if (segment === "new") {
    filtered = filtered.filter((c) => c.totalVisits <= 1);
  } else if (segment === "inactive") {
    filtered = filtered.filter(
      (c) => !c.lastVisitAt || c.lastVisitAt < sixtyDaysAgo || c.totalVisits === 0
    );
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }

  const mappedClients: ProClient[] = filtered.map((c) => {
    const lastVisitStr = c.lastVisitAt
      ? formatUtcToLocalParts(c.lastVisitAt).date
      : "Jamais venu";

    const techSheet = formatTechSheet(c.techFormulas);

    return {
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      phone: c.phone,
      email: c.email || "",
      createdAt: formatUtcToLocalParts(c.createdAt).date,
      lastVisit: lastVisitStr,
      totalVisits: c.totalVisits,
      totalSpent: c.totalSpentCents / 100,
      isVip: c.isVip,
      notes: c.notes || undefined,
      techSheet,
    };
  });

  return {
    clients: mappedClients,
    counts: {
      all: totalCount,
      vip: vipCount,
      regulars: regularsCount,
      new: newCount,
      inactive: inactiveCount,
    },
    totals: {
      totalRevenue,
      avgSpendPerClient,
      retentionRate,
    },
  };
}

/**
 * Création manuelle d'une fiche client dans le CRM.
 */
export async function createClientCRM(
  input: CreateClientInput & { venueId: string }
): Promise<ProClient> {
  const { venueId, firstName, lastName, phone, email, isVip = false, notes, techSheet } = input;

  // Vérification de doublon de numéro
  const existing = await db.customerCRM.findFirst({
    where: { venueId, phone },
  });

  if (existing) {
    throw new Error("Un client possède déjà ce numéro de téléphone dans votre fichier.");
  }

  const defaultTechSheet = formatTechSheet(techSheet);

  const created = await db.customerCRM.create({
    data: {
      venueId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : null,
      isVip,
      notes: notes ? notes.trim() : null,
      techFormulas: defaultTechSheet as any,
      totalVisits: 0,
      totalSpentCents: 0,
    },
  });

  return {
    id: created.id,
    firstName: created.firstName,
    lastName: created.lastName,
    phone: created.phone,
    email: created.email || "",
    createdAt: formatUtcToLocalParts(created.createdAt).date,
    lastVisit: "Jamais venu",
    totalVisits: 0,
    totalSpent: 0,
    isVip: created.isVip,
    notes: created.notes || undefined,
    techSheet: defaultTechSheet,
  };
}

/**
 * Récupère les détails complets d'un client avec l'historique de tous ses rendez-vous et rituels passés.
 */
export async function getClientCRMDetails(
  id: string,
  venueId: string
): Promise<{ client: ProClient; appointments: ProAppointment[] }> {
  const customer = await db.customerCRM.findFirst({
    where: { id, venueId },
    include: {
      bookings: {
        include: {
          items: {
            include: {
              service: true,
              staff: true,
              resource: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) {
    throw new Error("Fiche client introuvable.");
  }

  const lastVisitStr = customer.lastVisitAt
    ? formatUtcToLocalParts(customer.lastVisitAt).date
    : "Jamais venu";

  const techSheet = formatTechSheet(customer.techFormulas);

  const client: ProClient = {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: customer.phone,
    email: customer.email || "",
    createdAt: formatUtcToLocalParts(customer.createdAt).date,
    lastVisit: lastVisitStr,
    totalVisits: customer.totalVisits,
    totalSpent: customer.totalSpentCents / 100,
    isVip: customer.isVip,
    notes: customer.notes || undefined,
    techSheet,
  };

  const appointments: ProAppointment[] = customer.bookings.flatMap((b) =>
    b.items.map((item) => {
      const { date, time: startTimeStr } = formatUtcToLocalParts(item.startTime);
      const { time: endTimeStr } = formatUtcToLocalParts(item.endTime);

      return {
        id: b.id,
        clientId: customer.id,
        clientName: b.clientName,
        clientPhone: b.clientPhone,
        clientEmail: b.clientEmail || "",
        serviceId: item.serviceId,
        serviceName: item.service.name,
        staffId: item.staffId,
        staffName: item.staff.name,
        resourceId: item.resourceId || undefined,
        resourceName: item.resource?.name || undefined,
        date,
        startTime: startTimeStr,
        endTime: endTimeStr,
        price: item.priceCents / 100,
        depositPaid: b.depositCents / 100,
        status: b.status.toLowerCase() as ProAppointment["status"],
        isRecurring: customer.totalVisits > 1,
        notes: b.notes || undefined,
      };
    })
  );

  return { client, appointments };
}

/**
 * Met à jour une fiche client (coordonnées, VIP, notes et fiches techniques de coloration).
 */
export async function updateClientCRM(
  id: string,
  input: UpdateClientInput & { venueId: string }
): Promise<ProClient> {
  const { venueId } = input;

  const existing = await db.customerCRM.findFirst({
    where: { id, venueId },
  });

  if (!existing) {
    throw new Error("Fiche client introuvable.");
  }

  const updatedData: any = {};
  if (input.firstName !== undefined) updatedData.firstName = input.firstName.trim();
  if (input.lastName !== undefined) updatedData.lastName = input.lastName.trim();
  if (input.phone !== undefined) updatedData.phone = input.phone.trim();
  if (input.email !== undefined) updatedData.email = input.email ? input.email.trim() : null;
  if (input.isVip !== undefined) updatedData.isVip = input.isVip;
  if (input.notes !== undefined) updatedData.notes = input.notes ? input.notes.trim() : null;
  if (input.techSheet !== undefined) updatedData.techFormulas = input.techSheet;

  const updated = await db.customerCRM.update({
    where: { id: existing.id },
    data: updatedData,
  });

  const lastVisitStr = updated.lastVisitAt
    ? formatUtcToLocalParts(updated.lastVisitAt).date
    : "Jamais venu";

  const techSheet = formatTechSheet(updated.techFormulas);

  return {
    id: updated.id,
    firstName: updated.firstName,
    lastName: updated.lastName,
    phone: updated.phone,
    email: updated.email || "",
    createdAt: formatUtcToLocalParts(updated.createdAt).date,
    lastVisit: lastVisitStr,
    totalVisits: updated.totalVisits,
    totalSpent: updated.totalSpentCents / 100,
    isVip: updated.isVip,
    notes: updated.notes || undefined,
    techSheet,
  };
}
