import { createDataGridInputCell } from "../../Common/components/generators/createDataGridInputCell";
import { createRowIcons } from "../../Common/components/generators/createRowIcons";
import { TDataGridInputCellParams } from "../../Records/types/TDataGridInputCellParams";
import { TNote } from "../types/TNote";

export const noteCols = (
  onCellUpdate: (
    row: TNote & {
      id: string | undefined;
    }
  ) => void,
  editFunc: (params: TDataGridInputCellParams) => void,
  deleteFunc: (params: TDataGridInputCellParams) => void,
  undeleteFunc?: (params: TDataGridInputCellParams) => void
) => [
  {
    field: "name",
    headerName: "Name",
    flex: 0.5,
    headerClassName: "super-app-theme--header",
    sortable: true,
    editable: true,
    renderCell: (params: TDataGridInputCellParams) => {
      return createDataGridInputCell(params, onCellUpdate, "name");
    },
  },
  {
    field: "content",
    headerName: "Content",
    flex: 0.8,
    headerClassName: "super-app-theme--header",
    sortable: true,
    editable: true,
    renderCell: (params: TDataGridInputCellParams) => {
      return createDataGridInputCell(params, onCellUpdate, "content");
    },
  },
  {
    field: "date",
    headerName: "Date",
    flex: 0.5,
    headerClassName: "super-app-theme--header",
    sortable: true,
    editable: true,
    renderCell: (params: TDataGridInputCellParams) => {
      return createDataGridInputCell(params, onCellUpdate, "date", "date");
    },
  },
  {
    field: "noteStatus",
    headerName: "Status",
    flex: 0.4,
    headerClassName: "super-app-theme--header",
    sortable: true,
    editable: true,
    renderCell: (params: TDataGridInputCellParams) => {
      return createDataGridInputCell(params, onCellUpdate, "noteStatus", "select", [
        "PENDING",
        "READ",
      ]);
    },
  },
  {
    field: "isSticky",
    headerName: "Is Sticky",
    flex: 0.2,
    headerClassName: "super-app-theme--header",
    sortable: true,
    editable: true,
    renderCell: (params: TDataGridInputCellParams) => {
      return createDataGridInputCell(params, onCellUpdate, "isSticky", "checkbox");
    },
  },
  {
    field: "options",
    headerName: "Options",
    flex: 0.2,
    headerClassName: "super-app-theme--header",
    sortable: false,
    editable: false,
    renderCell: (params: TDataGridInputCellParams) => {
      return createRowIcons(
        () => editFunc(params),
        () => deleteFunc(params),
        params.row.status === "inactive" && undeleteFunc
          ? () => undeleteFunc(params)
          : undefined
      );
    },
  },
];
