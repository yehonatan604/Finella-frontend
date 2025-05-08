import { createDataGridInputCell } from "../../Common/components/generators/createDataGridInputCell";
import { createRowIcons } from "../../Common/components/generators/createRowIcons";
import { TBalanceEntry } from "../types/TBalanceEntry";
import { TDataGridInputCellParams } from "../../Common/types/TDataGridInputCellParams";

export const balanceEntryCols = (
    onCellUpdate: (row: TBalanceEntry & {
        id: string | undefined;
    }) => void,
    editFunc: (params: TDataGridInputCellParams) => void,
    deleteFunc: (params: TDataGridInputCellParams) => void,
    undeleteFunc?: (params: TDataGridInputCellParams) => void,
) => {

    return [
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            headerClassName: "super-app-theme--header",
            sortable: true,
            sortComparator: (v1: string, v2: string, param1: { id: string; }, param2: { id: string; }) => {
                if (param1.id === "total" || param2.id === "total") return;
                return v1.localeCompare(v2);
            },
            editable: true,
            renderCell: (params: TDataGridInputCellParams) => {
                if (params.row.id === "total") return params.value;
                return createDataGridInputCell(params, onCellUpdate, "name");
            },
        },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
            headerClassName: "super-app-theme--header",
            sortable: true,
            sortComparator: (v1: string, v2: string, param1: { id: string; }, param2: { id: string; }) => {
                if (param1.id === "total" || param2.id === "total") return;
                return v1.localeCompare(v2);
            },
            editable: true,
            renderCell: (params: TDataGridInputCellParams) => {
                if (params.row.id === "total") return params.value;
                return createDataGridInputCell(params, onCellUpdate, "date", "date");
            },
        },
        {
            field: "type",
            headerName: "Type",
            flex: 1,
            headerClassName: "super-app-theme--header",
            sortable: true,
            sortComparator: (v1: string, v2: string, param1: { id: string; }, param2: { id: string; }) => {
                if (param1.id === "total" || param2.id === "total") return;
                return v1.localeCompare(v2);
            },
            editable: true,
            renderCell: (params: TDataGridInputCellParams) => {
                if (params.row.id === "total") return params.value;
                return createDataGridInputCell(params, onCellUpdate, "type", "select", ["income", "expense"]);
            },
        },
        {
            field: "price",
            headerName: "Price",
            flex: .5,
            headerClassName: "super-app-theme--header",
            sortable: true,
            sortComparator: (v1: number, v2: number, param1: { id: string; }, param2: { id: string; }) => {
                if (param1.id === "total" || param2.id === "total") return;
                return v1 - v2;
            },
            editable: true,
            renderCell: (params: TDataGridInputCellParams) => {
                if (params.row.id === "total") return params.value;
                return createDataGridInputCell(params, onCellUpdate, "price", "number");
            },
        },
        {
            field: "options",
            headerName: "Options",
            flex: 0.4,
            headerClassName: "super-app-theme--header",
            sortable: false,
            editable: false,
            renderCell: (params: TDataGridInputCellParams) => {
                if (params.row.id === "total") return;
                return createRowIcons(
                    () => editFunc(params),
                    () => deleteFunc(params),
                    params.row.status === "inactive" && undeleteFunc ? () => undeleteFunc(params) : undefined
                );
            },
        }
    ];
}
