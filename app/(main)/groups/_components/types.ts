export interface GroupListItem {
    id: string;
    name: string;
    description: string | null;
    currency: string;
    totalSpent: number;
    memberCount: number;
    members: {
        id: string;
        name: string;
        email: string;
        role: string;
    }[];
    createdAt: string;
}
