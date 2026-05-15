import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* The Sidebar is now persistent and never unmounts */}
            <Sidebar />

            {/* This is where page.tsx or loading.tsx will be injected */}
            {children}
        </div>
    );
}
