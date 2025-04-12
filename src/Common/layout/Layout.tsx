import { Box } from "@mui/system";
import { blue } from "@mui/material/colors";
import useAuth from "../../Auth/hooks/useAuth";
import LeftNavigation from "./LeftNavigation";
import TopNavigation from "./TopNavigation";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import useTheme from "../hooks/useTheme";

import { PaletteMode } from "@mui/material";

const darkTheme = {
  palette: {
    mode: "dark" as PaletteMode,
    background: {
      default: "#121212",
      paper: "#1d1d1d",
    },
  },
};
const lightTheme = {
  palette: {
    mode: "light" as PaletteMode,
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { mode } = useTheme();

  const appliedTheme = createTheme(mode === "dark" ? darkTheme : lightTheme);

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
