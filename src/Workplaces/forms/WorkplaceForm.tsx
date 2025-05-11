import { Box, Button, Container, Divider, Paper } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { workplaceSchema } from "../validations/workplace.schema";
import { TWorkplace } from "../types/TWorkplace";
import useWorkplaces from "../hooks/useWorkplace";
import { addWorkplaceFormDefault } from "./initialData/addWorkplaceFormDefault";
import FormValidationMessage from "../../Common/components/form/FormValidationMessage";
import FormField from "../../Common/components/form/FormField";
import useTheme from "../../Common/hooks/useTheme";
import { DateTime } from "luxon";

const WorkplaceForm = ({
  setIsDialogOpen,
  workplace = null,
}: {
  setIsDialogOpen: (isOpen: boolean) => void;
  workplace?: TWorkplace | null;
}) => {
  const { add, onUpdate, user } = useWorkplaces();
  const { mode } = useTheme();

  const formMethods = useForm<TWorkplace>({
    defaultValues: workplace
      ? {
          ...workplace,
          startDate: new Date(workplace.startDate).toISOString().split("T")[0],
          endDate: workplace.endDate
            ? new Date(workplace.endDate).toISOString().split("T")[0]
            : "",
        }
      : addWorkplaceFormDefault(user._id),
    resolver: joiResolver(workplaceSchema),
  });

  const {
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isValid },
  } = formMethods;

  const onFormSubmit = async (data: TWorkplace) => {
    const func = workplace ? onUpdate : add;
    await func(data);
    setIsDialogOpen(false);
  };

  console.log(errors);
  console.log(watch());

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
              <FormField
                label="Name"
                name="name"
                type="text"
                required
                width="100%"
                value={watch("name")}
                onChange={(e) => {
                  setValue("name", e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                required
                width="100%"
                value={watch("email")}
                onChange={(e) => {
                  setValue("email", e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormField
                label="Street"
                name="address.street"
                required
                width="100%"
                value={watch("address.street")}
                onChange={(e) => {
                  setValue("address.street", e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
              <FormField
                label="House Number"
                name="address.houseNumber"
                required
                width="100%"
                value={watch("address.houseNumber")}
                onChange={(e) => {
                  setValue("address.houseNumber", e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
              <FormField
                label="City"
                name="address.city"
                required
                width="100%"
                value={watch("address.city")}
                onChange={(e) => {
                  setValue("address.city", e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormField
                label="Country"
                name="address.country"
                required
                width="100%"
                value={watch("address.country")}
                onChange={(e) => {
                  setValue("address.country", e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
              <FormField
                label="Zip"
                name="address.zip"
                required
                width="100%"
                value={watch("address.zip")}
                onChange={(e) => {
                  setValue("address.zip", e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormField
                label="Main Phone"
                name="phone.main"
                required
                width="100%"
                value={watch("phone.main")}
                onChange={(e) => {
                  setValue("phone.main", e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
              <FormField
                label="Secondary Phone"
                name="phone.secondary"
                width="100%"
                value={watch("phone.secondary")}
                onChange={(e) => {
                  setValue("phone.secondary", e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
            </Box>

            <Divider sx={{ mb: 2, color: "silver" }} />

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <FormField
                label="price Per Hour"
                name="pricePerHour"
                required
                type="number"
                sx={{ mb: 2, width: "33%" }}
                value={watch("pricePerHour")}
                onChange={(e) => {
                  if (+e.target.value <= 0 && +watch("pricePerMonth")! <= 0) {
                    setError("pricePerHour", {
                      type: "manual",
                      message: "Price per hour or month must be greater than 0",
                    });
                  } else {
                    clearErrors("pricePerHour");
                    clearErrors("pricePerMonth");
                    setValue("pricePerHour", +e.target.value, {
                      shouldValidate: true,
                    });
                  }
                }}
              />

              <FormField
                label="price Per Month"
                name="pricePerMonth"
                sx={{ mb: 2, width: "33%" }}
                type="number"
                onChange={(e) => {
                  if (+e.target.value <= 0 && +watch("pricePerHour")! <= 0) {
                    setError("pricePerMonth", {
                      type: "manual",
                      message: "Price per hour or month must be greater than 0",
                    });
                  } else {
                    clearErrors("pricePerMonth");
                    clearErrors("pricePerHour");
                    setValue("pricePerMonth", +e.target.value, {
                      shouldValidate: true,
                    });
                  }
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormField
                className={mode === "dark" ? "dark" : ""}
                label="Start Date"
                name="startDate"
                required
                type="date"
                width="100%"
                value={watch("startDate")}
                onChange={(e) => {
                  const date = DateTime.fromISO(e.target.value, {
                    zone: "local",
                  }).toISO();
                  setValue(
                    "startDate",
                    workplace ? date!.split("T")[0] : e.target.value,
                    {
                      shouldValidate: true,
                    }
                  );
                }}
              />
              <FormField
                className={mode === "dark" ? "dark" : ""}
                label="End Date"
                name="endDate"
                type="date"
                width="100%"
                value={watch("endDate")}
                onChange={(e) => {
                  const date = DateTime.fromISO(e.target.value, {
                    zone: "local",
                  }).toISO();
                  setValue("endDate", workplace ? date!.split("T")[0] : e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
            </Box>

            <FormValidationMessage isValid={isValid} />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontSize: "1.2rem", py: 1 }}
                disabled={!isValid}
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
