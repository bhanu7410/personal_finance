# 💰 Personal Finance

A modern, high-performance financial management application built with **Next.js 15 (React 19)**, **Tailwind CSS 4**, and **Prisma**. Designed for individuals and groups who need surgical precision in tracking expenses, income, and shared social debts.

## 🚀 The Stack

- **Framework:** Next.js 15 (App Router, React 19)
- **Styling:** Tailwind CSS 4 (The future of utility-first CSS)
- **Database:** PostgreSQL with Prisma 7.2.0
- **Auth:** [Stack](https://stackframe.com/) (Managed, secure authentication)
- **UI Components:** TanStack Table (Data handling), Lucide React (Iconography)
- **Visualization:** Recharts & Nivo (Financial insights)

## 💎 Key Features

### 🏦 Split-Ledger Financial Model

The core engine distinguishes between different types of financial standing:

- **Realized (Cash Flow):** Your actual money in/out.
- **Unrealized (Social):** Pending debts and credits from shared group expenses.
- **Net Position:** Your true total worth (Realized + Unrealized).

### 📊 Advanced Activity Tracking

- **Unified Activity Feed:** View Personal, Group, Split, and Transfer activity in one place.
- **High-Performance Tables:** TanStack Table integration with column resizing, custom sorting, and server-side pagination.
- **Deep Filtering:** Instant filtering by month or custom date ranges.
- **Resizable Layouts:** Modern "List-Detail" interface with draggable resizers for a desktop-class experience.

### 👥 Group Expense Management

- Create groups and manage members.
- Track who paid and how expenses are split.
- Integrated settlement system (Transfers) to clear social debts.

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Installation

1. **Clone the repository:**

    ```bash
    git clone <repo-url>
    cd personal-finance
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Environment Setup:**
   Create a `.env` file and add your database and Stack authentication keys.

    ```env
    DATABASE_URL="postgresql://..."
    NEXT_PUBLIC_STACK_PROJECT_ID="..."
    STACK_SECRET_KEY="..."
    ```

4. **Database Setup:**

    ```bash
    npx prisma db push
    npx prisma generate
    ```

5. **Run Development Server:**

    ```bash
    npm run dev
    ```

## 🏗️ Architecture

- `app/(main)/`: Core application logic and routes.
- `app/(main)/transactions/`: Highly interactive transaction ledger with custom `_components`.
- `lib/accountBalance.ts`: The central logic for calculating realized vs. unrealized balances.
- `prisma/schema.prisma`: A robust schema optimized for social splitting and soft-deletes.

## 📝 Roadmap & TODO

See [TODO.md](./TODO.md) for the latest development priorities and upcoming features.

---

Built with ❤️ for better financial clarity.
