import { Box, Paper } from "@mui/material";
import useSalary from "../hooks/useSalary";
import { GridColDef } from "@mui/x-data-grid";
import Page from "../../Common/components/Page";
import SalariesPdfDoc from "../components/SalariesPdfDoc";
import PageFilters from "../../Common/components/PageFilters";
import PageButtons from "../../Common/components/PageButtons";
import PlusButton from "../../Common/components/PlusButton";
import ShowInactiveCheckbox from "../../Common/components/ShowInactiveCheckbox";
import { useState } from "react";
import SalariesChartsDialog from "../components/dialogs/chratDialogs/SalariesChartsDialog";
import SalaryDetailsDialog from "../components/dialogs/detailsDialogs/SalaryDetailsDialog";
import StyledDataGrid from "../../Common/components/styled/StyledDataGrid";
import useTheme from "../../Common/hooks/useTheme";
import { TDataGridRow } from "../../Common/types/TDataGridRow";
import { pageSizeOptions } from "../../Common/helpers/paginationHelpers";

const SalariesPage = () => {
  const {
    workplaces,
    columns,
    rows,
    setFromYear,
    setToYear,
    setMonths,
    setPickedWorkplaces,
    onUpdate,
    isSalaryDetailsDialogOpen,
    setIsSalaryDetailsDialogOpen,
    setSelectedSalary,
    selectedSalary,
    setSearch,
    filteredRows,
    showInactive,
    setShowInactive,
    loading,
    paginatedRows,
    paginationModel,
    setPaginationModel,
  } = useSalary(true);

  const [isChartsDialogOpen, setIsChartsDialogOpen] = useState(false);
  const { mode } = useTheme();

  return (
    <>
      <Page title="Salaries">
        <PageFilters
          setSearch={setSearch}
          setFromYear={setFromYear}
          setToYear={setToYear}
          setMonths={setMonths}
          setPickedWorkplaces={setPickedWorkplaces}
          workplaces={workplaces!}
        />
        <ShowInactiveCheckbox
          showInactive={showInactive}
          setShowInactive={setShowInactive}
          label="Show Inactive Salaries"
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
      <PageButtons
        fileName="Salaries"
        rows={rows}
        Doc={SalariesPdfDoc}
        openCharts={() => setIsChartsDialogOpen(true)}
      />

      {isSalaryDetailsDialogOpen && selectedSalary && (
        <SalaryDetailsDialog
          isOpen={isSalaryDetailsDialogOpen}
          onClose={() => setIsSalaryDetailsDialogOpen(false)}
          salary={selectedSalary}
          onSubmit={(data) => {
            onUpdate(data);
            setSelectedSalary(null);
          }}
          workplaces={workplaces ?? []}
        />
      )}

      {isChartsDialogOpen && (
        <SalariesChartsDialog
          open={isChartsDialogOpen}
          onClose={() => setIsChartsDialogOpen(false)}
          data={filteredRows.filter((d) => d.id !== "total")}
        />
      )}

      <PlusButton addUrl="/actions/add-salary" />
    </>
  );
};

export default SalariesPage;
