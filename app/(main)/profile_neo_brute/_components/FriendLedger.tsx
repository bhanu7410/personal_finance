import { formatCurrency } from "@/lib/utils.tsx";

interface FriendBalance {
    id: string;
    name: string;
    netBalance: number;
}

export function FriendLedger({ balances }: { balances: FriendBalance[] }) {
    if (balances.length === 0) {
        return (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-3xl border-4 border-black bg-gray-100 p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xl font-black text-black">All Settled Up!</p>
                <p className="font-bold text-gray-500">No one owes you, and you owe no one.</p>
            </div>
        );
    }

    return (
        <div className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="mb-6 text-2xl font-black uppercase tracking-tight text-black">Friend Ledger</h3>
            <div className="flex flex-col gap-4">
                {balances.map(friend => {
                    const isOwed = friend.netBalance > 0;
                    return (
                        <div key={friend.id} className="flex items-center justify-between rounded-2xl border-2 border-black bg-gray-50 p-4 transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <span className="text-lg font-bold text-black">{friend.name}</span>
                            <div className={`rounded-full border-2 border-black px-4 py-1 text-sm font-black ${isOwed ? 'bg-green-300' : 'bg-red-300'}`}>
                                {isOwed ? 'Owes you' : 'You owe'} {formatCurrency(Math.abs(friend.netBalance))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
