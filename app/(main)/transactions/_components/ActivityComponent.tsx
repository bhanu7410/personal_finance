"use client";

import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

interface CategoryData {
    id: string;
    type: string;
    name: string;
    desc: string;
    amount: number;
    date: Date;
    isIncome: boolean;
}

export function ActivityComponent({ data }: { data: CategoryData[] }) {
    const [toggleDetailedActivityView, setToggleDetailedActivityView] =
        useState(false);

    function handleActivityOnClick(item: CategoryData) {
        // Placeholder for click handling logic, e.g., navigate to transaction details
        setToggleDetailedActivityView((prev) => !prev);
        console.log("Activity item clicked", item);
    }
    return (
        <div className="flex">
            <div className="flex min-h-0 flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="shrink-0 border-b border-gray-100 p-5">
                    <h2 className="font-semibold text-gray-900">
                        Recent Activity
                    </h2>
                </div>
                <div className="flex-1 space-y-4 overflow-y-auto px-2 py-5">
                    {data.map((item) => (
                        <div
                            key={`${item.type}-${item.id}`}
                            className="group m-0 flex items-center justify-between rounded-2xl px-2 py-1 transition duration-400 ease-in-out hover:cursor-pointer hover:bg-gray-400"
                            onClick={() => handleActivityOnClick(item)}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`rounded-full p-2 transition-colors ${item.isIncome ? "bg-green-100 group-hover:bg-green-200" : "bg-red-50 group-hover:bg-red-100"}`}
                                >
                                    {item.isIncome ? (
                                        <ArrowDownLeft
                                            className={`h-4 w-4 ${item.isIncome ? "text-green-600" : "text-red-600"}`}
                                        />
                                    ) : (
                                        <ArrowUpRight
                                            className={`h-4 w-4 ${item.isIncome ? "text-green-600" : "text-red-600"}`}
                                        />
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
                                    className={`text-sm font-semibold ${item.isIncome ? "text-green-600" : "text-gray-900"}`}
                                >
                                    {item.isIncome ? "+" : "-"}
                                    {formatCurrency(item.amount)}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {new Date(item.date).toLocaleDateString(
                                        "en-US",
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {toggleDetailedActivityView && <div className="">Hello World</div>}
        </div>
    );
}
