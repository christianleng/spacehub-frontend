# 🏢 SpaceHub — Coworking Multi-Tenant App

Application SaaS multi-tenant pour gérer des espaces de coworking :

- **Utilisateurs & rôles (RBAC)**
- **Réservations (salles, bureaux)**
- **Paiements (Stripe Connect)**
- **Analytics (occupation, revenus, cohortes)**

Construit avec **Next.js 14 (App Router)**, **TypeScript**, **Prisma/Postgres**, **MobX**, **Stripe**, **Tailwind + shadcn/ui**.

---

## 🚀 Stack Technique

- **Frontend** : [Next.js 14](https://nextjs.org/) (App Router, RSC, Route Handlers)
- **Langage** : TypeScript
- **UI** : TailwindCSS + shadcn/ui + react-hook-form + zod
- **State** : MobX (`onboarding.store.ts`, etc.)
- **DB** : PostgreSQL + Prisma ORM
- **Cache/Jobs** : Redis (BullMQ/Inngest possible)
- **Auth** : Auth.js (NextAuth) — Google OAuth + Credentials
- **Payments** : Stripe Connect (abonnements, usage, reversements)
- **Observabilité** : OpenTelemetry, Sentry, Logtail/Datadog

---

## 🛠 Installation

1. `pnpm install`
2. `docker-compose up -d`
3. `pnpm prisma migrate dev`
4. `pnpm dev`

---

## 📂 Architecture de dossiers

```txt
src/
├─ app/                         # Routes App Router
│  ├─ (auth)/sign-in/           # Pages auth
│  ├─ (onboarding)/onboarding/  # Page onboarding
│  ├─ api/                      # API routes (si besoin REST)
│  ├─ layout.tsx                # Layout racine
│  └─ providers.tsx             # Context Providers (MobX, etc.)
│
├─ core/                        # Hooks et libs transverses
│  └─ hooks/store/use-store.ts  # Hook pour accéder au RootStore
│
├─ features/                    # Domaines métier (DDD-style)
│  ├─ auth/
│  │  └─ server/                # Auth.js + server actions auth
│  │
│  └─ onboarding/               # Feature Onboarding
│     ├─ ui/                    # Composants UI (Steps, Form)
│     ├─ store/                 # MobX store
│     ├─ services/              # Services client → server actions
│     └─ server/                # Code serveur pur
│
├─ store/
│  └─ root.store.ts             # RootStore qui instancie tous les stores
│
├─ prisma/
│  ├─ migrations/               # Migrations Prisma
│  └─ schema.prisma             # Schéma DB
│
└─ components/                  # Composants UI génériques (shadcn/ui)
```
