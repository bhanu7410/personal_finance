import { stackServerApp } from "@/stack"; // Your Stack Auth config
import { prisma } from "@/lib/prisma";

export async function getAuthenticatedUser() {
    const stackUser = await stackServerApp.getUser();

    if (!stackUser) {
        return null;
    }
    // Explicit Check
    let dbUser = await prisma.user.findUnique({
        where: { externalId: stackUser.id },
    });
    let isNewUser = false;

    // 2. If not found, Create
    if (!dbUser) {
        isNewUser = true;
        dbUser = await prisma.user.create({
            data: {
                externalId: stackUser.id,
                email: stackUser.primaryEmail,
                // ...
            },
        });
    }

    // You can attach a flag to the object if you want the frontend to know
    return { ...dbUser, isNewUser };
}
