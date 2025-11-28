"use client";

import Link from "next/link";
import { useAppUser } from "@/components/UserProvider"; // Import our custom hook

export default function Home() {
    // We get 'dbUser' from our optimized Context.
    // No API calls happen here directly.
    const { stackUser, dbUser, loading } = useAppUser();

    // Optional: Show a loading spinner while checking auth
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <div className="text-xl">Loading your finance data...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900 dark:text-white">
            <div className="flex flex-col items-center justify-center">
                <div className="mb-4 text-center text-5xl font-bold">
                    Personal Finance Tracker
                </div>
                <div className="mb-8 max-w-lg text-center text-lg">
                    Check & Update your finances Daily and Track your group
                    financial status.
                </div>

                {/* LOGIC: IF LOGGED IN vs IF LOGGED OUT */}
                {stackUser ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-xl font-semibold text-green-600">
                            {/* We use dbUser.name if available, falling back to Stack email */}
                            Welcome back,{" "}
                            {dbUser?.name || stackUser.displayName || "User"}!
                        </div>

                        {/* If we have the DB ID, we can link to their specific dashboard */}
                        {dbUser && (
                            <div className="mb-2 text-sm text-gray-500">
                                Internal ID: {dbUser.id}
                            </div>
                        )}

                        <Link
                            href="/dashboard"
                            className="rounded bg-green-500 px-6 py-3 font-bold text-white transition hover:bg-green-600"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="mt-4 cursor-pointer rounded bg-blue-300 px-4 py-2 font-bold text-black ease-in hover:bg-blue-400">
                        <Link href="/sign-in">Sign In</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
