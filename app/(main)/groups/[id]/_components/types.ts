export interface GroupTransaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    currency: string;
    category: {
        id: string;
        name: string;
        icon: string | null;
        parentId: string | null;
        parentName: string | null;
        parentIcon: string | null;
    } | null;
    payer: {
        id: string;
        name: string;
    };
    splitCount: number;
}

export interface GroupMember {
    id: string;
    name: string;
    role: string;
}

export interface CategoryStat {
    id: string;
    name: string;
    icon: string | null;
    amount: number;
    percentage: number;
    color: string;
    subcategories?: CategoryStat[];
}
