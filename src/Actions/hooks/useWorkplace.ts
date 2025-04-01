import { useCallback, useEffect, useMemo, useState } from "react";
import { TWorkplace } from "../types/TWorkplace";
import { HTTPMethodTypes } from "../../Core/types/HTTPMethodTypes";
import { sendApiRequest } from "../../Core/helpers/sendApiRequest";
import { TDataGridInputCellParams } from "../types/TDataGridInputCellParams";
import { toastify } from "../../UI/utilities/toast";
import { workplaceCols } from "../data/workplaceCols";
import { workplaceRows } from "../data/workplaceRows";
import { TWorkplaceWithFormPhone } from "../types/TWorkplaceWithFormPhone";

const useWorkplaces = () => {
    const [workplaces, setWorkplaces] = useState<TWorkplace[]>();
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [selectedWorkplace, setSelectedWorkplace] = useState<TWorkplace | null>(null);
    const [search, setSearch] = useState<string>("");

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
            const res = await sendApiRequest("/work-place", HTTPMethodTypes.POST, workplace);
            setWorkplaces(prev => [...(prev || []), res.data]);
            toastify.success("Workplace added successfully");
        } catch (e) {
            console.log(e);
            toastify.error("Error adding workplace");

            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError(String(e));
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const onUpdate = useCallback(async (workplace: TWorkplace) => {
        try {
            setLoading(true);
            setError("");

            const finalWorlpace = {
                _id: workplace._id ? workplace._id : (workplace as TWorkplace & { id: string })["id"],
                name: workplace.name,
                address: workplace.address,
                pricePerHour: workplace.pricePerHour,
                pricePerMonth: workplace.pricePerMonth,
                startDate: workplace.startDate,
                endDate: workplace.endDate,
                phone: {
                    main: workplace.phone
                        ? (workplace as TWorkplaceWithFormPhone).phone["main phone"] :
                        (workplace as TWorkplace & { "main phone": string })["main phone"],
                    secondary: workplace.phone
                        ? (workplace as TWorkplaceWithFormPhone).phone["secondary phone"] :
                        (workplace as TWorkplace & { "secondary phone": string })["secondary phone"],
                },
                email: workplace.email,
                withVat: workplace.withVat,
            }

            const res = await sendApiRequest(`/work-place`, HTTPMethodTypes.PUT, finalWorlpace);
            setWorkplaces(prev => prev?.map(w => w._id === res.data._id ? res.data : w) || []);
            setSelectedWorkplace(null);
            toastify.success("Workplace updated successfully");
        }
        catch (e) {
            console.log(e);
            toastify.error("Error updating workplace");
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError(String(e));
            }
        }
        finally {
            setLoading(false);
        }
    }, []);

    const onCellUpdate = useMemo(
        () => (row: TWorkplace & { id: string | undefined }) => {
            const fetchedRow = workplaces?.find(workplace => workplace._id === row.id);

            const fields = [
                "name",
                "email",
                "address",
                "pricePerHour",
                "pricePerMonth",
                "startDate",
                "endDate",
                "main phone",
                "secondary phone",
            ] as const;

            const normalizeRow = (row: Partial<TWorkplace>) => ({
                name: row?.name,
                email: row?.email,
                address: fetchedRow?.address,
                pricePerHour: row?.pricePerHour,
                pricePerMonth: row?.pricePerMonth,
                startDate: row?.startDate,
                endDate: row?.endDate,
                "main phone": row?.phone?.main,
                "secondary phone": row?.phone?.secondary,
            });

            const checkFetchedRow = normalizeRow(fetchedRow as TWorkplace);
            const checkRow = normalizeRow(row);

            const isEqual = fields.every(
                field => checkFetchedRow[field] === checkRow[field]
            );

            if (!isEqual) {
                onUpdate({ ...row, address: fetchedRow?.address } as TWorkplace);
            }
        },
        [onUpdate, workplaces]
    );

    const onDelete = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError("");

            await sendApiRequest(`/work-place/${id}`, HTTPMethodTypes.DELETE);
            setWorkplaces(prev => prev?.filter(w => w._id !== id) || []);
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

    const columns = useMemo(
        () => workplaceCols(
            onCellUpdate,
            (params: TDataGridInputCellParams) => {
                setSelectedWorkplace(workplaces?.find(workplace => workplace._id === params.id) ?? null);
                setIsUpdateDialogOpen(true);
            }
            , (params: TDataGridInputCellParams) => {
                onDelete(params.id as string);
            }
        ), [onCellUpdate, onDelete, workplaces]
    );

    const rows = useMemo(() => workplaceRows(workplaces || []), [workplaces]);

    const filteredRows = rows.filter((row) =>
        JSON.stringify(row).toLowerCase().includes(search.toLowerCase())
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
        isUpdateDialogOpen,
        setIsUpdateDialogOpen,
        selectedWorkplace,
        setSelectedWorkplace,
        onUpdate,
        setSearch,
        filteredRows,
    }
}

export default useWorkplaces;