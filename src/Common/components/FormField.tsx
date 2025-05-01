import React from "react";
import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

const Field = ({
  label,
  name,
  type = "text",
  required = false,
  width = "100%",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  width?: string;
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <TextField
      label={label}
      {...register(name)}
      type={type}
      required={required}
      variant="outlined"
      fullWidth
      sx={{ mb: 2, width }}
      error={
        !!errors?.[name.split(".")[0] as keyof typeof errors]?.[name.split(".")[1] || ""]
      }
      helperText={
        (
          errors?.[name.split(".")[0] as keyof typeof errors] as Record<
            string,
            { message?: string }
          >
        )?.[name.split(".")[1] || ""]?.message ??
        (errors?.[name as keyof typeof errors]?.message as string)
      }
      slotProps={{ inputLabel: { shrink: true } }}
      color={
        errors?.[name.split(".")[0] as keyof typeof errors]?.[name.split(".")[1] || ""]
          ? "error"
          : "primary"
      }
    />
  );
};

export default Field;
