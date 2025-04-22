import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledDateTimePicker = styled(TextField)(() => ({
  width: "220px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent",
  },
  "& .MuiInputBase-input": {
    color: "black",
  },
  "& input[type='datetime-local']::-webkit-calendar-picker-indicator": {
    filter: "invert(1) brightness(0.2) contrast(0.8)",
  },
  "& .MuiInputBase-root": {
    backgroundColor: "transparent",
  },
  "& .MuiInputBase-root:hover": {
    backgroundColor: "transparent",
  },
  "& .MuiInputBase-root:focus": {
    backgroundColor: "transparent",
  },
}));

export default StyledDateTimePicker;
