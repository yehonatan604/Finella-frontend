import { Typography } from "@mui/material";
import { Box } from "@mui/system";

const Page = ({
  title,
  children,
  width = "85vw",
}: {
  title: string;
  children: React.ReactNode;
  width?: string;
}) => (
  <>
    <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ textAlign: "center" }}>
      {title}
    </Typography>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width,
        maxHeight: "75vh",
        overflow: "auto",
        pb: 5,
      }}
    >
      {children}
    </Box>
  </>
);

export default Page;
