import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Page from "../../UI/components/Page";
import SalariesPdfDoc from "../components/SalariesPdfDoc";
import ActionFilters from "../components/ActionFilters";
import ActionButtons from "../components/ActionButtons";
import useToDo from "../hooks/useToDo";
import ToDoDetailsDialog from "../dialogs/ToDoDetailsDialog";
import { useState } from "react";
import { TToDo } from "../types/TToDo";

const ToDoPage = () => {
  const {
    columns,
    rows,
    fetchedToDos,
    setFromYear,
    setToYear,
    setMonths,
    setPickedStatus,
    onUpdate,
    processRowOnCellUpdate: normalizeRowOnCellUpdate,
  } = useToDo(true);

  const [isToDoDetailsDialogOpen, setIsToDoDetailsDialogOpen] = useState(false);
  const [selectedToDo, setSelectedToDo] = useState<TToDo | null>(null);

  return (
    <>
      <Page title="To Do's">
        <ActionFilters
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
            rows={rows}
            columns={columns as GridColDef[]}
            sx={{ width: "60vw" }}
            getRowClassName={(params) =>
              params.id === "total"
                ? "total"
                : params.indexRelativeToCurrentPage % 2 === 0
                ? "even"
                : "odd"
            }
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            onRowDoubleClick={(params) => {
              setSelectedToDo(
                fetchedToDos?.find((toDo) => toDo._id === params.id) ?? null
              );
              setIsToDoDetailsDialogOpen(true);
            }}
            processRowUpdate={(row) => {
              normalizeRowOnCellUpdate(row);
              return row;
            }}
          />
        </Box>
      </Page>

      <ActionButtons
        actionName="To Do"
        fileName="ToDo"
        rows={rows}
        addUrl="/actions/add-todo"
        Doc={SalariesPdfDoc}
      />

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
