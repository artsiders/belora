import { NextResponse } from "next/server";
import { z } from "zod";
import { LockService } from "@/modules/availability/lock.service";

const acquireLockSchema = z.object({
  venueId: z.string().min(1, "venueId requis"),
  staffId: z.string().min(1, "staffId requis"),
  startTime: z.string().datetime({ message: "startTime doit être une date ISO 8601 UTC valide" }),
  durationMinutes: z.number().int().min(5),
});

const releaseLockSchema = z.object({
  lockKey: z.string().min(1, "lockKey requis"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = acquireLockSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Paramètres de verrouillage invalides" },
        { status: 400 }
      );
    }

    const { venueId, staffId, startTime, durationMinutes } = parsed.data;

    const lockResult = await LockService.acquireLock({
      venueId,
      staffId,
      startTime: new Date(startTime),
      durationMinutes,
    });

    if (!lockResult.success) {
      return NextResponse.json(
        { error: lockResult.error || "Créneau temporairement indisponible" },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      lockKey: lockResult.lockKey,
      expiresAt: lockResult.expiresAt?.toISOString(),
    });
  } catch (err) {
    console.error("POST /api/availability/lock error:", err);
    return NextResponse.json(
      { error: "Impossible de verrouiller le créneau." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parsed = releaseLockSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Identifiant de verrou manquant" },
        { status: 400 }
      );
    }

    await LockService.releaseLock(parsed.data.lockKey);
    return NextResponse.json({ success: true, message: "Verrou libéré" });
  } catch (err) {
    console.error("DELETE /api/availability/lock error:", err);
    return NextResponse.json(
      { error: "Impossible de libérer le verrou." },
      { status: 500 }
    );
  }
}
