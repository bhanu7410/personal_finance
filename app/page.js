import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="dark:bg-background flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
            <div className="flex flex-col items-center justify-center">
                <div className="mb-4 text-5xl font-bold">
                    Personal Finance Tracker
                </div>
                <div className="">
                    Check & Update your finances Daily and Track your group
                    financial status
                </div>
                <div className="mt-4 cursor-pointer rounded bg-blue-300 px-4 py-2 font-bold text-black ease-in hover:bg-blue-400">
                    <Link href="/signin">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
