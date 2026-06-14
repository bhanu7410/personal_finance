# Project Instructions: Personal Finance

This is a personal finance management application built with Next.js 16 (React 19), Tailwind CSS 4, Prisma, and Stack for authentication. It features a split-ledger system for tracking group expenses and settlements.

## Tech Stack

- **Framework:** Next.js (App Router, React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database/ORM:** PostgreSQL with Prisma 7.2.0 (Client)
- **Authentication:** [Stack](https://stackframe.com/) (`@stackframe/stack`)
- **Data Table:** TanStack Table (`@tanstack/react-table`)
- **Charts:** Nivo and Recharts
- **Icons:** Lucide React

## Project Structure

- `app/`: Next.js App Router directory.
    - `(auth)/`: Authentication-related routes (e.g., `/sign-in`).
    - `(main)/`: Main application routes.
        - `dashboard/`: Financial summary and charts.
            - `_lib/`: Dashboard-specific data fetching logic (e.g., `getCategoryStats.ts`).
        - `transactions/`: Transaction and settlement history.
            - `_components/`: Activity list, detail views, and resizable layout components.
        - `groups/`: Group management and split tracking.
- `components/`: Reusable UI components (Sidebar, Charts, Skeletons).
- `lib/`: Shared utility functions and server-side logic.
    - `auth.ts`: Authentication helpers.
    - `prisma.ts`: Prisma client instance.
    - `accountBalance.ts`: Core financial logic for realized/unrealized balances.
- `prisma/`: Prisma schema and migrations. Uses a split-ledger model (Transaction, Split, Payment).
- `stack/`: Stack configuration files.

## Key Conventions & Architectural Patterns

### 1. Authentication

- Use `getCurrentUser()` from `@/lib/auth` in Server Components to identify the authenticated user.
- Routes are protected via the `(main)` layout or individual page checks.

### 2. Database & Data Fetching

- **Client:** Use the Prisma client from `@/lib/prisma`.
- **Parallelism:** Utilize `Promise.all` for concurrent data fetching in Server Components to minimize waterfall delays.
- **Soft Deletes:** Always filter for `deletedAt: null` when querying `Transaction` records.
- **Decimal Handling:** Prisma returns `Decimal` objects for amount fields. Convert them using `.toNumber()` for client-side consumption or arithmetic.

### 3. Split-Ledger Financial Model

The app tracks finances across three main views (see `lib/accountBalance.ts`):

- **Realized (Cash Flow):** (Income + Settlements In) - (Full Bills Paid + Settlements Out).
- **Unrealized (Social/Split):** Pending debts from shared transactions (Lent - Borrowed).
- **Net Position:** Total standing (Realized + Unrealized).

### 4. Transactions & Activity

- The system treats both `Transaction` and `Payment` (settlements) as "Activity".
- Data from multiple models is unified into an `ActivityItem` type for display in the transaction history.
- **Pagination & Filtering:** Implements server-side pagination (offset-based) with a "Load More" pattern and date-range filtering.

### 5. UI & Styling

- **Tailwind CSS 4:** Use utility classes for styling. Note that Tailwind 4 has different configuration patterns than v3.
- **Client vs. Server:** Prefer Server Components for data-heavy pages. Use Client Components for interactive elements like the `ActivityLayout` or charts.
- **TanStack Table:** Used for complex list views with features like column resizing, sorting, and custom cell rendering.
- **Interactive Layouts:** Resizable panels (e.g., in the transactions view) allow side-by-side list and detail views.

## Development Mandates

- **Type Safety:** Strict typing is mandatory. Use the generated Prisma types where possible.
- **Surgical Edits:** Maintain existing naming conventions (e.g., `_lib` for route-specific logic).
- **Performance:** Ensure data fetching is optimized and avoid redundant database calls.
- **Error Handling:** Use `loading.tsx` for transitions and implement proper error states.

## Common Commands

- `npm run dev`: Start the development server.
- `npm run build`: Build the application.
- `npx prisma generate`: Update the Prisma client after schema changes.
- `npx prisma db push`: Sync schema changes to the local/dev database.
- `npx prisma migrate dev`: Create a new migration for production-tracked changes.
