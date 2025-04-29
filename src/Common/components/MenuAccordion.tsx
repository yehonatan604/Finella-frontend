import React from "react";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
} from "@mui/material";
import { useState } from "react";
import { TbChevronDown } from "react-icons/tb";
import useTheme from "../hooks/useTheme";
import { blue } from "@mui/material/colors";

const MenuAccordion = ({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
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
            gap: 1,
          }}
        >
          {icon && icon}
          <Typography variant="h6">{title}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default MenuAccordion;
