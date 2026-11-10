#!/usr/bin/env bash
# =============================================================================
# Script de Sauvegarde Quotidienne Automatique de la Base de Données Belora
# =============================================================================
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/opt/belora/backups}"
CONTAINER_NAME="${DB_CONTAINER:-belora-db-prod}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_NAME="${POSTGRES_DB:-belora_prod}"
RETENTION_DAYS=7

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="belora_backup_${TIMESTAMP}.sql.gz"
TARGET_FILE="${BACKUP_DIR}/${FILENAME}"

mkdir -p "${BACKUP_DIR}"

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Démarrage de la sauvegarde de ${DB_NAME}..."

# Exécution de pg_dump via docker exec
docker exec -t "${CONTAINER_NAME}" pg_dump -U "${DB_USER}" -d "${DB_NAME}" --clean --if-exists | gzip -9 > "${TARGET_FILE}"

FILE_SIZE=$(du -h "${TARGET_FILE}" | cut -f1)
echo "[$(date +'%Y-%m-%d %H:%M:%S')] Sauvegarde réussie : ${TARGET_FILE} (${FILE_SIZE})"

# Chiffrement optionnel GPG si la variable GPG_RECIPIENT est définie
if [ -n "${GPG_RECIPIENT:-}" ]; then
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] Chiffrement GPG de la sauvegarde..."
    gpg --batch --yes --encrypt --recipient "${GPG_RECIPIENT}" "${TARGET_FILE}"
    rm -f "${TARGET_FILE}"
    TARGET_FILE="${TARGET_FILE}.gpg"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] Fichier chiffré : ${TARGET_FILE}"
fi

# Synchronisation vers stockage distant (S3 / Cloudflare R2 / Hostinger Object Storage) si configuré
if command -v aws >/dev/null 2>&1 && [ -n "${BACKUP_S3_BUCKET:-}" ]; then
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] Synchronisation distante vers ${BACKUP_S3_BUCKET}..."
    aws s3 cp "${TARGET_FILE}" "s3://${BACKUP_S3_BUCKET}/backups/${FILENAME}"
fi

# Nettoyage des sauvegardes locales âgées de plus de RETENTION_DAYS jours
echo "[$(date +'%Y-%m-%d %H:%M:%S')] Nettoyage des anciennes sauvegardes (> ${RETENTION_DAYS} jours)..."
find "${BACKUP_DIR}" -name "belora_backup_*.sql.gz*" -mtime +"${RETENTION_DAYS}" -exec rm -f {} \;

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Opération de sauvegarde terminée avec succès."
