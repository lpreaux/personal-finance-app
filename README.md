# Personal Finance App — prototype

Prototype full-stack réalisé à partir du challenge [Personal Finance App de Frontend Mentor](https://www.frontendmentor.io/challenges/personal-finance-app-JfjtZgyMt1).

## État du projet

Ce dépôt conserve une expérimentation fonctionnelle, mais incomplète. Il ne s'agit pas d'une solution terminée au challenge.

Fonctionnel dans l'état actuel :

- authentification Clerk et connexion à Convex ;
- tableau de bord responsive avec navigation desktop/mobile ;
- vue d'ensemble alimentée par des données de démonstration ;
- schéma Convex multi-utilisateur pour transactions, budgets, pots et factures récurrentes ;
- import de données de démonstration ;
- liste de transactions paginée côté Convex.

À terminer :

- recherche, tri et filtres des transactions ;
- opérations CRUD sur les budgets et pots ;
- suivi des factures récurrentes ;
- remplacement des données de démonstration du tableau de bord ;
- états de chargement, erreurs et retours de validation complets.

## Stack

- Next.js 15, React 19 et TypeScript ;
- Tailwind CSS 4 ;
- Convex pour les données temps réel ;
- Clerk pour l'authentification ;
- Zod, ESLint et Prettier.

## Lancement local

Prérequis : Node.js 20+, pnpm, un déploiement Convex et une application Clerk.

```bash
cp .env.example .env.local
# Renseigner les trois variables dans .env.local
pnpm install --frozen-lockfile
pnpm dev
```

Configurer également `CLERK_JWT_ISSUER_DOMAIN` dans le tableau de bord Convex, puis ouvrir <http://localhost:3000>.

## Vérifications

```bash
pnpm check
pnpm format:check
pnpm build
```

## Décision de publication

Le dépôt est un prototype d'apprentissage. S'il n'est pas repris pour terminer les parcours ci-dessus, il a vocation à être archivé plutôt qu'à être présenté comme une application finalisée.
