import { createDataGridInputCell } from "../../Common/components/generators/createDataGridInputCell";
import { createRowIcons } from "../../Common/components/generators/createRowIcons";
import { TDataGridInputCellParams } from "../types/TDataGridInputCellParams";
import { TToDo } from "../types/TToDo";

export const todoCols = (
  onCellUpdate: (
    row: TToDo & {
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
    flex: 1,
    headerClassName: "super-app-theme--header",
    editable: true,
    renderCell: (params: TDataGridInputCellParams) => {
      return createDataGridInputCell(params, onCellUpdate, "name");
    },
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
    headerClassName: "super-app-theme--header",
    editable: true,
    renderCell: (params: TDataGridInputCellParams) => {
      return createDataGridInputCell(params, onCellUpdate, "description");
    },
  },
  {
    field: "startDate",
    headerName: "Start Date",
    flex: 0.5,
    headerClassName: "super-app-theme--header",
    editable: true,
    renderCell: (params: TDataGridInputCellParams) => {
      return createDataGridInputCell(params, onCellUpdate, "startDate", "date");
    },
  },
  {
    field: "endDate",
    headerName: "End Date",
    flex: 0.5,
    headerClassName: "super-app-theme--header",
    editable: true,
    renderCell: (params: TDataGridInputCellParams) => {
      return createDataGridInputCell(params, onCellUpdate, "endDate", "date");
    },
  },
  {
    field: "toDoStatus",
    headerName: "Status",
    flex: 0.5,
    headerClassName: "super-app-theme--header",
    editable: true,
    renderCell: (params: TDataGridInputCellParams) => {
      return createDataGridInputCell(params, onCellUpdate, "toDoStatus", "select", [
        "PENDING",
        "COMPLETED",
      ]);
    },
  },
  {
    field: "tasks",
    headerName: "Tasks",
    flex: 0.3,
    headerClassName: "super-app-theme--header",
    editable: false,
    renderCell: (params: TDataGridInputCellParams) => {
      if (params.row.status === "inactive") return <s>{params.value}</s>;
      else return params.value;
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
