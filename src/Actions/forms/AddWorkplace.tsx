import { Box, Button, TextField, Container, Divider, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { addWorkplaceSchema } from "../validations/addWorkplace.schema";
import { TWorkplace } from "../types/TWorkplace";
import useWorkplaces from "../hooks/useWorkplace";
import { addWorkplaceFormDefault } from "./initialData/addWorkplaceFormDefault";

const AddWorkplace = ({
  setIsDialogOpen,
}: {
  setIsDialogOpen: (isOpen: boolean) => void;
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: addWorkplaceFormDefault,
    resolver: joiResolver(addWorkplaceSchema),
  });
  const { add } = useWorkplaces();

  const onFormSubmit = async (data: TWorkplace) => {
    await add(data);
    setIsDialogOpen(false);
  };

  return (
    <Box sx={{ p: 2, pb: 0 }}>
      <Container
        maxWidth="xl"
        component={Paper}
        sx={{
          p: 4,
          textAlign: "center",
        }}
      >
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Name"
              {...register("name")}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.name ? "error" : "primary"}
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
              fullWidth
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
              fullWidth
              sx={{ mb: 2 }}
              color={errors.address?.street ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="House Number"
              {...register("address.houseNumber")}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.address?.houseNumber ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="City"
              {...register("address.city")}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.address?.city ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Country"
              {...register("address.country")}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.address?.country ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Zip"
              {...register("address.zip")}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.address?.zip ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Main Phone"
              {...register("phone.main")}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.phone?.main ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Secondary Phone"
              {...register("phone.secondary")}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.phone?.secondary ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Divider sx={{ my: 2, background: "silver" }} />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="price Per Hour"
              {...register("pricePerHour")}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.pricePerHour ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="With Vat"
              {...register("withVat")}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.withVat ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="price Per Month"
              {...register("pricePerMonth")}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.pricePerMonth ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Start Date"
              {...register("startDate")}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.startDate ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="End Date"
              {...register("endDate")}
              variant="outlined"
              fullWidth
              sx={{ mb: 3 }}
              color={errors.endDate ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ fontSize: "1.2rem", py: 1 }}
            >
              Add
            </Button>

            <Button
              type="reset"
              variant="contained"
              color="error"
              fullWidth
              sx={{ fontSize: "1.2rem", py: 1 }}
            >
              Reset
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default AddWorkplace;
