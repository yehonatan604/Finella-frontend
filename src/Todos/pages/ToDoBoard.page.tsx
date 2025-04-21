import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
} from "@mui/material";
import useToDo from "../hooks/useToDo";
import Page from "../../Common/components/Page";
import useTheme from "../../Common/hooks/useTheme";
import { TTask } from "../../Records/types/TTask";
import { TTaskStastus } from "../../Records/types/TTaskStatus";
import { TToDo } from "../types/TToDo";
import ShowInactiveCheckbox from "../../Common/components/ShowInactiveCheckbox";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";

const TodosBoard = () => {
  const { fetchedToDos, onUpdate, onDelete, onUndelete } = useToDo(true);
  const [showInactive, setShowInactive] = useState(false);
  const { mode } = useTheme();

  const handleUpdateTask = (todoId: string, task: TTask) => {
    const updatedTask = {
      ...task,
      taskStatus:
        task.taskStatus === "COMPLETE"
          ? ("PENDING" as TTaskStastus)
          : ("COMPLETE" as TTaskStastus),
    };

    const todo = fetchedToDos?.find((t) => t._id === todoId);
    if (!todo) return;

    const updatedTasks = todo.tasks?.map((t) => (t._id === task._id ? updatedTask : t));

    const updatedTodo = {
      ...todo,
      tasks: updatedTasks,
    };

    onUpdate(updatedTodo);
  };

  const handleStatusChange = (todo: TToDo, event: SelectChangeEvent) => {
    const updatedTodo = {
      ...todo,
      toDoStatus: event.target.value as TToDo["toDoStatus"],
    };
    onUpdate(updatedTodo);
  };

  return (
    <Page title="Todos Board">
      <ShowInactiveCheckbox
        label="Show Deleted Records"
        setShowInactive={setShowInactive}
        showInactive={showInactive}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            maxWidth: "1350px",
            width: "100%",
            backgroundColor: "burlywood",
            p: 3,
            borderRadius: 2,
            border: "5px groove white",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, 300px)",
            gap: 2,
            justifyContent: "center",
            justifyItems: "start",
          }}
          style={{
            boxShadow: mode === "dark" ? "0 2px 10px azure" : "0 2px 10px grey",
          }}
        >
          {fetchedToDos?.map(
            (todo) =>
              (todo.status !== "inactive" || showInactive) && (
                <Card
                  key={todo._id}
                  sx={{
                    width: "300px",
                    height: "250px",
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
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="black"
                        noWrap
                        sx={{ fontSize: "1rem" }}
                      >
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
                      <IconButton
                        onClick={() =>
                          todo.status === "inactive"
                            ? onUndelete(todo._id!)
                            : onDelete(todo._id!)
                        }
                        sx={{
                          color: todo.status === "inactive" ? "green" : "indianred",
                        }}
                      >
                        {todo.status === "inactive" ? <RestoreIcon /> : <DeleteIcon />}
                      </IconButton>
                    </Box>

                    <Typography variant="body2" color="silver" sx={{ mb: 1 }}>
                      {new Date(todo.startDate).toLocaleString()} -{" "}
                      {new Date(todo.endDate).toLocaleString()}
                    </Typography>

                    {todo.tasks && todo.tasks.length > 0 ? (
                      todo.tasks?.map((task) => (
                        <Box
                          key={task._id}
                          sx={{ display: "flex", alignItems: "center" }}
                        >
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
                </Card>
              )
          )}
        </Box>
      </Box>
    </Page>
  );
};

export default TodosBoard;
