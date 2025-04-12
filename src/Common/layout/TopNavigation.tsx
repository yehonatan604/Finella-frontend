import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { blue } from "@mui/material/colors";
import logoImg from "../../Assets/images/logo.png";

export const TopNavigation = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        background: `linear-gradient(90deg, ${blue[900]} 0%, ${blue[700]} 100%)`,
        height: "7vh",
        width: "85vw",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-around" }}>
        <Box>
          <Typography
            component={Button}
            color="inherit"
            variant="h5"
            sx={{ textTransform: "capitalize", color: "white", fontWeight: "bold" }}
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
