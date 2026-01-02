import { CategoryType, GroupRole } from "../prisma/generated/client";

import { prisma } from "../lib/prisma";

async function main() {
    console.log("🌱 Starting seed...");

    // 1. CLEANUP: Delete existing data to prevent duplicates
    // Order matters due to foreign key constraints!
    await prisma.split.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.groupMember.deleteMany();
    await prisma.group.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log("🧹 Database cleaned.");

    // 2. CREATE USERS
    const me = await prisma.user.create({
        data: {
            name: "Bhanu Prabhath",
            email: "bhanu@example.com",
            externalId: "3f9c8652-6e78-467a-ad8c-be4a09bfb6f0", // Simulating Auth0/Clerk ID
        },
    });

    const alice = await prisma.user.create({
        data: {
            name: "Alice Sharma",
            email: "alice@example.com",
            externalId: "user_alice_456",
        },
    });

    const bob = await prisma.user.create({
        data: {
            name: "Bob Kumar",
            email: "bob@example.com",
            externalId: "user_bob_789",
        },
    });

    console.log("👤 Users created: Bhanu, Alice, Bob");

    // 3. CREATE CATEGORIES (System Defaults)
    const foodCat = await prisma.category.create({
        data: { name: "Food & Drink", type: CategoryType.EXPENSE, icon: "🍔" },
    });

    const travelCat = await prisma.category.create({
        data: { name: "Travel", type: CategoryType.EXPENSE, icon: "✈️" },
    });

    const utilitiesCat = await prisma.category.create({
        data: { name: "Utilities", type: CategoryType.EXPENSE, icon: "💡" },
    });

    // 4. CREATE GROUPS
    const goaTrip = await prisma.group.create({
        data: {
            name: "Goa Trip 2024",
            description: "Summer vacation expenses",
            ownerId: me.id,
            currency: "INR",
        },
    });

    const flatExpenses = await prisma.group.create({
        data: {
            name: "Flat 101",
            description: "Monthly house bills",
            ownerId: me.id,
            currency: "INR",
        },
    });

    // 5. ADD MEMBERS
    // Add everyone to Goa Trip
    await prisma.groupMember.createMany({
        data: [
            { userId: me.id, groupId: goaTrip.id, role: GroupRole.ADMIN },
            { userId: alice.id, groupId: goaTrip.id, role: GroupRole.MEMBER },
            { userId: bob.id, groupId: goaTrip.id, role: GroupRole.MEMBER },
        ],
    });

    // Add only Me and Bob to Flat Expenses
    await prisma.groupMember.createMany({
        data: [
            { userId: me.id, groupId: flatExpenses.id, role: GroupRole.ADMIN },
            {
                userId: bob.id,
                groupId: flatExpenses.id,
                role: GroupRole.MEMBER,
            },
        ],
    });

    console.log("👥 Groups & Memberships created");

    // 6. CREATE TRANSACTIONS (The Fun Part)

    // Scenario A: Dinner in Goa (Paid by Me, Split Equally among 3)
    // Total: 3000. Each owes 1000.
    await prisma.transaction.create({
        data: {
            description: "Seafood Dinner",
            amount: 3000.0,
            date: new Date("2024-12-20"),
            payerId: me.id,
            groupId: goaTrip.id,
            categoryId: foodCat.id,
            splits: {
                create: [
                    { userId: me.id, amount: 1000.0 },
                    { userId: alice.id, amount: 1000.0 },
                    { userId: bob.id, amount: 1000.0 },
                ],
            },
        },
    });

    // Scenario B: Cab to Airport (Paid by Alice, Split by Alice & Bob only)
    // Total: 500. Each owes 250. (I didn't go in the cab)
    await prisma.transaction.create({
        data: {
            description: "Cab to Airport",
            amount: 500.0,
            date: new Date("2024-12-21"),
            payerId: alice.id,
            groupId: goaTrip.id,
            categoryId: travelCat.id,
            splits: {
                create: [
                    { userId: alice.id, amount: 250.0 },
                    { userId: bob.id, amount: 250.0 },
                ],
            },
        },
    });

    // Scenario C: WiFi Bill for Flat (Paid by Bob, Split by Me & Bob)
    // Total: 1200. Each owes 600.
    await prisma.transaction.create({
        data: {
            description: "December WiFi",
            amount: 1200.0,
            date: new Date("2024-12-01"),
            payerId: bob.id,
            groupId: flatExpenses.id,
            categoryId: utilitiesCat.id,
            splits: {
                create: [
                    { userId: me.id, amount: 600.0 },
                    { userId: bob.id, amount: 600.0 },
                ],
            },
        },
    });

    console.log("💸 Transactions & Splits created");

    // 7. CREATE PAYMENTS (Settlements)
    // Bob pays Me 500 rupees back for the Goa dinner
    await prisma.payment.create({
        data: {
            amount: 500.0,
            senderId: bob.id,
            receiverId: me.id,
            groupId: goaTrip.id,
            date: new Date(),
        },
    });

    console.log("💰 Payment created: Bob paid Bhanu 500");

    console.log("✅ Seeding completed successfully.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
