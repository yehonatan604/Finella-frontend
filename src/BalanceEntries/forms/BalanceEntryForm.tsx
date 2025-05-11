import { Box, Container, Paper } from "@mui/material";
import useBalanceEntry from "../hooks/useBalanceEntry";
import useTheme from "../../Common/hooks/useTheme";
import { TBalanceEntry } from "../types/TBalanceEntry";
import { FormProvider, useForm } from "react-hook-form";
import { addBalanceEntryFormDefault } from "./initialData/addBalanceEntryFormDefault";
import { DateTime } from "luxon";
import FormField from "../../Common/components/form/FormField";
import { joiResolver } from "@hookform/resolvers/joi";
import { balanceEntrySchema } from "../validations/balanceEntry.schema";
import FormButtons from "../../Common/components/form/FormButtons";
import FormValidationMessage from "../../Common/components/form/FormValidationMessage";

type BalanceEntryFormProps = {
  setIsDialogOpen: (isOpen: boolean) => void;
  setIsUpdateDialogOpen?: (isOpen: boolean) => void | null;
  bEntry?: TBalanceEntry | null;
};

const BalanceEntryForm = (props: BalanceEntryFormProps) => {
  const { setIsDialogOpen, setIsUpdateDialogOpen, bEntry = null } = props;
  const { onSubmit, onUpdate, user } = useBalanceEntry();
  const { mode } = useTheme();

  const formMethods = useForm<TBalanceEntry>({
    defaultValues: bEntry
      ? { ...bEntry, date: new Date(bEntry.date).toISOString().split("T")[0] }
      : addBalanceEntryFormDefault(user._id),
    resolver: joiResolver(balanceEntrySchema),
  });

  const {
    reset,
    setValue,
    watch,
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
                value={watch("type") || "expense"}
                onChange={(e) => {
                  setValue("type", e.target.value as "income" | "expense", {
                    shouldValidate: true,
                  });
                }}
              />

              <FormField
                className={mode === "dark" ? "dark" : ""}
                label="Date"
                type="date"
                name="date"
                required
                value={watch("date")}
                onChange={(e) => {
                  const date = DateTime.fromISO(e.target.value, {
                    zone: "local",
                  }).toISO();
                  setValue("date", bEntry ? date!.split("T")[0] : e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />

              <FormField
                label="Price"
                type="number"
                name="price"
                required
                value={watch("price")}
                onChange={(e) => {
                  setValue("price", +e.target.value, { shouldValidate: true });
                }}
              />
            </Box>

            <FormField
              label="Notes"
              type="text"
              name="notes"
              rows={3}
              multiline
              value={watch("notes")}
              onChange={(e) => {
                setValue("notes", e.target.value, { shouldValidate: true });
              }}
            />

            <FormValidationMessage isValid={isValid} />

            <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
              <FormButtons
                isValid={isValid}
                onReset={() => {
                  reset(
                    bEntry
                      ? {
                          ...bEntry,
                          date: new Date(bEntry.date).toISOString().split("T")[0],
                        }
                      : addBalanceEntryFormDefault(user._id)
                  );
                }}
              />
            </Box>
          </form>
        </FormProvider>
      </Container>
    </Box>
  );
};

export default BalanceEntryForm;
