import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";
import Page from "../../UI/components/Page";
import useWorkplaces from "../hooks/useWorkplace";
import WorkplacesPdfDoc from "../components/WorkplacesPdfDoc";
import ActionButtons from "../components/ActionButtons";
import AddButton from "../components/AddButton";
import WorkplaceDetailsDialog from "../components/dialogs/WorkPlaceDetailsDialog";

const WorkplacesPage = () => {
  const {
    columns,
    rows,
    isUpdateDialogOpen,
    setIsUpdateDialogOpen,
    selectedWorkplace,
    setSelectedWorkplace,
    onUpdate,
  } = useWorkplaces();

  return (
    <>
      <Page title="Workplaces">
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
            pageSizeOptions={[5, 10, 25]}
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

      <AddButton addUrl="/actions/add-workplace" />
    </>
  );
};

export default WorkplacesPage;
