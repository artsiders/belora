import { NextResponse } from "next/server";
import {
  getAdminContext,
  getAdminFinancialReport,
} from "@/modules/admin/admin.service";

export async function GET(request: Request) {
  try {
    const adminContext = await getAdminContext(request);
    if ("error" in adminContext) {
      return NextResponse.json(
        { error: adminContext.error },
        { status: adminContext.status }
      );
    }

    const report = await getAdminFinancialReport();

    // Génération du CSV
    const headers = [
      "ID Transaction",
      "Reference",
      "Etablissement",
      "Client",
      "Montant Total TTC (EUR)",
      "Acompte En Ligne (EUR)",
      "Commission Belora (EUR)",
      "Statut",
      "Stripe Payment Intent",
      "Date",
    ];

    const rows = report.recentTransactions.map((t) => [
      t.id,
      t.reference,
      `"${t.venueName.replace(/"/g, '""')}"`,
      `"${t.clientName.replace(/"/g, '""')}"`,
      t.amountEuros.toFixed(2),
      t.depositEuros.toFixed(2),
      t.commissionEuros.toFixed(2),
      t.status,
      t.stripePaymentIntentId || "N/A",
      t.createdAt,
    ]);

    const csvContent = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="belora_finances_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de l'exportation du fichier comptable.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
