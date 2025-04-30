import { Box } from "@mui/system";
import { blue } from "@mui/material/colors";
import LeftNavigation from "./LeftNavigation";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { useEffect } from "react";
import useTheme from "../../hooks/useTheme";
import React from "react";
import useAuth from "../../../Auth/hooks/useAuth";
import { TTheme } from "../../types/TTheme";
import { darkTheme } from "../../styles/themes/dark.theme";
import { lightTheme } from "../../styles/themes/light.theme";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { mode, setTheme } = useTheme();

  const appliedTheme = createTheme(mode === "dark" ? darkTheme : lightTheme);

  useEffect(() => {
    const storageMode = localStorage.getItem("mode") || "light";
    localStorage.setItem("mode", storageMode);
    setTheme(storageMode as TTheme);
  }, [setTheme]);

  return (
    <ThemeProvider theme={appliedTheme}>
      <Box sx={{ height: "100vh" }}>
        {user && <LeftNavigation />}
        <Box
          component={"main"}
          sx={{
            "*": {
              transition: "all 0.5s ease, color 0.5s ease",
            },
            flexGrow: 1,
            backgroundColor: mode === "light" ? blue[50] : "#0f172a",
            p: 3,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
