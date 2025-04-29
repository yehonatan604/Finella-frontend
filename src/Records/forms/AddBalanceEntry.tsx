import React from "react";
import {
  Box,
  Button,
  TextField,
  Container,
  MenuItem,
  Checkbox,
  FormLabel,
  Paper,
} from "@mui/material";
import useBalanceEntry from "../hooks/useBalanceEntry";
import useTheme from "../../Common/hooks/useTheme";
import { TBalanceEntry } from "../types/TBalanceEntry";

const AddBalanceEntry = ({
  setIsDialogOpen,
}: {
  setIsDialogOpen: (isOpen: boolean) => void;
}) => {
  const { register, errors, handleSubmit, onSubmit } = useBalanceEntry();
  const { mode } = useTheme();

  const onFormSubmit = async (data: TBalanceEntry) => {
    await onSubmit(data);
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
              {...register("date")}
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
            />

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
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
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

            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                gap: 1,
              }}
            >
              <FormLabel style={{ color: "white" }}>With VAT</FormLabel>
              <Checkbox {...register("withVat")} style={{ color: "white" }} />
            </Box>

            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                gap: 1,
              }}
            >
              <FormLabel style={{ color: "white" }}>Is Payed</FormLabel>
              <Checkbox {...register("isPayed")} style={{ color: "white" }} />
            </Box>
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
            >
              Add
            </Button>

            <Button
              type="reset"
              variant="contained"
              color="error"
              fullWidth
              sx={{ fontSize: "1.2rem" }}
            >
              Reset
            </Button>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default AddBalanceEntry;
