import React from "react";
import {
  Box,
  Button,
  Container,
  Checkbox,
  FormControlLabel,
  Divider,
  Paper,
} from "@mui/material";
import useNote from "../hooks/useNote";
import { TNote } from "../types/TNote";
import useTheme from "../../Common/hooks/useTheme";
import { FormProvider, useForm } from "react-hook-form";
import { addNoteFormDefault } from "./initialData/addNoteFormDefault";
import FormField from "../../Common/components/FormField";
import { joiResolver } from "@hookform/resolvers/joi";
import { noteSchema } from "../validations/note.schema";
import { DateTime } from "luxon";

type NoteFormProps = {
  setIsDialogOpen?: (isOpen: boolean) => void;
  setIsUpdateDialogOpen?: (isOpen: boolean) => void | null;
  note?: TNote | null;
};

const NoteForm = (props: NoteFormProps) => {
  const { setIsDialogOpen, setIsUpdateDialogOpen, note = null } = props;
  const { onSubmit, onUpdate } = useNote();
  const { mode } = useTheme();

  const formMethods = useForm<TNote>({
    mode: "onChange",
    defaultValues: note
      ? { ...note, date: new Date(note.date).toISOString().split("T")[0] }
      : addNoteFormDefault,
    resolver: joiResolver(noteSchema),
  });

  const {
    register,
    reset,
    setValue,
    formState: { isValid },
    handleSubmit,
  } = formMethods;

  const onFormSubmit = async (data: TNote) => {
    const func = note ? onUpdate : onSubmit;
    await func(data);
    const setDialog =
      note && setIsUpdateDialogOpen ? setIsUpdateDialogOpen : setIsDialogOpen;
    setDialog!(false);
  };

  if (note) {
    console.log(note);
  }

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
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FormField label="Name" name="name" required />

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
                  setValue("date", note ? date!.split("T")[0] : e.target.value);
                }}
              />

              <FormControlLabel
                control={<Checkbox {...register("isSticky")} />}
                label="Sticky"
                sx={{ mb: 2 }}
              />
            </Box>

            <FormField label="Content" name="content" multiline rows={4} required />
            <FormField label="Extra notes" name="notes" multiline rows={2} />

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontSize: "1.2rem" }}
                disabled={!isValid}
              >
                Add
              </Button>

              <Button
                type="reset"
                variant="contained"
                color="error"
                fullWidth
                sx={{ fontSize: "1.2rem" }}
                onClick={() => {
                  reset(note ?? addNoteFormDefault);
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

export default NoteForm;
