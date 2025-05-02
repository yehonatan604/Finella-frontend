import React from "react";
import { MenuItem, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { TFormErrorMessage } from "../types/TFormErrorMessage";

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  width?: string;
  selectArray?: string[] | null;
  defaultValue?: string | null;
};

const FormField = (props: FormFieldProps) => {
  const {
    label,
    name,
    type = "text",
    required = false,
    width = "100%",
    selectArray = null,
    defaultValue = null,
  } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext();

  type KeyOfError = keyof typeof errors;

  return selectArray ? (
    <TextField
      label={label}
      {...register(name)}
      select
      required={required}
      variant="outlined"
      fullWidth
      sx={{ mb: 2, width }}
      error={!!errors?.[name.split(".")[0] as KeyOfError]?.[name.split(".")[1] || ""]}
      helperText={
        (errors?.[name.split(".")[0] as KeyOfError] as TFormErrorMessage)?.[
          name.split(".")[1] || ""
        ]?.message ?? (errors?.[name as KeyOfError]?.message as string)
      }
      slotProps={{ inputLabel: { shrink: true } }}
      color={
        errors?.[name.split(".")[0] as KeyOfError]?.[name.split(".")[1] || ""]
          ? "error"
          : "primary"
      }
      defaultValue={defaultValue}
    >
      {selectArray.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  ) : (
    <TextField
      label={label}
      {...register(name)}
      type={type}
      required={required}
      variant="outlined"
      fullWidth
      sx={{ mb: 2, width }}
      error={!!errors?.[name.split(".")[0] as KeyOfError]?.[name.split(".")[1] || ""]}
      helperText={
        (errors?.[name.split(".")[0] as KeyOfError] as TFormErrorMessage)?.[
          name.split(".")[1] || ""
        ]?.message ?? (errors?.[name as KeyOfError]?.message as string)
      }
      slotProps={{ inputLabel: { shrink: true } }}
      color={
        errors?.[name.split(".")[0] as KeyOfError]?.[name.split(".")[1] || ""]
          ? "error"
          : "primary"
      }
    />
  );
};

export default FormField;
