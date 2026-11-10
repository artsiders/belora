# Guide de Déploiement VPS Hostinger & Sécurisation Belora

Ce guide détaille la procédure pas-à-pas pour déployer l'application **Belora** sur un serveur dédié virtuel (VPS) Hostinger sous **Ubuntu 24.04 LTS** ou **Debian 12**, en utilisant Docker Standalone, Caddy (SSL automatique Let's Encrypt), PostgreSQL 16 et Cloudflare.

---

## 1. Préparation Initiale & Sécurisation du Serveur VPS

### 1.1 Mise à jour des paquets système
Connectez-vous en SSH à votre VPS Hostinger :
```bash
ssh root@<IP_VPS_HOSTINGER>
apt update && apt upgrade -y
apt install -y curl wget git ufw fail2ban htop unzip
```

### 1.2 Configuration du Pare-Feu UFW (Hardening Réseau)
Verrouillez tous les ports entrants non indispensables :
```bash
# Autoriser les ports essentiels uniquement
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP Caddy'
ufw allow 443/tcp comment 'HTTPS Caddy'
ufw allow 443/udp comment 'HTTP/3 QUIC Caddy'

# Activation du pare-feu
ufw enable
ufw status verbose
```

### 1.3 Sécurisation SSH avec Fail2ban
Activez et lancez le service fail2ban pour bloquer les tentatives d'intrusion brute-force :
```bash
systemctl enable fail2ban
systemctl start fail2ban
```

---

## 2. Installation de Docker & Docker Compose Plugin

Installez la dernière version officielle de Docker :
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl enable docker
systemctl start docker
```

Vérifiez les versions installées :
```bash
docker --version
docker compose version
```

---

## 3. Déploiement du Projet Belora

### 3.1 Clonage du Dépôt Git
Créez le répertoire de l'application et clonez le dépôt :
```bash
mkdir -p /opt/belora
cd /opt/belora
git clone https://github.com/artsiders/belora.git .
```

### 3.2 Configuration des Variables d'Environnement de Production
Créez le fichier `/opt/belora/.env.production` (non commité dans git) :
```bash
cp .env.example .env.production
nano .env.production
```

Renseignez les valeurs de production réelles :
```ini
# Base de données PostgreSQL Docker interne
POSTGRES_USER=belora_admin
POSTGRES_PASSWORD=VotreMotDePasseTresSecurise_2026!
POSTGRES_DB=belora_prod
DATABASE_URL=postgresql://belora_admin:VotreMotDePasseTresSecurise_2026!@db:5432/belora_prod?schema=public

# URL publique & Auth.js NextAuth v5
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://belora.com
NEXTAUTH_URL=https://belora.com
AUTH_SECRET=CleSecreteGenereeAvecOpensslRandHex32

# Paiements Stripe Production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# E-mails Transactionnels Resend
RESEND_API_KEY=re_...
EMAIL_FROM=Belora <contact@belora.com>

# SMS Transactionnels Brevo
BREVO_API_KEY=xkeysib-...
BREVO_SMS_SENDER=Belora

# Sécurisation des Tâches Planifiées (Cron)
CRON_SECRET=CleCronTresLongueEtSecurisee2026
```

> **Astuce** : Pour générer un secret aléatoire fort pour `AUTH_SECRET` et `CRON_SECRET` :
> ```bash
> openssl rand -hex 32
> ```

---

## 4. Lancement des Conteneurs en Production

Démarrez les conteneurs en arrière-plan :
```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Vérifiez le statut des conteneurs :
```bash
docker compose -f docker-compose.prod.yml ps
```

Vous devriez observer 3 conteneurs en cours d'exécution et sains (`healthy`) :
- `belora-db-prod` (PostgreSQL 16)
- `belora-app` (Next.js 16 Standalone)
- `belora-proxy` (Caddy HTTPS automatique)

### 4.1 Exécution des Migrations et du Seed Initial
Exécutez la synchronisation de schéma Prisma et le seed des salons dans le conteneur `app` :
```bash
docker exec -it belora-app node_modules/.bin/prisma db push
docker exec -it belora-app node_modules/.bin/prisma db seed
```

---

## 5. Configuration DNS & Cloudflare

1. Dans la console Cloudflare (ou votre registrar de domaine) :
   - Ajoutez un enregistrement **A** : `@` pointant vers l'adresse IP publique de votre VPS Hostinger.
   - Ajoutez un enregistrement **A** ou **CNAME** : `www` pointant vers `belora.com`.
2. Configuration SSL/TLS Cloudflare :
   - Mode SSL/TLS : **Full (Strict)**.
   - Always Use HTTPS : **Activé**.
   - HSTS : **Activé**.
   - Protection WAF & DDoS : **Activé**.

---

## 6. Automatisation des Sauvegardes de Base de Données

Configurez la tâche cron quotidienne pour sauvegarder la base PostgreSQL chaque nuit à 03h00 du matin :
```bash
crontab -e
```

Ajoutez la ligne suivante :
```cron
0 3 * * * /opt/belora/scripts/backup-db.sh >> /var/log/belora-backup.log 2>&1
```

Pour tester manuellement la sauvegarde :
```bash
/opt/belora/scripts/backup-db.sh
ls -lh /opt/belora/backups/
```

En cas de besoin de restauration :
```bash
/opt/belora/scripts/restore-db.sh /opt/belora/backups/belora_backup_YYYYMMDD_HHMMSS.sql.gz CONFIRM_OVERWRITE
```

---

## 7. Surveillance & Santé du Service

- **Healthcheck HTTP** :
  ```bash
  curl -i https://belora.com/api/health
  ```
  Réponse attendue : `200 OK` avec `{"status":"healthy","database":"connected",...}`
- **Logs applicatifs en temps réel** :
  ```bash
  docker logs -f belora-app
  ```
- **Logs Caddy et certificats SSL** :
  ```bash
  docker logs -f belora-proxy
  ```
- **Logs base de données** :
  ```bash
  docker logs -f belora-db-prod
  ```
