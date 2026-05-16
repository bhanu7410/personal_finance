# Project Instructions: Personal Finance

This is a personal finance management application built with Next.js, Tailwind CSS, Prisma, and Stack for authentication.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database/ORM:** PostgreSQL with Prisma
- **Authentication:** [Stack](https://stackframe.com/) (`@stackframe/stack`)
- **Charts:** Nivo and Recharts
- **Icons:** Lucide React

## Project Structure
- `app/`: Next.js App Router directory.
    - `(auth)/`: Authentication-related routes (e.g., `/sign-in`).
    - `(main)/`: Main application routes (Dashboard, Transactions, etc.).
        - `dashboard/_lib/`: Route-specific logic for the dashboard.
- `components/`: Reusable UI components.
- `lib/`: Shared utility functions and server-side logic (e.g., Prisma client, auth helpers).
- `prisma/`: Prisma schema and migrations.
- `stack/`: Stack configuration files.
- `public/`: Static assets.

## Key Conventions & Workflows
- **Authentication:** Use `getCurrentUser()` from `@/lib/auth` to get the current user in Server Components.
- **Database:** Use the Prisma client instance from `@/lib/prisma`.
- **Navigation:** The `Sidebar` component in `components/sidebar.tsx` handles main navigation.
- **Styling:** Use Tailwind CSS 4 utility classes. Prefer Vanilla CSS for complex custom styles if needed, but stay within the Tailwind ecosystem where possible.
- **Charts:** Use `@nivo` or `recharts` for data visualization.
- **Icons:** Use `lucide-react` for consistent iconography.

## Development Mandates
- **Type Safety:** Ensure all new code is strictly typed. Avoid `any`.
- **Server Components:** Prefer Server Components for data fetching. Use Client Components only when interactivity or client-side hooks (e.g., `usePathname`, `useState`) are required.
- **Error Handling:** Implement proper error boundaries and loading states (using `loading.tsx` and `error.tsx`).
- **Performance:** Utilize parallel data fetching in Server Components where appropriate (e.g., using `Promise.all`).
- **Surgical Edits:** When modifying existing logic, maintain the existing architectural patterns and naming conventions.

## Common Commands
- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npx prisma generate`: Generate the Prisma client.
- `npx prisma db push`: Sync the Prisma schema with the database (development).
- `npx prisma migrate dev`: Create and run a new migration (production/staging).
