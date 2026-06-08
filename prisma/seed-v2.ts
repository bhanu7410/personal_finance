import { CategoryType, GroupRole } from "../prisma/generated/client";
import { prisma } from "../lib/prisma";

async function main() {
    console.log("🌱 Starting High-Variance Seed (v2)...");

    // 1. CLEANUP
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

    const othersData = [
        { name: "Alice Sharma", email: "alice@example.com", externalId: "user_alice_456" },
        { name: "Bob Kumar", email: "bob@example.com", externalId: "user_bob_789" },
        { name: "Charlie Puth", email: "charlie@example.com", externalId: "user_charlie_101" },
        { name: "Dave Wilson", email: "dave@example.com", externalId: "user_dave_202" },
        { name: "Eve Adams", email: "eve@example.com", externalId: "user_eve_303" },
    ];

    const users = [me];
    for (const data of othersData) {
        users.push(await prisma.user.create({ data }));
    }
    const [_, alice, bob, charlie, dave, eve] = users;
    console.log(`👤 ${users.length} users created.`);

    // 3. CREATE CATEGORIES
    const categoriesData = [
        { name: "Food & Drink", type: CategoryType.EXPENSE, icon: "🍔" },
        { name: "Travel", type: CategoryType.EXPENSE, icon: "✈️" },
        { name: "Groceries", type: CategoryType.EXPENSE, icon: "🛒" },
        { name: "Rent & Bills", type: CategoryType.EXPENSE, icon: "🏠" },
        { name: "Shopping", type: CategoryType.EXPENSE, icon: "🛍️" },
        { name: "Health", type: CategoryType.EXPENSE, icon: "🏥" },
        { name: "Entertainment", type: CategoryType.EXPENSE, icon: "🎬" },
        { name: "Transport", type: CategoryType.EXPENSE, icon: "🚗" },
        { name: "Salary", type: CategoryType.INCOME, icon: "💰" },
        { name: "Investments", type: CategoryType.INCOME, icon: "📈" },
        { name: "Gifts", type: CategoryType.INCOME, icon: "🎁" },
    ];

    const categories = [];
    for (const data of categoriesData) {
        categories.push(await prisma.category.create({ data }));
    }
    console.log(`📂 ${categories.length} categories created.`);

    // 4. CREATE GROUPS
    const groupsData = [
        { name: "Goa Trip 2024", desc: "Summer vacation", members: [me, alice, bob, charlie] },
        { name: "Flat 101", desc: "Monthly house bills", members: [me, bob, dave] },
        { name: "Work Crew", desc: "Office lunches and coffee", members: [me, alice, eve] },
        { name: "Weekend Hangout", desc: "Friday nights", members: [me, alice, bob, charlie, dave, eve] },
    ];

    const groups = [];
    for (const g of groupsData) {
        const group = await prisma.group.create({
            data: {
                name: g.name,
                description: g.desc,
                ownerId: me.id,
                currency: "INR",
            },
        });
        groups.push(group);

        await prisma.groupMember.createMany({
            data: g.members.map(u => ({
                userId: u.id,
                groupId: group.id,
                role: u.id === me.id ? GroupRole.ADMIN : GroupRole.MEMBER
            }))
        });
    }
    console.log(`👥 ${groups.length} groups created.`);

    // 5. HELPER FUNCTIONS FOR VARIANCE
    const getRandomAmount = () => {
        const rand = Math.random();
        if (rand < 0.7) return Math.floor(Math.random() * 900) + 100; // Small: 100-1000
        if (rand < 0.95) return Math.floor(Math.random() * 9000) + 1000; // Medium: 1000-10000
        return Math.floor(Math.random() * 90000) + 10000; // Large: 10000-100000
    };

    const getRandomDate = (monthsBack: number) => {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * (monthsBack * 30)));
        return date;
    };

    const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

    // 6. GENERATE 1000 TRANSACTIONS
    console.log("⚡ Generating 1000 transactions...");
    const transactionDescriptions = [
        "Starbucks Coffee", "Uber Ride", "Netflix Subscription", "Amazon Purchase",
        "Weekly Groceries", "Dinner at Social", "Movie Tickets", "Gym Membership",
        "Zomato Order", "Electricity Bill", "Broadband", "Flight Ticket",
        "Hotel Stay", "Beer Night", "New Shoes", "Phone Bill", "Birthday Gift"
    ];

    const incomeDescriptions = ["Monthly Salary", "Freelance Project", "Dividend Payout", "Cashback"];

    for (let i = 0; i < 1000; i++) {
        const isIncome = Math.random() < 0.05; // 5% income
        const isGroup = !isIncome && Math.random() < 0.7; // 70% of expenses are group-related
        
        const category = isIncome 
            ? getRandomElement(categories.filter(c => c.type === CategoryType.INCOME))
            : getRandomElement(categories.filter(c => c.type === CategoryType.EXPENSE));
        
        const group = isGroup ? getRandomElement(groups) : null;
        const payer = isGroup 
            ? getRandomElement(groupsData.find(gd => gd.name === group?.name)?.members || [me])
            : me; // Personal txns are usually by "Me" for this seed

        const amount = isIncome ? (Math.floor(Math.random() * 50000) + 50000) : getRandomAmount();
        const desc = isIncome ? getRandomElement(incomeDescriptions) : getRandomElement(transactionDescriptions);
        const date = getRandomDate(12); // Spread over 1 year

        // Handle splits
        let splitsData = [];
        if (isGroup && group) {
            const groupMembers = groupsData.find(gd => gd.name === group.name)?.members || [me];
            const splitAmount = amount / groupMembers.length;
            splitsData = groupMembers.map(u => ({
                userId: u.id,
                amount: splitAmount
            }));
        } else {
            splitsData = [{ userId: me.id, amount }];
        }

        await prisma.transaction.create({
            data: {
                description: `${desc} #${i + 1}`,
                amount,
                date,
                payerId: payer.id,
                groupId: group?.id || null,
                categoryId: category.id,
                splits: { create: splitsData }
            }
        });

        // Occasional Payment (Settlement)
        if (isGroup && i % 5 === 0) {
            const groupMembers = groupsData.find(gd => gd.name === group?.name)?.members || [me];
            if (groupMembers.length > 1) {
                const sender = getRandomElement(groupMembers);
                let receiver = getRandomElement(groupMembers);
                while (sender.id === receiver.id) receiver = getRandomElement(groupMembers);

                await prisma.payment.create({
                    data: {
                        amount: Math.floor(getRandomAmount() / 2),
                        senderId: sender.id,
                        receiverId: receiver.id,
                        groupId: group!.id,
                        date: new Date(date.getTime() + 86400000) // Day after transaction
                    }
                });
            }
        }
    }

    console.log("✅ 1000+ records generated successfully with high variance!");
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
