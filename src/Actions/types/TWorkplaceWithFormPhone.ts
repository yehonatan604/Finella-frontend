import { TWorkplace } from "./TWorkplace";

export type TWorkplaceWithFormPhone = TWorkplace & {
    phone: {
        ["main phone"]?: string;
        ["secondary phone"]?: string;
    };
};