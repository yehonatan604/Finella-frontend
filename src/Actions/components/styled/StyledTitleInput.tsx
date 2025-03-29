import { styled, TextField } from "@mui/material";

const StyledTitleInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    color: "#fff",
    fontSize: "1.3rem",
    border: "none",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent",
  },
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    color: "white",
    borderColor: "transparent",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent",
  },
  "& .MuiInputBase-input": {
    color: "#fff",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#fff",
  },
}));

export default StyledTitleInput;
