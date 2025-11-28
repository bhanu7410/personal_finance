"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useUser as useStackUser } from "@stackframe/stack";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const stackUser = useStackUser(); // The auth user from Stack
    const [dbUser, setDbUser] = useState(null); // The data from YOUR database
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let isMounted = true; // Flag to prevent setting state if component unmounts

        async function loadUser() {
            // 1. If not logged in via Stack, clear data
            if (!stackUser) {
                setDbUser(null);
                setLoading(false);
                return;
            }

            // REMOVED: if (dbUser) return;
            // Why? Because if stackUser changed, we NEED to fetch new data.

            try {
                const res = await fetch("/api/user/me");
                if (res.ok && isMounted) {
                    const userData = await res.json();
                    setDbUser(userData);
                }
            } catch (error) {
                console.error("Failed to load user profile", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadUser();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [stackUser]); // Only depend on stackUser

    return (
        <UserContext.Provider value={{ stackUser, dbUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}

// Helper hook to use this data in any component
export function useAppUser() {
    return useContext(UserContext);
}
