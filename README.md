# 🎬 Contently - Content Operating System pour Créateurs

Un système de gestion de contenu complet pour créateurs de contenus, développé avec Next.js 14, Supabase et Stripe.

![Contently Dashboard](https://via.placeholder.com/1200x600?text=Contently+Dashboard)

## ✨ Fonctionnalités

### 📥 Inspirations
- Capture d'URLs depuis n'importe quelle plateforme
- Détection automatique de la plateforme (YouTube, Instagram, TikTok, Twitter)
- Système de tri (Non traité / Gardé / Écarté)
- Transformation en idée en un clic

### 💡 Gestion des Idées
- Pipeline visuel (Brouillon → Script → Filmé → Monté → Publié)
- Script builder avec blocs (Hook, Intro, Points, Transitions, CTA)
- Checklist B-Roll avec suivi de capture
- Organisation par piliers et catégories

### 📅 Planner
- Vue calendrier (semaine/mois)
- Drag & drop pour planifier
- Types de slots : Tournage, Montage, Publication
- Intégration avec les idées

### 🎬 Production (Filming Day)
- Queue de tournage du jour
- Timer d'enregistrement
- Checklist équipement
- Progression de la journée

### 🤝 CRM Marques
- Gestion des contacts marques
- Pipeline de deals (Lead → Contact → Négo → Proposition → Gagné)
- Suivi des montants et deadlines
- Historique des collaborations

### 📧 Email Hub
- Connexion comptes Gmail (OAuth) et IMAP
- Composition avec templates
- Association aux marques
- Dossiers (Inbox, Envoyés, Favoris)

### 💰 Revenus & Analytics
- Tracking multi-sources (Sponsoring, Affiliation, AdSense, Produits)
- Graphiques d'évolution
- Stats mensuelles et tendances
- Export des données

### ⚙️ Paramètres
- Gestion du profil
- Piliers de contenu personnalisables
- Catégories et types de contenu
- Setups de tournage avec équipement
- Groupes de hashtags
- Plans d'abonnement (Free/Pro/Creator+)

## 🛠️ Stack Technique

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **Paiements**: Stripe (Subscriptions, Webhooks)
- **Internationalisation**: French (date-fns/locale/fr)

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou pnpm
- Compte Supabase
- Compte Stripe (pour le billing)

### 1. Cloner le projet

```bash
git clone https://github.com/votre-repo/contently.git
cd contently
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration Supabase

1. Créez un nouveau projet sur [supabase.com](https://supabase.com)
2. Allez dans SQL Editor et exécutez les fichiers dans l'ordre :
   - `supabase/migrations/001_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_storage.sql`

### 4. Variables d'environnement

Créez un fichier `.env.local` :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_CREATOR_PLUS=price_xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Configuration Stripe

1. Créez les produits dans Stripe Dashboard :
   - **Pro** : 19€/mois
   - **Creator+** : 49€/mois
2. Copiez les `price_id` dans vos variables d'environnement
3. Configurez le webhook endpoint : `https://votre-domaine.com/api/stripe/webhook`
   - Événements à écouter :
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`

### 6. Lancer le projet

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
src/
├── app/
│   ├── (auth)/           # Pages d'authentification
│   │   ├── login/
│   │   ├── register/
│   │   └── onboarding/
│   ├── (dashboard)/      # Pages principales
│   │   ├── page.tsx      # Dashboard
│   │   ├── inspirations/
│   │   ├── ideas/
│   │   ├── planner/
│   │   ├── production/
│   │   ├── crm/
│   │   ├── emails/
│   │   ├── revenue/
│   │   └── settings/
│   ├── api/
│   │   └── stripe/       # Webhooks Stripe
│   └── layout.tsx
├── components/
│   └── ui/               # Composants shadcn/ui
├── lib/
│   ├── supabase/         # Clients Supabase
│   └── stripe/           # Utilitaires Stripe
├── types/
│   └── database.ts       # Types générés Supabase
└── styles/
    └── globals.css
```

## 🗄️ Schéma Base de Données

### Tables Principales
- `profiles` - Profils utilisateurs
- `content_pillars` - Piliers de contenu
- `content_categories` - Catégories
- `content_types` - Types de contenu
- `inspirations` - Sources d'inspiration
- `ideas` - Idées de contenu
- `script_blocks` - Blocs de script
- `broll_items` - Items B-Roll
- `planner_items` - Éléments planifiés
- `brands` - Contacts marques
- `deals` - Deals/partenariats
- `revenues` - Revenus
- `subscriptions` - Abonnements Stripe

## 🔒 Sécurité

- **Row Level Security (RLS)** : Chaque utilisateur ne peut accéder qu'à ses propres données
- **Authentification** : Gérée par Supabase Auth (email/password, magic link)
- **Storage** : Buckets sécurisés pour les fichiers (avatars, contrats, assets)

## 💳 Plans d'Abonnement

| Fonctionnalité | Free | Pro (19€) | Creator+ (49€) |
|----------------|------|-----------|----------------|
| Idées | 5 | ∞ | ∞ |
| Piliers | 3 | ∞ | ∞ |
| CRM Marques | ❌ | ✅ | ✅ |
| Revenus | ❌ | ✅ | ✅ |
| Email Hub | ❌ | ❌ | ✅ |
| IA Assistant | ❌ | ❌ | 🔜 |

## 🧪 Données de Test

Pour peupler votre base avec des données de démonstration :

1. Créez un compte sur l'application
2. Récupérez votre `user_id` dans Supabase Dashboard > Authentication > Users
3. Modifiez `supabase/seed.sql` en remplaçant `'YOUR_USER_ID'` par votre ID
4. Exécutez le script dans SQL Editor

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT License - voir [LICENSE](LICENSE)

---

Développé avec ❤️ pour les créateurs de contenu.
