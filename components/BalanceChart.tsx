"use client"; // Required for Recharts

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface BalanceDataPoint {
    date: string;
    balance: number;
}

export function BalanceChart({ data }: { data: BalanceDataPoint[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                />
                <YAxis
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                    contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#2563EB" // Blue-600
                    strokeWidth={3}
                    dot={{
                        r: 4,
                        fill: "#2563EB",
                        strokeWidth: 2,
                        stroke: "#fff",
                    }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
