import React, { useState } from "react";
import { Box, Drawer, IconButton, Menu, MenuItem } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link, useNavigate } from "react-router-dom";
import CenterBox from "../components/styled/CenterBox";
import ColBox from "../components/styled/ColBox";
import MenuAccordion from "../components/MenuAccordion";
import { MenuItemWithIcon } from "../components/MenuItemWithIcon";
import BalanceIcon from "@mui/icons-material/Balance";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import ApartmentIcon from "@mui/icons-material/Apartment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CalculateIcon from "@mui/icons-material/Calculate";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import Person2Icon from "@mui/icons-material/Person2";
import AttractionsIcon from "@mui/icons-material/Attractions";
import ConstructionIcon from "@mui/icons-material/Construction";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import EventNoteIcon from "@mui/icons-material/EventNote";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import ToolDragDialog from "../../Tools/components/dialogs/ToolDragDialog";
import useTheme from "../hooks/useTheme";
import useAuth from "../../Auth/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../../Core/store/store";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { themeActions } from "../../Core/store/themeSlice";
import ChecklistIcon from "@mui/icons-material/Checklist";

const LeftNavigation = () => {
  const [toolModals, setToolModals] = useState({
    calculator: false,
    currency: false,
    timer: false,
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { mode, setTheme } = useTheme();
  const { logout } = useAuth();
  const open = Boolean(anchorEl);
  const isLeftNavOpen = useSelector(
    (state: TRootState) => state.themeSlice.isLeftNavOpen
  );
  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const nav = useNavigate();

  const handleToolClick = (tool: keyof typeof toolModals) => {
    setToolModals((prev) => ({ ...prev, [tool]: !prev[tool] }));
  };

  const gradientBackground =
    mode === "dark"
      ? "linear-gradient(180deg, #1e293b 0%, #334155 100%)"
      : "linear-gradient(180deg, #0d47a1 0%, #1976d2 100%)";

  const iconColor = "#ccc";
  const sectionColor = "#bbb";

  return (
    <>
      <IconButton
        onClick={() => dispatch(themeActions.toggleLeftNav())}
        sx={{
          position: "fixed",
          bottom: 16,
          left: {
            xs: isLeftNavOpen ? "50vw" : 0,
            md: isLeftNavOpen ? "15vw" : 0,
          },
          zIndex: 1300,
          color: mode === "dark" ? "white" : "black",
          transition: "left 0.5s ease-in-out",
          "&:hover": {
            backgroundColor: mode === "dark" ? "#1e293b" : "#1976d2",
          },
        }}
      >
        {isLeftNavOpen ? (
          <KeyboardDoubleArrowLeftIcon />
        ) : (
          <KeyboardDoubleArrowRightIcon />
        )}
      </IconButton>
      <Drawer variant="permanent" open>
        <Box
          sx={{
            width: isLeftNavOpen ? { xs: "50vw", md: "15vw" } : 0,
            transition: "width 0.5s ease-in-out",
            overflowX: "hidden",
          }}
        >
          <ColBox
            sx={{
              width: "100%",
              minHeight: "100vh",
              background: gradientBackground,
              transition: "opacity 0.4s ease",
              opacity: isLeftNavOpen ? 1 : 0,
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
                width: "inherit",
              }}
            >
              <IconButton sx={{ color: "white" }}>
                <HomeIcon onClick={() => nav("/")} />
              </IconButton>
              <IconButton sx={{ color: "white" }} onClick={handleClick}>
                <Person2Icon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem
                  onClick={() => {
                    logout();
                    handleClose();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>

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
                mx: "auto",
                width: "inherit",
                overflowY: "auto",
                overflowX: "hidden",
                transition: "opacity 0.4s ease",
                opacity: isLeftNavOpen ? 1 : 0,
              }}
            >
              <MenuAccordion
                title="Records"
                icon={<AttractionsIcon sx={{ color: sectionColor }} />}
              >
                <Link to={"/records/balance-entries"}>
                  <MenuItemWithIcon
                    title="Balance Entries"
                    icon={<BalanceIcon sx={{ color: iconColor }} />}
                  />
                </Link>
                <Link to={"/records/salaries"}>
                  <MenuItemWithIcon
                    title="Salaries"
                    icon={<LocalAtmIcon sx={{ color: iconColor }} />}
                  />
                </Link>
                <Link to={"/records/workplaces"}>
                  <MenuItemWithIcon
                    title="Workplaces"
                    icon={<ApartmentIcon sx={{ color: iconColor }} />}
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
                title="Todo's"
                icon={<ChecklistIcon sx={{ color: sectionColor }} />}
              >
                <Link to={"/todos"}>
                  <MenuItemWithIcon
                    title="All Todo's"
                    icon={<EditNoteIcon sx={{ color: iconColor }} />}
                  />
                </Link>
                <Link to={"/todos/board"}>
                  <MenuItemWithIcon
                    title="Todos Board"
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
                <Box onClick={() => handleToolClick("currency")}>
                  <MenuItemWithIcon
                    title="Currency Converter"
                    icon={<CurrencyExchangeIcon sx={{ color: iconColor }} />}
                  />
                </Box>
                <Box onClick={() => handleToolClick("timer")}>
                  <MenuItemWithIcon
                    title="Timer"
                    icon={<TimerSharpIcon sx={{ color: iconColor }} />}
                  />
                </Box>
              </MenuAccordion>
            </Box>
          </ColBox>

          <ToolDragDialog
            open={toolModals.calculator}
            onClose={() => handleToolClick("calculator")}
            tool={"calculator"}
            title={"Calculator"}
          />
          <ToolDragDialog
            open={toolModals.currency}
            onClose={() => handleToolClick("currency")}
            tool={"currency"}
            title={"Currency Converter"}
          />
          <ToolDragDialog
            open={toolModals.timer}
            onClose={() => handleToolClick("timer")}
            tool={"timer"}
            title={"Timer"}
          />
        </Box>
      </Drawer>
    </>
  );
};

export default LeftNavigation;
