import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Page from "../../UI/components/Page";
import BalanceEnetriesPdfDoc from "../components/BalanceEnetriesPdfDoc";
import useBalanceEntry from "../hooks/useBalanceEntry";
import ActionButtons from "../components/ActionButtons";
import ActionFilters from "../components/ActionFilters";

const BalanceEntriesPage = () => {
  const { columns, rows, setFromYear, setToYear, setMonths, setPickedType } =
    useBalanceEntry(true);

  return (
    <>
      <Page title="Balance Entries">
        <ActionFilters
          setFromYear={setFromYear}
          setToYear={setToYear}
          setMonths={setMonths}
          setPickedType={setPickedType}
          types={["income", "expense"]}
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
            onRowSelectionModelChange={(ids) => {
              console.log(ids);
            }}
          />
        </Box>
      </Page>
      <ActionButtons
        actionName="Balance Entry"
        fileName="BalanceEntries"
        rows={rows}
        addUrl="/actions/add-balance-entry"
        Doc={BalanceEnetriesPdfDoc}
      />
    </>
  );
};

export default BalanceEntriesPage;
