export interface ActivityItem {
    id: string;
    // We changed "Settlement" to "Transfer" per your request
    type: "Personal" | "Split" | "Group" | "Transfer";
    name: string;
    desc: string;
    amount: number;
    date: string;
    isIncome: boolean;

    // --- NEW COLUMNS FOR THE FUTURE TABLE ---
    currency: string; // e.g., "INR", "USD"
    groupName?: string; // Which group this belongs to (if any)
    hasReceipt: boolean; // True if receiptUrl exists (we can show a 📎 icon later)
    splitCount: number; // How many people are splitting this?

    // --- ENHANCED DETAIL FIELDS ---
    categoryIcon?: string; // e.g. "🍔"
    receiptUrl?: string;
    splits?: {
        userName: string;
        amount: number;
    }[];
    payerName?: string;
}
