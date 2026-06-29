"use client";

import { getProfileData } from "../_lib/getProfileData";
import Link from "next/link";
import { Users, ChevronRight, Activity } from "lucide-react";

interface GroupProps {
    initialData: Awaited<ReturnType<typeof getProfileData>>;
}

export function SimplifiedGroups({ initialData }: GroupProps) {
    const { groupsInfo } = initialData;

    if (!groupsInfo || groupsInfo.length === 0) {
        return (
            <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-neutral-200">
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="rounded-full bg-neutral-100 p-4 text-neutral-400">
                        <Users className="h-8 w-8" />
                    </div>
                    <p className="text-xl font-medium text-neutral-600">
                        You aren&apos;t in any groups yet.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto mt-6 w-full max-w-5xl space-y-5">
            <div className="flex items-center gap-3 px-1">
                <Activity className="h-5 w-5 text-neutral-400" />
                <h3 className="text-xl font-semibold tracking-tight text-neutral-800">
                    Active Groups
                </h3>
            </div>

            {/* Added extra padding p-2 to the container to prevent hover shadows from clipping */}
            <div className="custom-scrollbar -mx-2 flex max-h-115 flex-col gap-4 overflow-y-auto p-2">
                {groupsInfo.map((group) => (
                    <Link
                        key={group.id}
                        href={`/groups/${group.id}`}
                        className="group relative flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200/60 transition-all hover:shadow-md hover:ring-neutral-300 sm:flex-row sm:items-center"
                    >
                        <div className="flex min-w-0 items-center gap-5">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100/50">
                                <Users className="h-5 w-5" />
                            </div>
                            <div className="flex min-w-0 flex-col gap-1">
                                <h4 className="truncate text-lg font-semibold text-neutral-900 transition-colors group-hover:text-blue-600">
                                    {group.name}
                                </h4>
                                <span className="text-sm font-medium text-neutral-500">
                                    {group.membersCount} member
                                    {group.membersCount !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>

                        <div className="mt-2 flex shrink-0 items-center justify-between gap-6 border-t border-neutral-100 pt-4 sm:mt-0 sm:justify-end sm:gap-10 sm:border-t-0 sm:pt-0">
                            <div className="flex flex-col items-start sm:items-end">
                                <span className="text-xs font-medium tracking-wider text-neutral-400 uppercase">
                                    Group Spent
                                </span>
                                <span className="text-base font-semibold text-neutral-700">
                                    ${group.totalSpend.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex flex-col items-start sm:items-end">
                                <span className="text-xs font-medium tracking-wider text-neutral-400 uppercase">
                                    Your Share
                                </span>
                                <span className="text-base font-semibold text-blue-600">
                                    ${group.userContribution.toFixed(2)}
                                </span>
                            </div>
                            <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-50 text-neutral-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 sm:flex">
                                <ChevronRight className="h-5 w-5" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #e5e5e5;
                    border-radius: 9999px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #d4d4d8;
                }
            `}</style>
        </div>
    );
}
