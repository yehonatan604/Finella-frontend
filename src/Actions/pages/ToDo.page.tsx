import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Page from "../../Common/components/Page";
import SalariesPdfDoc from "../components/SalariesPdfDoc";
import ActionFilters from "../components/ActionFilters";
import ActionButtons from "../components/ActionButtons";
import useToDo from "../hooks/useToDo";
import PlusButton from "../components/PlusButton";
import ShowInactiveCheckbox from "../components/ShowInactiveCheckbox";
import ToDoDetailsDialog from "../components/dialogs/detailsDialogs/ToDoDetailsDialog";
import { useState } from "react";
import ToDosChartsDialogDialog from "../components/dialogs/chratDialogs/ToDosChartsDialog";

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
  } = useToDo(true);

  const [isChartsDialogOpen, setIsChartsDialogOpen] = useState(false);

  return (
    <>
      <Page title="To Do's">
        <ActionFilters
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
            padding: "1.5rem",
            "& .super-app-theme--header": {
              backgroundColor: "primary.main",
              color: "#fff",
              fontWeight: "bold",
            },
          }}
        >
          <DataGrid
            rows={filteredRows}
            rowCount={
              !showInactive
                ? filteredRows.filter(
                    (row) => (row as { status: string }).status !== "inactive"
                  ).length
                : filteredRows.length
            }
            paginationMode="server"
            columns={columns as GridColDef[]}
            sx={{
              width: "60vw",
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
              "& .MuiDataGrid-cell--editing": {
                boxShadow: "none",
                outline: "none",
              },
            }}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
            onCellEditStart={(_, event) => {
              event.defaultMuiPrevented = true;
            }}
            isRowSelectable={() => false}
          />
        </Box>
      </Page>

      <ActionButtons
        fileName="ToDo"
        rows={rows}
        Doc={SalariesPdfDoc}
        openCharts={() => setIsChartsDialogOpen(true)}
      />

      <PlusButton addUrl="/actions/add-todo" />

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
    </>
  );
};

export default ToDoPage;
