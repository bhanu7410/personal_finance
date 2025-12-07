import Link from "next/link"; // Import our custom hook

export default function Home() {
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
                <div className="mt-4 cursor-pointer rounded bg-blue-300 px-4 py-2 font-bold text-black ease-in hover:bg-blue-400">
                    <Link href="/sign-in">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
