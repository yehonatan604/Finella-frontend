import { TWorkplace } from "../../types/TWorkplace";

export const addWorkplaceFormDefault = (userId: string): TWorkplace => ({
    userId,
    name: "",
    email: "",
    address: {
        street: "",
        houseNumber: "",
        city: "",
        country: "",
        zip: "",
    },
    phone: {
        main: "",
        secondary: "",
    },
    pricePerHour: 0,
    pricePerMonth: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    notes: "",
});