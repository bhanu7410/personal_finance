"use server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ActivityItem } from "./_components/types";

// This function acts as our secure bridge. It runs strictly on the server.
export async function fetchMoreTransactions(
    offset: number,
    startDate?: string,
    endDate?: string,
): Promise<ActivityItem[]> {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const currentUserId = user.id;

    let dateQuery = {};
    if (startDate && endDate) {
        dateQuery = {
            date: {
                gte: new Date(startDate), // Greater than or equal to
                lte: new Date(endDate), // Less than or equal to
            },
        };
    }

    // We use the 'skip' parameter to skip the records we already have on screen
    const [topTransactions, topPayments] = await Promise.all([
        prisma.transaction.findMany({
            where: {
                payerId: currentUserId,
                deletedAt: null,
                ...dateQuery,
            },
            orderBy: { date: "desc" },
            skip: offset, // <-- SKIP the ones we already loaded!
            take: 200, // <-- TAKE the next 200
            include: { category: true, group: true, splits: true },
        }),
        prisma.payment.findMany({
            where: {
                OR: [
                    { senderId: currentUserId },
                    { receiverId: currentUserId },
                ],
                ...dateQuery,
            },
            orderBy: { date: "desc" },
            skip: offset,
            take: 200,
            include: { receiver: true, sender: true, group: true },
        }),
    ]);

    // Map them exactly like we did in page.tsx
    const fetchedActivity: ActivityItem[] = [
        ...topTransactions.map((txn) => {
            let itemType: ActivityItem["type"] = "Personal";
            if (txn.groupId) itemType = "Group";
            else if (txn.splits.length > 1) itemType = "Split";

            return {
                id: txn.id,
                type: itemType,
                name: txn.category?.name || "Uncategorized",
                desc: txn.description,
                amount: txn.amount.toNumber(),
                currency: txn.currency,
                date: txn.date.toISOString(),
                isIncome: txn.category?.type === "INCOME",
                groupName: txn.group?.name,
                hasReceipt: !!txn.receiptUrl,
                splitCount: txn.splits.length,
            };
        }),
        ...topPayments.map((pmt) => {
            const isIncoming = pmt.receiverId === currentUserId;
            return {
                id: pmt.id,
                type: "Transfer" as const,
                name: isIncoming
                    ? `Transfer from ${pmt.sender?.name || "Unknown"}`
                    : `Transfer to ${pmt.receiver?.name || "Unknown"}`,
                desc: "Direct Transfer",
                amount: pmt.amount.toNumber(),
                currency: pmt.group?.currency || "INR",
                date: pmt.date.toISOString(),
                isIncome: isIncoming,
                groupName: pmt.group?.name,
                hasReceipt: false,
                splitCount: 0,
            };
        }),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Because we fetched 200 of both, we might have 400 total.
    // We slice it to ensure we only return exactly 200 to the frontend.
    return fetchedActivity.slice(0, 200);
}
