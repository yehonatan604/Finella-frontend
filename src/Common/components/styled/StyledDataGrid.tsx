import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { blue } from "@mui/material/colors";

const StyledDataGrid = styled(DataGrid)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";

  return {
    width: "60vw",
    color: isDark ? "#e3f2fd" : "inherit", // Light blue text in dark mode

    // Header
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: isDark ? blue[900] : theme.palette.primary.main,
      color: "#fff",
      fontWeight: "bold",
    },

    // Alternate row colors
    "& .MuiDataGrid-row.even": {
      backgroundColor: isDark ? "#0f1e36" : "#f9f9f9", // Deep navy
    },
    "& .MuiDataGrid-row.odd": {
      backgroundColor: isDark ? "#102342" : "#ffffff", // Slightly lighter blue
    },

    // Cells
    "& .MuiDataGrid-cell": {
      borderBottom: `1px solid ${isDark ? "#1e3a5f" : "#ccc"}`,
      color: isDark ? "#d1ecff" : "inherit",
    },

    // Pagination + Footer
    "& .MuiTablePagination-root": {
      color: isDark ? "#bbdefb" : "inherit",
    },

    // Remove outlines
    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
      outline: "none",
    },
    "& .MuiDataGrid-cell--editing": {
      boxShadow: "none",
      outline: "none",
    },

    // Optional: toolbar buttons, sorting arrows etc.
    "& .MuiDataGrid-toolbarContainer, & .MuiButtonBase-root": {
      color: isDark ? "#bbdefb" : "inherit",
    },
  };
});

export default StyledDataGrid;
