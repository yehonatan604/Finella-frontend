import React from "react";
import { createDataGridInputCell } from "../../Common/components/generators/createDataGridInputCell";
import { createRowIcons } from "../../Common/components/generators/createRowIcons";
import { TWorkplace } from "../types/TWorkplace";
import { TDataGridInputCellParams } from "../../Common/types/TDataGridInputCellParams";
import { Tooltip } from "@mui/material";

export const workplaceCols = (
  onCellUpdate: (
    row: TWorkplace & {
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
    flex: 0.8,
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
    flex: 0.5,
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
    flex: 0.5,
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
    renderCell: (params: TDataGridInputCellParams) => {
      if (params.row.status === "inactive") return <s>{params.value} </s>;
      else
        return (
          <Tooltip title="This is the Full Adress, Edit the Workplace to change it">
            <span>{params.value}</span>
          </Tooltip>
        );
    },
  },
  {
    field: "pricePerHour",
    headerName: "Price per Hour",
    flex: 0.5,
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
    flex: 0.5,
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
