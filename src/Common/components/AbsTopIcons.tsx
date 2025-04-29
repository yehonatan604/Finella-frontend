import React from "react";
import { Box, IconButton } from "@mui/material";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import HomeIcon from "@mui/icons-material/Home";
import useTheme from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";

export const AbsTopIcons = ({ hideHome = false }: { hideHome?: boolean }) => {
  const { mode, setTheme } = useTheme();
  const nav = useNavigate();

  return (
    <Box
      sx={{
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
      }}
    >
      <IconButton>
        {mode === "dark" ? (
          <LightModeRoundedIcon
            onClick={() => setTheme("light")}
            sx={{
              color: "white",
            }}
          />
        ) : (
          <DarkModeRoundedIcon
            onClick={() => setTheme("dark")}
            sx={{ color: "text.standard" }}
          />
        )}
      </IconButton>

      {!hideHome && (
        <IconButton sx={{ color: mode === "dark" ? "white" : "text.standard" }}>
          <HomeIcon onClick={() => nav("/")} />
        </IconButton>
      )}
    </Box>
  );
};

export default AbsTopIcons;
