import React from "react";
import { Box, Button, Container, Paper } from "@mui/material";
import useBalanceEntry from "../hooks/useBalanceEntry";
import useTheme from "../../Common/hooks/useTheme";
import { TBalanceEntry } from "../types/TBalanceEntry";
import { FormProvider, useForm } from "react-hook-form";
import { addBalanceEntryFormDefault } from "./initialData/addBalanceEntryFormDefault";
import { DateTime } from "luxon";
import FormField from "../../Common/components/FormField";

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

  const formMethods = useForm<TBalanceEntry>({
    defaultValues: bEntry
      ? { ...bEntry, date: new Date(bEntry.date).toISOString().split("T")[0] }
      : addBalanceEntryFormDefault,
  });

  const {
    reset,
    setValue,
    formState: { isValid },
    handleSubmit,
  } = formMethods;

  const onFormSubmit = async (data: TBalanceEntry) => {
    const func = bEntry ? onUpdate : onSubmit;
    const setDialog =
      bEntry && setIsUpdateDialogOpen ? setIsUpdateDialogOpen : setIsDialogOpen;
    await func(data);
    setDialog(false);
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
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormField label="Name" type="text" name="name" required />

              <FormField
                label="Entry Type"
                name="type"
                required
                selectArray={["income", "expense"]}
                defaultValue={"expense"}
              />

              <FormField
                className={mode === "dark" ? "dark" : ""}
                label="Date"
                type="date"
                name="date"
                required
                onChange={(e) => {
                  const date = DateTime.fromISO(e.target.value, {
                    zone: "local",
                  }).toISO();
                  setValue("date", bEntry ? date!.split("T")[0] : e.target.value);
                }}
              />

              <FormField label="Price" type="number" name="price" required />
            </Box>

            <FormField label="Notes" type="text" name="notes" rows={3} multiline />

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
        </FormProvider>
      </Container>
    </Box>
  );
};

export default BalanceEntryForm;
