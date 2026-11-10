import { describe, it, expect } from "vitest";
import { GET as healthRoute } from "@/app/api/health/route";
import fs from "fs";
import path from "path";

describe("Sprint 13 — Déploiement VPS Hostinger, Docker & Sécurisation Finale", () => {
  // ===========================================================================
  // 1. HEALTHCHECK ENDPOINT
  // ===========================================================================
  it("1. GET /api/health should return 200 OK with connected database", async () => {
    const res = await healthRoute();
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe("healthy");
    expect(body.database).toBe("connected");
    expect(body.timestamp).toBeDefined();
    expect(body.responseTimeMs).toBeGreaterThanOrEqual(0);
  });

  // ===========================================================================
  // 2. CONFIGURATION NEXT.JS STANDALONE & SÉCURITÉ
  // ===========================================================================
  it("2. next.config.ts should have standalone output and HTTP security headers configured", async () => {
    const nextConfigPath = path.join(process.cwd(), "next.config.ts");
    expect(fs.existsSync(nextConfigPath)).toBe(true);

    const content = fs.readFileSync(nextConfigPath, "utf-8");
    expect(content).toContain('output: "standalone"');
    expect(content).toContain("Strict-Transport-Security");
    expect(content).toContain("X-Frame-Options");
    expect(content).toContain("X-Content-Type-Options");
    expect(content).toContain("Referrer-Policy");
    expect(content).toContain("Permissions-Policy");
  });

  // ===========================================================================
  // 3. ARTEFACTS DOCKER & DOCKER-COMPOSE PRODUCTION
  // ===========================================================================
  it("3. Dockerfile should be a multi-stage Alpine build with non-root user", () => {
    const dockerfilePath = path.join(process.cwd(), "Dockerfile");
    expect(fs.existsSync(dockerfilePath)).toBe(true);

    const content = fs.readFileSync(dockerfilePath, "utf-8");
    expect(content).toContain("FROM node:20-alpine AS base");
    expect(content).toContain("FROM base AS deps");
    expect(content).toContain("FROM base AS builder");
    expect(content).toContain("FROM node:20-alpine AS runner");
    expect(content).toContain("adduser --system --uid 1001 nextjs");
    expect(content).toContain("server.js");
    expect(content).toContain("/api/health");
  });

  it("4. docker-compose.prod.yml should define app, db, and proxy services", () => {
    const composePath = path.join(process.cwd(), "docker-compose.prod.yml");
    expect(fs.existsSync(composePath)).toBe(true);

    const content = fs.readFileSync(composePath, "utf-8");
    expect(content).toContain("postgres:16-alpine");
    expect(content).toContain("belora-app");
    expect(content).toContain("caddy:2-alpine");
    expect(content).toContain("belora_pgdata_prod");
    expect(content).toContain("caddy_data");
  });

  it("5. Caddyfile should be configured with Let's Encrypt TLS and reverse proxy", () => {
    const caddyPath = path.join(process.cwd(), "Caddyfile");
    expect(fs.existsSync(caddyPath)).toBe(true);

    const content = fs.readFileSync(caddyPath, "utf-8");
    expect(content).toContain("belora.com");
    expect(content).toContain("reverse_proxy app:3000");
    expect(content).toContain("health_uri /api/health");
    expect(content).toContain("encode zstd gzip");
  });

  // ===========================================================================
  // 4. SCRIPTS DE SAUVEGARDE & RESTAURATION BASE DE DONNÉES
  // ===========================================================================
  it("6. Backup and restore scripts should exist and be executable", () => {
    const backupScript = path.join(process.cwd(), "scripts", "backup-db.sh");
    const restoreScript = path.join(process.cwd(), "scripts", "restore-db.sh");

    expect(fs.existsSync(backupScript)).toBe(true);
    expect(fs.existsSync(restoreScript)).toBe(true);

    const backupContent = fs.readFileSync(backupScript, "utf-8");
    expect(backupContent).toContain("pg_dump");
    expect(backupContent).toContain("gzip");
    expect(backupContent).toContain("RETENTION_DAYS");

    const restoreContent = fs.readFileSync(restoreScript, "utf-8");
    expect(restoreContent).toContain("CONFIRM_OVERWRITE");
    expect(restoreContent).toContain("psql");
  });

  // ===========================================================================
  // 5. DOCUMENTATION DÉPLOIEMENT VPS HOSTINGER
  // ===========================================================================
  it("7. VPS Hostinger deployment guide should be comprehensive", () => {
    const docPath = path.join(process.cwd(), "docs", "VPS-DEPLOYMENT-HOSTINGER.md");
    expect(fs.existsSync(docPath)).toBe(true);

    const content = fs.readFileSync(docPath, "utf-8");
    expect(content).toContain("ufw");
    expect(content).toContain("fail2ban");
    expect(content).toContain("Cloudflare");
    expect(content).toContain("crontab");
  });
});
