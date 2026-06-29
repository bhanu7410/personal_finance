import Image from "next/image";

interface ProfileHeroProps {
    user: {
        name: string;
        primaryEmail: string;
        profileImageUrl?: string;
    };
}

export function ProfileHero({ user }: ProfileHeroProps) {
    return (
        <div className="relative flex items-center gap-6 rounded-3xl border-4 border-black bg-yellow-300 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {user.profileImageUrl ? (
                    <Image
                        src={user.profileImageUrl}
                        alt={user.name}
                        width={112}
                        height={112}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="text-4xl font-black text-black">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
            <div>
                <h1 className="text-4xl font-black tracking-tight text-black uppercase">
                    {user.name}
                </h1>
                <p className="mt-1 text-lg font-bold text-black/70">
                    {user.primaryEmail}
                </p>
                <div className="mt-4 inline-flex items-center rounded-full border-2 border-black bg-pink-400 px-4 py-1 text-sm font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    SUPER USER
                </div>
            </div>
        </div>
    );
}
