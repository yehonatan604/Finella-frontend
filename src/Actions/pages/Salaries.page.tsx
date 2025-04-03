import { Box, Paper } from "@mui/material";
import useSalary from "../hooks/useSalary";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Page from "../../Common/components/Page";
import SalariesPdfDoc from "../components/SalariesPdfDoc";
import ActionFilters from "../components/ActionFilters";
import ActionButtons from "../components/ActionButtons";
import PlusButton from "../components/PlusButton";
import ShowInactiveCheckbox from "../components/ShowInactiveCheckbox";
import { useState } from "react";
import SalariesChartsDialog from "../components/dialogs/chratDialogs/SalariesChartsDialog";
import SalaryDetailsDialog from "../components/dialogs/detailsDialogs/SalaryDetailsDialog";

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
  } = useSalary(true);

  const [isChartsDialogOpen, setIsChartsDialogOpen] = useState(false);

  return (
    <>
      <Page title="Salaries">
        <ActionFilters
          setSearch={setSearch}
          setFromYear={setFromYear}
          setToYear={setToYear}
          setMonths={setMonths}
          setPickedWorkplaces={setPickedWorkplaces}
          workplaces={workplaces}
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
