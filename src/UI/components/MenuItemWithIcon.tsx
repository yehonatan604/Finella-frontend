import { MenuItem } from "@mui/material";
import { Box } from "@mui/system";

type SizedMenuItemProps = {
  title: string;
  fontSize?: number;
  icon?: React.ReactNode;
};

export const MenuItemWithIcon = (props: SizedMenuItemProps) => {
  const { title, fontSize, icon } = props;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
      }}
    >
      {icon && icon}
      <MenuItem sx={{ fontSize: fontSize || 16 }}>{title}</MenuItem>
    </Box>
  );
};
