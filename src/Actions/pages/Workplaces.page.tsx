import { GridColDef } from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";
import Page from "../../Common/components/Page";
import useWorkplaces from "../hooks/useWorkplace";
import WorkplacesPdfDoc from "../components/WorkplacesPdfDoc";
import ActionButtons from "../components/ActionButtons";
import PlusButton from "../components/PlusButton";
import ActionFilters from "../components/ActionFilters";
import ShowInactiveCheckbox from "../components/ShowInactiveCheckbox";
import WorkplaceDetailsDialog from "../components/dialogs/detailsDialogs/WorkPlaceDetailsDialog";
import StyledDataGrid from "../../Common/components/styled/StyledDataGrid";
import useTheme from "../../Common/hooks/useTheme";

const WorkplacesPage = () => {
  const {
    columns,
    rows,
    isUpdateDialogOpen,
    setIsUpdateDialogOpen,
    selectedWorkplace,
    setSelectedWorkplace,
    onUpdate,
    setSearch,
    filteredRows,
    showInactive,
    setShowInactive,
  } = useWorkplaces();

  const { mode } = useTheme();

  return (
    <>
      <Page title="Workplaces">
        <ActionFilters setSearch={setSearch} />

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
            padding: "1.5rem",
            "& .super-app-theme--header": {
              backgroundColor: mode === "light" ? "primary.main" : "ffffff",
              color: "#fff",
              fontWeight: "bold",
            },
          }}
        >
          <StyledDataGrid
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

      {isUpdateDialogOpen && selectedWorkplace && (
        <WorkplaceDetailsDialog
          isOpen={isUpdateDialogOpen}
          onClose={() => setIsUpdateDialogOpen(false)}
          workplace={selectedWorkplace}
          onSubmit={(data) => {
            onUpdate(data);
            setSelectedWorkplace(null);
          }}
        />
      )}

      <PlusButton addUrl="/actions/add-workplace" />
    </>
  );
};

export default WorkplacesPage;
