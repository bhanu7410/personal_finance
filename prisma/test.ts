import { prisma } from "../lib/prisma";

async function main() {
    console.log("🔌 Attempting to connect to the database...");

    try {
        // 1. Try to verify connection
        await prisma.$connect();
        console.log("✅ Connection Successful!");

        // 2. Try a simple read query
        const userCount = await prisma.user.count();
        console.log(
            `📊 Database is reachable. Current User count: ${userCount}`,
        );
    } catch (error) {
        console.error("❌ Connection Failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
