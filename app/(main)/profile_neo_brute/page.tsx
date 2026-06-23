import { stackServerApp } from "@/stack/server";
import { getProfileData } from "./_lib/getProfileData";
import { ProfileClient } from "./_components/ProfileClient";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const user = await stackServerApp.getUser();
    if (!user) return redirect("/sign-in");

    // Fetch initial "All Time" data
    const initialData = await getProfileData(null);

    const clientUser = {
        name: user.displayName || "Unknown User",
        primaryEmail: user.primaryEmail || "",
        profileImageUrl: user.profileImageUrl || undefined,
    };

    return (
        <main className="flex h-full flex-1 flex-col overflow-y-auto bg-gray-50/50 p-6">
            <div className="mx-auto w-full max-w-5xl">
                <ProfileClient initialData={initialData} user={clientUser} />
            </div>
        </main>
    );
}
