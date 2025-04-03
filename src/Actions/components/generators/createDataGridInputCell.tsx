import { Checkbox, MenuItem, TextField } from "@mui/material";
import { TDataGridInputCellParams } from "../../types/TDataGridInputCellParams";
import { formatStringDate } from "../../../Common/helpers/dateHelpers";
import { Box } from "@mui/system";

export const createDataGridInputCell = (
  params: TDataGridInputCellParams,
  processRowOnCellUpdate: (arg: never) => void,
  field: string,
  type: string = "text",
  selectOptions?: string[]
) => {
  const { row, value, hasFocus } = params;

  if (hasFocus && type !== "checkbox") {
    if (type === "select") {
      return (
        <TextField
          select
          defaultValue={value}
          variant="outlined"
          size="small"
          sx={{ pt: 0.5 }}
          onBlur={(event) => {
            const updatedRow = { ...row, [field]: event.target.value };
            processRowOnCellUpdate(updatedRow as never);
          }}
        >
          {selectOptions?.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      );
    } else {
      return (
        <TextField
          type={type}
          defaultValue={type === "date" ? formatStringDate(String(value)) : value}
          variant="outlined"
          size="small"
          sx={{ pt: 0.5 }}
          onBlur={(event) => {
            const updatedRow = { ...row, [field]: event.target.value };
            processRowOnCellUpdate(updatedRow as never);
          }}
          onKeyDown={(event) => {
            if (
              event.key === " " ||
              event.code === "Space" ||
              event.key === "ArrowLeft" ||
              event.key === "ArrowRight"
            ) {
              event.stopPropagation();
            }
          }}
        />
      );
    }
  } else {
    if (row.status === "inactive") {
      return <s>{value}</s>;
    }
    if (type === "checkbox") {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Checkbox
            checked={Boolean(value ?? false)}
            onChange={(event) => {
              const updatedRow = { ...row, [field]: event.target.checked };
              processRowOnCellUpdate(updatedRow as never);
            }}
            sx={{ pt: 0.5 }}
          />
        </Box>
      );
    }
    return value;
  }
};
