import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/material";

export const createRowIcons = (onEdit: () => void, onDelete: () => void) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "0.6rem",
        gap: "1rem",
      }}
    >
      <CreateIcon
        sx={{
          color: "primary.main",
          cursor: "pointer",
          "&:hover": {
            color: "primary.dark",
          },
        }}
        onClick={onEdit}
      />
      <DeleteIcon
        sx={{
          color: "error.main",
          cursor: "pointer",
          "&:hover": {
            color: "error.dark",
          },
        }}
        onClick={onDelete}
      />
    </Box>
  );
};
