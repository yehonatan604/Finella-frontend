import { LinearProgress, linearProgressClasses } from "@mui/material";
import { grey } from "@mui/material/colors";
import styled from "@mui/system/styled/styled";

type BorderLinearProgressProps = {
  barColor?: string;
};

const BorderLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== "barColor",
})<BorderLinearProgressProps>(({ theme, barColor = "#1a90ff" }) => ({
  height: 10,
  borderRadius: 5,
  width: "100%",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: barColor,
    ...theme.applyStyles("dark", {
      backgroundColor: "#308fe8",
    }),
  },
}));

export default BorderLinearProgress;
