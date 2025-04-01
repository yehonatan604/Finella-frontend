import { TWorkplace } from "../types/TWorkplace";

export const workplaceRows = (workplaces: TWorkplace[]) => {
    return (
        workplaces?.map((workplace) => ({
            id: workplace._id,
            name: workplace.name,
            email: workplace.email,
            ["main phone"]: workplace.phone?.main,
            address: `${workplace.address?.street} ${workplace.address?.houseNumber} ${workplace.address?.city} ${workplace.address?.country}`,
            pricePerHour: workplace.pricePerHour,
            pricePerMonth: workplace.pricePerMonth,
            ["secondary phone"]: workplace.phone?.secondary,
            startDate: workplace.startDate,
            endDate: workplace.endDate,

        })) || []
    );
};