import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "unknown";

  try {
    // Ping rapide de la base de données PostgreSQL
    await db.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch (err: unknown) {
    dbStatus = "disconnected";
    const errorMessage = err instanceof Error ? err.message : "Erreur de connexion base de données";
    return NextResponse.json(
      {
        status: "unhealthy",
        database: dbStatus,
        error: errorMessage,
        timestamp: new Date().toISOString(),
        responseTimeMs: Date.now() - startTime,
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    status: "healthy",
    environment: process.env.NODE_ENV || "production",
    database: dbStatus,
    timestamp: new Date().toISOString(),
    responseTimeMs: Date.now() - startTime,
  });
}
