import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center text-9xl">
            <div>YOU ARE SIGNED IN</div>
            <div>
                <Link className="hover:bg-white hover:text-black" href="/">
                    NOW GO BACK
                </Link>
            </div>
        </div>
    );
}
