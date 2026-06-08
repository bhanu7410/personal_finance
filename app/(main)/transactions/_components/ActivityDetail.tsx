"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { ActivityItem } from "./types";
import {
    X,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    User,
    Globe,
    Tag,
    Info,
    ExternalLink,
    ReceiptText,
    Users,
    Clock,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

interface ActivityDetailProps {
    item: ActivityItem;
    onClose: () => void;
}

export function ActivityDetail({ item, onClose }: ActivityDetailProps) {
    const [isSplitsOpen, setIsSplitsOpen] = useState(false);

    const dateObj = new Date(item.date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    const formattedTime = dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="animate-slide-in flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Header Actions */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Transaction Detail
                </span>
                <button
                    onClick={onClose}
                    className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Hero Section: Amount & Title */}
                <div className="flex flex-col items-center bg-gray-50/50 py-10 px-6">
                    <div
                        className={`mb-2 flex items-center justify-center rounded-2xl p-4 shadow-sm ${
                            item.isIncome ? "bg-green-100" : "bg-red-50"
                        }`}
                    >
                        {item.isIncome ? (
                            <ArrowDownLeft className="h-8 w-8 text-green-600" />
                        ) : (
                            <ArrowUpRight className="h-8 w-8 text-red-600" />
                        )}
                    </div>
                    <div
                        className={`text-4xl font-black tracking-tight ${
                            item.isIncome ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {item.isIncome ? "+" : "-"}
                        {formatCurrency(item.amount)}
                    </div>
                    <h2 className="mt-2 text-xl font-bold text-gray-900">
                        {item.categoryIcon} {item.name}
                    </h2>
                    <div className="mt-4">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                                item.type === "Transfer"
                                    ? "bg-blue-100 text-blue-700"
                                    : item.type === "Split"
                                      ? "bg-orange-100 text-orange-700"
                                      : item.type === "Group"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {item.type}
                        </span>
                    </div>
                </div>

                <div className="space-y-8 p-8">
                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                    Date
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {formattedDate}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                    Time
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {formattedTime}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                <Globe className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                    Currency
                                </p>
                                <p className="text-sm font-semibold text-gray-900 uppercase">
                                    {item.currency}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                    Payer
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {item.payerName || "You"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    {item.desc && (
                        <div>
                            <p className="mb-3 flex items-center gap-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                <Info className="h-3 w-3" />
                                Description
                            </p>
                            <div className="rounded-2xl bg-gray-50 p-4 text-sm font-medium leading-relaxed text-gray-700">
                                {item.desc}
                            </div>
                        </div>
                    )}

                    {/* Group & Split Details Section (Collapsible Accordion) */}
                    {item.splits && item.splits.length > 0 && (
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all">
                            <button
                                onClick={() => setIsSplitsOpen(!isSplitsOpen)}
                                className="flex w-full items-center justify-between bg-gray-50 px-5 py-4 transition-colors hover:bg-gray-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-gray-900">
                                            Split Breakdown
                                        </p>
                                        <p className="text-xs font-medium text-gray-500">
                                            {item.splits.length} participants {item.groupName ? `in ${item.groupName}` : ""}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
                                    {isSplitsOpen ? (
                                        <ChevronUp className="h-4 w-4 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-gray-600" />
                                    )}
                                </div>
                            </button>

                            {isSplitsOpen && (
                                <div className="divide-y divide-gray-50 border-t border-gray-200 bg-white px-2 animate-in slide-in-from-top-2 fade-in duration-200">
                                    {item.splits.map((split, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-3 py-4"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                                                    {split.userName.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {split.userName}
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">
                                                {formatCurrency(split.amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Receipt Section */}
                    {item.receiptUrl && (
                        <div className="pt-4">
                            <a
                                href={item.receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gray-900 py-4 font-bold text-white shadow-lg shadow-gray-200 transition-all hover:bg-gray-800 hover:shadow-xl"
                            >
                                <ReceiptText className="h-5 w-5" />
                                View Attached Receipt
                                <ExternalLink className="ml-1 h-4 w-4 opacity-50" />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
