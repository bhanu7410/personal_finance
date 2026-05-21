// Helper for cleaner currency display
export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
    }).format(amount);
};
