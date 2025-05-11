import { ChangeEvent } from "react";
import { MenuItem, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { TFormErrorMessage } from "../../types/TFormErrorMessage";

type FormFieldProps = {
  label: string;
  name: string;
  setValue?: (value) => void;
  type?: string;
  required?: boolean;
  width?: string;
  selectArray?: string[] | number[];
  defaultValue?: string | number;
  value?: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  sx?: object;
  rows?: number;
  multiline?: boolean;
  selectItems?: React.ReactNode;
  doRegister?: boolean;
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
    value,
    onChange,
    className,
    sx = {},
    rows = 1,
    multiline = false,
    selectItems,
    doRegister = true,
  } = props;
  const {
    register,
    formState: { errors },
  } = useFormContext();

  type KeyOfError = keyof typeof errors;

  return selectArray || selectItems ? (
    <TextField
      className={className}
      label={label}
      {...(doRegister ? register(name) : {})}
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
      value={value}
      onChange={(e) => {
        if (onChange) {
          onChange(e as ChangeEvent<HTMLInputElement>);
        }
      }}
    >
      {selectItems ??
        selectArray!.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
    </TextField>
  ) : (
    <TextField
      className={className}
      label={label}
      {...(doRegister ? register(name) : {})}
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
