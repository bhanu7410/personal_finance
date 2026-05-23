import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    createColumnHelper,
} from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";
import { ActivityItem } from "./types";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useState } from "react";

interface ActivityListProps {
    data: ActivityItem[];
    selectedItem: ActivityItem | null;
    onItemClick: (item: ActivityItem) => void;
}

const columnHelper = createColumnHelper<ActivityItem>();

const columns = [
    columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => (
            <span className="text-xs text-gray-500">
                {new Date(info.getValue()).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                })}
            </span>
        ),
    }),
    columnHelper.accessor("name", {
        header: "Details",
        cell: (info) => {
            const item = info.row.original;
            return (
                <div className="flex items-center gap-3">
                    <div
                        className={`shrink-0 rounded p-1.5 ${
                            item.isIncome ? "bg-green-100" : "bg-red-50"
                        }`}
                    >
                        {item.isIncome ? (
                            <ArrowDownLeft className="h-3 w-3 text-green-600" />
                        ) : (
                            <ArrowUpRight className="h-3 w-3 text-red-600" />
                        )}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="truncate text-sm font-medium text-gray-900">
                            {info.getValue()}
                        </span>
                        <span className="text-xs text-gray-500">
                            {item.type}
                        </span>
                    </div>
                </div>
            );
        },
    }),
    columnHelper.accessor("amount", {
        header: () => <div className="text-right">Amount</div>,
        cell: (info) => {
            const item = info.row.original;
            return (
                <div
                    className={`text-right text-sm font-semibold ${
                        item.isIncome ? "text-green-600" : "text-gray-900"
                    }`}
                >
                    {item.isIncome ? "+" : "-"}
                    {formatCurrency(info.getValue())}
                </div>
            );
        },
    }),
];

export function ActivityList({
    data,
    selectedItem,
    onItemClick,
}: ActivityListProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setIsScrolled(e.currentTarget.scrollTop > 0);
    };

    return (
        <div
            className="relative max-h-full flex-1 overflow-y-auto px-2"
            onScroll={handleScroll}
        >
            {/* CHANGED: border-collapse to border-separate with spacing to create gaps between rows */}
            <table
                className="w-full border-separate text-left"
                style={{ borderSpacing: "0 6px" }}
            >
                <thead
                    className={`sticky top-0 z-10 bg-white/95 backdrop-blur-sm transition-shadow duration-200 ${
                        isScrolled ? "shadow-md" : "shadow-none"
                    }`}
                >
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="bg-gray-50/80 px-4 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                {/* CHANGED: Removed divide-y so the rows can float freely */}
                <tbody>
                    {table.getRowModel().rows.map((row) => {
                        const item = row.original;
                        const isSelected = selectedItem?.id === item.id;
                        const cells = row.getVisibleCells();

                        return (
                            <tr
                                key={row.id}
                                onClick={() => onItemClick(item)}
                                className="group cursor-pointer"
                            >
                                {cells.map((cell, index) => {
                                    const isFirst = index === 0;
                                    const isLast = index === cells.length - 1;

                                    return (
                                        <td
                                            key={cell.id}
                                            className={`px-4 py-3 whitespace-nowrap transition-all duration-300 ${
                                                isSelected
                                                    ? "border-y-4 border-dashed border-orange-400 bg-orange-100"
                                                    : "border-y-4 border-solid border-transparent bg-white shadow-sm group-hover:bg-blue-50 group-hover:shadow-md"
                                            } ${
                                                // Handle rounded corners and left/right borders only on the first and last cells
                                                isFirst
                                                    ? isSelected
                                                        ? "rounded-l-2xl border-l-4"
                                                        : "rounded-l-2xl border-l-4 border-transparent"
                                                    : ""
                                            } ${
                                                isLast
                                                    ? isSelected
                                                        ? "rounded-r-2xl border-r-4"
                                                        : "rounded-r-2xl border-r-4 border-transparent"
                                                    : ""
                                            }`}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
