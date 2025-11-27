import Image from "next/image";

export default function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-background">
			<div className="flex flex-col items-center justify-center">
				<div className="font-bold text-5xl mb-4">
					Personal Finance Tracker
				</div>
				<div className="">
					Check & Update your finances Daily and Track your group
					financial status
				</div>
				<div className="px-4 py-2 bg-blue-300 rounded text-black hover:bg-blue-400 font-bold cursor-pointer ease-in">
					Sign In To let&apos;s get started
				</div>
			</div>
		</div>
	);
}
