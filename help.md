📋 Project Context for AI Assistant
Project Type: Next.js (App Router) personal finance and expense-splitting application (similar to Splitwise).
Tech Stack: TypeScript, Tailwind CSS, Prisma ORM, TanStack Table v8, Lucide React.
Current Focus: The Transactions Page (app/transactions/page.tsx).

🏗️ Architecture & File Structure
We recently refactored a monolithic component into a "Smart Parent / Dumb Children" architecture to ensure scalability:

types.ts: Defines the ActivityItem interface (id, type, name, desc, amount, currency, date, isIncome, groupName, hasReceipt, splitCount).

ActivityLayout.tsx (Client): The Smart Parent. Manages state (selectedItem, left panel width, drag logic) and renders the split-pane layout.

ActivityList.tsx (Client): Renders a highly customized, interactive TanStack Table.

ActivityDetail.tsx (Client): Renders the right-side details panel (slides in with an animation).

ResizerHandle.tsx (Client): The draggable divider between the left table and right details panel.

🎨 Design Philosophy & UX Vision
Playful & Fun, yet Stable: We avoid boring, rigid spreadsheet looks. The table rows act as "floating cards" (border-separate) that highlight with a dashed orange border (border-orange-400) and soft orange background when selected.

Dynamic Depth: The table header has a dynamic shadow that appears only when the user scrolls down. Row cards elevate with a shadow on hover.

Split-Pane Layout: Clicking a row opens a sliding details panel on the right. The divider between the list and details is fully draggable (using percentage-based widths) so the user can resize their view.

Unified View (For Now): A single table displays all types of transactions. (Future scope: Tabs for All, Personal, Groups, Settlements).

Strict Scope: The table only shows transactions where the current user is the payer, plus direct settlement transfers.

🗺️ Development Roadmap & Phases
✅ Phase 1: Data Foundation (Completed)

Updated the Prisma query to map transactions into 4 distinct buckets: Personal, Split, Group, and Transfer.

Filtered out soft-deleted items (deletedAt: null).

Serialized dates to ISO strings to safely cross the Next.js Server/Client boundary.

Gathered extra context (currency, receipt status, split counts) for table columns.

✅ Phase 2: Visual Table (Completed)

Replaced the basic vertical list with a headless TanStack Table rendered via HTML <table>.

Implemented the "floating card" UI with transparent borders that transition smoothly on hover and selection.

✅ Phase 3: Customization & Interactivity (Completed)

Added real-time Sorting (clicking headers toggles asc/desc arrows).

Added Column Visibility (a dropdown menu to toggle columns like "Currency" on/off).

Added Column Resizing (invisible drag handles on table headers).

Table utilizes table-layout: fixed to support precise dragging.

⏳ Phase 4: Load More & Filters (Up Next)

Implement a "Load More" button at the bottom of the table to fetch the next chunk of records (appending to the UI, not URL-page based).

Implement Date/Time filtering.

🔮 Future Scope

Create a frictionless, ultra-simple entry form for adding new personal transactions or simple splits.

Implement top-level Tabs to isolate transaction types.
