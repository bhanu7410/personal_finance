import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth"; // Import our new helper

// GET: Fetch my transactions
export async function GET(request) {
    const user = await getAuthenticatedUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Now we can use 'user.id' (the Int) directly
    const transactions = await prisma.transaction.findMany({
        where: {
            payerId: user.id,
        },
        include: {
            splits: true,
        },
        orderBy: {
            date: "desc",
        },
    });

    return NextResponse.json(transactions);
}

// POST: Add a new transaction
export async function POST(request) {
    const user = await getAuthenticatedUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { amount, description, category } = body;

        // Create transaction linked to the user
        const newTransaction = await prisma.transaction.create({
            data: {
                amount: amount,
                description: description,
                category: category,
                payerId: user.id, // <--- SAFE: Uses the ID from the server session

                // Example: Add a simple split record for the payer
                splits: {
                    create: {
                        amount: amount,
                        userId: user.id,
                    },
                },
            },
        });

        return NextResponse.json(newTransaction);
    } catch (error) {
        console.error("Transaction Error", error);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}
