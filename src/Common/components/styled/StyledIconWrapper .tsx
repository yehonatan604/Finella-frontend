import React from "react";
import { Box } from "@mui/material";
import { ReactNode } from "react";

const StyledIconWrapper = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "primary.dark",
      borderRadius: "15%",
      width: "30px",
      height: "30px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#1156B0",
      },
    }}
  >
    {children}
  </Box>
);

export default StyledIconWrapper;
