import { useCallback, useEffect, useMemo, useState } from "react";
import { TWorkplace } from "../types/TWorkplace";
import { HTTPMethodTypes } from "../../Common/types/HTTPMethodTypes";
import { sendApiRequest } from "../../Common/helpers/sendApiRequest";
import { TDataGridInputCellParams } from "../types/TDataGridInputCellParams";
import { toastify } from "../../Common/utilities/toast";
import { workplaceCols } from "../data/workplaceCols";
import { workplaceRows } from "../data/workplaceRows";
import { TWorkplaceWithFormPhone } from "../types/TWorkplaceWithFormPhone";
import { question } from "../../Common/utilities/question";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../../Core/store/store";
import { entitiesActions } from "../../Core/store/entitiesSlice";
import { defaultPageSize, paginatedRows } from "../../Common/helpers/paginationHelpers";
import useAuth from "../../Auth/hooks/useAuth";

const useWorkplaces = () => {
    const { user } = useAuth();
    const workplaces = useSelector((state: TRootState) => state.entitiesSlice.workplaces);
    const loading = useSelector((state: TRootState) => state.entitiesSlice.loading);
    const dispatch = useDispatch();

    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [selectedWorkplace, setSelectedWorkplace] = useState<TWorkplace | null>(null);
    const [search, setSearch] = useState<string>("");
    const [showInactive, setShowInactive] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: defaultPageSize,
    });

    const getAllWorkplaces = useCallback(async () => {
        try {
            dispatch(entitiesActions.setLoading(true));
            const res = await sendApiRequest("/work-place", HTTPMethodTypes.GET);
            dispatch(entitiesActions.setEntity({ type: "workplaces", data: res.data }));
        } catch (e) {
            console.log(e);
            toastify.error("Error fetching workplaces");
        }
    }, [dispatch]);

    const add = useCallback(async (workplace: TWorkplace) => {
        try {
            dispatch(entitiesActions.setLoading(true));
            const res = await sendApiRequest("/work-place", HTTPMethodTypes.POST, workplace);
            dispatch(entitiesActions.addEntityItem({ type: "workplaces", item: res.data }));
            toastify.success("Workplace added successfully");
        } catch (e) {
            console.log(e);
            toastify.error("Error adding workplace");
        }
    }, [dispatch]);

    const onUpdate = useCallback(async (workplace: TWorkplace) => {
        try {
            dispatch(entitiesActions.setLoading(true));

            console.log("workplace", workplace);


            const finalWorlpace = {
                userId: user?._id,
                _id: workplace._id ? workplace._id : (workplace as TWorkplace & { id: string })["id"],
                name: workplace.name,
                address: workplace.address,
                pricePerHour: workplace.pricePerHour,
                pricePerMonth: workplace.pricePerMonth,
                startDate: workplace.startDate,
                endDate: workplace.endDate,
                phone: {
                    main: workplace.phone
                        ? workplace.phone.main
                            ? workplace.phone.main
                            : (workplace as TWorkplaceWithFormPhone).phone["main phone"]
                        : (workplace as TWorkplace & { "main phone": string })["main phone"],
                    secondary: workplace.phone
                        ? workplace.phone.secondary
                            ? workplace.phone.secondary
                            : (workplace as TWorkplaceWithFormPhone).phone["secondary phone"]
                        : (workplace as TWorkplace & { "secondary phone": string })["secondary phone"],
                },
                email: workplace.email,
                withVat: workplace.withVat,
            }

            const res = await sendApiRequest(`/work-place`, HTTPMethodTypes.PUT, finalWorlpace);
            dispatch(entitiesActions.updateEntityItem({ type: "workplaces", item: res.data, id: finalWorlpace._id }));
            setSelectedWorkplace(null);
            toastify.success("Workplace updated successfully");
        }
        catch (e) {
            console.log(e);
            toastify.error("Error updating workplace");
        } finally {
            dispatch(entitiesActions.setLoading(false));
        }
    }, [dispatch, user?._id]);

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

    const onUndelete = useCallback(
        async (id: string) => {
            try {
                await question(
                    "Undelete WorkPlace",
                    "Are you sure you want to undelete this WorkPlace?",
                    "warning",
                    async () => {
                        dispatch(entitiesActions.setLoading(true));
                        await sendApiRequest(`/work-place/undelete/${id}`, HTTPMethodTypes.PATCH);
                        dispatch(entitiesActions.undeleteEntityItem({ type: "workplaces", id }));
                        toastify.success("WorkPlace undeleted successfully");
                    }
                );
            } catch (error) {
                console.log(error);
                toastify.error("Error undeleting WorkPlace");
            }
        },
        [dispatch]
    );

    const onDelete = useCallback(
        async (id: string) => {
            try {
                await question(
                    "Delete WorkPlace",
                    "Are you sure you want to delete this WorkPlace?",
                    "warning",
                    async () => {
                        dispatch(entitiesActions.setLoading(true));
                        await sendApiRequest(`/work-place/${id}`, HTTPMethodTypes.DELETE);
                        dispatch(entitiesActions.removeEntityItem({ type: "workplaces", id }));
                        toastify.success("WorkPlace deleted successfully");
                    }
                );
            } catch (error) {
                console.log(error);
                toastify.error("Error deleting WorkPlace");
            }
        },
        [dispatch]
    );

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
            , (params: TDataGridInputCellParams) => {
                onUndelete(params.id as string);
            }

        ), [onCellUpdate, onDelete, onUndelete, workplaces]
    );

    const rows = useMemo(() => workplaceRows(workplaces || []), [workplaces]);

    const filteredRows = rows.filter((row) =>
        JSON.stringify(row).toLowerCase().includes(search.toLowerCase()) &&
        (showInactive || (row as { status: string }).status !== "inactive")
    );

    useEffect(() => {
        if (!workplaces) {
            getAllWorkplaces();
        }
    }, [getAllWorkplaces, workplaces]);

    return {
        workplaces,
        columns,
        rows,
        getAllWorkplaces,
        add,
        loading,
        isUpdateDialogOpen,
        setIsUpdateDialogOpen,
        selectedWorkplace,
        setSelectedWorkplace,
        onUpdate,
        setSearch,
        filteredRows,
        setShowInactive,
        showInactive,
        paginationModel,
        setPaginationModel,
        paginatedRows: paginatedRows(paginationModel, filteredRows),
        user
    }
}

export default useWorkplaces;