import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import logoImg from "../../Assets/images/logo.png";
import useTheme from "../hooks/useTheme";

export const TopNavigation = () => {
  const { mode } = useTheme();

  const background =
    mode === "dark"
      ? "linear-gradient(90deg, #1e293b 0%, #334155 100%)" // dark navy gradient
      : "linear-gradient(90deg, #0d47a1 0%, #1976d2 100%)"; // material blue

  return (
    <AppBar
      position="fixed"
      sx={{
        background,
        height: "7vh",
        width: "85vw",
        borderBottom: mode === "dark" ? "1px solid rgba(255,255,255,0.05)" : undefined,
        boxShadow: mode === "dark" ? "0 2px 4px rgba(0,0,0,0.3)" : undefined,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-around" }}>
        <Box>
          <Typography
            component={Button}
            color="inherit"
            variant="h5"
            sx={{
              textTransform: "capitalize",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Personal Manager
          </Typography>
        </Box>

        <Box
          sx={{
            position: "absolute",
            right: "2rem",
            top: ".8rem",
          }}
        >
          <img
            src={logoImg}
            alt="Logo"
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavigation;
