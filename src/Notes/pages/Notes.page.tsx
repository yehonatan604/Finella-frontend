import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";
import Page from "../../Common/components/Page";
import ActionButtons from "../../Actions/components/ActionButtons";
import ActionFilters from "../../Actions/components/ActionFilters";
import PlusButton from "../../Actions/components/PlusButton";
import ShowInactiveCheckbox from "../../Actions/components/ShowInactiveCheckbox";
import WorkplacesPdfDoc from "../../Actions/components/WorkplacesPdfDoc";
import NoteDetailsDialog from "../components/NoteDetailsDialog";
import useNote from "../hooks/useNote";
import AddFormDialog from "../../Common/components/AddFormDialog";
import AddNoteForm from "../forms/AddNote.form";

const NotesPage = () => {
  const {
    columns,
    rows,
    isUpdateDialogOpen,
    setIsUpdateDialogOpen,
    selectedNote,
    setSelectedNote,
    onUpdate,
    setSearch,
    filteredRows,
    showInactive,
    setShowInactive,
    setMonths,
    setFromYear,
    setToYear,
    isAddDialogOpen,
    setIsAddDialogOpen,
  } = useNote(true);

  return (
    <>
      <Page title="Notes">
        <ActionFilters
          setSearch={setSearch}
          setMonths={setMonths}
          setFromYear={setFromYear}
          setToYear={setToYear}
        />

        <ShowInactiveCheckbox
          showInactive={showInactive}
          setShowInactive={setShowInactive}
          label="Show Inactive Notes"
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
                    (row: { status: string | undefined }) => row.status !== "inactive"
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

      <ActionButtons fileName="workplaces" rows={rows} Doc={WorkplacesPdfDoc} />
      <PlusButton onClick={() => setIsAddDialogOpen(true)} />

      {selectedNote && (
        <NoteDetailsDialog
          isOpen={isUpdateDialogOpen}
          onClose={() => setIsUpdateDialogOpen(false)}
          note={selectedNote}
          onSubmit={(data) => {
            onUpdate(data);
            setSelectedNote(null);
          }}
        />
      )}

      <AddFormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Add a Note"
        formComponent={<AddNoteForm setIsDialogOpen={setIsAddDialogOpen} />}
      />
    </>
  );
};

export default NotesPage;
