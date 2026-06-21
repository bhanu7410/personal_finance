"use client";

import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    createColumnHelper,
    SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { GroupTransaction } from "./types";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, ArrowUp, ArrowDown } from "lucide-react";

interface GroupTransactionsTableProps {
    data: GroupTransaction[];
}

const columnHelper = createColumnHelper<GroupTransaction>();

const columns = [
    columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => (
            <span className="text-xs font-medium text-gray-500">
                {new Date(info.getValue()).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "2-digit",
                })}
            </span>
        ),
    }),
    columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => {
            const item = info.row.original;
            return (
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-sm">
                        {item.category?.icon || "📄"}
                    </div>
                    <div className="flex flex-col">
                        <span className="mb-1 text-sm leading-none font-bold text-gray-900">
                            {info.getValue()}
                        </span>
                        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                            {item.category?.name || "Uncategorized"}
                        </span>
                    </div>
                </div>
            );
        },
    }),
    columnHelper.accessor("payer.name", {
        header: "Paid By",
        cell: (info) => (
            <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600">
                    {info.getValue().charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-gray-700">
                    {info.getValue()}
                </span>
            </div>
        ),
    }),
    columnHelper.accessor("amount", {
        header: () => <div className="text-right">Amount</div>,
        cell: (info) => (
            <div className="text-right text-sm font-black text-gray-900">
                {formatCurrency(info.getValue())}
            </div>
        ),
    }),
];

export function GroupTransactionsTable({ data }: GroupTransactionsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="w-full space-y-6">
            <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase">
                Group Activity
            </h3>

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <table className="w-full border-collapse text-left">
                    <thead className="bg-gray-50/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase select-none"
                                    >
                                        <div
                                            className={`flex items-center gap-1 ${header.column.getCanSort() ? "cursor-pointer hover:text-gray-900" : ""}`}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            {{
                                                asc: (
                                                    <ArrowUp className="h-3 w-3" />
                                                ),
                                                desc: (
                                                    <ArrowDown className="h-3 w-3" />
                                                ),
                                            }[
                                                header.column.getIsSorted() as string
                                            ] ?? null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="group transition-colors hover:bg-gray-50/50"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-6 py-4">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 rounded-full bg-gray-50 p-4">
                            <Receipt className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                            No transactions found
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            Try clearing your filters.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
import { Receipt } from "lucide-react";
