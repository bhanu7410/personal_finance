import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth"; // The helper we wrote earlier

export async function GET(request) {
    // calling this AUTOMATICALLY syncs the user to your DB
    const user = await getAuthenticatedUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return the full user object from YOUR database (including upid, transactions, etc.)
    return NextResponse.json(user);
}
