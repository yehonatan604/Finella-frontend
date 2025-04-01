import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Page from "../../UI/components/Page";
import SalariesPdfDoc from "../components/SalariesPdfDoc";
import ActionFilters from "../components/ActionFilters";
import ActionButtons from "../components/ActionButtons";
import useToDo from "../hooks/useToDo";
import PlusButton from "../components/PlusButton";
import ToDoDetailsDialog from "../components/dialogs/ToDoDetailsDialog";

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
  } = useToDo(true);

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
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            onCellEditStart={(_, event) => {
              event.defaultMuiPrevented = true;
            }}
            isRowSelectable={() => false}
          />
        </Box>
      </Page>

      <ActionButtons fileName="ToDo" rows={rows} Doc={SalariesPdfDoc} />

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
    </>
  );
};

export default ToDoPage;
