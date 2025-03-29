import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { blue } from "@mui/material/colors";

export const TopNavigation = () => {
  return (
    <AppBar
      position="fixed"
      sx={{ backgroundColor: blue[900], height: "7vh", width: "85vw" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-around" }}>
        <Box>
          <Typography
            component={Button}
            color="inherit"
            variant="h6"
            sx={{ textTransform: "capitalize", color: "white", fontWeight: "bold" }}
          >
            Personal Manager
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavigation;
