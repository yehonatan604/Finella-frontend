import { createDataGridInputCell } from "../components/generators/createDataGridInputCell";
import { createRowIcons } from "../components/generators/createRowIcons";
import { TDataGridInputCellParams } from "../types/TDataGridInputCellParams";
import { TSalary } from "../types/TSalary";
import { TWorkplace } from "../types/TWorkplace";

export const salaryCols = (
  workplaces: TWorkplace[],
  onCellUpdate: (
    row: TSalary & {
      id: string | undefined;
      workplace: string | undefined;
      year: number | undefined;
      month: number | undefined;
      "total hours": number | undefined;
      "total sum": number | undefined;
    }
  ) => void,
  editFunc: (params: TDataGridInputCellParams) => void,
  deleteFunc: (params: TDataGridInputCellParams) => void,
  undeleteFunc?: (params: TDataGridInputCellParams) => void
) => [
  {
    field: "workplace",
    headerName: "Workplace",
    flex: 1,
    headerClassName: "super-app-theme--header",
    sortable: true,
    sortComparator: (
      v1: string,
      v2: string,
      param1: { id: string },
      param2: { id: string }
    ) => {
      if (param1.id === "total" || param2.id === "total") return;
      return v1.localeCompare(v2);
    },
    editable: true,
    renderCell: (params: TDataGridInputCellParams) => {
      if (params.row.id === "total") return params.value;
      return createDataGridInputCell(params, onCellUpdate, "workplace", "select", [
        ...(workplaces ?? []).map((workplace) => workplace.name),
      ]);
    },
  },
  {
    field: "year",
    headerName: "Year",
    flex: 0.5,
    headerClassName: "super-app-theme--header",
    sortable: true,
    sortComparator: (v1: number, v2: number) => v1 - v2,
    editable: true,
    renderCell: (params: TDataGridInputCellParams) => {
      if (params.row.id === "total") return params.value;
      return createDataGridInputCell(params, onCellUpdate, "year", "number");
    },
  },
  {
    field: "month",
    headerName: "Month",
    flex: 0.5,
    headerClassName: "super-app-theme--header",
    sortable: true,
    sortComparator: (v1: number, v2: number) => v1 - v2,
    editable: true,
    renderCell: (params: TDataGridInputCellParams) => {
      if (params.row.id === "total") return params.value;
      return createDataGridInputCell(params, onCellUpdate, "month", "number");
    },
  },
  {
    field: "total hours",
    headerName: "Total Hours",
    flex: 0.5,
    headerClassName: "super-app-theme--header",
    sortable: true,
    sortComparator: (
      v1: number,
      v2: number,
      param1: { id: string },
      param2: { id: string }
    ) => {
      if (param1.id === "total" || param2.id === "total") return;
      return v1 - v2;
    },
    editable: false,
    renderCell: (params: TDataGridInputCellParams) => {
      if (params.row.status === "inactive") return <s>{params.value} </s>;
      else return params.value;
    },
  },
  {
    field: "total sum",
    headerName: "Total Sum",
    flex: 0.5,
    headerClassName: "super-app-theme--header",
    sortable: true,
    sortComparator: (
      v1: number,
      v2: number,
      param1: { id: string },
      param2: { id: string }
    ) => {
      if (param1.id === "total" || param2.id === "total") return;
      return v1 - v2;
    },
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
      if (params.row.id === "total") return;
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
