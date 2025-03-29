import { TDbItem } from "../../Actions/types/TDbItem";

export type TUser = TDbItem & {
    email: string;
    name: {
        first: string;
        last: string;
    }
    password: string;
    dob: Date
    workPlaces: string[];
} 