import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";
import Page from "../../UI/components/Page";
import WorkplacesPdfDoc from "../components/WorkplacesPdfDoc";
import ActionButtons from "../components/ActionButtons";
import PlusButton from "../components/PlusButton";
import ActionFilters from "../components/ActionFilters";
import ShowInactiveCheckbox from "../components/ShowInactiveCheckbox";
import useNote from "../hooks/useNote";
import NoteDetailsDialog from "../components/dialogs/detailsDialogs/NoteDetailsDialog";

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
      <ActionButtons fileName="workplaces" rows={rows} Doc={WorkplacesPdfDoc} />

      {isUpdateDialogOpen && selectedNote && (
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

      <PlusButton addUrl="/actions/add-note" />
    </>
  );
};

export default NotesPage;
