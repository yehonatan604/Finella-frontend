import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Checkbox,
  SelectChangeEvent,
  Divider,
} from "@mui/material";
import { Box } from "@mui/system";
import { TToDo } from "../types/TToDo";
import useTheme from "../../Common/hooks/useTheme";
import { useEffect, useState } from "react";
import useToDo from "../hooks/useToDo";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import { TTask } from "../../Records/types/TTask";
import { DateTime } from "luxon";
import StyledDateTimePicker from "./StyledDateTimePicker";
import AddFormDialog from "../../Common/components/dialogs/AddFormDialog";
import AddToDo from "../forms/AddToDo";
import ToDoDetailsDialog from "./ToDoDetailsDialog";
import CreateIcon from "@mui/icons-material/Create";
import { green } from "@mui/material/colors";

type ToDoCardProps = {
  todo: TToDo;
  handleUpdateTask: (todoId: string, task: TTask) => void;
  handleStatusChange: (todo: TToDo, e: SelectChangeEvent<string>) => void;
};

export const ToDoCard = (props: ToDoCardProps) => {
  const { todo, handleStatusChange, handleUpdateTask } = props;
  const { mode } = useTheme();
  const [editStartDate, setEditStartDate] = useState(false);
  const [editEndDate, setEditEndDate] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isToDoDetailsDialogOpen, setIsToDoDetailsDialogOpen] = useState(false);
  const { onDelete, onUndelete, onUpdate, selectedToDo, setSelectedToDo } = useToDo();

  const handleBlur = (type: "startDate" | "endDate", value: string) => {
    const newLocal = DateTime.fromISO(value, {
      zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    const utcString = newLocal.toUTC().toISO({ suppressMilliseconds: true }) || "";

    const updatedTodo = {
      ...todo,
      [type]: utcString,
    };
    onUpdate(updatedTodo);
    if (type === "startDate") {
      setEditStartDate(false);
    } else {
      setEditEndDate(false);
    }
  };

  const getDateTimeValue = (date: string | undefined) => {
    return date
      ? DateTime.fromISO(date, {
          zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }).toFormat("yyyy-MM-dd'T'HH:mm")
      : "";
  };

  useEffect(() => {
    if (todo) {
      setSelectedToDo(todo);
    }
  }, [todo, setSelectedToDo]);

  return (
    <Card
      key={todo._id}
      sx={{
        width: "350px",
        height: "270px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: "#f5f5f5",
        opacity: todo.status === "inactive" ? 0.6 : 1,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
        },
        borderLeft:
          todo.status === "inactive"
            ? "6px solid transparent"
            : todo.toDoStatus === "FAILED" || todo.toDoStatus === "CANCELED"
            ? "6px solid #ef4444"
            : todo.toDoStatus === "COMPLETE"
            ? "6px solid #22c55e"
            : todo.toDoStatus === "PENDING"
            ? "6px solid #3b82f6"
            : "none",
      }}
    >
      <CardContent
        sx={{
          overflowY: "auto",
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color="black" noWrap sx={{ fontSize: "1rem" }}>
            {todo.name}
          </Typography>
          <Select
            size="small"
            value={todo.toDoStatus}
            onChange={(e) => handleStatusChange(todo, e)}
            sx={{
              minWidth: 80,
              backgroundColor: "transparent",
              "& .MuiSelect-select": {
                color: "black",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
              "& svg": {
                color: "black",
              },
            }}
          >
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="COMPLETE">Complete</MenuItem>
            <MenuItem value="FAILED">Failed</MenuItem>
            <MenuItem value="CANCELED">Canceled</MenuItem>
          </Select>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={() =>
                todo.status === "inactive" ? onUndelete(todo._id!) : onDelete(todo._id!)
              }
              sx={{
                color: todo.status === "inactive" ? "green" : "indianred",
              }}
            >
              {todo.status === "inactive" ? <RestoreIcon /> : <DeleteIcon />}
            </IconButton>
            <IconButton
              onClick={() => setIsToDoDetailsDialogOpen(true)}
              sx={{
                color: green[400],
              }}
            >
              <CreateIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mb: 1, width: "100%", background: "silver" }} />

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" color="black" sx={{ mb: 1 }}>
            Start Date:
          </Typography>
          {editStartDate ? (
            <StyledDateTimePicker
              size="small"
              type="datetime-local"
              autoFocus
              defaultValue={getDateTimeValue(todo.startDate)}
              onBlur={(e) => handleBlur("startDate", e.target.value)}
            />
          ) : (
            <Typography
              variant="body2"
              color="black"
              sx={{ mb: 1 }}
              onClick={() => setEditStartDate(true)}
            >
              {todo.startDate && new Date(todo.startDate).toLocaleString()}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography variant="body2" color="black" sx={{ mb: 1 }}>
            End Date:
          </Typography>
          {editEndDate ? (
            <StyledDateTimePicker
              size="small"
              type="datetime-local"
              defaultValue={getDateTimeValue(todo.endDate)}
              onBlur={(e) => handleBlur("endDate", e.target.value)}
            />
          ) : (
            <Typography
              variant="body2"
              color="black"
              sx={{ mb: 1 }}
              onClick={() => setEditEndDate(true)}
            >
              {todo.endDate && new Date(todo.endDate).toLocaleString()}
            </Typography>
          )}
        </Box>

        {todo.tasks && todo.tasks.length > 0 ? (
          todo.tasks?.map((task) => (
            <Box key={task._id} sx={{ display: "flex", alignItems: "center" }}>
              {
                <Checkbox
                  size="small"
                  checked={task.taskStatus === "COMPLETE"}
                  onChange={() => handleUpdateTask(todo._id!, task)}
                  sx={{
                    color: mode === "dark" ? "gray" : undefined,
                    "&.Mui-checked": {
                      color: mode === "dark" ? "black" : undefined,
                    },
                    "&.Mui-disabled": {
                      color: mode === "dark" ? "#ffffffaa" : "#00000099",
                    },
                    "&.Mui-disabled svg": {
                      color: "#ccc",
                    },
                  }}
                  disabled={todo.status === "inactive"}
                />
              }
              <Typography
                variant="body2"
                color={task.taskStatus === "COMPLETE" ? "green" : "#555"}
                sx={{
                  textDecoration:
                    task.taskStatus === "COMPLETE" ? "line-through" : "none",
                }}
              >
                {task.name}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="grey" sx={{ mt: 2 }}>
            * No tasks
          </Typography>
        )}
      </CardContent>
      <AddFormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Add a ToDo"
        formComponent={<AddToDo setIsDialogOpen={setIsAddDialogOpen} />}
      />
      {isToDoDetailsDialogOpen && selectedToDo && (
        <ToDoDetailsDialog
          isOpen={isToDoDetailsDialogOpen}
          onClose={() => setIsToDoDetailsDialogOpen(false)}
          toDo={selectedToDo}
          onSubmit={(data) => {
            onUpdate(data);
            setSelectedToDo(null);
          }}
        />
      )}
    </Card>
  );
};

export default ToDoCard;
