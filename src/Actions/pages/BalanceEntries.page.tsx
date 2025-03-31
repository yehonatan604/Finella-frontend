import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Page from "../../UI/components/Page";
import BalanceEnetriesPdfDoc from "../components/BalanceEnetriesPdfDoc";
import useBalanceEntry from "../hooks/useBalanceEntry";
import ActionButtons from "../components/ActionButtons";
import ActionFilters from "../components/ActionFilters";
import { useState } from "react";
import { TBalanceEntry } from "../types/TBalanceEntry";
import BalanceEntryDetailsDialog from "../dialogs/BalanceEntryDetailsDialog";
import AddButton from "../components/AddButton";

const BalanceEntriesPage = () => {
  const {
    columns,
    rows,
    setFromYear,
    setToYear,
    setMonths,
    setPickedType,
    fetchedBalanceEntries,
    onUpdate,
  } = useBalanceEntry(true);

  const [selectedBEntry, setSelectedBEntry] = useState<TBalanceEntry | null>(null);
  const [isBEntryDetailsDialogOpen, setIsBEntryDetailsDialogOpen] = useState(false);

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
            onRowDoubleClick={(params) => {
              setSelectedBEntry(
                fetchedBalanceEntries?.find((bEntry) => bEntry._id === params.id) ?? null
              );
              setIsBEntryDetailsDialogOpen(true);
            }}
            onCellEditStart={(_, event) => {
              event.defaultMuiPrevented = true;
            }}
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

      <AddButton addUrl="/actions/add-balance-entry" />
    </>
  );
};

export default BalanceEntriesPage;
