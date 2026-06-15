"use client";

import { GroupListItem } from "./types";
import {
    X,
    ExternalLink,
    Users,
    Wallet,
    Calendar,
    ShieldCheck,
    User as UserIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface GroupDetailProps {
    group: GroupListItem;
    onClose: () => void;
    isDragging?: boolean;
}

export function GroupDetail({ group, onClose, isDragging }: GroupDetailProps) {
    return (
        <div
            className={`flex h-full min-w-0 flex-1 flex-col border-l border-gray-100 bg-white ${!isDragging ? "animate-in fade-in slide-in-from-right-4 duration-300" : ""}`}
        >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {group.name}
                        </h2>
                        <p className="text-xs text-gray-500">Group Details</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                <Wallet className="h-3.5 w-3.5" />
                                Total Spent
                            </div>
                            <div className="mt-2 text-xl font-bold text-gray-900">
                                {formatCurrency(group.totalSpent)}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                <Calendar className="h-3.5 w-3.5" />
                                Created On
                            </div>
                            <div className="mt-2 text-sm font-bold text-gray-900">
                                {new Date(group.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    },
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {group.description && (
                        <div>
                            <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                Description
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                {group.description}
                            </p>
                        </div>
                    )}

                    {/* Members List */}
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                Members ({group.memberCount})
                            </h3>
                        </div>
                        <div className="mt-4 space-y-3">
                            {group.members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between rounded-xl border border-gray-50 bg-white p-3 shadow-sm transition-all hover:border-orange-100 hover:shadow-md"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-100 bg-orange-50 font-bold text-orange-600">
                                            {member.name
                                                .split(" ")
                                                .map((n) => n.charAt(0))
                                                .join("")}
                                        </div>
                                        <div className="">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {member.name}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                {member.email}
                                            </p>
                                        </div>
                                    </div>
                                    {member.role === "ADMIN" ? (
                                        <div className="flex items-center gap-1 rounded-full bg-purple-50 px-2 py-1 text-[10px] font-bold text-purple-600">
                                            <ShieldCheck className="h-3 w-3" />
                                            ADMIN
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1 text-[10px] font-bold text-gray-500">
                                            <UserIcon className="h-3 w-3" />
                                            MEMBER
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Quick Action */}
            <div className="border-t border-gray-100 p-6">
                <Link
                    href={`/groups/${group.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800"
                >
                    <ExternalLink className="h-4 w-4" />
                    Open Full Group Dashboard
                </Link>
            </div>
        </div>
    );
}
