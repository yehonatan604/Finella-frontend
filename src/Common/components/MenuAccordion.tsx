import { ReactNode } from "react";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
  Badge,
} from "@mui/material";
import { useState } from "react";
import { TbChevronDown } from "react-icons/tb";
import useTheme from "../hooks/useTheme";
import { blue } from "@mui/material/colors";

const MenuAccordion = ({
  title,
  children,
  icon,
  badgeValue,
}: {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  badgeValue?: number;
}) => {
  const [hovered, setHovered] = useState(false);
  const { mode } = useTheme();

  return (
    <Accordion
      disableGutters
      elevation={hovered ? 5 : 0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        backgroundColor: hovered && mode === "light" ? blue[800] : "transparent",
        "& .MuiAccordion-region": {
          color: "#444",
        },
        "& .MuiAccordionSummary-root": {
          color: "#444",
        },
        "& .MuiAccordionDetails-root": {
          color: "#efe",
        },
        "& .MuiAccordionSummary-content": {
          color: "#ddd",
        },
      }}
    >
      <AccordionSummary expandIcon={<TbChevronDown color="white" size={20} />}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          {icon && icon}
          <Typography variant="h6">{title}</Typography>
          {badgeValue && (
            <Badge badgeContent={badgeValue} color="primary" sx={{ ml: 1 }} />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default MenuAccordion;
