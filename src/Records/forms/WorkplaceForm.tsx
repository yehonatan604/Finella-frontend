import React from "react";
import { Box, Button, TextField, Container, Divider, Paper } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { workplaceSchema } from "../validations/workplace.schema";
import { TWorkplace } from "../types/TWorkplace";
import useWorkplaces from "../hooks/useWorkplace";
import { addWorkplaceFormDefault } from "./initialData/addWorkplaceFormDefault";
import FormValidationMessage from "../../Common/components/FormValidationMessage";
import FormField from "../../Common/components/FormField";

const WorkplaceForm = ({
  setIsDialogOpen,
  workplace = null,
}: {
  setIsDialogOpen: (isOpen: boolean) => void;
  workplace?: TWorkplace | null;
}) => {
  const { add, onUpdate, user } = useWorkplaces();

  const methods = useForm({
    mode: "onChange",
    defaultValues: workplace ?? addWorkplaceFormDefault(user?._id),
    resolver: joiResolver(workplaceSchema),
  });

  const {
    handleSubmit,
    register,
    reset,
    watch,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isValid },
  } = methods;

  const onFormSubmit = async (data: TWorkplace) => {
    const func = workplace ? onUpdate : add;
    await func(data);
    setIsDialogOpen(false);
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
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormField label="Name" name="name" type="text" required width="100%" />
              <FormField label="Email" name="email" type="email" required width="100%" />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormField label="Street" name="address.street" required width="100%" />
              <FormField
                label="House Number"
                name="address.houseNumber"
                required
                width="100%"
              />
              <FormField label="City" name="address.city" required width="100%" />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormField label="Country" name="address.country" required width="100%" />
              <FormField label="Zip" name="address.zip" required width="100%" />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormField label="Main Phone" name="phone.main" required width="100%" />
              <FormField label="Secondary Phone" name="phone.secondary" width="100%" />
            </Box>

            <Divider sx={{ mb: 2, color: "silver" }} />

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <TextField
                label="price Per Hour"
                {...register("pricePerHour")}
                variant="outlined"
                type="number"
                sx={{ mb: 2, width: "33%" }}
                color={errors.pricePerHour ? "error" : "primary"}
                slotProps={{ inputLabel: { shrink: true } }}
                error={!!errors.pricePerHour}
                helperText={errors.pricePerHour?.message as string}
                onChange={(e) => {
                  if (+e.target.value <= 0 && +watch("pricePerMonth")! <= 0) {
                    setError("pricePerHour", {
                      type: "manual",
                      message: "Price per hour or month must be greater than 0",
                    });
                  } else {
                    clearErrors("pricePerHour");
                    clearErrors("pricePerMonth");
                    setValue("pricePerHour", +e.target.value);
                  }
                }}
              />

              <TextField
                label="price Per Month"
                {...register("pricePerMonth")}
                variant="outlined"
                sx={{ mb: 2, width: "33%" }}
                color={errors.pricePerMonth ? "error" : "primary"}
                slotProps={{ inputLabel: { shrink: true } }}
                type="number"
                error={!!errors.pricePerMonth}
                helperText={errors.pricePerMonth?.message as string}
                onChange={(e) => {
                  if (+e.target.value <= 0 && +watch("pricePerHour")! <= 0) {
                    setError("pricePerMonth", {
                      type: "manual",
                      message: "Price per hour or month must be greater than 0",
                    });
                  } else {
                    clearErrors("pricePerMonth");
                    clearErrors("pricePerHour");
                    setValue("pricePerMonth", +e.target.value);
                  }
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormField
                label="Start Date"
                name="startDate"
                required
                type="date"
                width="100%"
              />
              <FormField label="End Date" name="endDate" type="date" width="100%" />
            </Box>

            <FormValidationMessage isValid={isValid} />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontSize: "1.2rem", py: 1 }}
              >
                {workplace ? "Update" : "Add"}
              </Button>

              <Button
                type="reset"
                variant="contained"
                color="error"
                fullWidth
                sx={{ fontSize: "1.2rem", py: 1 }}
                onClick={() => {
                  reset(workplace ?? addWorkplaceFormDefault(user?._id));
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

export default WorkplaceForm;
