# Audit de cohérence Interfaces ↔ Fonctionnalités — Belora

*Date : 21 novembre 2026 — Référentiels : code source (`main`, `3c5734b`), `belora-feuille-de-route-mvp.md`, comportement de Planity.*
*Complète l'audit de fiabilité `audit/fiabilite-2026-11-18.md` (non répété ici).*

---

## 1. Synthèse

L'application est **riche visuellement et largement branchée sur la base** (agenda, caisse, CRM, paramètres pro, admin passent tous par des API réelles). Mais l'audit relève trois familles de problèmes :

1. **Sécurité (bloquant)** — trois API acceptent une identité passée en paramètre d'URL ou d'en-tête : n'importe qui peut agir en admin, lire le compte de n'importe quel client, ou piloter n'importe quel salon.
2. **Parcours cassés** — le paiement de l'acompte n'a pas d'interface ; une réservation avec acompte n'est jamais confirmée ni payée. Plusieurs liens mènent à des pages inexistantes.
3. **Façades** — des écrans promettent des fonctionnalités non implémentées (favoris, mot de passe oublié, formulaire partenaire, mode maintenance, abonnements, Stripe Connect, notifications).

### Tableau de bord

| Gravité | Nb | Exemples |
|---|---|---|
| 🔴 Critique | 4 | Contournements d'authentification (admin, compte, pro), paiement d'acompte absent |
| 🟠 Majeur | 9 | Pages 404 (CGU, confidentialité, claim), formulaire partenaire perdu, mot de passe oublié factice, pas de confirmation e-mail sans acompte, validation des salons court-circuitée, mode maintenance inopérant… |
| 🟡 Moyen | 12 | Favoris non persistés, filtre date ignoré, pas de déplacement de RDV, données d'accueil en dur… |
| ⚪ Mineur | 6 | Doublons d'écrans, textes, galerie identique… |

### Couverture vs. Planity / feuille de route (P0)

| Domaine | Couverture | Commentaire |
|---|---|---|
| Recherche & fiche salon | ~75 % | Filtres prix/note/distance/dispo et tri absents |
| Tunnel de réservation | ~70 % | 4 étapes OK, paiement absent |
| Compte client | ~60 % | Pas de report, favoris factices, pas de lien magique invité |
| Agenda pro | ~75 % | Pas de drag & drop / déplacement, pas d'indisponibilités/pauses |
| Caisse & Z | ~90 % | Complet fonctionnellement |
| CRM | ~90 % | Complet |
| Paramètres pro | ~70 % | Stripe Connect et abonnement absents |
| Admin | ~60 % | Pas de blocage utilisateur, référentiels, journal d'audit, plans |
| Transverse (i18n, SEO ville, légal) | ~25 % | FR seulement, pas de pages catégorie × ville, pas de pages légales |

---

## 2. 🔴 Constats critiques

> ✅ **C1, C2 et C3 corrigés le 21/11/2026** : le passage d'identité par paramètre n'est plus accepté que sous Vitest (`src/lib/test-identity.ts`), l'en-tête `x-admin-key` est supprimé, et un `venueId` n'est accepté que si l'utilisateur connecté est propriétaire, membre de l'équipe ou ADMIN. Test de non-régression : `tests/integration/auth-bypass.test.ts`.

### C1. Accès administrateur sans authentification
`src/modules/admin/admin.service.ts:63-95` — si aucune session n'est présente, `getAdminContext` accepte :
- `?adminEmail=<email>` dans l'URL, **ou**
- n'importe quelle valeur d'en-tête `x-admin-key` (la valeur n'est même pas comparée) → résout l'utilisateur `admin@belora.com` / `admin@yopmail.com`.

**Conséquence** : `curl -H "x-admin-key: x" https://belora.com/api/admin/users` donne la liste de tous les utilisateurs ; même chose pour supprimer des utilisateurs, changer des rôles, suspendre des salons, exporter la finance, modifier la commission.
**Correctif** : supprimer le fallback ; pour les tests, injecter une session mockée ou une clé comparée à une variable d'environnement, désactivée en production.

### C2. Lecture/modification de n'importe quel compte client
`src/modules/account/account.service.ts:58-86` — `?userId=` ou `?email=` permettent d'agir comme ce client : voir ses RDV, **les annuler**, modifier son profil, publier des avis à son nom.
**Correctif** : idem C1.

### C3. Pilotage de n'importe quel salon, sans être connecté
`src/modules/pro/pro-agenda.service.ts:33-54` — le salon actif est pris **en priorité** depuis `?venueId=`, l'en-tête `x-venue-id` ou le cookie `belora_active_venue_id`, **sans vérifier** que l'utilisateur est connecté ni qu'il possède ce salon. Toutes les API `/api/pro/*` (agenda, clients et fiches techniques, caisse, paramètres, équipe) sont concernées → fuite de données personnelles (RGPD) et falsification de caisse.
De plus, hors production, un appel anonyme retombe sur le premier salon de la base.
**Correctif** : exiger la session, puis vérifier `venue.ownerId === session.user.id` (ou rôle ADMIN) avant d'accepter un `venueId`.

### C4. Le client ne peut jamais payer l'acompte
- Serveur : `booking.service.ts:248-265` crée un `PaymentIntent` et renvoie `clientSecret` ; la réservation est créée en `PENDING_PAYMENT`.
- Interface : `book-client.tsx:236-253` **ignore `clientSecret`** ; aucun Stripe Elements / `loadStripe` dans le projet.
- Conséquences en chaîne :
  - la réservation reste `PENDING_PAYMENT` indéfiniment, le créneau est bloqué ;
  - l'écran affiche « Acompte : X € » comme si c'était réglé ;
  - côté pro, `PENDING_PAYMENT` est affiché comme **« confirmé »** (`pro-agenda.service.ts` `mapPrismaStatusToPro`) et la caisse **déduit un acompte jamais encaissé** ;
  - aucun e-mail de confirmation (il n'est envoyé que par le webhook de paiement).
- Par ailleurs `venue.stripeAccountId` n'est jamais renseigné (pas d'onboarding Connect dans l'UI) → la destination du paiement est vide.
**Correctif** : ajouter une étape 5 « Paiement » avec Stripe Payment Element ; afficher un statut « en attente de paiement » côté pro ; ne déduire que les acomptes `SUCCEEDED` ; expirer les réservations non payées.

---

## 3. 🟠 Constats majeurs

| # | Écran | Ce que l'interface promet | Réalité | Fichier |
|---|---|---|---|---|
| M1 | Footer | Liens « CGU » et « Confidentialité » | `/terms` et `/privacy` n'existent pas → 404. Bloquant légalement en France (mentions légales, RGPD, cookies) | `components/layout/footer.tsx` |
| M2 | Admin › Création assistée | « Lien d'invitation » pour que le pro prenne la main | Pointe vers `/pro/claim` **inexistant** ; aucun e-mail envoyé | `admin.service.ts` (~l.452) |
| M3 | `/pro/join` | « Un conseiller vous contactera » | Les données ne sont **envoyées nulle part** (`handleStep4Submit` change juste d'étape) → leads perdus | `components/pro/pro-join-flow.tsx:201` |
| M4 | `/forgot-password` | « E-mail de réinitialisation envoyé » | `setTimeout` factice, aucune API, aucun lien de reset | `(auth)/forgot-password/page.tsx:16` |
| M5 | Réservation sans acompte | Confirmation immédiate (comme Planity) | Statut `CONFIRMED` mais **aucun e-mail** au client ni au salon | `booking.service.ts` |
| M6 | Inscription pro | Validation des salons par l'admin (`PENDING_VALIDATION`) | Le salon est créé **directement `PUBLISHED`** (défaut du schéma aussi) → un salon vide apparaît dans la recherche ; l'étape de validation admin est inutile | `api/auth/register-pro/route.ts:112`, `schema.prisma` |
| M7 | Admin › Monétisation / Paramètres | « Mode maintenance : les clients ne peuvent pas réserver » | Le drapeau n'est lu **nulle part** hors admin | `grep maintenanceMode` |
| M8 | Admin › Réservations | « Annuler » une réservation (support) | Pas de remboursement Stripe ni d'e-mail, contrairement à l'annulation client | `admin.service.ts:1005` |
| M9 | Deux parcours « devenir pro » | `/pro/join` (lead) et `/register?role=pro` (compte réel) | Incohérents : les CTA de `/pro` mènent au formulaire qui ne crée rien ; le parcours qui fonctionne n'est accessible que depuis `/register` | `pro/page.tsx`, `pro-join-flow.tsx` |

---

## 4. 🟡 Constats moyens (UI ↔ feature)

| # | Écran | Écart |
|---|---|---|
| m1 | Recherche | **Favoris** (cœur) stockés en état local seulement — perdus au rechargement, non liés au compte. Pas de modèle `Favorite` en base |
| m2 | Compte › Favoris | Liste **codée en dur** (`CURATED_FAVORITE_VENUES`) sans rapport avec les favoris de l'utilisateur |
| m3 | Accueil › Recherche | Champ **date** envoyé (`?date=`) mais ignoré par `/search` et l'API |
| m4 | Recherche | Pas de filtres prix / note / distance / disponibilité ni de **tri** (P0 feuille de route). L'API sait pourtant filtrer `minRating` |
| m5 | Accueil › Salons populaires | 4 cartes **en dur** ; villes incohérentes (ex. « Nail & Glow Studio, Marseille » pointe sur `bain-de-vapeur-sequoia`) ; notes/avis ne reflètent pas la base |
| m6 | Fiche salon / Réservation | Fallback silencieux sur des **salons fictifs** (`lib/data/venues.ts`) : on peut ouvrir le tunnel d'un salon qui n'existe pas en base, la réservation échouera à la fin |
| m7 | Compte › À venir | Pas de **report / déplacement** de RDV (P0, standard Planity) |
| m8 | Réservation invité | Pas de **lien magique** pour gérer sa réservation sans compte (P0) |
| m9 | Agenda pro | Pas de **drag & drop** ni de modification date/heure/collaborateur d'un RDV existant ; pas de création d'**indisponibilité / pause** (P0) |
| m10 | Pro › Notifications | Réglages enregistrés mais **non utilisés** par `/api/cron/reminders` (qui envoie à tous) |
| m11 | En-tête pro | **Cloche de notifications** avec contenu de démonstration, non reliée aux vraies réservations |
| m12 | Admin › Utilisateurs | Pas de **blocage/suspension** d'un compte (P0) — seul choix : changer le rôle ou supprimer (suppression en cascade risquée) |

---

## 5. ⚪ Constats mineurs

| # | Écart |
|---|---|
| n1 | **Doublon** : commission par défaut + mode maintenance éditables à la fois dans *Monétisation* et *Paramètres & Santé* |
| n2 | Fiche salon : **même galerie** (`botanique-1..3.jpg`) pour tous les salons ; bio d'équipe générique « Artisan qualifié de la Maison Belora » ; note par défaut **« 5.0 » quand il n'y a aucun avis** (trompeur) ; prix d'appel « 35 € » inventé si pas de prestation |
| n3 | « Offrir cette prestation » dans le tunnel n'est qu'une note texte : le nom du bénéficiaire est collé dans `clientName` du payeur |
| n4 | Avis : le pro ne peut **pas répondre** depuis son espace (seul l'admin peut) ; pas d'écran « Avis » côté pro (P1) |
| n5 | Pas de statistiques pro (CA, taux d'annulation) — P1 |
| n6 | `README.md` est celui par défaut de create-next-app |

---

## 6. Écarts au cahier des charges non visibles dans l'UI

Fonctionnalités P0 de `belora-feuille-de-route-mvp.md` **absentes** :
- **Stripe Connect onboarding** (fonctions `createConnectedAccount` / `createAccountLink` existent dans `lib/stripe.ts` mais ne sont appelées nulle part).
- **Abonnement pro** (Stripe Billing, plans gérés en admin) — les prix 39/69 € sont codés en dur sur `/pro`.
- **Multi-langue / multi-devise** : tout est en français, montants formatés en €.
- **Pages SEO catégorie × ville** (`/coiffeur/paris`).
- **Rôles admin** (super-admin, modérateur, support) — un seul rôle `ADMIN`.
- **Référentiels admin** (catégories, pays, villes, devises).
- **Journal d'audit** des actions sensibles — aucun modèle.
- **Report de RDV**, **lien magique invité**.

### Cohérence avec la promesse marketing `/pro`
| Promesse | Réalité |
|---|---|
| « 0 % de commission sur vos habitués » | La commission s'applique à **toute** réservation en ligne ; aucune notion de « client habituel » |
| « Rappels SMS automatiques » | Implémenté via Brevo si configuré ; réglages pro ignorés |
| « Migration du fichier client en 24 h » | Aucun import CSV |
| Tarifs 39 / 69 € | Aucune facturation |

---

## 7. Plan d'action recommandé

**Sprint 0 — Sécurité (immédiat, avant toute mise en ligne)**
1. Supprimer les fallbacks d'identité C1, C2, C3 ; ajouter la vérification de propriété du salon.
2. Ajouter un test d'intégration qui vérifie qu'un appel anonyme à `/api/admin/*`, `/api/account/*`, `/api/pro/*` renvoie 401.

**Sprint 1 — Rendre le parcours de réservation réel**
3. Étape de paiement Stripe Elements (C4) + statut « paiement en attente » côté pro + expiration.
4. E-mail de confirmation pour les réservations sans acompte (M5).
5. Onboarding Stripe Connect dans Paramètres › Établissement.
6. Remboursement + e-mail sur annulation admin (M8).

**Sprint 2 — Supprimer les façades**
7. Pages `/terms`, `/privacy`, mentions légales, bandeau cookies (M1).
8. Mot de passe oublié réel (M4), page `/pro/claim` (M2).
9. Unifier « devenir pro » : soit `/pro/join` crée le compte, soit il enregistre un lead en base + notifie l'équipe (M3, M9).
10. Salons pro créés en `PENDING_VALIDATION` (M6) ; appliquer le mode maintenance (M7).
11. Favoris persistés en base (m1, m2).

**Sprint 3 — Parité Planity**
12. Filtres et tri de recherche, prise en compte de la date (m3, m4).
13. Report de RDV client, lien magique invité (m7, m8).
14. Déplacement/drag & drop et pauses dans l'agenda (m9).
15. Accueil alimenté par la base (m5), retrait des salons fictifs en production (m6).
16. Blocage d'utilisateur, journal d'audit, réponse aux avis côté pro.
