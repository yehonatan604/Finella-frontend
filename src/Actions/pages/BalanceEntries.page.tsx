import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Page from "../../UI/components/Page";
import BalanceEnetriesPdfDoc from "../components/BalanceEnetriesPdfDoc";
import useBalanceEntry from "../hooks/useBalanceEntry";
import ActionButtons from "../components/ActionButtons";
import ActionFilters from "../components/ActionFilters";
import PlusButton from "../components/PlusButton";
import BalanceEntryDetailsDialog from "../components/dialogs/BalanceEntryDetailsDialog";

const BalanceEntriesPage = () => {
  const {
    columns,
    rows,
    setFromYear,
    setToYear,
    setMonths,
    setPickedType,
    onUpdate,
    setSelectedBEntry,
    setIsBEntryDetailsDialogOpen,
    isBEntryDetailsDialogOpen,
    selectedBEntry,
    setSearch,
    filteredRows,
  } = useBalanceEntry(true);

  return (
    <>
      <Page title="Balance Entries">
        <ActionFilters
          setSearch={setSearch}
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
            pageSizeOptions={[5]}
            onCellEditStart={(_, event) => {
              event.defaultMuiPrevented = true;
            }}
            isRowSelectable={() => false}
          />
        </Box>
      </Page>
      <ActionButtons fileName="BalanceEntries" rows={rows} Doc={BalanceEnetriesPdfDoc} />

      {isBEntryDetailsDialogOpen && selectedBEntry && (
        <BalanceEntryDetailsDialog
          isOpen={isBEntryDetailsDialogOpen}
          onClose={() => setIsBEntryDetailsDialogOpen(false)}
          bEntry={selectedBEntry}
          onSubmit={(data) => {
            onUpdate(data);
            setSelectedBEntry(null);
          }}
        />
      )}

      <PlusButton addUrl="/actions/add-balance-entry" />
    </>
  );
};

export default BalanceEntriesPage;
