import { formatCurrency } from "@/lib/utils.tsx";
import { Wallet, ArrowUpRight, ArrowDownLeft, Landmark } from "lucide-react";

interface SummaryType {
    netPosition: number;
    realized: { currentCashBalance: number };
    unrealized: { amountOwedToMe: number; amountIOwe: number };
}

export function ProfileSummaryCards({ summary }: { summary: SummaryType }) {
    const cards = [
        { title: "Net Worth", value: summary.netPosition, icon: Landmark, color: "bg-blue-300" },
        { title: "Realized Cash", value: summary.realized.currentCashBalance, icon: Wallet, color: "bg-green-300" },
        { title: "Total Lent", value: summary.unrealized.amountOwedToMe, icon: ArrowDownLeft, color: "bg-purple-300" },
        { title: "Total Borrowed", value: summary.unrealized.amountIOwe, icon: ArrowUpRight, color: "bg-red-300" },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, i) => {
                const Icon = card.icon;
                return (
                    <div key={i} className={`group relative rounded-3xl border-4 border-black ${card.color} p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]`}>
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl border-2 border-black bg-white p-2">
                                <Icon className="h-6 w-6 text-black" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-black">{card.title}</h3>
                        </div>
                        <p className="mt-6 break-all text-2xl font-black tracking-tight text-black sm:text-3xl xl:text-4xl">
                            {formatCurrency(card.value)}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
