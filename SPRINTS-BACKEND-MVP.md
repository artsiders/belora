# Belora — Feuille de Route d'Ingénierie Backend MVP
## Découpage Opérationnel en Sprints Exhaustifs

> **Document de Référence Technique pour le Développement Backend.**  
> Ce document détaille l'intégralité des briques à implémenter pour transformer les interfaces Belora en une application de réservation et de gestion salon prête pour la production.  
> **Choix techniques validés :** NextAuth v5 (Auth.js) • Prisma ORM & PostgreSQL • API Routes Next.js App Router + Axios (`apiClient`) + React Query • Stripe Connect Express • Resend (E-mails) • Brevo (SMS).

---

## Sommaire des Sprints

- [Sprint 0 — Base de Données, Modèle Prisma & Données de Démonstration](#sprint-0--base-de-données-modèle-prisma--données-de-démonstration)
- [Sprint 1 — Authentification NextAuth v5, Sessions & Sécurité RBAC](#sprint-1--authentification-nextauth-v5-sessions--sécurité-rbac)
- [Sprint 2 — Infrastructure Réseau Client (Axios + React Query) & DTOs Zod](#sprint-2--infrastructure-réseau-client-axios--react-query--dtos-zod)
- [Sprint 3 — Moteur de Disponibilités & Verrouillage Anti-Collision](#sprint-3--moteur-de-disponibilités--verrouillage-anti-collision)
- [Sprint 4 — API Publique Marketplace & Données Salons](#sprint-4--api-publique-marketplace--données-salons)
- [Sprint 5 — Tunnel de Réservation & Flux Financier Stripe Connect](#sprint-5--tunnel-de-réservation--flux-financier-stripe-connect)
- [Sprint 6 — Notifications E-mails (Resend) & SMS (Brevo)](#sprint-6--notifications-e-mails-resend--sms-brevo)
- [Sprint 7 — Espace Pro : Agenda Dynamique & Pointage Présences](#sprint-7--espace-pro--agenda-dynamique--pointage-présences)
- [Sprint 8 — Espace Pro : Caisse Enregistreuse POS & Clôture Fiscale Z](#sprint-8--espace-pro--caisse-enregistreuse-pos--clôture-fiscale-z)
- [Sprint 9 — Espace Pro : Fichier Clients CRM & Fiches Techniques](#sprint-9--espace-pro--fichier-clients-crm--fiches-techniques)
- [Sprint 10 — Espace Pro : Catalogue Prestations & Paramètres Salon](#sprint-10--espace-pro--catalogue-prestations--paramètres-salon)
- [Sprint 11 — Compte Client, Annulations & Avis Vérifiés](#sprint-11--compte-client-annulations--avis-vérifiés)
- [Sprint 12 — Panneau Super-Admin Belora Plateforme (/admin)](#sprint-12--panneau-super-admin-belora-plateforme-admin)
- [Sprint 13 — Déploiement VPS Hostinger, Docker & Sécurisation Finale](#sprint-13--déploiement-vps-hostinger-docker--sécurisation-finale)

---

## Sprint 0 — Base de Données, Modèle Prisma & Données de Démonstration

### Objectif
Mettre en place l'infrastructure de persistance PostgreSQL locale, initialiser l'ORM Prisma, définir l'intégralité du modèle relationnel et injecter des données réalistes de démonstration.

### Tâches Détaillées
1. **Infrastructure Docker Locale** :
   - Créer `docker-compose.yml` avec PostgreSQL 16 et persistance sur volume `belora_pgdata`.
   - Configurer `.env.local` avec `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/belora_dev?schema=public"`.
2. **Initialisation Prisma & Schéma Exhaustif** (`prisma/schema.prisma`) :
   - **Enums** :
     - `Role` (`CUSTOMER`, `PRO`, `ADMIN`).
     - `VenueStatus` (`DRAFT`, `PENDING_VALIDATION`, `PUBLISHED`, `SUSPENDED`).
     - `BookingStatus` (`PENDING_PAYMENT`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`).
     - `PaymentStatus` (`PENDING`, `SUCCEEDED`, `REFUNDED`, `FAILED`).
     - `PaymentMethod` (`CARD_ONLINE`, `CARD_TERMINAL`, `CASH`, `MIXED`).
   - **Tables Principales** :
     - `User` : id, email, passwordHash, firstName, lastName, phone, role, emailVerified, createdAt, updatedAt.
     - `Account` & `Session` : tables standard Auth.js / NextAuth pour OAuth et sessions.
     - `Venue` : id, slug (unique), name, description, address, city, postalCode, countryCode, latitude, longitude, phone, email, currency (EUR), timezone (Europe/Paris), status, stripeAccountId, commissionRate, ownerId.
     - `VenueOpeningHour` : id, venueId, dayOfWeek (0-6), openTime, closeTime, isOpen.
     - `StaffMember` : id, venueId, userId, name, role, color, avatarUrl, isActive.
     - `StaffSchedule` : id, staffId, dayOfWeek, plannedStart, plannedEnd, isActive.
     - `StaffTimeOff` : id, staffId, startDate, endDate, reason.
     - `StaffClockIn` : id, staffId, date, clockInTime, clockOutTime.
     - `Resource` : id, venueId, name, type (Fauteuil, Cabine, etc.), color, isActive.
     - `ServiceCategory` : id, venueId, name, order.
     - `Service` : id, venueId, categoryId, name, description, durationMinutes, processingTimeMinutes (temps de pose), priceCents, depositRequired, depositCents, order, isActive.
     - `CustomerCRM` : id, venueId, firstName, lastName, phone, email, isVip, notes, techFormulas (JSON : formules coloration, diagnostic cuir chevelu), totalVisits, totalSpentCents.
     - `Booking` : id, reference (#BEL-XXXXX), venueId, customerId, clientName, clientPhone, clientEmail, status, totalPriceCents, depositCents, remainingCents, notes, cancellationReason, cancelledAt.
     - `BookingItem` : id, bookingId, serviceId, staffId, resourceId, startTime (DateTime UTC), endTime (DateTime UTC), priceCents.
     - `HoldingLock` : id, lockKey, expiresAt (verrou de 10 min pour panier).
     - `SaleTicket` : id, ticketNumber, venueId, bookingId, clientName, totalTtcCents, subtotalHtCents, vatAmountCents, paymentMethod, cardAmountCents, cashAmountCents, depositDeductedCents, createdAt.
     - `DailyClosing` : id, venueId, date, totalTtcCents, totalHtCents, vatAmountCents, totalCardCents, totalCashCents, totalDepositsCents, cashCountedCents, discrepancyCents, closedAt.
     - `Review` : id, venueId, bookingId, authorName, rating (1-5), comment, isVerified, reply, replyAt.
     - `PlatformSetting` : id, defaultCommissionRate, maintenanceMode.
3. **Singleton Prisma Client** (`src/lib/db.ts`) :
   - Instanciation robuste avec gestion du hot-reload Next.js en développement.
4. **Script de Seed Réaliste** (`prisma/seed.ts`) :
   - Création des comptes types : `admin@belora.com`, `pro@atelierbotanique.fr`, `client@belora.com`.
   - Création de *L'Atelier Botanique* (Paris 3e), ses 4 artisans réels (Hélène, Clément, Élodie, Thomas), ses cabines, son catalogue de 8 rituels, ses créneaux de la semaine et 10 fiches clients historiques avec formules techniques.

---

## Sprint 1 — Authentification NextAuth v5, Sessions & Sécurité RBAC

### Objectif
Sécuriser l'application avec un système d'authentification robuste NextAuth v5 (Auth.js) supportant la connexion par mot de passe et Google OAuth, avec enrichissement de session et contrôle d'accès par rôles (RBAC).

### Tâches Détaillées
1. **Configuration NextAuth v5** (`src/lib/auth.ts`, `src/auth.config.ts`) :
   - Adaptateur Prisma (`@auth/prisma-adapter`).
   - Stratégie de session JWT sécurisée avec cookies HTTP-only `SameSite=Lax`.
   - Providers configurés :
     - `CredentialsProvider` avec validation Zod et hachage sécurisé (bcrypt/argon2).
     - `GoogleProvider` avec liaison automatique de compte.
2. **Enrichissement du Token & Session Callback** :
   - Injection de `user.role` (`CUSTOMER`, `PRO`, `ADMIN`).
   - Pour les comptes Pro : injection de `venueId` et `staffId` dans le token de session pour éviter toute requête répétitive en base.
3. **Middleware de Protection des Routes** (`src/middleware.ts`) :
   - Routes protégées Client : `/account/*` $\to$ exige `CUSTOMER`, `PRO` ou `ADMIN`.
   - Routes protégées Pro : `/pro/*` (sauf `/pro`, `/pro/join`) $\to$ exige `PRO` ou `ADMIN`.
   - Routes protégées Admin : `/admin/*` $\to$ exige `ADMIN`.
   - Redirection automatique vers `/login?callbackUrl=...` avec conservation de l'URL cible.
4. **Endpoints API d'Authentification** :
   - `POST /api/auth/register` : inscription d'un compte particulier avec validation Zod (e-mail unique, force du mot de passe).
   - `POST /api/auth/register-pro` : inscription initiale d'un gérant d'établissement.
   - `GET /api/auth/me` : profil courant et permissions.
5. **Connexion des Écrans de Login / Inscription Existants** :
   - Brancher `src/app/(auth)/login/page.tsx` sur `signIn("credentials", ...)` et `signIn("google")`.
   - Brancher `src/app/(auth)/register/page.tsx`.

---

## Sprint 2 — Infrastructure Réseau Client (Axios + React Query) & DTOs Zod

### Objectif
Mettre en place la couche réseau standardisée obligatoire (Directive `.agents/AGENTS.md` Règle 17 : pas de Server Actions, API Routes Next.js, Axios et React Query).

### Tâches Détaillées
1. **Client Axios Préconfiguré** (`src/lib/api-client.ts`) :
   - Base URL relative `/api`.
   - Intercepteur de requête : injection automatique des en-têtes et CSRF si requis.
   - Intercepteur de réponse : normalisation des erreurs vers un format strict `{ error: string, statusCode: number }`. Pas de message technique exposé (Cloudinary, Prisma, Postgres masqués).
2. **Fournisseur Global React Query** (`src/providers/query-provider.tsx`) :
   - Configuration `QueryClient` :
     - `staleTime: 60_000` ms (1 min).
     - `gcTime: 600_000` ms (10 min).
     - `refetchOnWindowFocus: false` pour éviter les clignotements.
     - `placeholderData: keepPreviousData` sur les listes paginées.
   - Intégration dans `src/app/layout.tsx`.
3. **Schémas de Validation Zod & Types Partagés** (`src/lib/validations/`) :
   - `booking.schema.ts` : validation création RDV, dates ISO, téléphone libphonenumber.
   - `service.schema.ts` : validation prix en centimes, durées, temps de pose.
   - `client.schema.ts` : validation nom, prénom, email, téléphone, allergies.
   - `venue.schema.ts` : validation coordonnées, SIRET, horaires.

---

## Sprint 3 — Moteur de Disponibilités & Verrouillage Anti-Collision

### Objectif
Développer le cœur algorithmique de Belora : le moteur de calcul des créneaux libres en temps réel, garantissant zéro double réservation et gérant le multi-prestations, les temps de pose et les fuseaux horaires.

### Tâches Détaillées
1. **Gestion Temporelle Universelle (UTC)** (`src/modules/availability/time-utils.ts`) :
   - Toutes les comparaisons et stockages de dates en base s'effectuent strictement en UTC.
   - Conversion d'affichage selon le fuseau de l'établissement (`Europe/Paris`).
2. **Algorithme de Calcul des Créneaux Libres** (`src/modules/availability/availability.service.ts`) :
   - Paramètres d'entrée : `venueId`, `serviceIds[]`, `staffId` (optionnel ou "any"), `targetDate`.
   - Étape 1 : Récupérer les horaires d'ouverture du salon pour le jour donné.
   - Étape 2 : Récupérer les collaborateurs qualifiés pour tous les services sélectionnés.
   - Étape 3 : Croiser avec le planning de présence du collaborateur (`StaffSchedule`) et ses congés (`StaffTimeOff`).
   - Étape 4 : Déduire les rendez-vous existants (`BookingItem`), pauses et pointages non terminés.
   - Étape 5 : Gestion des temps de pose autonomes (ex: 30 min de pose coloration libère le praticien pour un brushing express).
   - Étape 6 : Si une cabine/ressource est exigée, vérifier la disponibilité de la ressource en simultané (double allocation synchronisée).
   - Étape 7 : Granularité configurable (10, 15, 20 ou 30 min).
3. **Option « Sans Préférence »** :
   - Répartir intelligemment la charge en affectant en priorité le collaborateur ayant le moins de charge ou comblant un trou d'agenda.
4. **Verrouillage Temporaire de Panier (Hold Lock)** :
   - Table `HoldingLock` : quand un client commence l'étape coordonnées/paiement, le créneau est verrouillé 10 minutes.
   - Expiration automatique si le paiement n'est pas finalisé.
5. **Endpoint API** :
   - `GET /api/availability?venueId=...&services=...&date=...&staffId=...`
6. **Suite de Tests Unitaires Vitest** (`tests/unit/availability.test.ts`) :
   - Test de chevauchement strict.
   - Test des créneaux en limite d'horaire de fermeture.
   - Test du changement d'heure hiver/été.
   - Test de non-collision en concurrence simultanée.

---

## Sprint 4 — API Publique Marketplace & Données Salons

### Objectif
Créer les routes API publiques pour alimenter l'accueil, la recherche avec carte interactive et la fiche salon, puis brancher les pages existantes avec React Query.

### Tâches Détaillées
1. **Endpoints API Marketplace** :
   - `GET /api/venues` :
     - Paramètres : `category`, `city`, `lat`, `lng`, `radius`, `priceMin`, `priceMax`, `ratingMin`, `search`.
     - En-tête HTTP : `Cache-Control: public, s-maxage=10, stale-while-revalidate=59`.
   - `GET /api/venues/[slug]` :
     - Détails complets du lieu : prestations groupées par catégories, équipe avec avatars, horaires d'ouverture, avis vérifiés, photos haute résolution.
   - `GET /api/categories` : liste des univers beauté (Coiffure, Barbier, Onglerie, Soins, etc.).
2. **Brancher la Page d'Accueil (`src/app/page.tsx`)** :
   - Remplacer les données statiques par `useQuery({ queryKey: ['venues', 'featured'], ... })`.
3. **Brancher la Recherche & Carte (`src/app/search/page.tsx`)** :
   - Connecter les filtres de recherche et la liste des établissements aux données de `/api/venues`.
   - Synchroniser les marqueurs Leaflet sur les coordonnées réelles des salons.
4. **Brancher la Fiche Établissement (`src/app/venue/[slug]/page.tsx`)** :
   - Récupération dynamique par slug avec état de chargement ciblé (skeleton inline sans flash global) et gestion propre des erreurs.

---

## Sprint 5 — Tunnel de Réservation & Flux Financier Stripe Connect

### Objectif
Connecter le tunnel de réservation mobile-first en 4 étapes à la création réelle de réservations en base et au paiement sécurisé par Stripe Connect (acompte ou montant total avec déduction de la commission Belora).

### Tâches Détaillées
1. **Intégration Stripe Connect Express** (`src/lib/stripe.ts`, `src/modules/payments/`) :
   - Création de compte connecté pour l'établissement (`stripe.accounts.create`).
   - Lien d'onboarding Stripe pour le professionnel (`stripe.accountLinks.create`).
2. **Flux de Paiement Hybride (Acompte en Ligne / Solde en Salon)** :
   - Si la prestation exige un acompte (ex : 30%) : le client règle l'acompte par carte bancaire.
   - Belora prélève sa commission de plateforme via `application_fee_amount`.
   - Le solde restant (`remainingCents`) est inscrit sur le booking pour être encaissé au salon le jour J.
3. **Création Transactionnelle du Rendez-vous** :
   - `POST /api/bookings` :
     - Validation Zod des coordonnées client (nom, email, téléphone).
     - Transaction Prisma en mode isolation sérialisable : vérification finale que le créneau n'a pas été réservé pendant la saisie.
     - Création de l'enregistrement `Booking` et des `BookingItem`s.
     - Création du `PaymentIntent` Stripe avec métadonnées (`bookingId`, `venueId`).
     - Retour du `clientSecret` Stripe pour le formulaire de carte bancaire.
4. **Gestionnaire de Webhooks Stripe** (`src/app/api/webhooks/stripe/route.ts`) :
   - Vérification cryptographique de la signature `stripe-signature`.
   - Gestion de l'idempotence (vérifier si le webhook n'a pas déjà été traité).
   - Événement `payment_intent.succeeded` : passage du statut du RDV à `CONFIRMED`, enregistrement du paiement, déclenchement des e-mails.
   - Événement `payment_intent.payment_failed` : libération immédiate du créneau et notification client.
5. **Brancher le Tunnel (`src/app/book/[venueSlug]/book-client.tsx`)** :
   - Étape 1 (Services) $\to$ Étape 2 (Artisans réels de la base) $\to$ Étape 3 (Créneaux dynamiques de `/api/availability`) $\to$ Étape 4 (Formulaire client + Stripe Elements) $\to$ Écran confirmation avec référence unique `#BEL-XXXXX`.

---

## Sprint 6 — Notifications E-mails (Resend) & SMS (Brevo)

### Objectif
Implémenter la chaîne de notification transactionnelle automatique pour sécuriser la présence des clients et éliminer les no-shows.

### Tâches Détaillées
1. **Moteur d'E-mails avec Resend & React Email** (`src/lib/email.ts`, `src/emails/`) :
   - Template 1 : Confirmation de réservation client (date, heure, adresse, artisan, récapitulatif acompte réglé et solde à payer).
   - Template 2 : Notification de nouvelle réservation pour le gérant du salon.
   - Template 3 : Rappel 24h avant le rendez-vous avec lien de modification/annulation.
   - Template 4 : Confirmation d'annulation et reçu de remboursement.
   - Template 5 : Reçu de caisse dématérialisé envoyé après encaissement POS.
2. **Service SMS avec Brevo** (`src/lib/sms.ts`) :
   - Configuration du client Brevo Transactional SMS.
   - Modèle de SMS court et sobre : *"Rappel Belora : Votre rdv chez L'Atelier Botanique est demain à 14h00 avec Hélène. Adresse : 18 rue de Turenne Paris."*.
3. **Tâche Automatisée de Rappels (Worker / Route Cron)** :
   - `POST /api/cron/reminders` (sécurisé par secret d'autorisation `CRON_SECRET`) :
     - Recherche des réservations prévues dans les prochaines 24 à 48 heures sans rappel envoyé.
     - Envoi des e-mails et SMS de rappel, mise à jour du marqueur `reminderSentAt`.

---

## Sprint 7 — Espace Pro : Agenda Dynamique & Pointage Présences

### Objectif
Remplacer les états locaux de l'Agenda Pro par des requêtes React Query synchronisées avec la base de données, permettant la gestion en direct des rendez-vous et des présences.

### Tâches Détaillées
1. **Endpoints API Agenda Pro** :
   - `GET /api/pro/appointments?startDate=...&endDate=...` : retourne les RDVs de la période avec détails client, service, collaborateur et ressource.
   - `POST /api/pro/appointments` : création d'un RDV manuel pris au salon ou par téléphone.
   - `PATCH /api/pro/appointments/[id]` : mise à jour d'un RDV (déplacement horaire, changement de collaborateur, statut : honoré, no-show, annulé).
   - `DELETE /api/pro/appointments/[id]` : annulation avec libération du créneau.
   - `POST /api/pro/staff/clock-in` : enregistrement de l'arrivée / du départ d'un collaborateur pour la journée.
2. **Brancher `src/app/pro/(dashboard)/agenda/page.tsx`** :
   - Hook `useAppointments(currentDate, viewMode)` : chargement temps réel.
   - Mutations avec mise à jour optimiste du calendrier lors du déplacement d'un créneau.
   - Brancher `appointment-modal.tsx` (détails RDV, encaissement direct, annulation).
   - Brancher `clock-in-modal.tsx` sur `/api/pro/staff/clock-in`.
   - Brancher `presence-modal.tsx` sur la mise à jour des plages de présence du jour.

---

## Sprint 8 — Espace Pro : Caisse Enregistreuse POS & Clôture Fiscale Z

### Objectif
Connecter le terminal de caisse POS à la base de données pour gérer l'encaissement des clients, la déduction automatique des acomptes Stripe et la clôture journalière Z certifiée.

### Tâches Détaillées
1. **Endpoints API Caisse POS** :
   - `GET /api/pro/checkout/pending-appointments` : liste des RDVs du jour terminés ou confirmés en attente de règlement.
   - `POST /api/pro/checkout/tickets` :
     - Validation du panier (prestations et produits de revente).
     - Déduction automatique de l'acompte Stripe perçu en amont.
     - Répartition des modes de règlement (Carte bancaire, Espèces, Mixte).
     - Calcul automatique de la TVA (20%) et du hors taxes.
     - Génération d'un numéro de ticket séquentiel inaltérable (`#TC-2026-XXXX`).
     - Mise à jour du statut du RDV à `COMPLETED`.
   - `GET /api/pro/checkout/daily-summary` : total des encaissements du jour ventilé par moyen de paiement.
   - `POST /api/pro/checkout/daily-closing` : clôture Z de caisse journalière, calcul de l'écart de caisse (fond de caisse + espèces théoriques vs espèces comptées), verrouillage comptable des ventes de la journée.
2. **Brancher `src/app/pro/(dashboard)/checkout/page.tsx` & `checkout-terminal.tsx`** :
   - Connecter la sidebar caisse à la liste réelle des RDVs du jour cliquables en 1 clic.
   - Connecter l'attribution client au CRM.
   - Connecter la modale `daily-closing-modal.tsx` à la clôture Z réelle en base.

---

## Sprint 9 — Espace Pro : Fichier Clients CRM & Fiches Techniques

### Objectif
Connecter l'annuaire CRM de l'atelier à la base de données, avec segmentation intelligente et sauvegarde des fiches techniques confidentielles.

### Tâches Détaillées
1. **Endpoints API Clients CRM** :
   - `GET /api/pro/clients` :
     - Paramètres : `segment` (`all`, `vip`, `regulars`, `new`, `inactive`), `search`, `page`, `limit`.
     - Calcul des agrégats : nombre de visites, chiffre d'affaires cumulé, date de dernière visite.
   - `POST /api/pro/clients` : création manuelle d'une fiche client.
   - `GET /api/pro/clients/[id]` : fiche complète avec historique de tous les rituels passés et formules techniques.
   - `PATCH /api/pro/clients/[id]` : mise à jour des notes d'accueil et des fiches techniques (formules de coloration, diagnostic capillaire).
2. **Brancher `src/app/pro/(dashboard)/clients/page.tsx`** :
   - Connecter `clients-sidebar.tsx` aux compteurs réels en base.
   - Connecter `client-drawer.tsx` à la consultation et à l'édition des fiches techniques.
   - Connecter `new-client-modal.tsx` à la mutation de création.

---

## Sprint 10 — Espace Pro : Catalogue Prestations & Paramètres Salon

### Objectif
Permettre au professionnel de piloter l'ensemble de son offre commerciale et de ses paramètres opérationnels depuis son backoffice.

### Tâches Détaillées
1. **Gestion du Catalogue de Prestations** (`/pro/settings/services`) :
   - `GET /api/pro/services` : arborescence des catégories et prestations.
   - `POST /api/pro/services` & `PATCH /api/pro/services/[id]` : création et modification (durée, temps de pose, prix TTC, acompte exigé).
   - `POST /api/pro/services/duplicate` : duplication rapide d'un rituel.
   - `POST /api/pro/services/mass-price` : augmentation/diminution générale des tarifs (en % ou en €) sur une catégorie ou sur tout le catalogue.
2. **Paramètres Établissement** (`/pro/settings/establishment`) :
   - `GET /api/pro/settings/establishment` & `PATCH /api/pro/settings/establishment` : mise à jour des coordonnées légales (SIRET, numéro TVA, adresse, horaires d'ouverture hebdomadaires, délais de prévenance annulation).
3. **Gestion du Temps de Travail** (`/pro/settings/team`) :
   - `GET /api/pro/settings/team` & `PATCH /api/pro/settings/team/[staffId]` : horaires hebdomadaires planifiés par collaborateur.
4. **Paramètres Caisse & Notifications** :
   - Enregistrement des préférences de caisse et des modèles de SMS/E-mails.

---

## Sprint 11 — Compte Client, Annulations & Avis Vérifiés

### Objectif
Offrir au client final un espace personnel autonome pour consulter ses réservations, modifier/annuler selon la politique du salon et déposer un avis certifié.

### Tâches Détaillées
1. **Endpoints API Espace Client** :
   - `GET /api/account/bookings` : réservations à venir et passées du client connecté.
   - `POST /api/account/bookings/[id]/cancel` :
     - Vérification de la politique d'annulation de l'établissement (ex : annulation gratuite jusqu'à 24h avant).
     - Si éligible à remboursement : appel à Stripe Refund pour rembourser l'acompte automatiquement.
     - Libération du créneau sur l'agenda pro et envoi des e-mails d'annulation.
   - `POST /api/account/reviews` :
     - Dépôt d'une note (1 à 5 étoiles) et d'un commentaire uniquement si le rendez-vous est marqué `COMPLETED`.
     - Marqueur `isVerified: true`.
2. **Brancher `src/app/account/account-client.tsx`** sur les données réelles avec React Query.

---

## Sprint 12 — Panneau Super-Admin Belora Plateforme (/admin)

### Objectif
Construire l'interface d'administration centrale réservée à l'équipe Belora pour piloter la marketplace, valider les salons, modérer le contenu et suivre la rentabilité de la plateforme.

### Tâches Détaillées
1. **Layout & Armature Super-Admin** (`src/app/admin/layout.tsx`, `admin-sidebar.tsx`) :
   - Thème sobre et dense : Charbon / Lin clair, filets fins.
   - Sidebar Admin : *Vue d'ensemble*, *Établissements*, *Création Assistée*, *Utilisateurs*, *Avis & Modération*, *Monétisation & Commissions*, *Journal d'Audit*.
2. **Tableau de Bord Plateforme** (`/admin/dashboard`) :
   - KPIs temps réel : Volume d'affaires brut (GMV), Commissions Belora perçues, Nombre total de réservations, Salons actifs.
3. **Gestion & Validation des Salons** (`/admin/venues`) :
   - Liste des salons en attente de vérification (`PENDING_VALIDATION`).
   - Actions : Valider et publier (`PUBLISHED`), suspendre (`SUSPENDED`).
4. **Création Assistée d'Établissement** (`/admin/venues/create-assisted`) :
   - Module d'onboarding manuel : l'équipe Belora saisit les informations pour le compte des 20 à 30 premiers salons partenaires, puis génère un lien d'invitation sécurisé pour que le pro prenne le contrôle de son compte.
5. **Monétisation & Commissions** (`/admin/monetization`) :
   - Configuration du taux de commission plateforme par défaut (ex : 0% sur habitués, X% sur nouveaux clients marketplace).
   - Suivi des frais de paiement Stripe et des commissions collectées.
6. **Modération des Avis** (`/admin/reviews`) :
   - Traitement des signalements d'avis inappropriés et masquage.

---

## Sprint 13 — Déploiement VPS Hostinger, Docker & Sécurisation Finale

### Objectif
Packager l'application Next.js en conteneur Docker optimisé, configurer l'environnement de production sur le VPS Hostinger et déployer la solution avec certificats SSL et sauvegardes automatiques.

### Tâches Détaillées
1. **Dockerfile Multi-Stage Optimisé** :
   - Utilisation de `output: "standalone"` de Next.js (aucun dépendance à Vercel).
   - Image finale alpine légère sans fichiers inutiles ni node_modules superflus.
2. **Docker Compose Production** (`docker-compose.prod.yml`) :
   - Service `app` : conteneur Next.js avec healthcheck.
   - Service `db` : PostgreSQL 16 avec volume persistant chiffré.
   - Service `proxy` : Caddy ou Nginx avec gestion automatique des certificats SSL Let's Encrypt pour `belora.com`, `www.belora.com`, et sous-domaines.
3. **Stratégie de Sauvegarde Automatique** :
   - Script shell quotidien `pg_dump` chiffré par clé GPG.
   - Synchronisation vers un stockage objet externe S3/R2 hors du VPS.
   - Procédure de test de restauration documentée.
4. **Hardening & Sécurité** :
   - Configuration du pare-feu UFW sur le VPS (ports 80, 443 et SSH sécurisé uniquement).
   - Headers de sécurité HTTP stricts (HSTS, X-Frame-Options, Content-Security-Policy).
   - Configuration de Cloudflare en frontal (DNS, WAF et protection anti-DDoS).
5. **Vérification Finale des Critères de Réussite MVP** :
   - Réservation mobile de bout en bout en moins de 90 secondes.
   - Zéro double réservation possible en concurrence d'accès.
   - Encaissement caisse POS fonctionnel et clôture Z conforme.
