import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Typography,
  Divider,
  Box,
  Stack,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { TToDo } from "../types/TToDo";
import { ChangeEvent, useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../../Core/helpers/stringHelpers";
import DialogXButton from "../components/DialogXButton";
import StyledTitleInput from "../components/styled/StyledTitleInput";

type ToDoDetailsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  toDo: TToDo;
  onSubmit: (toDo: TToDo) => void;
};

const ToDoDetailsDialog = ({
  isOpen,
  onClose,
  toDo,
  onSubmit,
}: ToDoDetailsDialogProps) => {
  const [data, setData] = useState<TToDo>(toDo);
  const [withTasks, setWithTasks] = useState(true);
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);

  const handlChanges = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Submitting data:", data);
    onSubmit(data);
    onClose();
  };

  useEffect(() => {
    const completedTasks = data.tasks?.filter((task) => task.taskStatus === "COMPLETE");
    const totalTasks = data.tasks?.length ?? 0;
    const completedCount = completedTasks?.length ?? 0;

    if (totalTasks > 0) {
      setData((prev) => ({
        ...prev,
        toDoStatus: completedCount === totalTasks ? "COMPLETE" : "PENDING",
      }));
    }
  }, [data.tasks]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md" sx={{ left: "15vw" }}>
      <DialogTitle
        sx={{
          backgroundColor: "primary.main",
          color: "#fff",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: ".5rem",
        }}
      >
        <StyledTitleInput
          type="text"
          name="name"
          value={capitalizeFirstLetter(data.name)}
          sx={{ width: 705 }}
          onChange={handlChanges}
        />
        <DialogXButton onClose={onClose} />
      </DialogTitle>
      <DialogContent sx={{ p: 3, pb: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            my: 2,
            gap: 2,
          }}
        >
          <TextField
            type="text"
            name="description"
            value={capitalizeFirstLetter(data.description)}
            label="Description"
            multiline
            rows={2}
            sx={{ width: 700, color: "#fff" }}
            onChange={handlChanges}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>Start Date:</Typography>
              <TextField
                type="date"
                name="startDate"
                value={
                  data.startDate
                    ? new Date(data.startDate).toISOString().split("T")[0]
                    : ""
                }
                size="small"
                sx={{ minWidth: 130 }}
                onChange={handlChanges}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>End Date:</Typography>
              <TextField
                type="date"
                name="endDate"
                value={
                  data.endDate ? new Date(data.endDate).toISOString().split("T")[0] : ""
                }
                size="small"
                sx={{ minWidth: 130 }}
                onChange={handlChanges}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>Status:</Typography>
              <TextField
                select
                label="ToDO Status"
                name="toDoStatus"
                value={data.toDoStatus}
                onChange={handlChanges}
                size="small"
                sx={{ minWidth: 130 }}
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="COMPLETE">Complete</MenuItem>
                <MenuItem value="CANCELED">Canceled</MenuItem>
                <MenuItem value="FAILED">Failed</MenuItem>
              </TextField>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {data.notes && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Notes:</strong> {toDo.notes}
          </Typography>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={withTasks}
              color="primary"
              onChange={(e) => {
                setWithTasks(e.target.checked);
                if (!e.target.checked && data.tasks?.length === 0) {
                  setData({
                    ...data,
                    tasks: [
                      {
                        name: "Task 1",
                        priority: 1,
                        taskStatus: "PENDING",
                        notes: "",
                      },
                    ],
                  });
                }
              }}
            />
          }
          label="With Tasks"
        />

        {withTasks &&
          data?.tasks?.map((task, index) => (
            <Box key={index} sx={{ mt: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Checkbox
                  checked={task.taskStatus === "COMPLETE"}
                  onChange={(e) => {
                    const updatedTasks = [...(data.tasks || [])];
                    updatedTasks[index].taskStatus = e.target.checked
                      ? "COMPLETE"
                      : "PENDING";
                    setData({ ...data, tasks: updatedTasks });
                  }}
                  color="success"
                  size="small"
                />
                <Box
                  onClick={() => {
                    setEditingTaskIndex(index);
                  }}
                  onBlur={() => {}}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") {
                      e.preventDefault();
                    }
                  }}
                >
                  <Typography fontWeight="bold">
                    {editingTaskIndex !== index ? (
                      task.taskStatus === "COMPLETE" ? (
                        <s>{task.name}</s>
                      ) : (
                        task.name
                      )
                    ) : (
                      <TextField
                        type="text"
                        name="name"
                        value={capitalizeFirstLetter(task.name)}
                        label="Task Name"
                        size="small"
                        autoFocus
                        onBlur={() => setEditingTaskIndex(null)}
                        sx={{
                          "& .MuiInputBase-root": {
                            color: "#000",
                            fontSize: "1rem",
                          },
                        }}
                        onChange={(e) => {
                          const updatedTasks = [...(data.tasks || [])];
                          updatedTasks[index].name = e.target.value;
                          setData({ ...data, tasks: updatedTasks });
                        }}
                      />
                    )}
                  </Typography>
                </Box>
                {task.notes && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Notes: {task.notes}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => {
                    const updatedTasks = [...(data.tasks || [])];
                    updatedTasks.splice(index, 1);
                    setData({ ...data, tasks: updatedTasks });
                  }}
                >
                  -
                </Button>
                {index === data.tasks!.length - 1 && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => {
                      const updatedTasks = [...(data.tasks || [])];
                      updatedTasks.push({
                        name: `Task ${updatedTasks.length + 1}`,
                        priority: 1,
                        taskStatus: "PENDING",
                        notes: "",
                      });
                      setData({ ...data, tasks: updatedTasks });
                    }}
                  >
                    +
                  </Button>
                )}
              </Stack>
              {index !== data.tasks!.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Save Changes
        </Button>
        <Button variant="contained" color="error" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ToDoDetailsDialog;
