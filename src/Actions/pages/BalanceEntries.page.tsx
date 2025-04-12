import { Box, Paper } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import Page from "../../Common/components/Page";
import BalanceEnetriesPdfDoc from "../components/BalanceEnetriesPdfDoc";
import useBalanceEntry from "../hooks/useBalanceEntry";
import ActionButtons from "../components/ActionButtons";
import ActionFilters from "../components/ActionFilters";
import PlusButton from "../components/PlusButton";
import ShowInactiveCheckbox from "../components/ShowInactiveCheckbox";
import { useState } from "react";
import BalanceEntriesChartsDialog from "../components/dialogs/chratDialogs/BalanceEntriesChartsDialog";
import BalanceEntryDetailsDialog from "../components/dialogs/detailsDialogs/BalanceEntryDetailsDialog";
import StyledDataGrid from "../../Common/components/styled/StyledDataGrid";
import useTheme from "../../Common/hooks/useTheme";

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
  const { mode } = useTheme();

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
                  ).length - 1
                : filteredRows.length - 1
            }
            paginationMode="server"
            columns={columns as GridColDef[]}
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
