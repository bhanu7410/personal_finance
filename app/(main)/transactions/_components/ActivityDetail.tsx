import { formatCurrency } from "@/lib/utils";
import { ActivityItem } from "./types";

export function ActivityDetail({ item }: { item: ActivityItem }) {
    return (
        <div className="animate-slide-in min-w-0 flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white py-6 shadow-sm">
            <div className="mb-4 border-b border-gray-100 px-6 pb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                    Transaction Details
                </h2>
            </div>
            <div className="space-y-4 px-6">
                <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Description</div>
                    <div className="font-medium text-gray-900">{item.desc}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Amount</div>
                    <div
                        className={`font-semibold ${
                            item.isIncome ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {item.isIncome ? "+" : "-"}
                        {formatCurrency(item.amount)}
                    </div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-medium text-gray-900">
                        {new Date(item.date).toLocaleDateString("en-US")}
                    </div>
                </div>
            </div>
        </div>
    );
}
