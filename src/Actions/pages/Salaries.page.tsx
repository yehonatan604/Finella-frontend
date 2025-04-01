import { Box, Paper } from "@mui/material";
import useSalary from "../hooks/useSalary";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Page from "../../UI/components/Page";
import SalariesPdfDoc from "../components/SalariesPdfDoc";
import ActionFilters from "../components/ActionFilters";
import ActionButtons from "../components/ActionButtons";
import AddButton from "../components/AddButton";
import SalaryDetailsDialog from "../components/dialogs/SalaryDetailsDialog";

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
  } = useSalary(true);

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
            pageSizeOptions={[5, 10, 25]}
            onCellEditStart={(_, event) => {
              event.defaultMuiPrevented = true;
            }}
            isRowSelectable={() => false}
          />
        </Box>
      </Page>
      <ActionButtons fileName="Salaries" rows={rows} Doc={SalariesPdfDoc} />

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

      <AddButton addUrl="/actions/add-salary" />
    </>
  );
};

export default SalariesPage;
