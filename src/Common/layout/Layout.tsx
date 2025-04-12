import { Box } from "@mui/system";
import { blue } from "@mui/material/colors";
import useAuth from "../../Auth/hooks/useAuth";
import LeftNavigation from "./LeftNavigation";
import TopNavigation from "./TopNavigation";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import useTheme from "../hooks/useTheme";
import { lightTheme } from "../styles/themes/light.theme";
import { darkTheme } from "../styles/themes/dark.theme";
import { useEffect } from "react";
import { TTheme } from "../types/TTheme";

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
        {user && (
          <Box sx={{ display: "flex" }}>
            <LeftNavigation />
            <Box sx={{ width: "85%", marginLeft: "15%", height: "7vh" }}>
              <TopNavigation />
            </Box>
          </Box>
        )}
        <Box
          component={"main"}
          sx={{
            flexGrow: 1,
            bgcolor: blue[50],
            p: 3,
            height: user ? "93vh" : "100vh",
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
