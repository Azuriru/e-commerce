declare type Product = {
    name: string;
    description: string;
    price: number;
    category: string[];
    seller: number;
    id: number;
};

declare type Seller = string;

declare type Cart = Record<string | number, number>;