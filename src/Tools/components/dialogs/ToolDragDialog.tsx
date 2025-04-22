import React, { useRef, useState } from "react";
import { Paper, Typography, Box, IconButton } from "@mui/material";
import { toolsList } from "../../helpers/ToolsList";
import { TTool } from "../../types/TTool";
import DialogXButton from "../../../Common/components/dialogs/DialogXButton";
import useTheme from "../../../Common/hooks/useTheme";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CropSquareIcon from "@mui/icons-material/CropSquare"; // maximize icon
import StyledIconWrapper from "../../../Common/components/styled/StyledIconWrapper ";

type ToolDragDialogProps = {
  open: boolean;
  onClose: () => void;
  tool: TTool;
  title: string;
};

const ToolDragDialog = ({ open, onClose, tool, title }: ToolDragDialogProps) => {
  const { mode } = useTheme();
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({
    x: 100,
    y: 100,
  });
  const ref = useRef<HTMLDivElement>(null);
  const posOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    const dialogRect = ref.current?.getBoundingClientRect();
    if (isMinimized || !dialogRect) {
      posOffset.current = { x: 20, y: 20 }; // minimal offset when minimized
    } else {
      posOffset.current = {
        x: e.clientX - dialogRect.left,
        y: e.clientY - dialogRect.top,
      };
    }

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

  const handleMinimize = () => {
    setIsMinimized(true);
    setPosition({
      x: 32,
      y: window.innerHeight - 120,
    });
  };

  const handleMaximize = () => {
    const width = 300;
    const height = 800;
    setPosition({
      x: window.innerWidth / 2 - width / 2,
      y: window.innerHeight / 2 - height / 2,
    });
    setIsMinimized(false);
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
        border: `1px solid ${mode === "dark" ? "rgba(255,255,255,0.1)" : "silver"}`,
        backgroundColor: "background.paper",
        borderRadius: 2,
        overflow: "hidden",
        width: isMinimized ? "220px" : "auto",
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
        <Typography variant="subtitle2" noWrap>
          {title}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <StyledIconWrapper>
            <IconButton
              onClick={isMinimized ? handleMaximize : handleMinimize}
              disableRipple
              sx={{
                color: "#fff",
                padding: 0,
                "&:hover": {
                  backgroundColor: "transparent", // prevent hover bg
                },
              }}
            >
              {isMinimized ? (
                <CropSquareIcon fontSize="small" />
              ) : (
                <MinimizeIcon fontSize="small" />
              )}
            </IconButton>
          </StyledIconWrapper>

          <DialogXButton onClose={onClose} />
        </Box>
      </Box>

      {!isMinimized && <Box sx={{ p: 2 }}>{toolsList[tool]}</Box>}
    </Paper>
  );
};

export default ToolDragDialog;
