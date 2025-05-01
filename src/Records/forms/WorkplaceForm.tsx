import React from "react";
import {
  Box,
  Button,
  TextField,
  Container,
  Divider,
  Paper,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { workplaceSchema } from "../validations/addWorkplace.schema";
import { TWorkplace } from "../types/TWorkplace";
import useWorkplaces from "../hooks/useWorkplace";
import { addWorkplaceFormDefault } from "./initialData/addWorkplaceFormDefault";
import FormValidationMessage from "../../Common/components/FormValidationMessage";

const WorkplaceForm = ({
  setIsDialogOpen,
  workplace = null,
}: {
  setIsDialogOpen: (isOpen: boolean) => void;
  workplace?: TWorkplace | null;
}) => {
  const { add, onUpdate, user } = useWorkplaces();

  const {
    handleSubmit,
    register,
    reset,
    watch,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: workplace ?? addWorkplaceFormDefault(user?._id),
    resolver: joiResolver(workplaceSchema),
  });

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
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Name"
              {...register("name")}
              variant="outlined"
              required
              fullWidth
              sx={{ mb: 2 }}
              color={errors.name ? "error" : "primary"}
              error={!!errors.name}
              helperText={errors.name?.message as string}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
            <TextField
              label="Email"
              {...register("email")}
              variant="outlined"
              required
              fullWidth
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message as string}
              sx={{ mb: 2 }}
              color={errors.email ? "error" : "primary"}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Street"
              {...register("address.street")}
              variant="outlined"
              required
              error={!!errors.address?.street}
              helperText={errors.address?.street?.message as string}
              fullWidth
              sx={{ mb: 2 }}
              color={errors.address?.street ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="House Number"
              {...register("address.houseNumber")}
              variant="outlined"
              required
              fullWidth
              sx={{ mb: 2 }}
              color={errors.address?.houseNumber ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errors.address?.houseNumber}
              helperText={errors.address?.houseNumber?.message as string}
            />
            <TextField
              label="City"
              {...register("address.city")}
              required
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.address?.city ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errors.address?.city}
              helperText={errors.address?.city?.message as string}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Country"
              {...register("address.country")}
              required
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.address?.country ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errors.address?.country}
              helperText={errors.address?.country?.message as string}
            />
            <TextField
              label="Zip"
              {...register("address.zip")}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.address?.zip ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errors.address?.zip}
              helperText={errors.address?.zip?.message as string}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Main Phone"
              {...register("phone.main")}
              variant="outlined"
              required
              fullWidth
              sx={{ mb: 2 }}
              color={errors.phone?.main ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errors.phone?.main}
              helperText={errors.phone?.main?.message as string}
            />
            <TextField
              label="Secondary Phone"
              {...register("phone.secondary")}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.phone?.secondary ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errors.phone?.secondary}
              helperText={errors.phone?.secondary?.message as string}
            />
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
            <Box
              sx={{
                width: "33%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    {...register("withVat")}
                    color="primary"
                    defaultChecked={workplace?.withVat}
                  />
                }
                label="With VAT"
                sx={{ mb: 2 }}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Start Date"
              required
              {...register("startDate")}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.startDate ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
              type="date"
            />
            <TextField
              label="End Date"
              {...register("endDate")}
              variant="outlined"
              fullWidth
              sx={{ mb: 3 }}
              color={errors.endDate ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
              type="date"
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
                reset(workplace ? workplace : addWorkplaceFormDefault(user?._id));
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

export default WorkplaceForm;
