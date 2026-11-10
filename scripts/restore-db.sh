#!/usr/bin/env bash
# =============================================================================
# Script de Restauration Sécurisée de la Base de Données Belora
# Usage: ./restore-db.sh /path/to/backup.sql.gz [CONFIRM_OVERWRITE]
# =============================================================================
set -euo pipefail

if [ "$#" -lt 1 ]; then
    echo "Usage : $0 <fichier_sauvegarde.sql.gz> [CONFIRM_OVERWRITE]"
    exit 1
fi

BACKUP_FILE="$1"
CONFIRM_FLAG="${2:-}"
CONTAINER_NAME="${DB_CONTAINER:-belora-db-prod}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_NAME="${POSTGRES_DB:-belora_prod}"

if [ ! -f "${BACKUP_FILE}" ]; then
    echo "Erreur : Le fichier de sauvegarde ${BACKUP_FILE} n'existe pas."
    exit 1
fi

if [ "${CONFIRM_FLAG}" != "CONFIRM_OVERWRITE" ]; then
    echo "ATTENTION : Cette opération va écraser les données actuelles de la base '${DB_NAME}' !"
    echo "Pour confirmer, relancez avec l'argument de confirmation :"
    echo "$0 \"${BACKUP_FILE}\" CONFIRM_OVERWRITE"
    exit 1
fi

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Restauration de la base ${DB_NAME} depuis ${BACKUP_FILE}..."

# Décompression et injection dans PostgreSQL
gunzip -c "${BACKUP_FILE}" | docker exec -i "${CONTAINER_NAME}" psql -U "${DB_USER}" -d "${DB_NAME}"

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Restauration terminée avec succès !"
