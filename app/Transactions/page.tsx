import Sidebar from "@/components/sidebar";

export default function TransactionsPage() {
    console.log("Hello");
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar currentPath="/Transactions" />
            <main className="ml-64 flex h-full flex-1 flex-col p-6">
                <h1 className="mb-4 text-2xl font-bold">Transactions</h1>
                <p>Here you can view and manage your transactions.</p>
            </main>
        </div>
    );
}
