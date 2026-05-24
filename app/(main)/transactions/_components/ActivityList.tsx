import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    createColumnHelper,
    SortingState,
    VisibilityState,
} from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";
import { ActivityItem } from "./types";
import {
    ArrowDownLeft,
    ArrowUpRight,
    ArrowDown,
    ArrowUp,
    Settings2,
} from "lucide-react";
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
        size: 100,
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
        size: 250,
        cell: (info) => {
            const item = info.row.original;
            return (
                <div className="flex items-center gap-3">
                    <div
                        className={`shrink-0 rounded-full p-1.5 ${item.isIncome ? "bg-green-100" : "bg-red-50"}`}
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
    columnHelper.accessor("currency", {
        header: "Currency",
        size: 100,
        cell: (info) => (
            <span className="text-sm text-gray-500">{info.getValue()}</span>
        ),
    }),
    columnHelper.accessor("amount", {
        header: () => <div className="text-right">Amount</div>,
        size: 120,
        cell: (info) => {
            const item = info.row.original;
            return (
                <div
                    className={`text-right text-sm font-semibold ${item.isIncome ? "text-green-600" : "text-red-500"}`}
                >
                    {item.isIncome ? "+ " : "- "}
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
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        currency: false,
    });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isResizingEnabled, setIsResizingEnabled] = useState(true);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: "onChange",
    });

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setIsScrolled(e.currentTarget.scrollTop > 0);
    };

    const toggleResizing = (enabled: boolean) => {
        setIsResizingEnabled(enabled);
        if (!enabled) {
            table.resetColumnSizing();
        }
    };

    return (
        <div className="flex h-full flex-col">
            {/* Header section with Title and Customise button */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5 shrink-0">
                <h2 className="font-semibold text-gray-900">
                    Recent Activity
                </h2>
                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        <Settings2 className="h-4 w-4" />
                        Columns
                    </button>

                    {isMenuOpen && (
                        <div className="absolute top-10 right-0 z-50 w-56 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
                            <div className="mb-2 px-2 text-xs font-semibold text-gray-500 uppercase">
                                Settings
                            </div>
                            <label className="mb-2 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    checked={isResizingEnabled}
                                    onChange={(e) => toggleResizing(e.target.checked)}
                                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Enable Resizing
                                </span>
                            </label>
                            
                            <div className="my-2 border-t border-gray-100" />
                            
                            <div className="mb-2 px-2 text-xs font-semibold text-gray-500 uppercase">
                                Toggle Columns
                            </div>
                            {table.getAllLeafColumns().map((column) => {
                                return (
                                    <label
                                        key={column.id}
                                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={column.getIsVisible()}
                                            onChange={column.getToggleVisibilityHandler()}
                                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-700 capitalize">
                                            {column.id}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div
                className="relative max-h-full flex-1 overflow-y-auto px-2 pt-2"
                onScroll={handleScroll}
            >
                <table
                    className={`w-full border-separate text-left ${isResizingEnabled ? "table-fixed" : "table-auto"}`}
                    style={{ borderSpacing: "0 6px" }}
                >
                    <thead
                        className={`sticky top-0 z-10 bg-white/95 backdrop-blur-sm transition-shadow duration-200 ${isScrolled ? "shadow-md" : "shadow-none"}`}
                    >
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        style={isResizingEnabled ? { width: header.getSize() } : {}}
                                        className="group relative bg-gray-50/80 px-4 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase select-none"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={`flex items-center gap-1 ${header.column.getCanSort() ? "cursor-pointer hover:text-gray-900" : ""}`}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
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
                                        )}

                                        {isResizingEnabled && (
                                            <div
                                                onMouseDown={header.getResizeHandler()}
                                                onTouchStart={header.getResizeHandler()}
                                                className={`absolute top-0 right-0 h-full w-1.5 cursor-col-resize rounded-2xl hover:bg-orange-400/50 ${
                                                    header.column.getIsResizing()
                                                        ? "bg-orange-500"
                                                        : ""
                                                }`}
                                            />
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

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
                                        const isLast =
                                            index === cells.length - 1;

                                        return (
                                            <td
                                                key={cell.id}
                                                style={isResizingEnabled ? { width: cell.column.getSize() } : {}}
                                                className={`px-4 py-3 whitespace-nowrap transition-colors duration-300 ${
                                                    isSelected
                                                        ? "border-y-4 border-dashed border-orange-400 bg-orange-100"
                                                        : "border-y-4 border-solid border-transparent bg-white shadow-sm group-hover:bg-blue-50 group-hover:shadow-md"
                                                } ${isFirst ? (isSelected ? "rounded-l-2xl border-l-4" : "rounded-l-2xl border-l-4 border-transparent") : ""} ${isLast ? (isSelected ? "rounded-r-2xl border-r-4" : "rounded-r-2xl border-r-4 border-transparent") : ""}`}
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
        </div>
    );
}
