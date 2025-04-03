import { Box } from "@mui/system";

const SubMain = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginLeft: "15vw",
      }}
    >
      {children}
    </Box>
  );
};

export default SubMain;
