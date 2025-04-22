import {
  Box,
  Button,
  TextField,
  Container,
  Paper,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";
import { DateTime } from "luxon";
import useTheme from "../../Common/hooks/useTheme";
import useToDo from "../hooks/useToDo";
import { TTask } from "../../Records/types/TTask";
import { TToDo } from "../types/TToDo";

const AddToDo = ({ setIsDialogOpen }: { setIsDialogOpen: (isOpen: boolean) => void }) => {
  const { mode } = useTheme();
  const { register, errors, handleSubmit, onSubmit, watch } = useToDo();
  const [withTasks, setWithTasks] = useState(true);
  const [tasks, setTasks] = useState<TTask[]>([
    {
      name: "",
      priority: 1,
      taskStatus: "PENDING",
    },
  ]);

  const onFormSubmit = async (data: TToDo) => {
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

            <TextField
              label="Start Date"
              {...register("startDate")}
              type="date"
              className={mode === "dark" ? "dark" : ""}
              fullWidth
              defaultValue={
                watch().startDate
                  ? DateTime.fromISO(watch().startDate)
                      .setZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
                      .toFormat("yyyy-MM-dd")
                  : undefined
              }
              sx={{ mb: 2 }}
              color={errors.startDate ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              label="End Date"
              {...register("endDate")}
              type="date"
              className={mode === "dark" ? "dark" : ""}
              fullWidth
              defaultValue={
                watch().endDate
                  ? DateTime.fromISO(watch().endDate)
                      .setZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
                      .toFormat("yyyy-MM-dd")
                  : undefined
              }
              sx={{ mb: 2 }}
              color={errors.endDate ? "error" : "primary"}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Description"
              {...register("description")}
              fullWidth
              multiline
              rows={2}
              sx={{ mb: 2 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <FormControlLabel
            control={
              <Checkbox
                checked={withTasks}
                color="primary"
                onChange={(e) => {
                  setWithTasks(e.target.checked);
                }}
              />
            }
            label="With Tasks"
            sx={{ mb: 2, textAlign: "left" }}
          />

          {withTasks && tasks.length > 0 && (
            <>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {tasks.map((task, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    <TextField
                      label="Task Name"
                      {...register(`tasks.${index}.name`)}
                      required={withTasks}
                      sx={{ mb: 2, width: "25%" }}
                      slotProps={{ inputLabel: { shrink: true } }}
                      size="small"
                      defaultValue={task.name}
                    />
                    <TextField
                      label="Task Priority"
                      {...register(`tasks.${index}.priority`)}
                      type="number"
                      sx={{ mb: 2, width: "25%" }}
                      slotProps={{ inputLabel: { shrink: true } }}
                      size="small"
                      defaultValue={task.priority}
                    />
                    <TextField
                      label="Task Notes"
                      {...register(`tasks.${index}.notes`)}
                      size="small"
                      sx={{ mb: 2, width: "25%" }}
                      slotProps={{ inputLabel: { shrink: true } }}
                      defaultValue={task.notes}
                    />
                    {tasks.length > 1 && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          setTasks((prev) => prev.filter((_, i) => i !== index));
                        }}
                        sx={{ mb: 2 }}
                      >
                        -
                      </Button>
                    )}
                    {index === tasks.length - 1 && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setTasks((prev) => [
                            ...prev,
                            {
                              name: "",
                              description: "",
                              priority: 1,
                              taskStatus: "PENDING",
                            },
                          ]);
                        }}
                        sx={{ mb: 2 }}
                      >
                        +
                      </Button>
                    )}
                  </Box>
                ))}
              </Box>
            </>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Notes"
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
    </Box>
  );
};

export default AddToDo;
