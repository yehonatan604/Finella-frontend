import { Box, Typography } from "@mui/material";

const FeatureBox = ({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
}) => (
  <Box
    sx={{
      textAlign: "center",
      maxWidth: 200,
      px: 2,
      py: 1,
      transition: "all 0.3s",
      "&:hover": {
        transform: "translateY(-4px)",
        color: "primary.main",
      },
    }}
  >
    <Box color="primary.main" mb={1}>
      {icon}
    </Box>
    <Typography variant="subtitle1" fontWeight={600}>
      {label}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Box>
);

export default FeatureBox;
