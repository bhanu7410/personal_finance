"use client";

import { ResponsivePie, ComputedDatum } from "@nivo/pie"; // Added ComputedDatum
import { PieChart as PieIcon } from "lucide-react";
import { MouseEvent } from "react"; // Added MouseEvent

interface CategoryData {
    name: string;
    value: number;
}

interface NivoDataShape {
    id: string;
    label: string;
    value: number;
}

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
};

export function CategoriesPieChart({ data }: { data: CategoryData[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="mx-7 flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-100 bg-gray-50">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <PieIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No expenses yet
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                        Add expenses to see your category breakdown.
                    </p>
                </div>
            </div>
        );
    }

    const nivoData = data.map((item) => ({
        id: item.name,
        label: item.name,
        value: item.value,
    }));

    // --- HANDLER FUNCTION ---
    const handleSliceClick = (
        node: ComputedDatum<NivoDataShape>,
        event: MouseEvent,
    ) => {
        // 'node' contains all the info about the slice
        console.log("Category Clicked:", node.id);
        console.log("Amount:", node.value);
        console.log("Color:", node.color);
        console.log("Event:", event);

        // Example: If you want to filter a list or open a modal:
        // onCategorySelect(node.id);
    };

    return (
        <div className="h-full min-h-0 w-full flex-1">
            <ResponsivePie
                data={nivoData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                innerRadius={0.6}
                padAngle={2}
                cornerRadius={4}
                colors={COLORS}
                activeOuterRadiusOffset={8}
                enableArcLinkLabels={false}
                enableArcLabels={false}
                animate={true}
                motionConfig="wobbly"
                transitionMode="pushIn"
                // --- ADDED ONCLICK HERE ---
                onClick={handleSliceClick}
                // Optional: Change cursor to pointer so user knows it's clickable
                isInteractive={true}
                theme={{
                    tooltip: {
                        container: {
                            fontSize: "12px",
                        },
                    },
                }}
                tooltip={({ datum: { id, value, color } }) => (
                    <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white p-2 shadow-md">
                        <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: color }}
                        />
                        <div className="w-max text-xs text-gray-500">{id}:</div>
                        <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(value)}
                        </div>
                    </div>
                )}
            />
        </div>
    );
}
