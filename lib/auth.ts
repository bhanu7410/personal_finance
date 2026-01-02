import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

export async function getCurrentUser() {
    const user = await stackServerApp.getUser();

    if (!user) {
        redirect("/sign-in");
    }
    const currentUserFromDb = await prisma.user.findFirst({
        where: {
            externalId: user?.id,
        },
    });
    return currentUserFromDb;
}
