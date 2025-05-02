import { TDbItem } from "./TDbItem";

export type TWorkplace = TDbItem & {
    userId: string;
    name: string;
    email?: string;
    address?: {
        street: string;
        houseNumber: string;
        city: string;
        country: string;
        zip?: string;
    };
    phone?: {
        main?: string;
        secondary?: string;
    };
    pricePerHour?: number;
    pricePerMonth?: number;
    startDate: string;
    endDate?: string;
    notes?: string;
};