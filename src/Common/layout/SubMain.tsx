import { Box } from "@mui/system";
import useAuth from "../../Auth/hooks/useAuth";
import { useSelector } from "react-redux";
import { TRootState } from "../../Core/store/store";

const SubMain = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const isLeftNavOpen = useSelector(
    (state: TRootState) => state.themeSlice.isLeftNavOpen
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginLeft: user ? (isLeftNavOpen ? "15vw" : "0vw") : "0vw",
        transition: "margin-left 0.5s",
      }}
    >
      {children}
    </Box>
  );
};

export default SubMain;
