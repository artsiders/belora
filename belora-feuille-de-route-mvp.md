# Belora - Feuille de route MVP

*Document destiné à l'agent IA de développement. Il décrit les références (Planity, Fresha), le périmètre MVP, l'architecture Next.js, le déploiement sur VPS et la direction artistique. Il fait foi : en cas d'ambiguïté, choisir l'option la plus simple et la noter dans `DECISIONS.md`.*

**Produit** : Belora - **Domaine** : belora.com - **Hébergement** : VPS Hostinger

---

## 0. Décisions actées

| Sujet | Décision |
|---|---|
| Nom et domaine | **Belora**, `belora.com` |
| Marché de lancement | **France**, langue principale **français**, **anglais** en seconde langue |
| Architecture produit | Internationale dès la conception (multi-langue, multi-devise, multi-fuseau), mais lancement France (EUR, Europe/Paris) |
| Modèle économique | Commission par réservation, abonnement professionnel, frais de paiement (même logique que Planity et Fresha) |
| Paiement en ligne | **Inclus dès le MVP** (Stripe Connect) |
| Hébergement | **VPS Hostinger** (auto-hébergé, Docker) |
| Projet | Un seul projet **Next.js** : site client, backoffice pro, panneau admin, API |
| Onboarding des premiers établissements | Manuel et assisté par l'équipe Belora (voir section 5.3 et 12) |

---

## 1. Vision et objectifs

**Vision.** Belora est une marketplace de réservation de services beauté et bien-être (coiffeur, barbier, onglerie, institut, massage, spa…) qui relie des clients à des professionnels, avec un logiciel d'agenda pour les pros.

**Modèle à deux faces.**
- **Demande** : le client découvre, compare et réserve en moins d'une minute.
- **Offre** : le professionnel gère agenda, équipe, services, clients et encaissements.
- **Plateforme** : l'admin valide, modère, supervise et pilote.

**Objectifs du MVP.**
1. Un client trouve un établissement, choisit un service et un créneau, paie ou réserve sans friction (avec ou sans compte).
2. Un professionnel crée son établissement, ses services, son équipe, ses horaires, encaisse en ligne et gère ses rendez-vous.
3. Un admin valide les établissements, modère, suit l'activité et les revenus de la plateforme.
4. Le produit est **international dans sa conception** : aucune règle codée en dur pour la France seule.

**Principe directeur.** Peu de fonctionnalités, mais finies, rapides et belles. On s'inspire des mécanismes des références, jamais de leur identité visuelle, de leur code ni de leurs textes.

---

## 2. Analyse de Planity

Acteur européen (France, Belgique, Allemagne) centré sur la réservation en ligne pour la beauté, à l'identité éditoriale sobre (noir, blanc, photographie).

### 2.1 Côté client
- Accueil avec hero photo plein écran et recherche à deux champs : *quoi* (salon, prestation) et *où* (adresse, ville).
- Catégories de métiers : coiffeur, barbier, manucure, institut de beauté, massage, réflexologue, massothérapeute, sophrologue, hypnothérapeute, naturopathe, coach de vie.
- Carrousel de découverte des métiers.
- Pages SEO par catégorie et par ville (ex. « Coiffeur Paris »), maillage interne dans le footer.
- Fiche établissement : présentation, photos, prestations (durée, prix), équipe, avis, horaires, adresse, carte.
- Tunnel de réservation : prestations, professionnel (ou « sans préférence »), créneau, coordonnées, confirmation.
- Réservation 24h/24, confirmation immédiate.
- Espace « Mon compte » : rendez-vous à venir et passés, modification, annulation, favoris.
- Rappels par SMS et e-mail.
- Paiement en ligne selon l'établissement (acompte ou règlement complet).
- FAQ, pages légales (CGU, confidentialité, cookies, accessibilité), preuves sociales (presse, chiffres).
- Déclinaisons par pays.

### 2.2 Côté professionnel
- Page de présentation de l'offre pro avec chiffres clés (fréquence accrue, moins d'oublis grâce aux rappels SMS, réservations hors horaires d'ouverture).
- Agenda, prise de rendez-vous en ligne, rappels SMS automatiques.
- Gestion des salons, de l'équipe et des prestations.
- Offres commerciales et prise de contact.

### 2.3 À retenir
Parcours de recherche très simple, forte densité SEO locale, message clair pour les pros.

---

## 3. Analyse de Fresha

Plateforme mondiale (120+ pays) qui combine marketplace grand public et logiciel de gestion gratuit pour les pros, monétisée par commissions et frais de paiement.

### 3.1 Côté client (site et app)
- Recherche à trois champs : prestation, position, date/heure.
- Rails de découverte : « Récemment consulté », « Recommandés », « Nouveaux », « Tendances », badges (Offres, Highly Recommended, Best in Class).
- Cartes établissement : photo, note, nombre d'avis, localisation, type.
- Favoris.
- Compteur de rendez-vous du jour (preuve sociale en direct).
- Application mobile iOS/Android.
- Avis clients vérifiés.
- Recherche par ville et par pays avec liens SEO.
- Multi-langue et multi-pays.
- Paiement en ligne, offres promotionnelles, réservation instantanée.

### 3.2 Côté professionnel (logiciel)
- **Agenda** multi-membres par colonnes, codes couleur par service, vues jour/semaine, glisser-déposer.
- **Réservation en ligne** et profil marketplace.
- **Équipe** : horaires, commissions, congés.
- **Clients (CRM)** : fiches, historique, notes, segmentation.
- **Point de vente (POS)** : encaissement, produits, pourboires, factures.
- **Paiements** : terminal, paiement en ligne, acomptes, politique d'annulation, frais de no-show.
- **Marketing** : campagnes SMS/e-mail, offres, cartes cadeaux, fidélité, parrainage.
- **Inventaire** de produits.
- **Rapports** : chiffre d'affaires, performance de l'équipe, rétention.
- **Multi-établissements**, application mobile pro.
- Intégrations (réseaux sociaux, « Réserver avec Google »).

### 3.3 À retenir
L'agenda est le produit : c'est lui qui fidélise le pro. La marketplace l'alimente en nouveaux clients. Le revenu vient des commissions (nouveaux clients marketplace) et des frais de paiement.

---

## 4. Synthèse comparative

| Domaine | Planity | Fresha | Décision Belora MVP |
|---|---|---|---|
| Recherche | 2 champs (quoi, où) | 3 champs (+ date/heure) | 3 champs, date optionnelle |
| Découverte | Catégories + SEO ville | Rails éditoriaux + badges | Catégories + 2 rails simples |
| Fiche établissement | Complète | Complète + badges | Complète, sans badges |
| Réservation | Prestation, pro, créneau | Idem + offres | Idem, sans offres |
| Compte client | Oui | Oui + app | Oui, web uniquement |
| Paiement en ligne | Optionnel | Central | **Dès le MVP** (acompte ou total, Stripe Connect) |
| Rappels | SMS | SMS, e-mail, push | E-mail + SMS |
| Agenda pro | Oui | Très avancé | Jour/semaine, essentiel |
| CRM, POS, marketing | Limité | Complet | Hors MVP (CRM minimal) |
| Monétisation | Abonnement pro | Commission + frais de paiement | Commission + abonnement + frais de paiement |
| International | 3 pays | 120+ pays | Conçu multi-pays, lancement France |
| Admin plateforme | Non visible | Non visible | Obligatoire |

---

## 5. Périmètre du MVP

Légende : **P0** = indispensable au lancement, **P1** = souhaitable si le temps le permet, **Later** = après le MVP.

### 5.1 Web client (marketplace)

| Fonctionnalité | Priorité |
|---|---|
| Accueil : recherche (prestation/établissement, lieu, date optionnelle) | P0 |
| Catégories de métiers (coiffure, barbier, ongles, institut, massage, spa, bien-être) | P0 |
| Résultats : liste + carte, filtres (catégorie, prix, note, disponibilité, distance), tri | P0 |
| Fiche établissement : photos, description, services, équipe, horaires, adresse, carte, avis | P0 |
| Tunnel de réservation : services (multi-sélection) → professionnel ou « sans préférence » → créneau → coordonnées → paiement → confirmation | P0 |
| Paiement en ligne : acompte ou total selon la politique de l'établissement, carte bancaire (Stripe), 3-D Secure | P0 |
| Réservation invité (e-mail + téléphone) avec lien magique de gestion | P0 |
| Compte client : inscription, connexion (e-mail, Google), profil | P0 |
| Mes rendez-vous : à venir, passés, annulation et report selon la politique, remboursement automatique si éligible | P0 |
| E-mails transactionnels : confirmation, rappel, annulation, reçu | P0 |
| Avis après rendez-vous (note + commentaire, vérifiés) | P0 |
| Pages SEO catégorie × ville générées dynamiquement | P0 |
| Multi-langue (FR par défaut, EN), multi-devise, fuseaux horaires | P0 |
| Pages légales, FAQ, contact | P0 |
| Rappels SMS | P0 (si coût maîtrisé, sinon P1) |
| Favoris | P1 |
| Liste d'attente, cartes cadeaux, offres, parrainage, app mobile | Later |

### 5.2 Backoffice professionnel

| Fonctionnalité | Priorité |
|---|---|
| Inscription pro et onboarding guidé (établissement, adresse, catégories, horaires, services, équipe, compte de paiement) | P0 |
| Profil établissement : description, photos, galerie, localisation, devise, fuseau | P0 |
| Catalogue de services : catégories, durée, prix, buffer, services assignés aux membres | P0 |
| Équipe : membres, rôles (propriétaire, manager, staff), horaires hebdomadaires, congés | P0 |
| Agenda : vue jour et semaine par membre, création, déplacement, annulation, blocage de créneaux | P0 |
| Réservation en ligne : acceptation automatique, délais min/max, politique d'annulation | P0 |
| Rendez-vous manuels (téléphone, sur place) | P0 |
| Fiches clients minimales : coordonnées, historique, notes | P0 |
| Paiements : connexion Stripe Connect, paramétrage acompte/total, suivi des encaissements et des versements | P0 |
| Abonnement Belora : plan, facturation, moyens de paiement | P0 |
| Notifications pro (nouvelle réservation, annulation) | P0 |
| Avis reçus et réponse | P1 |
| Statistiques simples : rendez-vous, chiffre d'affaires, taux d'annulation | P1 |
| Multi-établissements | Later |
| POS, inventaire, marketing, fidélité, commissions d'équipe, app mobile pro | Later |

### 5.3 Panneau d'administration

| Fonctionnalité | Priorité |
|---|---|
| Connexion sécurisée, rôles (super-admin, modérateur, support) | P0 |
| Tableau de bord : inscriptions, établissements, rendez-vous, volume, revenus plateforme | P0 |
| Validation et suspension des établissements | P0 |
| **Création assistée d'un établissement au nom d'un pro** (onboarding manuel : l'équipe saisit les données puis envoie une invitation de prise en main) | P0 |
| Gestion des utilisateurs (clients, pros) : consultation, blocage | P0 |
| Modération des avis et signalements | P0 |
| Référentiels : catégories, langues, devises, pays, villes | P0 |
| Consultation de toutes les réservations, annulation par le support | P0 |
| Monétisation : taux de commission (global et par établissement), plans d'abonnement, frais de paiement, suivi des commissions perçues | P0 |
| Journal d'audit des actions sensibles | P0 |
| Gestion des pages de contenu (légal, FAQ) | P1 |
| Mise en avant d'établissements (rails « Recommandés ») | P1 |

### 5.4 Hors périmètre MVP
Application mobile native, POS physique, cartes cadeaux, fidélité, marketing automatisé, inventaire, multi-établissements, marketplace de produits, paie des employés, chat intégré.

---

## 6. Modèle économique et flux d'argent

**Sources de revenus (comme Planity et Fresha).**
1. **Commission par réservation** : pourcentage prélevé sur les réservations payées en ligne, taux configurable globalement et par établissement.
2. **Abonnement professionnel** : plan mensuel pour accéder au logiciel (au moins un plan d'entrée ; le détail des plans et prix est à définir dans l'admin, aucun prix codé en dur).
3. **Frais de paiement** : frais de traitement répercutés sur la transaction (Stripe + marge Belora éventuelle).

**Flux de paiement (Stripe Connect).**
- Chaque établissement possède un compte connecté (onboarding Stripe intégré dans le backoffice).
- Le client paie à la réservation (acompte ou total) ; Belora prélève sa commission (`application_fee_amount`) ; le solde est versé à l'établissement.
- L'abonnement pro est facturé via Stripe Billing.
- Remboursements et annulations : règles selon la politique de l'établissement (délai avant rendez-vous), exécutées automatiquement.
- Webhooks signés pour synchroniser statuts de paiement, remboursements et versements ; idempotence obligatoire.
- Tout montant est stocké en entier (unité mineure) avec code devise ; commission et frais calculés côté serveur uniquement.

**France (lancement).** Prix affichés TTC en euros, TVA gérée sur la facturation Belora (commission et abonnement), conformité DSP2/3-D Secure, mentions légales et factures conformes. Faire valider les points fiscaux et réglementaires par un professionnel avant la mise en production.

---

## 7. Architecture technique (projet Next.js unique)

### 7.1 Stack recommandée
- **Framework** : Next.js (App Router), TypeScript strict, React Server Components par défaut.
- **API** : Route Handlers et Server Actions, validation Zod.
- **Base de données** : PostgreSQL + PostGIS (recherche géographique). ORM : Drizzle ou Prisma.
- **Authentification** : Better Auth ou Auth.js (e-mail + mot de passe, lien magique, Google), sessions serveur, RBAC.
- **Paiement** : Stripe (Connect + Billing).
- **E-mails** : Resend (ou SMTP) + React Email. **SMS** : Twilio ou équivalent européen.
- **Tâches planifiées et files** : `pg-boss` (basé sur Postgres, pas de Redis requis sur le VPS) ou BullMQ + Redis si besoin de plus de débit.
- **Fichiers** : stockage compatible S3 (Cloudflare R2 ou MinIO sur le VPS), images via `next/image`.
- **Cartes** : MapLibre + tuiles open source ou Mapbox.
- **Recherche** : PostgreSQL (full-text + PostGIS), Meilisearch plus tard si nécessaire.
- **i18n** : next-intl, routes préfixées par locale (`/fr`, `/en`), français par défaut.
- **Styles** : Tailwind CSS avec **tokens personnalisés** (section 11). Composants accessibles de base (Radix ou React Aria), entièrement restylés.
- **Qualité** : ESLint, Prettier, Vitest, Playwright, CI GitHub Actions.

### 7.2 Organisation des routes (monolithe modulaire)

```
app/
  [locale]/
    (marketplace)/        # site public client
      page.tsx            # accueil
      s/                  # résultats de recherche
      [category]/[city]/  # pages SEO
      v/[slug]/           # fiche établissement
      book/[venueId]/     # tunnel de réservation
      account/            # espace client
    (auth)/               # connexion, inscription
  pro/                    # backoffice professionnel (protégé, rôle pro)
    onboarding/ calendar/ services/ team/ clients/ payments/ reviews/ settings/
  admin/                  # panneau admin (protégé, rôle admin)
  api/                    # webhooks (Stripe), cron, endpoints publics
src/
  modules/                # booking, availability, venues, catalog, staff,
                          # customers, reviews, payments, billing, notifications
  lib/                    # db, auth, i18n, money, time, geo
```

**Règle** : la logique métier vit dans `src/modules/*`, jamais dans les composants. Les pages appellent des services.

**Séparation des espaces.** `pro/` et `admin/` peuvent être servis sous des sous-domaines (`pro.belora.com`, `admin.belora.com`) via le middleware, tout en restant dans le même projet.

### 7.3 Moteur de disponibilités (cœur du produit)
Le calcul des créneaux doit :
- combiner horaires d'ouverture, horaires du membre, congés, rendez-vous existants, blocages, durée totale des services et buffers ;
- gérer « sans préférence » (affecter un membre disponible) ;
- travailler en **UTC** en base et convertir selon le fuseau de l'établissement ;
- empêcher toute double réservation (transaction + contrainte d'exclusion Postgres sur plage de temps par membre) ;
- **réserver temporairement le créneau** (verrou de 10 minutes) pendant le paiement, puis le libérer en cas d'abandon ;
- être entièrement testé unitairement (changement d'heure, minuit, services enchaînés, concurrence).

### 7.4 Modèle de données (entités principales)
- `users` (rôle : customer, pro, admin), `accounts`, `sessions`
- `venues` (nom, slug, adresse, géoloc, pays, fuseau, devise, statut : brouillon / en attente / publié / suspendu, `stripe_account_id`, taux de commission)
- `venue_categories`, `venue_photos`, `venue_hours`
- `service_categories`, `services` (durée, prix, devise, buffer, visibilité)
- `staff_members` (rôle, couleur agenda), `staff_services`, `staff_schedules`, `time_off`
- `customers` (profil client par venue, notes), `bookings`, `booking_items` (service, durée, prix figés), `booking_events` (historique)
- `payments`, `refunds`, `payouts`, `fees` (commission, frais de paiement)
- `subscription_plans`, `subscriptions` (abonnement pro)
- `reviews` (liées à un booking, statut de modération)
- `notifications`, `audit_logs`, `favorites`
- Référentiels : `countries`, `cities`, `currencies`, `locales`

**Règles.** Prix et durée figés dans la réservation. Montants en entiers avec code devise. Suppression logique pour les entités liées à des réservations.

### 7.5 International dès le MVP
- **Langues** : FR (défaut) et EN livrés ; structure prête pour ES, DE, PT, AR (propriétés CSS logiques pour le RTL).
- **Devises** : chaque établissement a sa devise ; affichage via `Intl.NumberFormat`. EUR au lancement.
- **Fuseaux** : stockage UTC, affichage dans le fuseau du lieu.
- **Adresses et téléphones** : formats internationaux (libphonenumber), pas de champs propres à un pays.
- **Conformité** : RGPD, consentement cookies, export et suppression des données, DSA (modération et signalement).
- **SEO** : `hreflang`, URLs localisées, sitemap par locale, données structurées `LocalBusiness`.

### 7.6 Non-fonctionnel
- Performance : LCP < 2,5 s, ISR/statique pour les pages marketplace.
- Accessibilité : WCAG 2.2 AA.
- Sécurité : RBAC, validation serveur systématique, rate limiting, CSRF, secrets hors dépôt, webhooks signés, en-têtes de sécurité.
- Observabilité : logs structurés, Sentry (ou équivalent auto-hébergé), métriques de réservation.

---

## 8. Déploiement sur VPS Hostinger

**Principe.** Tout tourne sur un VPS Linux avec Docker. Éviter toute fonctionnalité propre à Vercel (Edge, ISR managé spécifique, Image Optimization Vercel) ; utiliser le mode `output: "standalone"` de Next.js.

**Architecture conseillée (un seul VPS au début).**
- `reverse proxy` : Caddy ou Nginx (HTTPS automatique Let's Encrypt, domaines `belora.com`, `www`, `pro.`, `admin.`).
- `app` : conteneur Next.js (Node LTS), géré par Docker Compose, redémarrage automatique.
- `db` : PostgreSQL + PostGIS (volume persistant).
- `worker` : processus des tâches (rappels, expiration des verrous, e-mails).
- Optionnel : Redis, Meilisearch, MinIO.
- Orchestration de déploiement : Coolify, Dokploy ou simple Docker Compose + GitHub Actions (build, push d'image, déploiement par SSH).

**Dimensionnement de départ.** 4 vCPU / 8 Go de RAM minimum recommandé pour l'application, la base et le worker ; surveiller la mémoire. Prévoir la migration de la base vers un service managé ou un second VPS quand le trafic augmente.

**Exigences d'exploitation.**
- Sauvegardes PostgreSQL quotidiennes chiffrées, copiées hors du VPS (stockage objet externe) et **test de restauration** régulier.
- Pare-feu (UFW), accès SSH par clé uniquement, mises à jour de sécurité automatiques, fail2ban.
- Séparation des environnements : `staging` et `production` (deux stacks ou deux VPS).
- Surveillance : uptime (ex. Uptime Kuma), alertes disque, mémoire et erreurs.
- Variables d'environnement et secrets (Stripe, base, e-mail) hors dépôt.
- CDN et protection DDoS : mettre Cloudflare devant le domaine (DNS, cache des assets, WAF de base).
- Images volumineuses et fichiers utilisateurs : stockage objet externe plutôt que disque du VPS.

---

## 9. Parcours clés à implémenter en priorité
1. **Réservation client** : accueil → recherche → fiche → services → créneau → coordonnées → paiement → confirmation e-mail.
2. **Onboarding pro** : inscription (ou invitation) → établissement → services → équipe → horaires → connexion Stripe → publication (validation admin).
3. **Gestion quotidienne pro** : ouvrir l'agenda, voir la journée, déplacer ou annuler un rendez-vous, créer un rendez-vous manuel.
4. **Annulation et remboursement** : côté client et côté pro, selon la politique.
5. **Modération admin** : valider un établissement, traiter un avis signalé, suivre commissions et paiements.

---

## 10. Roadmap suggérée

| Phase | Contenu | Livrable |
|---|---|---|
| 0. Fondations | Dépôt, CI, tokens de design, i18n FR/EN, auth, rôles, base, schéma initial, Docker, déploiement staging sur le VPS | Squelette déployé |
| 1. Pro et catalogue | Onboarding, établissement, services, équipe, horaires | Un pro configure son lieu |
| 2. Disponibilités | Moteur de créneaux, tests, agenda pro | Créneaux fiables |
| 3. Paiement | Stripe Connect, onboarding pro, paiement acompte/total, commissions, webhooks, remboursements | Argent qui circule en mode test |
| 4. Marketplace | Accueil, recherche, carte, fiche, pages SEO | Découverte publique |
| 5. Réservation | Tunnel avec paiement, compte client, e-mails/SMS, annulation | Réservation de bout en bout |
| 6. Admin | Dashboard, validation, création assistée, modération, monétisation, audit | Plateforme pilotable |
| 7. Abonnement pro | Plans, Stripe Billing, facturation | Revenus récurrents |
| 8. Finitions | Avis, favoris, accessibilité, performance, QA, sécurité, bascule en production | Bêta fermée puis lancement France |

---

## 11. Direction artistique

### 11.1 Intention
Une identité **éditoriale, calme et précise**, entre magazine de mode et outil professionnel soigné. Belora doit évoquer une maison de beauté haut de gamme, pas un template SaaS. La beauté se montre par la **photographie, la typographie et l'espace**, pas par des effets.

**Mots-clés** : retenue, matière, précision, chaleur, silence visuel.

### 11.2 À éviter (signes d'un rendu « généré par IA »)
- Dégradés violet/bleu/rose, halos flous, « blobs » décoratifs.
- Glassmorphism, ombres portées omniprésentes, néons, effets de brillance.
- Cartes arrondies identiques empilées avec icône dans un cercle coloré.
- Police par défaut (Inter, Roboto, Arial) partout, titres centrés sans hiérarchie.
- Emojis comme icônes, illustrations 3D génériques, mockups flottants inclinés.
- Sections répétitives « 3 colonnes icône + titre + texte », bandeaux de faux logos « Ils nous font confiance ».
- Boutons dégradés, `rounded-full` partout, fade-in sur chaque élément.
- Textes marketing creux (« révolutionnez », « solution tout-en-un »), statistiques inventées.
- Photos de banques d'images génériques souriantes face caméra.

### 11.3 Principes
1. **Typographie d'abord.** Le texte porte l'identité.
2. **Grille visible et rigoureuse.** Alignements stricts, filets fins, grandes marges.
3. **Contraste de rythme.** Pages denses (résultats, agenda) et pages aérées (accueil, fiche).
4. **Photographie éditoriale.** Lumière naturelle, cadrages serrés, détails de matière (mains, cheveux, textures), peu de visages posés.
5. **Une seule couleur d'accent**, utilisée avec parcimonie.
6. **Mouvement utile.** Transitions courtes qui expliquent un changement d'état.
7. **Deux registres, une famille.** Marketplace expressive ; backoffice et admin sobres et denses, mêmes tokens.

### 11.4 Palette (proposition, à valider)
Neutres chauds, jamais de gris bleuté ni de blanc pur.

| Rôle | Nom | Valeur |
|---|---|---|
| Fond principal | Papier | `#F5F1EA` |
| Surface | Lin clair | `#FBF9F5` |
| Filets | Sable | `#DDD5C8` |
| Texte principal | Encre | `#17140F` |
| Texte secondaire | Fumée | `#6B645A` |
| Accent unique | Terre cuite | `#B5532F` |
| Accent profond (hover, focus) | Brique | `#8C3B1E` |
| Fond sombre (sections, admin) | Charbon | `#1C1A17` |
| Succès | Mousse | `#4F6B4A` |
| Alerte | Ocre | `#C48A2C` |
| Erreur | Grenat | `#9A2B2B` |

L'accent n'apparaît que sur l'action principale, les liens actifs et les états de sélection.

### 11.5 Typographie (proposition)
- **Titres** : serif éditoriale à contraste (*Fraunces*, *Newsreader* ou *Instrument Serif*), graisses légères, grande taille, interlettrage serré.
- **Texte et interface** : grotesque sobre (*Geist*, *Hanken Grotesk* ou *Instrument Sans*).
- **Données et horaires** : chiffres tabulaires pour l'agenda et les prix.
- Échelle modulaire (ratio 1,25) ; titres hero jusqu'à 96 px desktop ; corps 16–17 px ; interligne 1,5.
- Vérifier le support des alphabets (latin étendu, arabe…) avec police de secours par script.
- Le logotype Belora : mot-symbole en capitales ou bas de casse, interlettrage large, sans pictogramme générique ; à dessiner en SVG.

### 11.6 Composants et styles
- **Rayons** faibles (2–4 px) ; pas de pilules sauf puces de filtre.
- **Boutons** : pleins encre (primaire), contour fin (secondaire), lien souligné (tertiaire). Pas de dégradés.
- **Cartes établissement** : image ratio 4:5, légende typographique dessous (nom en serif, détails en petites capitales), sans cadre ni ombre.
- **Champs** : soulignés ou encadrés d'un filet, étiquette au-dessus, focus en accent.
- **Séparation** par filets 1 px et espaces, pas par ombres.
- **Icônes** : jeu linéaire unique, trait 1,5 px, usage minimal.
- **Barre de recherche** : un seul bloc horizontal à filets verticaux, fond papier au-dessus de la photo.
- **Agenda pro** : fond neutre, colonnes par membre séparées par filets, rendez-vous en aplats de teintes terreuses désaturées (palette de 8 couleurs dérivées), texte encre, heures en chiffres tabulaires, densité élevée.
- **Admin** : thème Charbon/Papier, tableaux denses, filtres persistants.

### 11.7 Mise en page
- Grille 12 colonnes, gouttières 24 px, largeur de contenu max 1360 px.
- Accueil : hero photographique plein écran avec titre serif très grand et recherche intégrée, sections éditoriales asymétriques, rails de découverte horizontaux, liste de villes en typographie pure.
- Fiche établissement : galerie en mosaïque, colonne de réservation collante à droite, services en liste tabulaire (nom, durée, prix alignés).
- Tunnel de réservation pensé mobile d'abord : une décision par écran, bouton principal fixé en bas.

### 11.8 Mouvement
- Durées 150–250 ms, courbe `cubic-bezier(0.2, 0, 0, 1)`.
- Animer : ouverture de panneaux, sélection de créneau, changement de vue de l'agenda, chargement de la carte.
- Respecter `prefers-reduced-motion`.
- Pas d'animation d'apparition systématique au scroll.

### 11.9 Ton éditorial
Phrases courtes, concrètes, sans superlatifs, en français d'abord (« Réservez en deux minutes. », « Trouvez un créneau près de chez vous. »). Aucun chiffre ni témoignage inventé : tant que les données réelles n'existent pas, ne pas afficher de preuve sociale.

### 11.10 Livrables de design avant le code
1. Fichier de tokens (couleurs, typographie, espacements, rayons, mouvements) en variables CSS et config Tailwind.
2. Page de référence des composants (« styleguide »), route interne.
3. Maquettes ou prototypes HTML : accueil, résultats, fiche, tunnel mobile, agenda pro, tableau admin.
4. Brief photo : 10 à 15 images types (cadrage, lumière, sujet) et source d'images libres de droits ou prise de vue dédiée.

---

## 12. Sourcing des premiers établissements (à confirmer)

*Point non tranché : plan par défaut proposé.*
- **Onboarding manuel assisté** : l'équipe Belora contacte les premiers établissements (idéalement une seule ville de départ, pour avoir assez de choix et de créneaux), saisit leurs données avec eux via la **création assistée** de l'admin (section 5.3), puis leur envoie une invitation pour reprendre la main.
- Objectif de départ : 20 à 30 établissements dans une ville avant d'ouvrir la marketplace au public, pour que la recherche ne soit jamais vide.
- Argument commercial initial : agenda en ligne et réservation, avec une période d'essai de l'abonnement (à décider dans l'admin).
- Collecter des photos de qualité chez chaque établissement (priorité de la DA).
- Ne publier un établissement qu'après validation admin (photos, services, horaires, compte de paiement).

---

## 13. Règles de travail pour l'agent IA

1. **Lire ce document en entier** avant de coder et le traiter comme source de vérité.
2. **Travailler par phases** (section 10), une fonctionnalité verticale à la fois (base, service, interface, tests).
3. **Ne jamais copier** le code, les textes, les images ou l'identité de Planity ou Fresha.
4. **Respecter la DA** : aucun composant de bibliothèque ne reste à son style par défaut ; tout passe par les tokens.
5. **TypeScript strict**, pas de `any`, validation Zod à chaque frontière (formulaires, API, webhooks).
6. **Tests obligatoires** sur le moteur de disponibilités, les règles d'annulation, les montants, commissions, remboursements et fuseaux.
7. **Aucun texte en dur** dans les composants : tout passe par l'i18n (FR par défaut, EN).
8. **Argent** : calculs uniquement côté serveur, entiers en unité mineure, idempotence des webhooks, jamais de confiance dans le client.
9. **Accessibilité et performance** vérifiées à chaque phase (Lighthouse, axe).
10. **Sécurité** : autorisations vérifiées côté serveur pour chaque action pro et admin.
11. **Données de démonstration** : script de seed réaliste, sans faux avis présentés comme réels.
12. **Commits petits et lisibles**, une PR par fonctionnalité, checklist « terminé ».
13. **Pas de dépendance à Vercel** : l'application doit tourner en conteneur sur le VPS.

### Définition de « terminé » (par fonctionnalité)
- Comportement conforme, états vides, chargement et erreur gérés.
- Responsive (mobile, tablette, desktop) et accessible au clavier.
- Textes traduits (FR, EN), formats de dates, devises et fuseaux corrects.
- Tests écrits et passants, aucune erreur de lint ou de type.
- Respect des tokens de la DA.

---

## 14. Critères de réussite du MVP
- Un client réserve et paie un service en moins de 90 secondes sur mobile.
- Aucune double réservation possible, y compris en cas de concurrence.
- Un pro configure, connecte son paiement et publie son établissement en moins de 20 minutes.
- Paiements, commissions, remboursements et versements cohérents de bout en bout (mode test puis réel).
- Pages marketplace avec LCP < 2,5 s et score d'accessibilité ≥ 95.
- Parcours complets disponibles en français et en anglais.
- Sauvegardes testées et déploiement reproductible sur le VPS.

---

## 15. Questions encore ouvertes
1. Ville de lancement et nombre d'établissements visés avant l'ouverture publique.
2. Taux de commission, plans d'abonnement et prix (configurables dans l'admin, à décider avant la mise en production).
3. Politique d'annulation par défaut (délai, remboursement, frais de no-show).
4. Prestataire SMS et budget associé.
5. Statut juridique et fiscal de Belora (TVA, facturation, Stripe) à valider avec un professionnel.
