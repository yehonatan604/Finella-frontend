import { TWorkplace } from "../../types/TWorkplace";

export const addWorkplaceFormDefault: TWorkplace = {
    userId: "",
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
    withVat: false,
    startDate: "",
    endDate: "",
    notes: "",
};