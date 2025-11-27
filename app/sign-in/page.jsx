import { SignIn } from "@stackframe/stack";
import Link from "next/link";

export default function SignInPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900 dark:text-white">
            <div className="w-full max-w-sm space-y-2 rounded-lg p-6 text-white shadow-lg dark:bg-slate-950 dark:text-white">
                <SignIn />
            </div>
            <div>
                <Link href="/" className="mt-4 block text-center underline">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
