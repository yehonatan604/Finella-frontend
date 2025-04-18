import {
  Box,
  Button,
  TextField,
  Container,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import useNote from "../hooks/useNote";
import { TNote } from "../types/TNote";
import useTheme from "../../Common/hooks/useTheme";

const AddNoteForm = ({
  setIsDialogOpen,
}: {
  setIsDialogOpen: (isOpen: boolean) => void;
}) => {
  const { register, errors, handleSubmit, onSubmit } = useNote();
  const { mode } = useTheme();

  const onFormSubmit = async (data: TNote) => {
    await onSubmit(data);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          px: 4,
          pt: 2,
          textAlign: "center",
        }}
      >
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextField
              label="Name"
              {...register("name")}
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              label="Date"
              {...register("date")}
              type="date"
              className={mode === "dark" ? "dark" : ""}
              fullWidth
              color={errors.date ? "error" : "primary"}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <FormControlLabel
              control={<Checkbox {...register("isSticky")} />}
              label="Sticky"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              label="Content"
              {...register("content")}
              fullWidth
              multiline
              rows={4}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              label="Extra notes"
              {...register("notes")}
              fullWidth
              multiline
              rows={2}
              sx={{ mb: 2 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

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
    </>
  );
};

export default AddNoteForm;
