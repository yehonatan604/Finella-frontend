import {
  Box,
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
import FormField from "../../Common/components/form/FormField";
import { joiResolver } from "@hookform/resolvers/joi";
import { noteSchema } from "../validations/note.schema";
import { DateTime } from "luxon";
import FormButtons from "../../Common/components/form/FormButtons";

type NoteFormProps = {
  setIsDialogOpen?: (isOpen: boolean) => void;
  setIsUpdateDialogOpen?: (isOpen: boolean) => void | null;
  note?: TNote | null;
};

const NoteForm = (props: NoteFormProps) => {
  const { setIsDialogOpen, setIsUpdateDialogOpen, note = null } = props;
  const { onSubmit, onUpdate, user } = useNote();
  const { mode } = useTheme();

  const formMethods = useForm<TNote>({
    defaultValues: note
      ? {
          ...note,
          userId: user._id,
          date: new Date(note.date).toISOString().split("T")[0],
        }
      : addNoteFormDefault(user._id),
    resolver: joiResolver(noteSchema),
  });

  const {
    reset,
    watch,
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
              <FormField
                label="Name"
                name="name"
                required
                value={watch("name")}
                onChange={(e) =>
                  setValue("name", e.target.value, {
                    shouldValidate: true,
                  })
                }
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
                  setValue("date", note ? date!.split("T")[0] : e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={watch("isSticky")}
                    onChange={(e) =>
                      setValue("isSticky", e.target.checked, { shouldValidate: true })
                    }
                  />
                }
                label="Sticky"
                sx={{ mb: 2 }}
              />
            </Box>

            <FormField
              label="Content"
              name="content"
              multiline
              rows={4}
              required
              value={watch("content")}
              onChange={(e) =>
                setValue("content", e.target.value, {
                  shouldValidate: true,
                })
              }
            />
            <FormField
              label="Extra notes"
              name="notes"
              multiline
              rows={2}
              value={watch("notes")}
              onChange={(e) =>
                setValue("notes", e.target.value, {
                  shouldValidate: true,
                })
              }
            />

            {note && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={watch("noteStatus") === "READ"}
                    onChange={(e) =>
                      setValue("noteStatus", e.target.checked ? "READ" : "PENDING", {
                        shouldValidate: true,
                      })
                    }
                  />
                }
                label="Mark as Read"
                sx={{ mb: 2 }}
              />
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
              <FormButtons
                isValid={isValid}
                onReset={() => {
                  reset(note ?? addNoteFormDefault(user._id));
                }}
              />
            </Box>
          </form>
        </FormProvider>
      </Container>
    </Box>
  );
};

export default NoteForm;
