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
import Page from "../../Common/components/Page";
import useTheme from "../../Common/hooks/useTheme";

const AddBalanceEntry = () => {
  const { register, errors, handleSubmit, onSubmit } = useBalanceEntry();
  const { mode } = useTheme();

  return (
    <Page title="Add a Balance Entry">
      <Container
        maxWidth="md"
        component={Paper}
        sx={{
          borderRadius: 3,
          p: 4,
          textAlign: "center",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
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
    </Page>
  );
};

export default AddBalanceEntry;
