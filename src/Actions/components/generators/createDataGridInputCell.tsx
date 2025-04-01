import { MenuItem, TextField } from "@mui/material";
import { TDataGridInputCellParams } from "../../types/TDataGridInputCellParams";
import { formatStringDate } from "../../../Core/helpers/dateHelpers";

export const createDataGridInputCell = (
  params: TDataGridInputCellParams,
  processRowOnCellUpdate: (arg: never) => void,
  field: string,
  type: string = "text",
  selectOptions?: string[]
) => {
  const { row, value, hasFocus } = params;

  if (hasFocus) {
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
    return <span>{value}</span>;
  }
};
