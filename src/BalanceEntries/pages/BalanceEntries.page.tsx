import React from "react";
import { Box, Paper } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import Page from "../../Common/components/layout/Page";
import BalanceEnetriesPdfDoc from "../components/BalanceEnetriesPdfDoc";
import useBalanceEntry from "../hooks/useBalanceEntry";
import PageButtons from "../../Common/components/layout/PageButtons";
import PageFilters from "../../Common/components/layout/PageFilters";
import PlusButton from "../../Common/components/layout/PlusButton";
import ShowInactiveCheckbox from "../../Common/components/ShowInactiveCheckbox";
import { useState } from "react";
import BalanceEntriesChartsDialog from "../components/BalanceEntriesChartsDialog";
import StyledDataGrid from "../../Common/components/styled/StyledDataGrid";
import useTheme from "../../Common/hooks/useTheme";
import { pageSizeOptions } from "../../Common/helpers/paginationHelpers";
import { TDataGridRow } from "../../Common/types/TDataGridRow";
import FormDialog from "../../Common/components/dialogs/FormDialog";
import BalanceEntryForm from "../forms/BalanceEntryForm";

const BalanceEntriesPage = () => {
  const {
    columns,
    rows,
    setFromYear,
    setToYear,
    setMonths,
    setPickedType,
    setIsUploadDialogOpen,
    isUploadDialogOpen,
    selectedBEntry,
    setSearch,
    filteredRows,
    showInactive,
    setShowInactive,
    loading,
    paginatedRows,
    paginationModel,
    setPaginationModel,
  } = useBalanceEntry();

  const [isChartsDialogOpen, setIsChartsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { mode } = useTheme();

  return (
    <>
      <Page title="Balance Entries">
        <PageFilters
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
                    (row) => "status" in row && row.status !== "inactive"
                  ).length
                : filteredRows.length
            }
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            columns={columns as GridColDef[]}
            getRowClassName={(params) =>
              params.id === "total"
                ? "total"
                : params.indexRelativeToCurrentPage % 2 === 0
                ? "even"
                : "odd"
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
        <PageButtons
          fileName="BalanceEntries"
          rows={rows}
          Doc={BalanceEnetriesPdfDoc}
          openCharts={() => setIsChartsDialogOpen(true)}
        />
      )}
      <PlusButton onClick={() => setIsAddDialogOpen(true)} />

      {isChartsDialogOpen && (
        <BalanceEntriesChartsDialog
          open={isChartsDialogOpen}
          onClose={() => setIsChartsDialogOpen(false)}
          incomingData={filteredRows}
        />
      )}

      <FormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Add a Balance Entry"
        formComponent={<BalanceEntryForm setIsDialogOpen={setIsAddDialogOpen} />}
      />

      <FormDialog
        open={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        title="Update Balance Entry"
        formComponent={
          <BalanceEntryForm
            setIsDialogOpen={setIsAddDialogOpen}
            setIsUpdateDialogOpen={setIsUploadDialogOpen}
            bEntry={selectedBEntry}
          />
        }
      />
    </>
  );
};

export default BalanceEntriesPage;
