import Link from "next/link";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-purple-100 text-black">
            <div className="text-6xl font-bold">Personal Finance</div>
            <div className="w-xl text-center">
                Streamline your Finances with our powerful easy to use finance
                Systems
            </div>
            <div className="flex items-center justify-center gap-4">
                <div className="hover cursor-pointer rounded-xl border-2 border-purple-400 bg-purple-200 px-4 py-2 duration-200 ease-in hover:border-purple-500 hover:bg-purple-500 hover:text-white">
                    <Link href="/sign-in">Sign In</Link>
                </div>
                <div className="cursor-pointer rounded-xl border-2 border-purple-500 bg-purple-500 px-4 py-2 text-white duration-200 ease-in hover:bg-purple-200 hover:text-black">
                    Learn More
                </div>
            </div>
        </div>
    );
}
