import { db } from "@/lib/db";

export interface AcquireLockParams {
  venueId: string;
  staffId: string;
  startTime: Date; // UTC
  durationMinutes: number;
  lockDurationSeconds?: number; // 600s = 10 min par défaut
}

export interface LockResult {
  success: boolean;
  lockKey?: string;
  expiresAt?: Date;
  error?: string;
}

export class LockService {
  /**
   * Génère la clé unique identifiant le verrou de réservation
   */
  public static generateLockKey(
    venueId: string,
    staffId: string,
    startTime: Date
  ): string {
    return `lock:${venueId}:${staffId}:${startTime.toISOString()}`;
  }

  /**
   * Nettoie les verrous expirés en base de données
   */
  public static async cleanupExpiredLocks(): Promise<number> {
    const res = await db.holdingLock.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    return res.count;
  }

  /**
   * Tente d'acquérir un verrou de 10 minutes sur un créneau donné
   */
  public static async acquireLock(params: AcquireLockParams): Promise<LockResult> {
    const {
      venueId,
      staffId,
      startTime,
      lockDurationSeconds = 600, // 10 minutes
    } = params;

    await this.cleanupExpiredLocks();

    const lockKey = this.generateLockKey(venueId, staffId, startTime);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + lockDurationSeconds * 1000);

    // Vérifier si un verrou actif existe déjà pour cette clé
    const existingLock = await db.holdingLock.findUnique({
      where: { lockKey },
    });

    if (existingLock && existingLock.expiresAt > now) {
      return {
        success: false,
        error: "Ce créneau fait actuellement l'objet d'une réservation en cours de finalisation.",
      };
    }

    try {
      const lock = await db.holdingLock.upsert({
        where: { lockKey },
        update: {
          expiresAt,
          createdAt: now,
        },
        create: {
          lockKey,
          expiresAt,
          createdAt: now,
        },
      });

      return {
        success: true,
        lockKey: lock.lockKey,
        expiresAt: lock.expiresAt,
      };
    } catch (err) {
      console.error("Erreur lors de l'acquisition du verrou:", err);
      return {
        success: false,
        error: "Impossible de réserver temporairement ce créneau. Veuillez réessayer.",
      };
    }
  }

  /**
   * Libère un verrou manuellement (ex: abandon de panier)
   */
  public static async releaseLock(lockKey: string): Promise<boolean> {
    try {
      await db.holdingLock.deleteMany({
        where: { lockKey },
      });
      return true;
    } catch {
      // Si le verrou n'existait pas ou était déjà expiré, on ignore
      return false;
    }
  }

  /**
   * Vérifie si un créneau précis est actuellement verrouillé
   */
  public static async isLocked(
    venueId: string,
    staffId: string,
    startTime: Date
  ): Promise<boolean> {
    const lockKey = this.generateLockKey(venueId, staffId, startTime);
    const lock = await db.holdingLock.findUnique({
      where: { lockKey },
    });

    if (!lock) return false;
    return lock.expiresAt > new Date();
  }
}
