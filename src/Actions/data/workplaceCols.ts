import { createDataGridInputCell } from "../components/generators/createDataGridInputCell";
import { createRowIcons } from "../components/generators/createRowIcons";
import { TDataGridInputCellParams } from "../types/TDataGridInputCellParams";
import { TWorkplace } from "../types/TWorkplace";

export const workplaceCols = (
    onCellUpdate: (row: TWorkplace & {
        id: string | undefined;
    }) => void,
    editFunc: (params: TDataGridInputCellParams) => void,
    deleteFunc: (params: TDataGridInputCellParams) => void
) => [
        {
            field: "name",
            headerName: "Name",
            flex: .8,
            headerClassName: "super-app-theme--header",
            sortable: true,
            editable: true,
            renderCell: (params: TDataGridInputCellParams) => {
                return createDataGridInputCell(params, onCellUpdate, "name");
            },
        },
        {
            field: "main phone",
            headerName: "Main Phone",
            flex: .5,
            headerClassName: "super-app-theme--header",
            sortable: true,
            editable: true,
            renderCell: (params: TDataGridInputCellParams) => {
                return createDataGridInputCell(params, onCellUpdate, "main phone");
            },
        },
        {
            field: "email",
            headerName: "Email",
            flex: .5,
            headerClassName: "super-app-theme--header",
            sortable: true,
            editable: true,
            renderCell: (params: TDataGridInputCellParams) => {
                return createDataGridInputCell(params, onCellUpdate, "email");
            },
        },
        {
            field: "address",
            headerName: "Address",
            flex: 1,
            headerClassName: "super-app-theme--header",
            sortable: true,
            editable: false,
        },
        {
            field: "pricePerHour",
            headerName: "Price per Hour",
            flex: .5,
            headerClassName: "super-app-theme--header",
            sortable: true,
            editable: true,
            renderCell: (params: TDataGridInputCellParams) => {
                return createDataGridInputCell(params, onCellUpdate, "pricePerHour", "number");
            },
        },
        {
            field: "pricePerMonth",
            headerName: "Price per Month",
            flex: .5,
            headerClassName: "super-app-theme--header",
            sortable: true,
            editable: true,
            renderCell: (params: TDataGridInputCellParams) => {
                return createDataGridInputCell(params, onCellUpdate, "pricePerMonth", "number");
            },
        },
        {
            field: "options",
            headerName: "Options",
            flex: .4,
            headerClassName: "super-app-theme--header",
            sortable: false,
            editable: false,
            renderCell: (params: TDataGridInputCellParams) => {
                return createRowIcons(() => editFunc(params), () => deleteFunc(params));
            }
        }
    ];
