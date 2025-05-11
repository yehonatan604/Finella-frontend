import { Box, Checkbox, FormControlLabel } from "@mui/material";

type ShowInactiveCheckboxProps = {
  showInactive: boolean;
  setShowInactive: (showInactive: boolean) => void;
  label: string;
  sx?: object;
};

const ShowInactiveCheckbox = (props: ShowInactiveCheckboxProps) => {
  const { showInactive, setShowInactive, label } = props;
  return (
    <Box
      sx={{
        width: "73%",
        display: "flex",
        gap: "1rem",
        m: 2,
        mt: 0,
        ...props.sx,
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
          />
        }
        label={label}
      />
    </Box>
  );
};

export default ShowInactiveCheckbox;
