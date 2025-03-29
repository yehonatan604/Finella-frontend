import { Box } from "@mui/system";
import { blue } from "@mui/material/colors";
import useAuth from "../../Auth/hooks/useAuth";
import LeftNavigation from "./LeftNavigation";
import TopNavigation from "./TopNavigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return (
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
  );
};

export default Layout;
