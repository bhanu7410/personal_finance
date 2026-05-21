import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ActivityItem } from "./types";

interface ActivityListProps {
    data: ActivityItem[];
    selectedItem: ActivityItem | null;
    onItemClick: (item: ActivityItem) => void;
}

export function ActivityList({
    data,
    selectedItem,
    onItemClick,
}: ActivityListProps) {
    return (
        <div className="max-h-full flex-1 space-y-4 overflow-y-auto px-2 py-5">
            {data.map((item) => (
                <div
                    key={`${item.type}-${item.id}`}
                    className={`group m-0 flex items-center justify-between rounded-2xl px-1 transition duration-300 ease-in-out hover:cursor-pointer hover:bg-blue-50 ${
                        selectedItem?.id === item.id
                            ? "border-4 border-dashed border-orange-400 bg-orange-100"
                            : "border-4 border-transparent"
                    }`}
                    onClick={() => onItemClick(item)}
                >
                    <div className="flex items-center gap-4">
                        <div
                            className={`rounded-full p-2 transition-colors ${
                                item.isIncome
                                    ? "bg-green-100 group-hover:bg-green-200"
                                    : "bg-red-50 group-hover:bg-red-100"
                            }`}
                        >
                            {item.isIncome ? (
                                <ArrowDownLeft className="h-4 w-4 text-green-600" />
                            ) : (
                                <ArrowUpRight className="h-4 w-4 text-red-600" />
                            )}
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-900">
                                {item.name}
                            </div>
                            <div className="text-xs text-gray-500">
                                {item.desc}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div
                            className={`text-sm font-semibold ${
                                item.isIncome
                                    ? "text-green-600"
                                    : "text-gray-900"
                            }`}
                        >
                            {item.isIncome ? "+" : "-"}
                            {formatCurrency(item.amount)}
                        </div>
                        <div className="text-xs text-gray-400">
                            {new Date(item.date).toLocaleDateString("en-US")}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
