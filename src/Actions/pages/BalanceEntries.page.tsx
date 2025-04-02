import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Page from "../../UI/components/Page";
import BalanceEnetriesPdfDoc from "../components/BalanceEnetriesPdfDoc";
import useBalanceEntry from "../hooks/useBalanceEntry";
import ActionButtons from "../components/ActionButtons";
import ActionFilters from "../components/ActionFilters";
import PlusButton from "../components/PlusButton";
import BalanceEntryDetailsDialog from "../components/dialogs/BalanceEntryDetailsDialog";
import ShowInactiveCheckbox from "../components/ShowInactiveCheckbox";
import { useState } from "react";
import BalanceEntriesChartsDialog from "../components/dialogs/BalanceEntriesChartsDialog";

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
    showInactive,
    setShowInactive,
  } = useBalanceEntry(true);

  const [isChartsDialogOpen, setIsChartsDialogOpen] = useState(false);

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

        <ShowInactiveCheckbox
          showInactive={showInactive}
          setShowInactive={setShowInactive}
          label="Show Inactive Entries"
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
                  ).length - 1
                : filteredRows.length - 1
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
            pageSizeOptions={[5, 10]}
            onCellEditStart={(_, event) => {
              event.defaultMuiPrevented = true;
            }}
            isRowSelectable={() => false}
          />
        </Box>
      </Page>
      <ActionButtons
        fileName="BalanceEntries"
        rows={rows}
        Doc={BalanceEnetriesPdfDoc}
        openCharts={() => setIsChartsDialogOpen(true)}
      />

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

      {isChartsDialogOpen && (
        <BalanceEntriesChartsDialog
          open={isChartsDialogOpen}
          onClose={() => setIsChartsDialogOpen(false)}
          data={filteredRows}
        />
      )}

      <PlusButton addUrl="/actions/add-balance-entry" />
    </>
  );
};

export default BalanceEntriesPage;
