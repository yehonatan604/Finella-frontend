import { DataGrid } from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";
import Page from "../../UI/components/Page";
import useWorkplaces from "../hooks/useWorkplace";
import WorkplacesPdfDoc from "../components/WorkplacesPdfDoc";
import ActionButtons from "../components/ActionButtons";

const WorkplacesPage = () => {
  const { columns, rows } = useWorkplaces();

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
            columns={columns}
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
            onRowSelectionModelChange={(ids) => {
              console.log(ids);
            }}
          />
        </Box>
      </Page>
      <ActionButtons
        actionName="Workplace"
        fileName="workplaces"
        rows={rows}
        addUrl="/actions/add-workplace"
        Doc={WorkplacesPdfDoc}
      />
    </>
  );
};

export default WorkplacesPage;
