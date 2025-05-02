import React from "react";
import { Box, Button, TextField, Container, MenuItem, Paper } from "@mui/material";
import useBalanceEntry from "../hooks/useBalanceEntry";
import useTheme from "../../Common/hooks/useTheme";
import { TBalanceEntry } from "../types/TBalanceEntry";
import { useForm } from "react-hook-form";
import { addBalanceEntryFormDefault } from "./initialData/addBalanceEntryFormDefault";
import { DateTime } from "luxon";

const BalanceEntryForm = ({
  setIsDialogOpen,
  setIsUpdateDialogOpen,
  bEntry = null,
}: {
  setIsDialogOpen: (isOpen: boolean) => void;
  setIsUpdateDialogOpen?: (isOpen: boolean) => void | null;
  bEntry?: TBalanceEntry | null;
}) => {
  const { onSubmit, onUpdate } = useBalanceEntry();
  const { mode } = useTheme();

  const {
    register,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<TBalanceEntry>({
    mode: "onChange",
    defaultValues: bEntry
      ? { ...bEntry, date: new Date(bEntry.date).toISOString().split("T")[0] }
      : addBalanceEntryFormDefault,
  });

  const onFormSubmit = async (data: TBalanceEntry) => {
    const func = bEntry ? onUpdate : onSubmit;
    const closeDialog =
      bEntry && setIsUpdateDialogOpen ? setIsUpdateDialogOpen : setIsDialogOpen;
    await func(data);
    closeDialog(false);
  };

  return (
    <Box sx={{ p: 2, pb: 0 }}>
      <Container
        maxWidth="xl"
        component={Paper}
        sx={{
          p: 4,
        }}
      >
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Name"
              {...register("name")}
              fullWidth
              sx={{ mb: 2 }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              label="type"
              {...register("type")}
              fullWidth
              sx={{ mb: 2 }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              select
              defaultValue={"expense"}
            >
              <MenuItem value={"income"}>Income</MenuItem>
              <MenuItem value={"expense"}>Expense</MenuItem>
            </TextField>

            <TextField
              label="Date"
              type="date"
              className={mode === "dark" ? "dark" : ""}
              fullWidth
              sx={{ mb: 2 }}
              color={errors.date ? "error" : "primary"}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              {...register("date")}
              defaultValue={watch("date")}
              onChange={(e) => {
                const date = DateTime.fromISO(e.target.value, { zone: "local" }).toISO();
                setValue("date", bEntry ? date!.split("T")[0] : e.target.value);
              }}
            />

            <TextField
              label="Price"
              {...register("price")}
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.price ? "error" : "primary"}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              defaultValue={0}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="notes"
              {...register("notes")}
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 2 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ fontSize: "1.2rem" }}
              disabled={!isValid}
            >
              {bEntry ? "Update" : "Add"}
            </Button>

            <Button
              type="reset"
              variant="contained"
              color="error"
              fullWidth
              sx={{ fontSize: "1.2rem" }}
              onClick={() => {
                reset(bEntry ?? addBalanceEntryFormDefault);
              }}
            >
              Reset
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default BalanceEntryForm;
