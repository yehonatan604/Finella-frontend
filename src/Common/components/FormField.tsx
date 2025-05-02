import React, { ChangeEvent } from "react";
import { MenuItem, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { TFormErrorMessage } from "../types/TFormErrorMessage";

type FormFieldProps = {
  label: string;
  name: string;
  setValue?: (value) => void;
  type?: string;
  required?: boolean;
  width?: string;
  selectArray?: string[];
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  sx?: object;
  rows?: number;
  multiline?: boolean;
};

const FormField = (props: FormFieldProps) => {
  const {
    label,
    name,
    type = "text",
    required = false,
    width = "100%",
    selectArray,
    defaultValue,
    onChange,
    className,
    sx = {},
    rows = 1,
    multiline = false,
  } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext();

  type KeyOfError = keyof typeof errors;

  return selectArray ? (
    <TextField
      className={className}
      label={label}
      {...register(name)}
      select
      required={required}
      variant="outlined"
      fullWidth
      sx={{ mb: 2, width, ...sx }}
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
      onChange={(e) => {
        if (onChange) {
          onChange(e as ChangeEvent<HTMLInputElement>);
        }
      }}
    >
      {selectArray.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  ) : (
    <TextField
      className={className}
      label={label}
      {...register(name)}
      type={type}
      required={required}
      variant="outlined"
      fullWidth
      sx={{ mb: 2, width, ...sx }}
      multiline={multiline}
      rows={rows}
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
      onChange={(e) => {
        if (onChange) {
          onChange(e as ChangeEvent<HTMLInputElement>);
        }
      }}
    />
  );
};

export default FormField;
