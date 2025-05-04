import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";
import Page from "../../Common/components/layout/Page";
import PageButtons from "../../Common/components/layout/PageButtons";
import PageFilters from "../../Common/components/layout/PageFilters";
import PlusButton from "../../Common/components/layout/PlusButton";
import ShowInactiveCheckbox from "../../Common/components/ShowInactiveCheckbox";
import useNote from "../hooks/useNote";
import FormDialog from "../../Common/components/dialogs/FormDialog";
import NoteForm from "../forms/Note.form";
import useTheme from "../../Common/hooks/useTheme";
import StyledDataGrid from "../../Common/components/styled/StyledDataGrid";
import { pageSizeOptions } from "../../Common/helpers/paginationHelpers";
import { TDataGridRow } from "../../Common/types/TDataGridRow";
import WorkplacesPdfDoc from "../../Records/components/pdfDocs/WorkplacesPdfDoc";

const NotesPage = () => {
  const { mode } = useTheme();
  const {
    columns,
    rows,
    isUpdateDialogOpen,
    setIsUpdateDialogOpen,
    selectedNote,
    setSearch,
    filteredRows,
    showInactive,
    setShowInactive,
    setMonths,
    setFromYear,
    setToYear,
    isAddDialogOpen,
    setIsAddDialogOpen,
    loading,
    paginatedRows,
    paginationModel,
    setPaginationModel,
  } = useNote(true);

  return (
    <>
      <Page title="Notes">
        <PageFilters
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
            overflow: "auto",
          }}
        >
          <Box
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
        </Box>
      </Page>

      <PageButtons fileName="workplaces" rows={rows} Doc={WorkplacesPdfDoc} />
      <PlusButton onClick={() => setIsAddDialogOpen(true)} />

      <FormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Add a Note"
        formComponent={<NoteForm setIsDialogOpen={setIsAddDialogOpen} />}
      />

      <FormDialog
        open={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        title="Edit a Note"
        formComponent={
          <NoteForm setIsUpdateDialogOpen={setIsUpdateDialogOpen} note={selectedNote} />
        }
      />
    </>
  );
};

export default NotesPage;
