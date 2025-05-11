import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";
import Page from "../../Common/components/layout/Page";
import useWorkplaces from "../hooks/useWorkplace";
import WorkplacesPdfDoc from "../components/WorkplacesPdfDoc";
import PageButtons from "../../Common/components/layout/PageButtons";
import PlusButton from "../../Common/components/layout/PlusButton";
import PageFilters from "../../Common/components/layout/PageFilters";
import ShowInactiveCheckbox from "../../Common/components/ShowInactiveCheckbox";
import StyledDataGrid from "../../Common/components/styled/StyledDataGrid";
import useTheme from "../../Common/hooks/useTheme";
import { pageSizeOptions } from "../../Common/helpers/paginationHelpers";
import { TDataGridRow } from "../../Common/types/TDataGridRow";
import FormDialog from "../../Common/components/dialogs/FormDialog";
import WorkplaceForm from "../forms/WorkplaceForm";

const WorkplacesPage = () => {
  const {
    columns,
    rows,
    isUpdateDialogOpen,
    setIsUpdateDialogOpen,
    selectedWorkplace,
    setSelectedWorkplace,
    setSearch,
    filteredRows,
    showInactive,
    setShowInactive,
    loading,
    paginatedRows,
    paginationModel,
    setPaginationModel,
  } = useWorkplaces();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { mode } = useTheme();

  return (
    <>
      <Page title="Workplaces">
        <PageFilters setSearch={setSearch} />

        <ShowInactiveCheckbox
          showInactive={showInactive}
          setShowInactive={setShowInactive}
          label="Show Inactive Workplaces"
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

      {paginatedRows.length > 0 && (
        <PageButtons fileName="workplaces" rows={rows} Doc={WorkplacesPdfDoc} />
      )}
      <PlusButton onClick={() => setIsAddDialogOpen(true)} />

      <FormDialog
        open={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
        }}
        title="Add a Workplace"
        formComponent={<WorkplaceForm setIsDialogOpen={setIsAddDialogOpen} />}
      />

      <FormDialog
        open={isUpdateDialogOpen}
        onClose={() => {
          setSelectedWorkplace(null);
          setIsUpdateDialogOpen(false);
        }}
        title="Edit Workplace"
        formComponent={
          <WorkplaceForm
            setIsDialogOpen={setIsUpdateDialogOpen}
            workplace={selectedWorkplace}
          />
        }
      />
    </>
  );
};

export default WorkplacesPage;
