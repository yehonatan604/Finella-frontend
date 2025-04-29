import React from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DialogXButton = ({ onClose }: { onClose: () => void }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "error.main",
        borderRadius: "15%",
        width: "30px",
        height: "30px",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "error.dark",
        },
      }}
    >
      <IconButton onClick={onClose} sx={{ color: "#fff" }}>
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default DialogXButton;
