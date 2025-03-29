import { useCallback, useEffect, useMemo, useState } from "react";
import { TWorkplace } from "../types/TWorkplace";
import { HTTPMethodTypes } from "../../Core/types/HTTPMethodTypes";
import { sendApiRequest } from "../../Core/helpers/sendApiRequest";
import { GridColDef } from "@mui/x-data-grid";

const useWorkplaces = () => {
    const [workplaces, setWorkplaces] = useState<TWorkplace[]>();
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const getAllWorkplaces = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const res = await sendApiRequest("/work-place", HTTPMethodTypes.GET);
            setWorkplaces(res.data);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError(String(e));
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const add = useCallback(async (workplace: TWorkplace) => {
        try {
            setLoading(true);
            setError("");

            if (workplace?.endDate === "") delete workplace.endDate;
            if (workplace?.notes === "") delete workplace.notes;
            if (workplace?.email === "") delete workplace.email;
            if (workplace?.address?.zip === "") delete workplace.address.zip;
            if (workplace?.phone?.secondary === "") delete workplace.phone.secondary;

            const res = await sendApiRequest("/work-place", HTTPMethodTypes.POST, workplace);
            setWorkplaces(prev => [...(prev || []), res.data]);
        } catch (e) {
            console.log(e);

            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError(String(e));
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const columns: GridColDef[] = useMemo(
        () => [
            {
                field: "name",
                headerName: "Name",
                flex: 1,
                headerClassName: "super-app-theme--header",
                sortable: true,
            },
            {
                field: "address",
                headerName: "Address",
                flex: 1,
                headerClassName: "super-app-theme--header",
            },
            {
                field: "city",
                headerName: "City",
                flex: 1,
                headerClassName: "super-app-theme--header",
            },
            {
                field: "country",
                headerName: "Country",
                flex: 1,
                headerClassName: "super-app-theme--header",
            },
            {
                field: "pricePerHour",
                headerName: "Price per hour",
                flex: 1,
                headerClassName: "super-app-theme--header",
            },
            {
                field: "pricePerMonth",
                headerName: "Price per month",
                flex: 1,
                headerClassName: "super-app-theme--header",
            },
        ],
        []
    );

    const rows = useMemo(
        () =>
            workplaces?.map((workplace) => ({
                id: workplace._id,
                name: workplace.name,
                address: `${workplace.address?.street} ${workplace.address?.houseNumber}`,
                city: workplace.address?.city,
                country: workplace.address?.country,
                pricePerHour: workplace.pricePerHour,
                pricePerMonth: workplace.pricePerMonth,
            })) || [],
        [workplaces]
    );

    useEffect(() => {
        getAllWorkplaces();
    }, [getAllWorkplaces]);

    return {
        workplaces,
        columns,
        rows,
        getAllWorkplaces,
        add,
        error,
        loading,
    }
}

export default useWorkplaces;