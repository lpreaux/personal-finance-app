# Personal Finance App

## Project Overview

Full-stack personal finance management application built for Frontend Mentor challenge. Allows users to track transactions, manage budgets, create savings pots, and monitor recurring bills.

**Status**: Work in Progress - Core navigation and authentication complete, feature implementation in progress

## Tech Stack

- **Framework**: Next.js 15.2.3 (App Router) + React 19
- **Language**: TypeScript 5.8.2 (strict mode)
- **Styling**: Tailwind CSS v4 (using new @theme directive)
- **Backend**: Convex 1.27.4 (serverless real-time database)
- **Auth**: Clerk (@clerk/nextjs 6.33.3)
- **Validation**: Zod + @t3-oss/env-nextjs
- **Package Manager**: pnpm 10.15.1
- **Dev Server**: Turbopack (`next dev --turbo`)

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root: ClerkProvider, fonts, global styles
│   ├── page.tsx                 # Landing page
│   ├── sign-in/[[...sign-in]]/  # Clerk auth
│   ├── dashboard/               # Protected dashboard
│   │   ├── layout.tsx           # SidebarProvider + DashboardSidebar
│   │   ├── page.tsx             # Overview (empty placeholder)
│   │   ├── transactions/        # Transaction management (empty)
│   │   ├── budgets/             # Budget management (empty)
│   │   ├── pots/                # Savings pots (empty)
│   │   └── recurring-bills/     # Bills tracking (empty)
│   └── convex-client-provider.tsx
├── components/
│   ├── ui/
│   │   └── sidebar.tsx          # 372 lines - fully responsive sidebar
│   ├── icons/                   # Custom SVG components
│   │   ├── home, transactions, budgets, pots, recurring-bills, minimize-menu
│   │   └── index.ts
│   └── dashboard-sidebar.tsx    # Navigation menu configuration
├── hooks/
│   └── is-mobile.ts             # Mobile detection
├── lib/
│   └── utils.ts                 # cn() helper + utilities
├── styles/
│   └── globals.css              # Tailwind v4 imports + theme
├── middleware.ts                # Clerk route protection
└── env.js                       # Environment validation

convex/
├── _generated/                  # Auto-generated types
├── auth.config.ts               # Clerk JWT integration
└── tsconfig.json

public/
├── fonts/PublicSans-VariableFont_wght.ttf
└── images/                      # Avatars, icons, logos
```

## Key Implementation Details

### Sidebar Component (`src/components/ui/sidebar.tsx`)

**Most complex component** - 372 lines with:
- Responsive design: completely different layouts for mobile vs desktop
- State persistence: cookie-based (`sidebar_state`)
- Keyboard shortcut: Cmd/Ctrl + B to toggle
- Auto-active route detection via `usePathname()`
- Mobile: bottom navigation bar (52px height)
- Desktop: collapsible side panel (300px → 88px)

**CSS Variables**:
```css
--sidebar-width: 18.75rem          /* 300px expanded */
--sidebar-width-icon: 5.5rem       /* 88px collapsed */
--sidebar-height-mobile: 3.25rem   /* 52px */
```

**Usage Pattern**:
```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarMenu>
      <SidebarMenuItem asChild icon={<Icon />}>
        <Link href="/path">Label</Link>
      </SidebarMenuItem>
    </SidebarMenu>
  </Sidebar>
  <SidebarInset>{children}</SidebarInset>
</SidebarProvider>
```

### Styling System

**Tailwind v4** with new features:
- Import via `@import "tailwindcss"` in globals.css
- Theme config in `@theme { }` block
- Custom font: Public Sans variable font
- Path alias: `~/*` → `./src/*`

**Color Scheme**:
- Primary: `teal-800` (#277C78)
- Sidebar: `gray-900`
- Background: `orange-100`
- Active state: `orange-100` bg + `teal-800` border/text

### Authentication

**Clerk + Convex Integration**:
- Middleware protects all routes except static files/API
- JWT issuer: `CLERK_JWT_ISSUER_DOMAIN` env var
- Convex auth config: `convex/auth.config.ts`
- Sign-in: `/sign-in/[[...sign-in]]`

### Data Model (from data.json)

```typescript
// Balance overview
balance: {
  current: number
  income: number
  expenses: number
}

// Transactions
transactions: Array<{
  avatar: string              // Path to avatar image
  name: string                // Person/business name
  category: string            // Category name
  date: string                // ISO 8601 format
  amount: number              // Positive = income, negative = expense
  recurring: boolean          // Is this recurring?
}>

// Budget categories
budgets: Array<{
  category: string            // Must match transaction categories
  maximum: number             // Budget limit
  theme: string               // Hex color for visualization
}>

// Savings pots
pots: Array<{
  name: string                // Pot name
  target: number              // Target amount
  total: number               // Current saved amount
  theme: string               // Hex color
}>
```

**Categories in use**: General, Dining Out, Groceries, Entertainment, Bills, Transportation, Lifestyle, Personal Care, Education, Shopping

## Environment Variables

```bash
# Required
NEXT_PUBLIC_CONVEX_URL=<your-convex-deployment-url>
CLERK_JWT_ISSUER_DOMAIN=<your-clerk-jwt-issuer>
NODE_ENV=development|test|production

# Optional
SKIP_ENV_VALIDATION=1  # Skip validation (e.g., Docker builds)
```

## Development Commands

```bash
pnpm dev           # Start with Turbopack
pnpm build         # Production build
pnpm start         # Run production build
pnpm preview       # Build + start
pnpm lint          # ESLint
pnpm lint:fix      # Auto-fix linting
pnpm typecheck     # TypeScript check
pnpm check         # Lint + typecheck
pnpm format:check  # Prettier check
pnpm format:write  # Format with Prettier
```

## Current Status & TODOs

### ✅ Completed
- Project scaffolding with T3 stack
- Authentication with Clerk
- Responsive sidebar navigation (mobile + desktop)
- Dashboard routing structure
- Icon components
- TypeScript strict mode configuration
- Environment validation

### 🚧 In Progress / TODO
- [ ] **Convex Schema**: Define tables for transactions, budgets, pots, bills
- [ ] **Data Migration**: Move data.json content to Convex
- [ ] **Overview Dashboard**:
  - [ ] Balance cards (current, income, expenses)
  - [ ] Recent transactions widget
  - [ ] Budget summary
  - [ ] Pots summary
- [ ] **Transactions Page**:
  - [ ] List view with pagination (10 per page)
  - [ ] Search by name/category
  - [ ] Sort by date/amount/category
  - [ ] Filter by category/date range
  - [ ] Add/edit/delete modals
- [ ] **Budgets Page**:
  - [ ] CRUD operations
  - [ ] Progress bars with spent/remaining
  - [ ] Latest 3 transactions per budget
  - [ ] Category color theming
- [ ] **Pots Page**:
  - [ ] CRUD operations
  - [ ] Add/withdraw money modals
  - [ ] Progress visualization
  - [ ] Target tracking
- [ ] **Recurring Bills**:
  - [ ] Monthly status view
  - [ ] Search & sort
  - [ ] Payment status indicators
- [ ] **Forms**:
  - [ ] Create reusable form components
  - [ ] Validation with Zod
  - [ ] Error handling
- [ ] **Accessibility**:
  - [ ] Full keyboard navigation
  - [ ] Screen reader support
  - [ ] Focus management
- [ ] **UI Polish**:
  - [ ] Update metadata (title/description)
  - [ ] Loading states
  - [ ] Error boundaries
  - [ ] Toast notifications

## Coding Guidelines

### General Patterns
- **Server Components by default**: Only use `"use client"` when necessary (state, hooks, events)
- **Path imports**: Always use `~/` alias for src imports
- **TypeScript**: Leverage strict mode, avoid `any`, use proper types
- **File naming**: kebab-case for files, PascalCase for components

### Component Structure
- Co-locate related components
- Extract reusable UI to `components/ui/`
- Keep page components minimal - delegate to feature components
- Use composition over prop drilling

### Styling
- Use Tailwind utility classes
- Use `cn()` helper from `~/lib/utils` for conditional classes
- Follow established color scheme (teal-800, orange-100, gray-900)
- Maintain responsive design patterns (mobile-first)

### Data Fetching
- Use Convex hooks: `useQuery`, `useMutation`, `useAction`
- Handle loading and error states
- Implement optimistic updates where appropriate

### Forms
- Use controlled components
- Validate with Zod schemas
- Provide clear error messages
- Disable submit during processing

### Icons
- Use existing icon components from `~/components/icons/`
- Add new icons following the same pattern (TSX components)
- Export from `index.ts` for clean imports

## Important Notes

1. **Sidebar is feature-complete** - avoid major refactoring unless fixing bugs
2. **Convex schemas needed** - define before implementing CRUD operations
3. **Mock data available** - data.json has realistic sample data for development
4. **Figma design** - 45MB design file in root (`personal-finance-app.fig`)
5. **Responsive first** - test mobile layout for every feature
6. **Type safety** - all env vars validated, no unchecked index access

## Git Info

- **Branch**: main
- **Recent**: Responsive sidebar implementation complete

## Resources

- [Frontend Mentor Challenge](https://www.frontendmentor.io/challenges/personal-finance-app-JfjtZgyMt1)
- Design file: `personal-finance-app.fig`
- Mock data: `data.json`
