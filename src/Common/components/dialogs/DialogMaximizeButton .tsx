import { Box, IconButton } from "@mui/material";
import CropSquareIcon from "@mui/icons-material/CropSquare";

const DialogMaximizeButton = ({ onClick }: { onClick: () => void }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "primary.light",
      borderRadius: "15%",
      width: "30px",
      height: "30px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "primary.main",
      },
    }}
  >
    <IconButton onClick={onClick} sx={{ color: "#fff" }} size="small">
      <CropSquareIcon fontSize="small" />
    </IconButton>
  </Box>
);

export default DialogMaximizeButton;
