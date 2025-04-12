import { Box } from "@mui/system";
import useAuth from "../../Auth/hooks/useAuth";

const SubMain = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginLeft: user ? "15vw" : "0",
      }}
    >
      {children}
    </Box>
  );
};

export default SubMain;
