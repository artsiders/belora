# Belora — Guide d'utilisation complet

*Version du 21 novembre 2026 — rédigé à partir du code source (branche `main`, commit `3c5734b`).*

> Ce guide décrit **ce que l'application fait réellement aujourd'hui**. Quand une fonctionnalité est visible mais pas (ou pas entièrement) branchée, c'est signalé par ⚠️. Le détail des écarts est dans [AUDIT-COHERENCE.md](AUDIT-COHERENCE.md).

---

## Sommaire

1. [Qu'est-ce que Belora ?](#1-quest-ce-que-belora-)
2. [À qui s'adresse l'application](#2-à-qui-sadresse-lapplication)
3. [Business model](#3-business-model)
4. [Périmètre (scope) du MVP](#4-périmètre-scope-du-mvp)
5. [Carte du site et rôles](#5-carte-du-site-et-rôles)
6. [Partie CLIENT — tutoriel](#6-partie-client--tutoriel)
7. [Partie PRO — tutoriel](#7-partie-pro--tutoriel)
8. [Partie ADMIN — tutoriel](#8-partie-admin--tutoriel)
9. [Automatismes en arrière-plan](#9-automatismes-en-arrière-plan)
10. [Comptes de test et démarrage local](#10-comptes-de-test-et-démarrage-local)
11. [Glossaire](#11-glossaire)

---

## 1. Qu'est-ce que Belora ?

Belora est une **marketplace de réservation de prestations beauté et bien-être** (coiffure, barbier, onglerie, soins du visage, massage/spa, soins à domicile) couplée à un **logiciel de gestion pour les salons** (agenda, caisse, fichier clients, paramétrage).

C'est un clone fonctionnel de **Planity** (référence principale) avec quelques emprunts à **Fresha**, mais avec une identité éditoriale propre : ton « haute horlogerie / maison d'artisans », vocabulaire *sanctuaire*, *maison*, *artisan*, *geste*.

Une seule application Next.js sert trois publics :

| Espace | URL de base | Pour qui |
|---|---|---|
| Site public / marketplace | `/`, `/search`, `/venue/...`, `/book/...` | Grand public |
| Espace client | `/account` | Clients connectés |
| Espace Pro (backoffice) | `/pro/...` | Gérants et équipes de salon |
| Panneau Admin | `/admin/...` | Équipe Belora |

---

## 2. À qui s'adresse l'application

### 2.1 Les clients (demande)
Particuliers qui veulent **trouver un salon, voir ses prix et réserver un créneau en moins d'une minute**, 24h/24, sans téléphoner. Ils peuvent réserver **sans compte** (invité) ou avec un compte pour retrouver leurs rendez-vous.

### 2.2 Les professionnels (offre)
Salons de coiffure, barbiers, instituts, bars à ongles, spas, praticiens bien-être, artisans à domicile. Ils utilisent Belora pour :
- être visibles sur la marketplace et recevoir des réservations en ligne ;
- gérer leur **agenda** multi-collaborateurs et multi-cabines ;
- **encaisser** (caisse légère + clôture Z) ;
- tenir un **fichier clients** avec fiches techniques (formules de couleur, sensibilités…).

### 2.3 L'équipe Belora (plateforme)
Administrateurs qui valident les établissements, modèrent les avis, supervisent les réservations, règlent les commissions et suivent la santé de la plateforme.

---

## 3. Business model

Inspiré de Planity / Fresha (cf. `belora-feuille-de-route-mvp.md` §6) :

| Source de revenu | Principe | État dans le code |
|---|---|---|
| **Commission par réservation** | % prélevé sur les réservations payées en ligne (défaut **1,8 %**), réglable globalement et par salon | Calculée côté serveur, passée à Stripe comme `application_fee` sur l'acompte. Réglable dans Admin › Monétisation et Admin › Établissements |
| **Abonnement pro** | Forfait mensuel pour le logiciel : *Atelier Solo* 39 €/mois (31 € en annuel), *Maison & Équipe* 69 €/mois (55 € en annuel) | ⚠️ Affiché uniquement sur la page marketing `/pro`. Aucune facturation, aucun plan en base |
| **Frais de paiement** | Frais Stripe répercutés | ⚠️ Non implémenté |

**Flux d'argent prévu (Stripe Connect)** : le client paie un **acompte** (30 % par défaut, ou montant fixe par prestation) → Belora garde sa commission → le reste part sur le compte Stripe du salon → le solde est réglé en salon via la Caisse (l'acompte est déduit automatiquement du ticket).

**Promesse commerciale aux pros** (page `/pro`) : « 0 % de commission sur vos habitués », sans engagement, migration gratuite du fichier clients en 24 h.

---

## 4. Périmètre (scope) du MVP

**Dans le périmètre** : recherche + carte, fiches salons, tunnel de réservation 4 étapes, réservation invité, acompte Stripe, compte client (RDV, annulation, avis, profil), agenda pro jour/semaine par collaborateur et par cabine, pointage, caisse + Z, CRM avec fiches techniques, catalogue de prestations, équipe et horaires, paramètres de notification, admin (dashboard, salons, utilisateurs, réservations, avis, finances, monétisation, création assistée).

**Hors périmètre** (volontairement) : app mobile, cartes cadeaux réelles, fidélité, marketing automatisé, inventaire, chat, paie.

**Lancement** : France, euros, fuseau Europe/Paris ; conçu pour être international (des salons fictifs à Londres, Milan, Rome, Barcelone, Genève, New York existent dans les données de démonstration).

---

## 5. Carte du site et rôles

Il y a 3 rôles (`CUSTOMER`, `PRO`, `ADMIN`). La protection des pages se fait dans `src/auth.config.ts` :

| Zone | Accès |
|---|---|
| Pages publiques | Tout le monde |
| `/account` | Connecté (n'importe quel rôle) |
| `/pro/agenda`, `/pro/checkout`, `/pro/clients`, `/pro/settings/*` | PRO ou ADMIN |
| `/pro` (vitrine) et `/pro/join` | Public |
| `/admin/*` | ADMIN uniquement |

Après connexion, chaque rôle est redirigé vers son espace : ADMIN → `/admin/dashboard`, PRO → `/pro/agenda`, CLIENT → `/account`.

```
/                         Accueil
├── /search               Résultats + carte
├── /category/[slug]      Pages univers (hair, facial, nails, barber, massage, home)
├── /venue/[slug]         Fiche établissement
├── /book/[venueSlug]     Tunnel de réservation
├── /login /register /forgot-password
├── /account              Mon compte (client)
├── /about  /help
├── /pro                  Vitrine Belora Pro (marketing + tarifs)
├── /pro/join             Formulaire « Devenir partenaire »
├── /pro/agenda           ┐
├── /pro/checkout         │ Backoffice pro
├── /pro/clients          │
├── /pro/settings/...     ┘
└── /admin/...            Panneau d'administration
```

---

## 6. Partie CLIENT — tutoriel

### 6.1 Page d'accueil `/`

De haut en bas :
1. **Barre de navigation** : logo, liens Recherche / Pro / Connexion ou Mon compte.
2. **Hero + barre de recherche** à 3 champs : *Où ?* (ville), *Quoi ?* (prestation/salon), *Quand ?* (mini-calendrier). Le bouton envoie vers `/search?location=…&category=…&date=…`.
   - ⚠️ Le champ date est transmis mais **ignoré** par la page de résultats.
3. **Bandeau des univers** : 7 pastilles rondes (Tout, Coiffure, Visage, Ongles, Barbier, Massage, À domicile) → pages `/category/...`.
4. **Philosophie**, **ruban défilant éditorial**.
5. **« Nos salons populaires »** : 4 cartes salons (note, tags, prix d'appel) → fiche salon.
   - ⚠️ Ces cartes sont écrites en dur (pas lues depuis la base) et les villes affichées ne correspondent pas toujours aux salons.
6. **Bannière de réassurance**, **Expérience sanctuaire**, **Portraits d'artisans**, **Galerie de réalisations**, **Répertoire par villes**.
7. **Pied de page** : liens À propos, Aide, Pro, CGU, Confidentialité, réseaux sociaux.

### 6.2 Pages univers `/category/[slug]`

Slugs disponibles : `hair`, `facial`, `nails`, `barber`, `massage`, `home`, `all`.
Chaque page contient : un hero thématique, un aperçu de salons de la catégorie, un guide éditorial (« comment choisir »), les villes, un encart pour les pros. Contenu entièrement éditorial (fichier `src/lib/data/categories.ts`).

### 6.3 Recherche `/search`

**Tutoriel :**
1. Saisissez une ville (*location*), une prestation ou un nom (*q*), choisissez une catégorie, puis validez → l'URL se met à jour.
2. La **liste** à gauche affiche les salons publiés correspondants ; la **carte** (Leaflet) à droite positionne chaque salon.
3. Survoler une carte met le marqueur en évidence ; cliquer sélectionne le salon sur la carte.
4. Les **sous-filtres** (puces « Tous », « Coloration », etc.) filtrent la liste localement.
5. Sur mobile, basculez entre **Liste** et **Carte**.
6. Le **cœur** sur une carte ajoute en favori — ⚠️ uniquement en mémoire de la page (perdu au rechargement, non relié au compte).
7. Cliquez sur une carte → fiche salon, ou sur un créneau/bouton → réservation.

⚠️ Pas encore de filtres prix / note / distance / disponibilité ni de tri, bien que l'API sache filtrer par note minimale.

### 6.4 Fiche établissement `/venue/[slug]`

Contenu : fil d'Ariane (Accueil / Ville / Salon), nom, accroche, note moyenne et nombre d'avis, adresse, prix d'appel, galerie photo, **liste des prestations** (nom, durée, prix) avec un bouton **Réserver** par prestation, **équipe**, **avis** (avec réponse du salon s'il y en a), **horaires** de la semaine, encart de réservation collant.

- Bouton **Réserver** sur une prestation → `/book/[slug]?service=ID` (le tunnel démarre à l'étape 2).
- Bouton général **Réserver** → `/book/[slug]` (étape 1).

> Les données viennent de la base PostgreSQL ; si le salon n'existe pas en base, la page utilise un salon de démonstration du fichier `src/lib/data/venues.ts`. ⚠️ La galerie photo est la même pour tous les salons en base.

### 6.5 Tunnel de réservation `/book/[venueSlug]` (4 étapes)

**Étape 1 — Prestations.** Cochez une ou plusieurs prestations. Le récapitulatif (durée totale, prix total) se met à jour. *Continuer*.

**Étape 2 — Artisan.** Choisissez un membre de l'équipe ou **« Sans préférence »** (premier disponible). *Continuer*.

**Étape 3 — Créneau.** Choisissez un jour dans le bandeau des prochains jours ; les créneaux libres sont calculés en temps réel par le moteur de disponibilités (`/api/availability`) en tenant compte des horaires, des congés et des RDV existants. Choisissez une heure.

**Étape 4 — Coordonnées.** Nom, téléphone (obligatoire), e-mail, notes pour le salon. Option **« Offrir cette prestation »** : nom du bénéficiaire + message (ajoutés en note du RDV — ce n'est pas une vraie carte cadeau). *Confirmer la réservation*.

**Écran de confirmation** : référence (`#BEL-XXXX`), date/heure, artisan, montant de l'**acompte** et du **reste à payer en salon**.

À tout moment, cliquer sur une étape déjà franchie permet d'y revenir.

> ⚠️ **Important** : si une prestation exige un acompte, le serveur crée bien un paiement Stripe, mais **aucun formulaire de carte n'est affiché**. La réservation reste « en attente de paiement » et le client ne paie jamais. Voir l'audit.

### 6.6 Inscription / connexion

- **`/register`** : choisir **Client** ou **Professionnel** (onglet en haut, ou `?role=pro`), puis prénom, nom, e-mail, téléphone, mot de passe.
  - Client → compte créé, redirection vers `/account`.
  - Pro → compte PRO **+ un établissement créé et publié immédiatement** avec un collaborateur par défaut, redirection vers `/pro/agenda`.
- **`/login`** : e-mail + mot de passe, ou **Continuer avec Google** (si configuré). Redirection selon le rôle ou vers la page demandée (`callbackUrl`).
- **`/forgot-password`** : ⚠️ formulaire factice, affiche un succès après un délai mais **n'envoie aucun e-mail**.

### 6.7 Mon compte `/account`

Quatre onglets (aussi accessibles via `?tab=upcoming|past|favorites|profile`) :

1. **À venir** — liste des RDV futurs : salon, prestation, artisan, date/heure, montant, statut.
   - **Annuler** : ouvre une confirmation. Si on est dans le délai autorisé par le salon (24 h par défaut), l'annulation est acceptée et l'acompte remboursé via Stripe s'il a été payé ; un e-mail d'annulation part.
   - ⚠️ Pas de bouton « Déplacer / reporter ».
2. **Passés** — historique. Bouton **Laisser un avis** (note 1–5 + commentaire) sur les RDV honorés ; l'avis est marqué « vérifié » et apparaît sur la fiche salon. Bouton pour **réserver à nouveau**.
3. **Favoris** — ⚠️ liste fixe de salons de démonstration, sans lien avec les cœurs cliqués dans la recherche.
4. **Profil** — modifier prénom, nom, téléphone. Déconnexion.

### 6.8 Pages institutionnelles
- **`/about`** : histoire et valeurs de Belora.
- **`/help`** : FAQ (réservation, annulation, paiement, compte).
- ⚠️ `/terms` et `/privacy` sont liés dans le footer mais **n'existent pas** (page 404).

---

## 7. Partie PRO — tutoriel

### 7.1 Découvrir l'offre : `/pro`

Page marketing destinée aux gérants : arguments (agenda, rappels SMS, acomptes, 0 % de commission sur les habitués), maquette d'agenda, comparatif avec « les autres plateformes », **grille tarifaire** (bascule mensuel/annuel : *Atelier Solo* et *Maison & Équipe*), FAQ, témoignages. Boutons **Commencer** → `/pro/join`, **Se connecter** → `/login`.

### 7.2 Devenir partenaire : `/pro/join` (formulaire de contact)

1. **Aiguillage** : « Je découvre » ou « Je suis déjà client ».
2. **Type d'établissement** : salon/barbershop, institut/spa/bar à ongles, bien-être, artisan indépendant.
3. **Spécialité** précise.
4. **Informations du salon** (nom, ville…).
5. **Coordonnées** (nom complet, téléphone, e-mail) → écran « Merci, un conseiller vous contactera ».

⚠️ Ces informations **ne sont envoyées nulle part** (pas d'appel API). Pour réellement créer un espace pro, il faut passer par `/register?role=pro`.

### 7.3 Se connecter et naviguer dans le backoffice

Après connexion d'un PRO, on arrive sur **`/pro/agenda`** (`/pro/dashboard` redirige aussi vers l'agenda).

**Barre supérieure permanente** :
- Logo (retour agenda).
- **Sélecteur d'établissement** : changer de salon actif, voir la fiche publique, ou **créer un nouvel établissement** (fenêtre « Nouvel établissement »).
- **4 onglets** : **Agenda**, **Caisse**, **Clients**, **Admin** (= paramètres).
- **Horloge** temps réel.
- **Cloche de notifications** (⚠️ contenu de démonstration).
- **Menu profil** : Équipe, Établissement, Prestations, Voir ma page publique, Aide, (Admin Belora si rôle ADMIN), Déconnexion.

### 7.4 Agenda `/pro/agenda`

**Barre d'outils** :
- **Aujourd'hui**, flèches **jour/semaine précédent(e)/suivant(e)**.
- **Vue Jour / Semaine**.
- **Intervalle** de la grille : 10, 15, 20 ou 30 min.
- **+ Nouveau RDV**.
- Bouton pour afficher/masquer le panneau latéral.

**Panneau latéral** :
- **Mini-calendrier mensuel** : cliquer un jour pour y aller.
- **Collaborateurs** : cases à cocher pour afficher/masquer chaque colonne.
- **Cabines / ressources** : idem.
- Raccourcis **Pointage** et **Horaires de présence**.

**Grille** :
- En vue jour, les colonnes peuvent être **par collaborateur**, **par cabine** ou **toutes** (bascule en haut de la grille).
- Une **ligne rouge** indique l'heure actuelle.
- **Cliquer sur un créneau vide** → ouvre la création de RDV pré-remplie (collaborateur + heure).
- **Cliquer sur un RDV** → ouvre sa fiche.

**Créer un RDV (tutoriel)** :
1. Cliquez sur un créneau ou sur *+ Nouveau RDV*.
2. Choisissez le **client** dans la liste (recherche) ou créez-en un rapidement (nom, téléphone, e-mail).
3. Choisissez la **prestation**, le **collaborateur**, éventuellement la **cabine**, la date et l'heure, des notes.
4. Validez → le RDV apparaît dans la grille.

**Gérer un RDV existant** (fiche RDV) :
- **Annuler le RDV**, **Absent (No-show)**, **Marquer honoré**.
- **Encaisser (X €)** → bascule vers la Caisse avec le RDV pré-chargé (acompte déjà déduit).
- ⚠️ Pas de déplacement par glisser-déposer ni de modification d'horaire depuis l'interface.

**Pointage** (*Clock-in*) : sélectionnez un collaborateur → **Arrivée** / **Départ**. L'heure est enregistrée.

**Horaires de présence** : définir l'heure de début/fin prévue de chaque collaborateur pour la journée.

### 7.5 Caisse `/pro/checkout`

Écran en deux parties :
- **Gauche** : les RDV du jour à encaisser et la recherche client.
- **Droite (terminal)** : le panier.

**Encaisser (tutoriel)** :
1. Sélectionnez un RDV du jour (ou partez de *Encaisser* dans l'agenda), ou choisissez un client et ajoutez des prestations manuellement.
2. Le total TTC s'affiche, avec le **HT et la TVA** calculés ; l'**acompte Stripe déjà payé est déduit** automatiquement.
3. Choisissez le mode de règlement : **Carte (TPE)**, **Espèces** ou **Mixte** (répartir les montants).
4. Validez → un **ticket** `TK-AAAA-NNNN` est créé et listé dans les ventes du jour.

**Clôture de caisse (Z)** :
1. Bouton **Clôture du jour**.
2. Le récapitulatif affiche le total TTC/HT/TVA, CB, espèces, acomptes, et le détail par collaborateur.
3. Saisissez le **montant d'espèces compté** ; l'écart est calculé.
4. Validez → la journée est clôturée (une seule clôture par jour et par salon).

### 7.6 Clients `/pro/clients` (CRM)

- **Liste** à gauche avec **recherche instantanée** (nom, téléphone, e-mail) et compteur.
- **+ Nouveau client** : prénom, nom, téléphone, e-mail, notes.
- Cliquer un client ouvre sa **fiche (tiroir)** :
  - coordonnées modifiables ;
  - **notes d'accueil & préférences** (boisson, température…) ;
  - **nature/texture du cheveu**, **sensibilités et contre-indications** ;
  - **fiches techniques** : prestation, temps de pose, coloriste, formule/dosage — à ajouter au fil des visites ;
  - **historique des rendez-vous**, total dépensé, nombre de visites.
- Enregistrer les modifications sauvegarde la fiche.

### 7.7 Admin du salon `/pro/settings/...`

Menu latéral : Prestations, Établissement, Équipe, Caisse, Notifications, Aide.

**a) Prestations `/pro/settings/services`**
- Prestations **groupées par catégorie** (arborescence).
- **+ Catégorie** / supprimer une catégorie.
- **+ Prestation** ou cliquer une prestation pour l'éditer : nom, description, durée, **temps de pose**, prix TTC, **acompte requis** et montant, collaborateurs habilités, cabine requise, visible en ligne / actif.
- **Dupliquer** une prestation.
- **Modifier les prix en masse** : sélectionner une catégorie ou des prestations → hausse/baisse en % ou en €.
- **Supprimer**.

**b) Établissement `/pro/settings/establishment`**
- Nom, accroche, description, adresse, ville, code postal, téléphone, e-mail.
- **SIRET**, **n° de TVA**.
- **Horaires d'ouverture** hebdomadaires (ouvert/fermé + heures).
- **Délai d'annulation** (heures) et **pourcentage d'acompte** par défaut.
- ⚠️ La section « paiements Stripe » est informative : aucun bouton de connexion Stripe Connect fonctionnel.

**c) Équipe `/pro/settings/team`**
- Liste des collaborateurs : nom, rôle, couleur dans l'agenda, actif/inactif.
- **+ Ajouter un collaborateur**.
- Éditer les **horaires hebdomadaires** de chacun.

**d) Caisse `/pro/settings/cash-register`**
- Taux de TVA par défaut, modes de paiement acceptés, fond de caisse, mentions du ticket, options d'impression/envoi du reçu.

**e) Notifications `/pro/settings/notifications`**
- Activer/désactiver les **rappels clients** par e-mail et SMS, délai du rappel (ex. 24 h avant), notifications au salon pour les nouvelles réservations/annulations.
- ⚠️ Ces réglages sont enregistrés mais **ne pilotent pas** encore l'envoi réel des rappels (le cron envoie à tout le monde selon ses propres règles).

---

## 8. Partie ADMIN — tutoriel

Accès : compte ADMIN → `/admin` (redirige vers `/admin/dashboard`). Menu latéral à gauche.

### 8.1 Vue d'ensemble `/admin/dashboard`
Indicateurs clés : nombre d'utilisateurs (clients/pros), établissements (publiés, en attente, suspendus), réservations (confirmées, honorées, annulées), volume d'affaires, **commissions Belora**, graphiques/tendances, dernières réservations. Bouton **Actualiser**.

### 8.2 Réservations `/admin/bookings`
- Tableau de toutes les réservations de la plateforme, **filtres** par statut et recherche (référence, client, salon).
- Compteurs : total, confirmées, honorées, annulées.
- Ouvrir une réservation → détail (client, salon, prestations, montants, paiement).
- **Annuler** avec un motif (support client).
  ⚠️ L'annulation admin ne rembourse pas l'acompte et n'envoie pas d'e-mail.

### 8.3 Utilisateurs `/admin/users`
- Liste filtrable par **rôle** (Tous / Clients / Pros / Admins) + recherche.
- Fiche utilisateur : infos, RDV, établissements possédés.
- **Modifier** (prénom, nom, téléphone, **rôle**), **Supprimer** (impossible de se supprimer soi-même).
- ⚠️ Pas de « blocage » d'un compte (prévu au cahier des charges).

### 8.4 Établissements `/admin/venues`
- Liste de tous les salons avec statut (**Brouillon**, **En attente de validation**, **Publié**, **Suspendu**), filtres et recherche.
- **Publier / Valider**, **Suspendre** : un salon suspendu disparaît de la recherche.
- **Modifier le taux de commission** propre à un salon.

### 8.5 Création assistée `/admin/venues/create-assisted`
Pour onboarder un salon à la main (comme Planity le fait par ses commerciaux) :
1. Saisir l'établissement (nom, adresse, ville, code postal, téléphone, catégorie…).
2. Saisir le gérant (nom, e-mail, téléphone).
3. Valider → compte PRO + établissement créés, **lien d'invitation** affiché.
⚠️ Le lien pointe vers `/pro/claim` qui **n'existe pas**, et aucun e-mail n'est envoyé.

### 8.6 Finances & Payouts `/admin/finance`
Rapport financier : volume TTC, acomptes encaissés, commissions perçues, remboursements, ventilation par salon et par mois. Bouton **Exporter CSV** (`/api/admin/finance/export`).
⚠️ Les « payouts » Stripe ne sont pas réellement suivis (pas de synchronisation des versements).

### 8.7 Modération des avis `/admin/reviews`
- Liste de tous les avis (note, commentaire, salon, auteur), filtres par note.
- **Marquer vérifié / non vérifié**, **Répondre** au nom du salon, **Supprimer**.

### 8.8 Monétisation `/admin/monetization`
- **Taux de commission par défaut** (en %) pour les nouveaux salons.
- **Mode maintenance** (case à cocher).
- **Commissions cumulées** et tableau **par établissement**.
⚠️ Aucune gestion de plans d'abonnement.

### 8.9 Paramètres & Santé `/admin/settings`
- Même réglage de **commission par défaut** et **mode maintenance** que la page précédente (doublon).
- **Santé système** : état base de données, Stripe, Resend (e-mail), Brevo (SMS), latences.
⚠️ Le mode maintenance n'est **appliqué nulle part** : les réservations restent ouvertes.

---

## 9. Automatismes en arrière-plan

| Automatisme | Déclencheur | Rôle |
|---|---|---|
| Moteur de disponibilités | `/api/availability` | Calcule les créneaux libres (horaires salon, horaires et congés collaborateurs, RDV existants, durée + temps de pose) |
| Verrou anti-double réservation | `/api/availability/lock` | Bloque un créneau 10 min pendant la saisie |
| Webhook Stripe | `/api/webhooks/stripe` | Passe la réservation en *Confirmée / Payée* à la réussite du paiement, envoie l'e-mail de confirmation au client et la notification au salon |
| Rappels | `/api/cron/reminders` (à appeler par une tâche planifiée) | E-mail (Resend) + SMS (Brevo) aux clients qui ont un RDV dans les prochaines 24 h |
| Remboursement | Annulation client dans les délais | `refund` Stripe de l'acompte |

---

## 10. Comptes de test et démarrage local

```bash
pnpm install
```
```bash
pnpm dev
```
Puis ouvrir http://localhost:3000. Les comptes et salons de démonstration sont créés par `prisma/seed.ts` (consultez-le pour les identifiants ; le salon principal est *L'Atelier Botanique*, slug `atelier-botanique-paris`).

Parcours de démonstration conseillé :
1. En invité : `/` → recherche « Paris » → *L'Atelier Botanique* → Réserver.
2. Créer un compte client, réserver, puis annuler depuis `/account`.
3. Se connecter en PRO → voir le RDV dans l'agenda → *Marquer honoré* → *Encaisser* → *Clôture du jour*.
4. Revenir en client → *Passés* → laisser un avis.
5. Se connecter en ADMIN → voir l'avis dans *Modération*, la réservation dans *Réservations*, la commission dans *Monétisation*.

---

## 11. Glossaire

| Terme | Sens |
|---|---|
| Établissement / salon / maison | Un lieu de prestation (`Venue`) |
| Artisan / collaborateur | Membre de l'équipe (`StaffMember`) |
| Ressource / cabine | Salle ou poste nécessaire à une prestation |
| Temps de pose | Durée pendant laquelle le collaborateur est libre (ex. coloration) |
| Acompte | Partie du prix payée en ligne à la réservation |
| No-show | Client absent sans prévenir |
| Ticket | Vente enregistrée en caisse (`SaleTicket`) |
| Z de caisse | Clôture comptable quotidienne (`DailyClosing`) |
| Fiche technique | Notes métier d'un client (formule couleur, sensibilités) |
| Commission | Part prélevée par Belora sur une réservation en ligne |
