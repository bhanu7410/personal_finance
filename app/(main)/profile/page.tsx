import { stackServerApp } from "@/stack/server";
import { getProfileData } from "./_lib/getProfileData";
import { redirect } from "next/navigation";

import { ProfileBar } from "./_components/ProfileBar";
import { SimplifiedGroups } from "./_components/SimplifiedGroups";
import { FriendBalances } from "./_components/FriendBalances";

export default async function ProfilePage() {
    const user = await stackServerApp.getUser();
    if (!user) return redirect("/sign-in");

    const initialData = await getProfileData(null);

    const clientUser = {
        name: user.displayName || "Unknown User",
        primaryEmail: user.primaryEmail || "",
        profileImageUrl: user.profileImageUrl || undefined,
    };

    return (
        <main className="gap-8overflow-y-auto flex h-full flex-1 flex-col bg-neutral-100 px-4 py-8">
            <ProfileBar initialData={initialData} user={clientUser} />
            <SimplifiedGroups initialData={initialData} />
            <FriendBalances initialData={initialData} />
        </main>
    );
}
