import React from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const PlusButton = ({
  addUrl = "",
  onClick,
}: {
  addUrl?: string;
  onClick?: () => void;
}) => {
  const nav = useNavigate();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={
        onClick
          ? onClick
          : () => {
              nav(addUrl);
            }
      }
      sx={{
        mt: 2,
        borderRadius: "100%",
        width: "80px",
        height: "80px",
        padding: 0.5,
        fontSize: "4rem",
        position: "fixed",
        right: "3vw",
        bottom: "10vh",
      }}
    >
      <AddIcon sx={{ fontSize: "inherit" }} />
    </Button>
  );
};

export default PlusButton;
