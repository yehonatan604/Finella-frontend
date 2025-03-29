import { Box, Drawer } from "@mui/material";
import { blue } from "@mui/material/colors";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import CenterBox from "../components/CenterBox";
import ColBox from "../components/ColBox";
import MenuAccordion from "../components/MenuAccordion";
import { MenuItemWithIcon } from "../components/MenuItemWithIcon";
import BalanceIcon from "@mui/icons-material/Balance";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import ApartmentIcon from "@mui/icons-material/Apartment";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CalculateIcon from "@mui/icons-material/Calculate";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AirIcon from "@mui/icons-material/Air";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LaunchIcon from "@mui/icons-material/Launch";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import Person2Icon from "@mui/icons-material/Person2";
import LanguageIcon from "@mui/icons-material/Language";
import LogoutIcon from "@mui/icons-material/Logout";
import AttractionsIcon from "@mui/icons-material/Attractions";
import ConstructionIcon from "@mui/icons-material/Construction";
import AutoModeIcon from "@mui/icons-material/AutoMode";

const LeftNavigation = () => {
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
          background: `linear-gradient(180deg, ${blue[900]} 0%, ${blue[800]} 100%)`,
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
          <Link to={"/"}>
            <HomeIcon />
          </Link>
          <Link to={"/"}>
            <Person2Icon />
          </Link>
          <span>
            <LanguageIcon />
          </span>
          <span>
            <LogoutIcon />
          </span>
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
            icon={<AttractionsIcon sx={{ color: "#bbb" }} />}
          >
            <Link to={"/data/balance-entries"}>
              <MenuItemWithIcon
                title="Balance Entries"
                icon={<BalanceIcon sx={{ color: "#ccc" }} />}
              />
            </Link>
            <Link to={"/data/salaries"}>
              <MenuItemWithIcon
                title="Salaries"
                icon={<LocalAtmIcon sx={{ color: "#ccc" }} />}
              />
            </Link>
            <Link to={"/data/workplaces"}>
              <MenuItemWithIcon
                title="Workplaces"
                icon={<ApartmentIcon sx={{ color: "#ccc" }} />}
              />
            </Link>
            <Link to={"/data/todos"}>
              <MenuItemWithIcon
                title="Todo's"
                icon={<FormatListBulletedIcon sx={{ color: "#ccc" }} />}
              />
            </Link>
            <Link to={"/data/workplaces"}>
              <MenuItemWithIcon
                title="Calendar"
                icon={<CalendarMonthIcon sx={{ color: "#ccc" }} />}
              />
            </Link>
            <Link to={"/data/workplaces"}>
              <MenuItemWithIcon
                title="Notes"
                icon={<EditNoteIcon sx={{ color: "#ccc" }} />}
              />
            </Link>
          </MenuAccordion>

          <MenuAccordion title="Tools" icon={<ConstructionIcon sx={{ color: "#bbb" }} />}>
            <MenuItemWithIcon
              title="Calculator"
              icon={<CalculateIcon sx={{ color: "#ccc" }} />}
            />
            <MenuItemWithIcon
              title="Currency Converter"
              icon={<CurrencyExchangeIcon sx={{ color: "#ccc" }} />}
            />
            <MenuItemWithIcon title="Weather" icon={<AirIcon sx={{ color: "#ccc" }} />} />
            <MenuItemWithIcon
              title="Files Browser"
              icon={<AttachFileIcon sx={{ color: "#ccc" }} />}
            />
          </MenuAccordion>

          <MenuAccordion
            title="Automations"
            icon={<AutoModeIcon sx={{ color: "#bbb" }} />}
          >
            <MenuItemWithIcon
              title="Scheduled Actions"
              icon={<ScheduleIcon sx={{ color: "#ccc" }} />}
            />
            <MenuItemWithIcon
              title="Manual Actions"
              icon={<LaunchIcon sx={{ color: "#ccc" }} />}
            />
            <MenuItemWithIcon
              title="Auto Messages"
              icon={<MarkEmailReadIcon sx={{ color: "#ccc" }} />}
            />
          </MenuAccordion>
        </Box>
      </ColBox>
    </Drawer>
  );
};

export default LeftNavigation;
