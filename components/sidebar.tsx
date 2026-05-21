"use client"; // <-- Add this to enable client-side routing detection

import { usePathname } from "next/navigation"; // <-- Import the hook
import { UserButton } from "@stackframe/stack";
import {
    BadgeDollarSign,
    HandCoins,
    Users,
    ClipboardPlus,
    SlidersHorizontal,
} from "lucide-react";

import Link from "next/link";

export default function Sidebar() {
    const currentPath = usePathname(); // <-- Automatically gets the current URL

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: HandCoins },
        { name: "Transactions", href: "/transactions", icon: BadgeDollarSign },
        { name: "Groups", href: "/groups", icon: Users },
        { name: "Reports", href: "/reports", icon: ClipboardPlus },
        { name: "Settings", href: "/settings", icon: SlidersHorizontal },
    ];

    return (
        <div className="fixed top-0 left-0 z-10 min-h-screen w-64 bg-gray-900 p-6 text-white">
            <div className="mb-8">
                <div className="mb-4 flex items-center space-x-2">
                    <HandCoins className="h-7 w-7" />
                    <span className="font-semibold">Personal Finance</span>
                </div>
            </div>
            <nav className="space-y-1">
                <div className="text-sm font-semibold text-gray-400 uppercase">
                    Inventory
                </div>
                {navigation.map((item, key) => {
                    const ItemComponent = item.icon;
                    // Exact match or sub-route match for active state
                    const isActive = currentPath === item.href;

                    return (
                        <Link
                            key={key}
                            className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors ${
                                isActive
                                    ? "bg-purple-100 text-gray-800"
                                    : "text-white hover:bg-gray-800"
                            }`}
                            href={item.href}
                        >
                            <ItemComponent className="h-5 w-5" />
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="absolute right-0 bottom-0 left-0 border-t border-gray-700 p-6">
                <div className="flex items-center justify-between">
                    <UserButton showUserInfo />
                </div>
            </div>
        </div>
    );
}
