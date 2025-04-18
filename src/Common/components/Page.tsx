import { Typography } from "@mui/material";
import { Box } from "@mui/system";

const Page = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
  width?: string;
}) => {
  return (
    <>
      <Typography
        variant="h3"
        fontWeight="bold"
        gutterBottom
        sx={{ textAlign: "center" }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "85vw",
          maxHeight: "80vh",
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default Page;
