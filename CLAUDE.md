# Personal Finance App

## Project Overview

Full-stack personal finance management application built for Frontend Mentor challenge. Allows users to track transactions, manage budgets, create savings pots, and monitor recurring bills.

**Status**: Work in Progress - Core navigation, authentication, and Overview page UI complete. Backend integration pending.

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
│   │   ├── page.tsx             # Overview with widgets (using mock data)
│   │   ├── transactions/        # Transaction management (placeholder)
│   │   ├── budgets/             # Budget management (placeholder)
│   │   ├── pots/                # Savings pots (placeholder)
│   │   └── recurring-bills/     # Bills tracking (placeholder)
│   └── convex-client-provider.tsx
├── components/
│   ├── ui/
│   │   ├── sidebar/             # Modular sidebar system (10 files, ~441 lines)
│   │   │   ├── sidebar.tsx
│   │   │   ├── sidebar-provider.tsx
│   │   │   ├── sidebar-context.tsx
│   │   │   ├── sidebar-menu.tsx
│   │   │   ├── sidebar-menu-item.tsx
│   │   │   ├── sidebar-menu-item-icon.tsx
│   │   │   ├── sidebar-menu-item-label.tsx
│   │   │   ├── sidebar-inset.tsx
│   │   │   ├── use-is-active-route.ts
│   │   │   └── index.ts
│   │   ├── sidebar.tsx          # Barrel export (16 lines)
│   │   └── card.tsx             # Reusable card component
│   ├── dashboard/               # Dashboard feature components
│   │   ├── balance-summary.tsx  # Balance overview section
│   │   ├── balance-card.tsx     # Individual balance card
│   │   ├── pots-widget.tsx      # Pots summary widget (with mock data)
│   │   ├── pot-item.tsx         # Individual pot display
│   │   ├── transactions-widget.tsx   # Transactions widget (shell)
│   │   ├── budget-widget.tsx    # Budget widget (shell)
│   │   ├── recurring-bills-widget.tsx # Bills widget (shell)
│   │   ├── section-header.tsx   # Reusable section header with link
│   │   └── index.ts             # Barrel export
│   ├── icons/                   # Custom SVG components (6 icons)
│   │   ├── home.tsx
│   │   ├── transactions.tsx
│   │   ├── budgets.tsx
│   │   ├── pots.tsx             # PotsIcon + PotsOutlineIcon
│   │   ├── recurring-bills.tsx
│   │   ├── minimize-menu.tsx
│   │   └── index.ts
│   └── dashboard-sidebar.tsx    # Navigation menu configuration
├── hooks/
│   ├── is-mobile.ts             # Mobile detection (legacy)
│   └── use-breakpoint.ts        # Modern breakpoint hooks
├── lib/
│   ├── utils.ts                 # cn() helper + utilities
│   └── breakpoints.ts           # Centralized breakpoint config
├── styles/
│   └── globals.css              # Tailwind v4 + typography presets
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

### Sidebar Component (`src/components/ui/sidebar/`)

**Modular sidebar system** - 10 files, ~441 total lines:
- **Responsive design**: Completely different layouts for mobile vs desktop
- **State persistence**: Cookie-based (`sidebar_state`)
- **Keyboard shortcut**: Cmd/Ctrl + B to toggle
- **Auto-active route detection**: Via `use-is-active-route.ts` hook
- **Mobile**: Bottom navigation bar (52px height)
- **Desktop**: Collapsible side panel (300px → 88px)
- **Accessibility**: Full ARIA labels, keyboard navigation, screen reader support

**Files**:
- `sidebar-provider.tsx` - Context and state management
- `sidebar-context.tsx` - Shared context definition
- `sidebar.tsx` - Main container component
- `sidebar-menu.tsx` - Menu wrapper
- `sidebar-menu-item.tsx` - Individual menu items with active state
- `sidebar-menu-item-icon.tsx` - Icon wrapper
- `sidebar-menu-item-label.tsx` - Label with responsive visibility
- `sidebar-inset.tsx` - Content area wrapper
- `use-is-active-route.ts` - Route matching logic
- `index.ts` - Barrel export

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

### Breakpoint System (`src/lib/breakpoints.ts`)

**Centralized responsive design**:
- Synced between Tailwind CSS and React hooks
- Breakpoints: `mobile` (0-767px), `tablet` (768-1439px), `desktop` (1440-1919px), `lg` (1920px+)
- Custom Tailwind screens: `tablet`, `desktop`, `lg`
- Hooks: `useBreakpoint()` returns current breakpoint, `useMediaQuery()` for specific queries
- Media query helpers: `aboveTablet`, `aboveDesktop`, `belowDesktop`

### Typography System (`src/styles/globals.css`)

**Design system presets**:
- `text-preset-1`: 32px/120%/700 (Headings)
- `text-preset-2`: 20px/120%/700 (Subheadings)
- `text-preset-3`: 16px/150%/700 (Bold body)
- `text-preset-4`: 14px/150%/400 (Body, also has `-bold` variant)
- `text-preset-5`: 12px/150%/400 (Small text, also has `-bold` variant)

### Dashboard Components (`src/components/dashboard/`)

**Overview page widgets** (using mock data):
- `balance-summary.tsx` - Displays current balance, income, and expenses
- `balance-card.tsx` - Individual balance card with dark/light variants
- `pots-widget.tsx` - Savings pots summary with total and individual pots
- `pot-item.tsx` - Individual pot display with color theming
- `transactions-widget.tsx` - Shell for recent transactions (needs backend)
- `budget-widget.tsx` - Shell for budget summary (needs backend)
- `recurring-bills-widget.tsx` - Shell for bills overview (needs backend)
- `section-header.tsx` - Reusable header with "See details" link

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
  - Modular 10-file architecture
  - Cookie-based state persistence
  - Keyboard shortcuts (Cmd/Ctrl + B)
  - Full accessibility support
- Dashboard routing structure
- Icon components (6 custom SVG icons)
- TypeScript strict mode configuration
- Environment validation
- Centralized breakpoint system
  - Synced between Tailwind and React hooks
  - Custom breakpoints: mobile, tablet, desktop, lg
  - Utility hooks: `useBreakpoint()`, `useMediaQuery()`
- Typography design system
  - 5 presets with variants
  - Consistent sizing and spacing
- Reusable UI components
  - Card component with `asChild` pattern
  - Section header with navigation links
- **Overview Dashboard (UI Complete)**:
  - ✅ Balance summary cards (current, income, expenses)
  - ✅ Pots widget with mock data
  - ✅ Transactions widget (shell)
  - ✅ Budget widget (shell)
  - ✅ Recurring bills widget (shell)
  - ✅ Fully responsive grid layout

### 🚧 In Progress / TODO

#### **Backend & Data** (Priority 1)
- [ ] **Convex Schema**: Define tables for transactions, budgets, pots, bills
- [ ] **Data Migration**: Move data.json content to Convex
- [ ] **API Queries**: Create Convex queries for all data types
- [ ] **API Mutations**: Create CRUD operations

#### **Overview Dashboard** (Priority 2)
- [ ] Connect balance cards to real Convex data
- [ ] Implement transactions widget content (show latest 5)
- [ ] Implement budget widget content (show chart/summary)
- [ ] Implement recurring bills widget (show totals)

#### **Transactions Page** (Priority 3)
- [ ] List view with pagination (10 per page)
- [ ] Search by name/category
- [ ] Sort by date/amount/category
- [ ] Filter by category/date range
- [ ] Add/edit/delete modals
- [ ] Transaction form with validation

#### **Budgets Page** (Priority 4)
- [ ] Budget list/grid view
- [ ] CRUD operations
- [ ] Progress bars with spent/remaining
- [ ] Latest 3 transactions per budget
- [ ] Category color theming
- [ ] Budget chart visualization

#### **Pots Page** (Priority 5)
- [ ] Pots list/grid view
- [ ] CRUD operations
- [ ] Add/withdraw money modals
- [ ] Progress visualization
- [ ] Target tracking
- [ ] Color theming

#### **Recurring Bills** (Priority 6)
- [ ] Bills list view
- [ ] Monthly status view
- [ ] Search & sort functionality
- [ ] Payment status indicators
- [ ] CRUD operations

#### **Forms & Validation** (Ongoing)
- [ ] Create reusable form components
- [ ] Zod validation schemas for all entities
- [ ] Error handling and display
- [ ] Success feedback

#### **UI Polish** (Final)
- [ ] Update metadata (title/description per page)
- [ ] Loading states for all data fetching
- [ ] Error boundaries
- [ ] Toast notifications
- [ ] Empty states
- [ ] Skeleton loaders

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

1. **Sidebar is feature-complete** - modular architecture, avoid major refactoring unless fixing bugs
2. **Overview dashboard UI complete** - all widgets have shells, some use mock data
3. **Backend integration needed** - Convex schemas must be defined before implementing CRUD
4. **Mock data available** - data.json has realistic sample data for development
5. **Figma design** - 45MB design file in root (`personal-finance-app.fig`)
6. **Responsive first** - test mobile/tablet/desktop layouts for every feature
7. **Type safety** - all env vars validated, no unchecked index access
8. **Accessibility built-in** - sidebar has full ARIA support, continue pattern for all components
9. **Breakpoint system** - use centralized `breakpoints.ts` and hooks for consistency
10. **Typography presets** - use `text-preset-*` classes for all text styling

## Git Info

- **Branch**: main
- **Recent commits**:
  - `7d4f6fd` - fix: typecheck and prettier
  - `6d5e350` - feat: improve breakpoint management and add responsiveness to overview page
  - `cfd3da3` - feat: add content to overview page
  - `4998b38` - switch from next lint to eslint
  - `4d4be49` - feat: Add responsive sidebar

## Resources

- [Frontend Mentor Challenge](https://www.frontendmentor.io/challenges/personal-finance-app-JfjtZgyMt1)
- Design file: `personal-finance-app.fig`
- Mock data: `data.json`
