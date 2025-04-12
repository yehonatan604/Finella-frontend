import { Box, Drawer, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link, useNavigate } from "react-router-dom";
import CenterBox from "../components/CenterBox";
import ColBox from "../components/ColBox";
import MenuAccordion from "../components/MenuAccordion";
import { MenuItemWithIcon } from "../components/MenuItemWithIcon";
import BalanceIcon from "@mui/icons-material/Balance";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import ApartmentIcon from "@mui/icons-material/Apartment";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CalculateIcon from "@mui/icons-material/Calculate";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AirIcon from "@mui/icons-material/Air";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import Person2Icon from "@mui/icons-material/Person2";
import AttractionsIcon from "@mui/icons-material/Attractions";
import ConstructionIcon from "@mui/icons-material/Construction";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { useState } from "react";
import ToolDragDialog from "../../Tools/components/dialogs/ToolDragDialog";
import { TTool } from "../../Tools/types/TTool";
import useTheme from "../hooks/useTheme";

const LeftNavigation = () => {
  const [selectedTool, setSelectedTool] = useState<TTool | null>(null);
  const { mode, setTheme } = useTheme();
  const nav = useNavigate();

  const handleToolClick = (tool: TTool) => {
    setSelectedTool(tool);
  };

  const gradientBackground =
    mode === "dark"
      ? "linear-gradient(180deg, #1e293b 0%, #334155 100%)"
      : "linear-gradient(180deg, #0d47a1 0%, #1976d2 100%)";

  const iconColor = mode === "dark" ? "#ccc" : "#333";
  const sectionColor = mode === "dark" ? "#bbb" : "#444";

  return (
    <Drawer
      variant="permanent"
      sx={{
        "& .MuiDrawer-paper": {
          border: "none",
        },
      }}
    >
      <ColBox
        sx={{
          width: "15vw",
          minHeight: "100vh",
          height: "100%",
          alignItems: "center",
          background: gradientBackground,
          maxHeight: "80vh",
          overflowY: "hidden",
        }}
      >
        <CenterBox
          sx={{
            height: "7vh",
            backgroundColor: "transparent",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            color: "white",
            position: "fixed",
            top: 0,
            width: "15vw",
          }}
        >
          <IconButton sx={{ color: "white" }}>
            <HomeIcon onClick={() => nav("/")} />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <Person2Icon />
          </IconButton>
          <IconButton>
            {mode === "dark" ? (
              <LightModeRoundedIcon onClick={() => setTheme("light")} />
            ) : (
              <DarkModeRoundedIcon
                onClick={() => setTheme("dark")}
                sx={{ color: "white" }}
              />
            )}
          </IconButton>
        </CenterBox>

        <Box
          sx={{
            pb: 2,
            mt: "7vh",
            mx: "auto",
            width: "15vw",
            overflowY: "auto",
          }}
        >
          <MenuAccordion
            title="Actions"
            icon={<AttractionsIcon sx={{ color: sectionColor }} />}
          >
            <Link to={"/data/balance-entries"}>
              <MenuItemWithIcon
                title="Balance Entries"
                icon={<BalanceIcon sx={{ color: iconColor }} />}
              />
            </Link>
            <Link to={"/data/salaries"}>
              <MenuItemWithIcon
                title="Salaries"
                icon={<LocalAtmIcon sx={{ color: iconColor }} />}
              />
            </Link>
            <Link to={"/data/workplaces"}>
              <MenuItemWithIcon
                title="Workplaces"
                icon={<ApartmentIcon sx={{ color: iconColor }} />}
              />
            </Link>
            <Link to={"/data/todos"}>
              <MenuItemWithIcon
                title="Todo's"
                icon={<FormatListBulletedIcon sx={{ color: iconColor }} />}
              />
            </Link>
          </MenuAccordion>

          <MenuAccordion
            title="Notes"
            icon={<EventNoteIcon sx={{ color: sectionColor }} />}
          >
            <Link to={"/notes"}>
              <MenuItemWithIcon
                title="All Notes"
                icon={<EditNoteIcon sx={{ color: iconColor }} />}
              />
            </Link>
            <Link to={"/notes/note-automations"}>
              <MenuItemWithIcon
                title="Note Automations"
                icon={<MarkEmailReadIcon sx={{ color: iconColor }} />}
              />
            </Link>
            <Link to={"/notes/board"}>
              <MenuItemWithIcon
                title="Notes Board"
                icon={<DashboardCustomizeIcon sx={{ color: iconColor }} />}
              />
            </Link>
          </MenuAccordion>

          <MenuAccordion
            title="Tools"
            icon={<ConstructionIcon sx={{ color: sectionColor }} />}
          >
            <Box onClick={() => handleToolClick("calculator")}>
              <MenuItemWithIcon
                title="Calculator"
                icon={<CalculateIcon sx={{ color: iconColor }} />}
              />
            </Box>
            <MenuItemWithIcon
              title="Currency Converter"
              icon={<CurrencyExchangeIcon sx={{ color: iconColor }} />}
            />
            <MenuItemWithIcon
              title="Weather"
              icon={<AirIcon sx={{ color: iconColor }} />}
            />
          </MenuAccordion>
        </Box>
      </ColBox>

      <ToolDragDialog
        open={selectedTool !== null}
        onClose={() => setSelectedTool(null)}
        tool={selectedTool as TTool}
        title={selectedTool === "calculator" ? "Calculator" : ""}
      />
    </Drawer>
  );
};

export default LeftNavigation;
