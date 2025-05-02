import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import Page from "../../Common/components/layout/Page";
import PageFilters from "../../Common/components/layout/PageFilters";
import PageButtons from "../../Common/components/layout/PageButtons";
import useToDo from "../hooks/useToDo";
import PlusButton from "../../Common/components/layout/PlusButton";
import ShowInactiveCheckbox from "../../Common/components/ShowInactiveCheckbox";
import ToDoDetailsDialog from "../components/ToDoDetailsDialog";
import StyledDataGrid from "../../Common/components/styled/StyledDataGrid";
import useTheme from "../../Common/hooks/useTheme";
import { pageSizeOptions } from "../../Common/helpers/paginationHelpers";
import { TDataGridRow } from "../../Common/types/TDataGridRow";
import ToDosChartsDialogDialog from "../../Records/components/dialogs/chratDialogs/ToDosChartsDialog";
import SalariesPdfDoc from "../../Records/components/SalariesPdfDoc";
import FormDialog from "../../Common/components/dialogs/FormDialog";
import AddToDo from "../forms/AddToDo";

const ToDoPage = () => {
  const {
    columns,
    rows,
    setFromYear,
    setToYear,
    setMonths,
    setPickedStatus,
    onUpdate,
    isToDoDetailsDialogOpen,
    setIsToDoDetailsDialogOpen,
    setSelectedToDo,
    selectedToDo,
    setSearch,
    filteredRows,
    showInactive,
    setShowInactive,
    loading,
    paginatedRows,
    paginationModel,
    setPaginationModel,
  } = useToDo(true);

  const [isChartsDialogOpen, setIsChartsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { mode } = useTheme();

  return (
    <>
      <Page title="To Do's">
        <PageFilters
          setSearch={setSearch}
          setFromYear={setFromYear}
          setToYear={setToYear}
          setMonths={setMonths}
          setPickedStatus={setPickedStatus}
          statusTypes={["PENDING", "COMPLETED", "CANCELLED", "FAILED"]}
        />

        <ShowInactiveCheckbox
          showInactive={showInactive}
          setShowInactive={setShowInactive}
          label="Show Inactive Entries"
        />

        <Box
          component={Paper}
          sx={{
            display: "flex",
            flexDirection: "column",
            "& .super-app-theme--header": {
              backgroundColor: mode === "light" ? "primary.main" : "ffffff",
              color: "#fff",
              fontWeight: "bold",
            },
          }}
        >
          <StyledDataGrid
            rows={paginatedRows as TDataGridRow[]}
            rowCount={
              !showInactive
                ? filteredRows.filter(
                    (row: { status: string | undefined }) => row.status !== "inactive"
                  ).length
                : filteredRows.length
            }
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            columns={columns as GridColDef[]}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            loading={loading}
            pageSizeOptions={pageSizeOptions}
            disableRowSelectionOnClick
            onCellEditStart={(_, event) => {
              event.defaultMuiPrevented = true;
            }}
            isRowSelectable={() => false}
          />
        </Box>
      </Page>

      <PageButtons
        fileName="ToDo"
        rows={rows}
        Doc={SalariesPdfDoc}
        openCharts={() => setIsChartsDialogOpen(true)}
      />
      <PlusButton onClick={() => setIsAddDialogOpen(true)} />

      {isToDoDetailsDialogOpen && selectedToDo && (
        <ToDoDetailsDialog
          isOpen={isToDoDetailsDialogOpen}
          onClose={() => setIsToDoDetailsDialogOpen(false)}
          toDo={selectedToDo}
          onSubmit={(data) => {
            onUpdate(data);
            setSelectedToDo(null);
          }}
        />
      )}

      {isChartsDialogOpen && (
        <ToDosChartsDialogDialog
          open={isChartsDialogOpen}
          onClose={() => setIsChartsDialogOpen(false)}
          data={filteredRows}
        />
      )}

      <FormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Add a ToDo"
        formComponent={<AddToDo setIsDialogOpen={setIsAddDialogOpen} />}
      />
    </>
  );
};

export default ToDoPage;
