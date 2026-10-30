# Directives de Style & Règles de Code

## 1. Interdiction des Icônes & Badges Génériques IA
- **Ne jamais utiliser l'icône Sparkles** (`LuSparkles`, `IoSparkles`, `✨`, etc.).
- **Ne pas générer de badges/eyebrows génériques d'IA** au-dessus de chaque titre de section (ex : pastille "Utilisation Ultra-Simple", "Technologie Avancée", etc.).
- Conserver des titres de section propres, sobres, et directement alignés avec l'identité éditoriale de la marque.

## 2. Standardisation Typographique & Composants Tailwind
- **Privilégier systématiquement les classes typographiques standard de Tailwind CSS** (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`).
- **Éviter les valeurs arbitraires en crochets** (ex : `text-[11px]`, `text-[20px]`, `text-[13px]`) sauf contrainte de layout SVG indispensable.
- **Réutilisation des composants d'interface** : Utiliser les classes de composants globales déclarées dans `globals.css` (`.btn-primary`, `.btn-secondary`, `.btn-dark`, `.btn-outline`, `.btn-ghost`, `.input`, etc.) ou des composants UI modulaires pour éviter les répétitions de classes utilitaires et garantir une uniformité parfaite.

## 3. Direction Artistique (DA) & Palette de Couleurs
- **Conserver la palette primaire et secondaire officielle** définie dans `globals.css` :
  - Primaire : Bleu Marine (`var(--primary-500)`, `bg-primary-500`, `text-primary-600`, etc.).
  - Secondaire : Or / Ambre (`var(--secondary-500)`, `bg-secondary-500`, `text-secondary-600`, etc.).
- **Interdiction Formelle des Dégradés (NO GRADIENT)** :
  - Ne jamais utiliser de dégradés (`linear-gradient`, `bg-gradient-to-*`, etc.) sur l'application. Utiliser uniquement des aplats de couleurs solides ou des masques opaques unis.
- **Ne jamais réintroduire de vert `#0E7C66` en dur** ni de couleurs hors charte graphique.
- Respecter le thème visuel propre du site : fonds clairs et aérés, bordures fines et douces (`border-neutral-200/80`), et ombres portées légères.

## 4. Prévention des Superpositions & Layout Safety
- Toujours contrôler la position absolue et les z-index pour éviter que des numéros géants, éléments filigranes ou effets visuels ne viennent se superposer à des textes ou boutons.
- Les conteneurs dynamiques doivent posséder des paddings adéquats pour ne jamais rogner les cartes ou éléments du bas.

## 5. Interdiction totale des émojis
- **Ne jamais utiliser d'émojis dans l'interface (ex : `✨`, `🚀`, etc.). Toujours privilégier l’usage d’icônes SVG ou vectorielles cohérentes avec la DA.**

## 6. Interdiction de la Surcharge de Badges & Pastilles (Pills)
- **Ne pas ajouter de badges/pastilles arrondis inutiles ("pills") sur l'interface** (ex : pastilles au-dessus des titres, badges d'état colorés répétés au sommet des cartes, pastilles "Ouvert", "KYB Vérifié", etc.).
- Intégrer les informations de statut de manière sobre et typographique (ex : icône SVG fine à côté du nom, simple texte de statut discret en bas de carte).
- Conserver des cartes et titres épurés sans accumulation d'étiquettes flottantes.

## 7. Utilisation Obligatoire du Composant `<Image />` de Next.js
- **Toujours utiliser le composant `<Image />` importé depuis `next/image` à la place de la balise HTML brute `<img>`.**
- Ne jamais désactiver la règle avec `eslint-disable-next-line @next/next/no-img-element`.
- Spécifier les attributs `width`, `height`, `alt`, ou `fill` (avec un conteneur `relative`) selon les besoins du layout.

## 8. Interdiction de la Surcharge des Composants Tailwind
- **Interdiction de surcharger excessivement les composants Tailwind globaux** (ex : `btn-navy`, `btn-outline`, `input`, etc.).
- Lorsqu'un composant réutilisable est appliqué, ne pas ré-ajouter une longue liste de classes utilitaires redondantes (paddings, typographies, ombres, flexions).
- **Mauvais exemple à proscrire** : `className="shrink-0 text-sm sm:text-base px-5 py-2.5 inline-flex items-center gap-1.5 font-extrabold shadow-sm"`
- **Bon exemple à privilégier** : `className="shrink-0"` (laisser la classe composant globale de `globals.css` gérer le style, le padding, l'alignement et la typographie).

## 9. Interdiction des Couleurs Hexadécimales en Dur (`bg-[#...]`, `text-[#...]`)
- **Interdiction d'utiliser des couleurs hexadécimales en dur** dans les classes Tailwind (ex : `bg-[#0b192c]`, `text-[#0b192c]`, `bg-[#061325]`, `border-[#...]`).
- **Toujours privilégier les classes de thèmes Tailwind ou les variables CSS personnalisées** déclarées dans `globals.css` (ex : `bg-primary-500`, `text-primary-600`, `bg-secondary-500`, `bg-dark-900`, `text-slate-900`, etc.). Si une nouvelle nuance récurrente est nécessaire, l'ajouter sous forme de token/variable dans `globals.css`.

## 10. Nommage Anglais des Chemins (URLs / Paths) & Organisation des Routes
- **Tous les chemins d'accès (routes Next.js App Router) doivent impérativement être rédigés en anglais** (ex : `/company/create`, `/account`, `/onboarding`, `/my-account`, `/login`, etc.).
- **Organisation avec des Groupes de Routes `()`** : Utiliser des dossiers de groupe entre parenthèses (ex : `(dashboard)`, `(auth)`) pour regrouper les pages liées et leur associer un layout partagé (`layout.tsx`).

## 11. Animations
- Utiliser "framer-motion" pour les animations UI avancées.

## 12. Interdiction Formelle des Popups Brutes Navigateur (`alert()`, `confirm()`, `prompt()`)
- **Ne jamais utiliser les fonctions natives du navigateur `alert()`, `confirm()` ou `prompt()`**.
- Utiliser systématiquement les composants de modale personnalisés réutilisables (ex : `ConfirmModal`) ou des notifications toast (`sonner`) pour garantir une expérience utilisateur haut de gamme et uniforme avec la charte graphique AvoPages.

## 13. Support Obligatoire du Glisser-Déposer (Drag and Drop) sur les Sélecteurs de Fichiers
- **Tous les sélecteurs et zones de téléversement de fichiers (Dropzones) doivent impérativement supporter le glisser-déposer (Drag & Drop)** natif en plus du clic d'importation.
- Gérer l'état visuel lors du survol de fichier (`isDragging` / `isDragOver`) avec un changement de style distinctif (bordure d'accentuation `border-primary-500`, fond surligné `bg-primary-100/60`, feedback textuel) et des animations fluides.
- L'expérience utilisateur (UX) doit toujours être pensée et peaufinée de bout en bout (prévisualisation locale instantanée, suppression facile, ré-sélection sans réinitialisation manuelle requise, notifications toast).

## 14. Interdiction des Termes Techniques / Fournisseurs & Prévalidation des Fichiers
- **Ne jamais exposer de détails techniques, de noms de services ou de fournisseurs** dans les messages d'erreur et notifications destinées à l'utilisateur (ex : interdiction absolue des termes "Cloudinary", "Prisma", "Database", "Server 500", etc.).
- Utiliser uniquement une formulation propre, professionnelle et orientée utilisateur (ex : "Impossible d'envoyer l'image. Veuillez vérifier votre connexion et réessayez.").
- **Prévalidation Client Obligatoire** : Tous les sélecteurs de fichiers doivent vérifier le format et la taille maximale (5 Mo par image, 10 Mo par document PDF) avant tout envoi réseau, et afficher clairement les formats acceptés et la taille maximale sous chaque zone de dépôt.

## 15. Squelettes de Chargement Ciblés (Inline Skeleton Loaders)
- **Interdiction des squelettes globaux de page ou de cartes** : Ne jamais afficher un grand bloc de squelette gris qui recouvre toute la page, la table ou la carte pendant le chargement des données. Cela crée un effet de flash massif non professionnel.
- **Règle d'or : squelettes chirurgicaux uniquement.** La carte entière, ses bordures, ses icônes et ses textes statiques (ex : "Volume Total Transigé", "Fonds Séquestrés") s'affichent IMMÉDIATEMENT et de manière fixe. Seule la valeur numérique ou le texte dynamique précis en attente de la réponse serveur affiche une pastille/barre inline `bg-slate-200 animate-pulse` (ou `bg-slate-100`).
- **Exemple de pattern correct** :
  ```tsx
  <div className="bg-white rounded-2xl border border-neutral-200/80 p-5">
    <span className="text-xs text-slate-500 font-medium">Volume Total Transigé</span>
    {isLoading ? (
      <span className="block h-8 w-28 rounded-lg bg-slate-200 animate-pulse my-1" />
    ) : (
      <span className="text-2xl font-extrabold text-slate-900">{formattedVolume}</span>
    )}
  </div>
  ```

## 16. Distinguo Strict entre État d'Erreur (Error State) et État Vide (Empty State)
- **Interdiction de masquer un échec par un état vide** : Ne jamais afficher "Aucun résultat trouvé", "Aucun produit", etc. lorsqu'une requête ou Server Action échoue. C'est une fausse information qui trompe l'utilisateur.
- **Détection composite des erreurs** : Pour les appels React Query / Server Actions, ne pas se fier uniquement à `isError` si la Server Action ou la route API attrape les exceptions et retourne `{ error: string }`. Toujours utiliser la détection composite : `hasError = isError || Boolean(data?.error)`.
- **UI d'Erreur User-Friendly & Actionnable** : En cas d'erreur (`hasError`), afficher un état d'erreur dédié avec un visuel sobre (icône SVG fine d'alerte, titre explicite, message sans termes techniques) et un bouton d'action principal **"Réessayer"** (ex : déclenchant `refetch()`).

## 17. API Routes, Axios & React Query (Gestion du Cache & Invalidation Optimale)
- **N'utilise pas les Server Actions**.
- **Toujours utiliser les API Routes (`/api/...`) du Next.js App Router combinées à l'instance préconfigurée Axios (`apiClient`) et React Query** pour toutes les opérations réseaux (listes, création, édition, suppression, recherches, etc.).
- **Gestion Optimale du Cache** :
  - *Côté Serveur* : Configurer les en-têtes HTTP de cache appropriés (ex : `Cache-Control: public, s-maxage=10, stale-while-revalidate=59` pour les annuaires publics).
  - *Côté Client* : Utiliser `useQuery` de React Query avec un `staleTime` (ex : `60_000`ms) et `gcTime` (ex : `10 * 60_000`ms) adaptés, ainsi que `placeholderData: keepPreviousData` pour garantir des transitions fluides sans flash.
- **Invalidation Précise du Cache** : Lors des mutations (création, mise à jour, suppression), exécuter `queryClient.invalidateQueries({ queryKey: [...] })` sur la clé exacte pour rafraîchir instantanément la donnée côté client.
- **Séparation Clé de Requête (queryKey) & Vue Client** : Les états purement visuels (ex : `activeTab`) ne doivent pas être inclus dans la `queryKey` si l'API renvoie le jeu de données complet, afin d'éviter les requêtes superflues et de garantir des transitions instantanées entre vues.

## 18. Affichage Conditionnel & Feature Gating pendant le Chargement
- **Interdiction de charger un état verrouillé (Feature Gated) par défaut** : Si l'accès à une fonctionnalité dépend d'une donnée en cours de chargement (ex : plan d'abonnement `subscriptionPlan`), ne jamais afficher l'UI de verrouillage (ex : icône de cadenas) pendant le chargement.
- **Squelette Ciblé pour le Chargement** : Afficher un squelette (skeleton inline) ciblé à la place du cadenas ou de l'indicateur de restriction pendant le chargement de la donnée, pour éviter le "flickering" (l'icône apparaît puis disparaît une fois la donnée chargée). L'expérience utilisateur (UX) ne doit jamais tromper l'utilisateur.

## 19. Interdiction Formelle des Effets de Zoom / Agrandissement au Survol (`hover:scale`)
- **Interdiction absolue d'utiliser `hover:scale-*` ou `group-hover:scale-*`** (ex : `hover:scale-105`, `group-hover:scale-104`, `hover:scale-102`, `scale-105`, etc.) sur les images, cartes, icônes, conteneurs ou boutons.
- **Interdiction des règles CSS appliquant un `scale` au survol** (ex : `.tile:hover .tile-media { @apply scale-105 }`).
- **Privilégier des micro-interactions sobres, stables et luxueuses** conformes à la DA Belora :
  - Transitions douces de bordure (`hover:border-neutral-300`, `hover:border-primary-600/80`).
  - Ombres portées délicates (`hover:shadow-md`, `hover:shadow-xs`).
  - Changements de teintes de fond ou de texte (`group-hover:text-primary-600`, `hover:bg-neutral-50`).
  - Déplacements discrets d'icônes d'action (`group-hover:translate-x-0.5`, `group-hover:-translate-y-0.5`).
- Les éléments doivent rester stables et fixes dans leur conteneur sans zoom ni effet de pulsation saccadé.