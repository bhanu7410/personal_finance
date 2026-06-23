import { formatCurrency } from "@/lib/utils.tsx";
import { Flame } from "lucide-react";

interface InsightsProps {
    insights: {
        highestCategory: { name: string; value: number } | null;
    }
}

export function QuickInsights({ insights }: InsightsProps) {
    if (!insights.highestCategory) return null;

    return (
        <div className="flex items-center gap-4 rounded-3xl border-4 border-black bg-orange-300 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="rounded-full border-4 border-black bg-white p-3">
                <Flame className="h-8 w-8 text-orange-500" />
            </div>
            <div>
                <h3 className="text-sm font-black uppercase text-black/70">Top Spending Category</h3>
                <p className="text-xl font-bold text-black">
                    You spent the most on <span className="font-black underline decoration-wavy">{insights.highestCategory.name}</span> ({formatCurrency(insights.highestCategory.value)})!
                </p>
            </div>
        </div>
    );
}
