"use client";

import { ResponsiveLine } from "@nivo/line";
import { ChartLineIcon } from "lucide-react";
import { useMemo } from "react";

interface BalanceDataPoint {
    date: string;
    balance: number;
}

interface NivoSeriesData {
    id: string;
    data: { x: string; y: number }[];
}

const currencyFormatter = (value: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
};

const dateFormatter = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
};

export function BalanceChart({ data }: { data: BalanceDataPoint[] }) {
    // 1. SIMPLIFIED LOGIC
    // Take min - 30% and max + 15% to create breathing room
    const { yMin, yMax, tickValues } = useMemo(() => {
        if (!data || data.length === 0)
            return { yMin: 0, yMax: 100, tickValues: [0, 25, 50, 75, 100] };

        const values = data.map((d) => d.balance);
        const rawMin = Math.min(...values);
        const rawMax = Math.max(...values);

        // Calculate rough targets
        let targetMin = rawMin - Math.abs(rawMin) * 0.1; // Go 30% lower
        let targetMax = rawMax + Math.abs(rawMax) * 0.05; // Go 15% higher

        // Special case: Flat line
        if (rawMin === rawMax) {
            targetMin = rawMin - 100;
            targetMax = rawMax + 100;
        }

        // Round to "nice" numbers (e.g. nearest 100 or 1000)
        // We use the range to decide what "nice" means
        const range = targetMax - targetMin;
        const magnitude = Math.pow(10, Math.floor(Math.log10(range))); // e.g. 100, 1000

        // Round down the min, Round up the max
        const niceMin = Math.floor(targetMin / magnitude) * magnitude;
        const niceMax = Math.ceil(targetMax / magnitude) * magnitude;

        // Generate exactly 5 evenly spaced ticks
        const step = (niceMax - niceMin) / 4;
        const ticks = [
            niceMin,
            niceMin + step,
            niceMin + step * 2,
            niceMin + step * 3,
            niceMax,
        ];

        return { yMin: niceMin, yMax: niceMax, tickValues: ticks };
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <div className="mx-7 flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-100 bg-gray-50 pr-5">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <ChartLineIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No expenses yet
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                        Your balance history will appear here once you start
                        adding your expenses.
                    </p>
                </div>
            </div>
        );
    }

    const nivoData: NivoSeriesData[] = [
        {
            id: "Balance",
            data: data.map((item) => ({
                x: item.date,
                y: item.balance,
            })),
        },
    ];

    return (
        <div className="h-full min-h-0 w-full flex-1">
            <ResponsiveLine
                data={nivoData}
                margin={{ top: 20, right: 20, bottom: 40, left: 80 }}
                theme={{
                    axis: {
                        domain: {
                            line: {
                                stroke: "#E5E7EB",
                                strokeWidth: 1,
                            },
                        },
                    },
                    grid: {
                        line: {
                            stroke: "#E5E7EB",
                            strokeWidth: 1,
                            strokeDasharray: "4 4",
                        },
                    },
                }}
                xScale={{ type: "point" }}
                yScale={{
                    type: "linear",
                    min: yMin,
                    max: yMax,
                    stacked: false,
                    reverse: false,
                }}
                curve="monotoneX"
                colors={["#2563EB"]}
                lineWidth={3}
                enableArea={false}
                pointSize={8}
                pointColor={{ from: "series.color" }}
                pointBorderWidth={1}
                pointBorderColor="#ffffff"
                useMesh={true}
                enableSlices="x"
                crosshairType="bottom"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 15,
                    tickRotation: 0,
                    format: (value) => dateFormatter(value as string),
                }}
                axisLeft={{
                    tickSize: 0,
                    tickPadding: 20,
                    tickRotation: 0,
                    format: (value) => currencyFormatter(value as number),
                    tickValues: tickValues, // <--- Using our specific 5 ticks
                }}
                enableGridX={false}
                enableGridY={true}
                gridYValues={tickValues} // <--- Using our specific 5 ticks
                sliceTooltip={({ slice }) => {
                    return (
                        <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-lg">
                            <div className="mb-2 border-b border-gray-100 pb-1 text-xs text-gray-500">
                                {new Date(
                                    slice.points[0].data.x as string,
                                ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })}
                            </div>
                            {slice.points.map((point) => (
                                <div
                                    key={point.id}
                                    className="flex items-center gap-2"
                                >
                                    <div
                                        className="h-2 w-2 rounded-full"
                                        style={{
                                            backgroundColor: point.seriesColor,
                                        }}
                                    />
                                    <span className="text-sm font-semibold text-gray-900">
                                        {currencyFormatter(
                                            point.data.y as number,
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    );
                }}
            />
        </div>
    );
}
