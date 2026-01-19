import { CategoryType, GroupRole } from "../prisma/generated/client"; // Adjust path if needed
import { prisma } from "../lib/prisma"; // Adjust path if needed

async function main() {
    console.log("🌱 Starting seed...");

    // 1. CLEANUP: Delete existing data to prevent duplicates
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
            externalId: "3f9c8652-6e78-467a-ad8c-be4a09bfb6f0",
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

    // 3. CREATE CATEGORIES
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
    await prisma.groupMember.createMany({
        data: [
            { userId: me.id, groupId: goaTrip.id, role: GroupRole.ADMIN },
            { userId: alice.id, groupId: goaTrip.id, role: GroupRole.MEMBER },
            { userId: bob.id, groupId: goaTrip.id, role: GroupRole.MEMBER },
        ],
    });

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

    // 6. CREATE TRANSACTIONS (Scenario Base)

    // Scenario A: Dinner (Me paid 3000, split 3 ways)
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

    // Scenario B: Cab (Alice paid 500, split Alice & Bob)
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

    // Scenario C: WiFi (Bob paid 1200, split Me & Bob)
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

    console.log("💸 Initial Transactions created");

    // 7. INITIAL PAYMENT (Bob pays Me back for dinner part)
    await prisma.payment.create({
        data: {
            amount: 500.0, // Partial payment
            senderId: bob.id,
            receiverId: me.id,
            groupId: goaTrip.id,
            date: new Date("2024-12-22"),
        },
    });

    // ==========================================
    // EXTENDED DATA
    // ==========================================

    console.log("🎲 Generating extended seed data...");

    // 8. ADD CHARLIE
    const charlie = await prisma.user.create({
        data: {
            name: "Charlie Puth",
            email: "charlie@example.com",
            externalId: "user_charlie_101",
        },
    });

    await prisma.groupMember.create({
        data: {
            userId: charlie.id,
            groupId: goaTrip.id,
            role: GroupRole.MEMBER,
        },
    });

    // 9. NEW CATEGORIES
    const salaryCat = await prisma.category.create({
        data: { name: "Salary", type: CategoryType.INCOME, icon: "💰" },
    });
    const entertainmentCat = await prisma.category.create({
        data: { name: "Entertainment", type: CategoryType.EXPENSE, icon: "🎬" },
    });
    const shoppingCat = await prisma.category.create({
        data: { name: "Shopping", type: CategoryType.EXPENSE, icon: "🛍️" },
    });

    // 10. PERSONAL TRANSACTIONS
    await prisma.transaction.create({
        data: {
            description: "December Salary",
            amount: 85000.0,
            date: new Date("2024-12-01"),
            payerId: me.id,
            groupId: null,
            categoryId: salaryCat.id,
            splits: { create: [{ userId: me.id, amount: 85000.0 }] },
        },
    });

    await prisma.transaction.create({
        data: {
            description: "New Headphones",
            amount: 15000.0,
            date: new Date("2024-12-05"),
            payerId: me.id,
            groupId: null,
            categoryId: shoppingCat.id,
            splits: { create: [{ userId: me.id, amount: 15000.0 }] },
        },
    });

    // 11. GENERATE RANDOM GROUP TRANSACTIONS
    const tripDescriptions = [
        "Beach Drinks",
        "Scooter Rental",
        "Breakfast",
        "Club Entry",
        "Souvenirs",
        "Late Night Pizza",
    ];
    const groupUsers = [me, alice, bob, charlie];

    const getRandomDate = () => {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        return date;
    };

    console.log("⚡ Generating 20 random transactions...");

    for (let i = 0; i < 20; i++) {
        const payer = groupUsers[Math.floor(Math.random() * groupUsers.length)];
        const amount = Math.floor(Math.random() * 4500) + 100;
        const desc =
            tripDescriptions[
                Math.floor(Math.random() * tripDescriptions.length)
            ];
        const splitAmount = amount / 4;

        await prisma.transaction.create({
            data: {
                description: `${desc} #${i + 1}`,
                amount: amount,
                date: getRandomDate(),
                payerId: payer.id,
                groupId: goaTrip.id,
                categoryId: entertainmentCat.id,
                splits: {
                    create: [
                        { userId: me.id, amount: splitAmount },
                        { userId: alice.id, amount: splitAmount },
                        { userId: bob.id, amount: splitAmount },
                        { userId: charlie.id, amount: splitAmount },
                    ],
                },
            },
        });
    }

    // 12. CREATE REALISTIC PAYMENT SCENARIOS
    console.log("💰 Creating detailed payment history...");

    // Scenario: I settle the Flat WiFi bill with Bob
    // Bob paid 1200 (my share was 600). I pay him back fully.
    await prisma.payment.create({
        data: {
            amount: 600.0,
            senderId: me.id,
            receiverId: bob.id,
            groupId: flatExpenses.id, // Important: Payment linked to specific group
            date: new Date("2024-12-05"),
        },
    });

    // Scenario: Bob settles the Cab ride with Alice
    // Alice paid 500 (Bob's share was 250). Bob pays her back.
    await prisma.payment.create({
        data: {
            amount: 250.0,
            senderId: bob.id,
            receiverId: alice.id,
            groupId: goaTrip.id,
            date: new Date("2024-12-22"),
        },
    });

    // Scenario: Alice pays Me back for the Seafood Dinner
    // I paid 3000 (Alice's share 1000). She pays me 1000.
    await prisma.payment.create({
        data: {
            amount: 1000.0,
            senderId: alice.id,
            receiverId: me.id,
            groupId: goaTrip.id,
            date: new Date("2024-12-23"),
        },
    });

    // Scenario: Charlie pays a big lump sum to Me
    // Charlie is new and racking up debt. He pays a chunk off.
    await prisma.payment.create({
        data: {
            amount: 5000.0,
            senderId: charlie.id,
            receiverId: me.id,
            groupId: goaTrip.id,
            date: new Date(), // Today
        },
    });

    // 13. GENERATE RANDOM PAYMENTS (To simulate active settling)
    console.log("🔄 Generating random partial payments...");

    // Create 10 random payments between people in the Goa Trip
    for (let i = 0; i < 10; i++) {
        // Pick random sender and receiver
        const sender =
            groupUsers[Math.floor(Math.random() * groupUsers.length)];
        let receiver =
            groupUsers[Math.floor(Math.random() * groupUsers.length)];

        // Ensure sender != receiver
        while (sender.id === receiver.id) {
            receiver =
                groupUsers[Math.floor(Math.random() * groupUsers.length)];
        }

        // Random amount between 100 and 2000
        const amount = Math.floor(Math.random() * 1900) + 100;

        await prisma.payment.create({
            data: {
                amount: amount,
                senderId: sender.id,
                receiverId: receiver.id,
                groupId: goaTrip.id,
                date: getRandomDate(),
            },
        });
    }

    console.log("✅ Extended seeding completed successfully!");
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
