import { Box, Paper } from "@mui/material";
import useSalary from "../hooks/useSalary";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Page from "../../UI/components/Page";
import SalariesPdfDoc from "../components/SalariesPdfDoc";
import ActionFilters from "../components/ActionFilters";
import ActionButtons from "../components/ActionButtons";
import AddButton from "../components/AddButton";
import { useState } from "react";
import { TSalary } from "../types/TSalary";
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
    fetchedSalaries,
    onUpdate,
  } = useSalary(true);

  const [selectedSalary, setSelectedSalary] = useState<TSalary | null>(null);
  const [isSalaryDetailsDialogOpen, setIsSalaryDetailsDialogOpen] = useState(false);

  return (
    <>
      <Page title="Salaries">
        <ActionFilters
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
              setSelectedSalary(
                fetchedSalaries?.find((salary) => salary._id === params.id) ?? null
              );
              setIsSalaryDetailsDialogOpen(true);
            }}
            onCellEditStart={(_, event) => {
              event.defaultMuiPrevented = true;
            }}
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
