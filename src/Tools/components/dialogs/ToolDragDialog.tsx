import React, { useRef, useState } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { toolsList } from "../../helpers/ToolsList";
import { TTool } from "../../types/TTool";
import DialogXButton from "../../../Actions/components/DialogXButton";

type ToolDragDialogProps = {
  open: boolean;
  onClose: () => void;
  tool: TTool;
  title: string;
};

const ToolDragDialog = ({ open, onClose, tool, title }: ToolDragDialogProps) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const ref = useRef<HTMLDivElement>(null);
  const posOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    posOffset.current = {
      x: e.clientX - ref.current.getBoundingClientRect().left,
      y: e.clientY - ref.current.getBoundingClientRect().top,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    setPosition({
      x: e.clientX - posOffset.current.x,
      y: e.clientY - posOffset.current.y,
    });
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  if (!open) return null;

  return (
    <Paper
      ref={ref}
      elevation={10}
      sx={{
        position: "fixed",
        top: position.y,
        left: position.x,
        zIndex: 2000,
        backgroundColor: "#fff",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          cursor: "move",
          backgroundColor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          userSelect: "none",
        }}
        onMouseDown={handleMouseDown}
      >
        <Typography variant="h6">{title}</Typography>
        <DialogXButton onClose={onClose} />
      </Box>

      <Box sx={{ p: 2 }}>{toolsList[tool]}</Box>
    </Paper>
  );
};

export default ToolDragDialog;
