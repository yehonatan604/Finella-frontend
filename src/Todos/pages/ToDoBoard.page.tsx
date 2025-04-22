import { Box, SelectChangeEvent } from "@mui/material";
import useToDo from "../hooks/useToDo";
import Page from "../../Common/components/Page";
import useTheme from "../../Common/hooks/useTheme";
import { TTask } from "../../Records/types/TTask";
import { TTaskStastus } from "../../Records/types/TTaskStatus";
import { TToDo } from "../types/TToDo";
import ShowInactiveCheckbox from "../../Common/components/ShowInactiveCheckbox";
import { useState } from "react";
import ToDoCard from "../components/ToDoCard";
import PlusButton from "../../Common/components/PlusButton";
import AddFormDialog from "../../Common/components/dialogs/AddFormDialog";
import AddToDo from "../forms/AddToDo";

const TodosBoard = () => {
  const { fetchedToDos, onUpdate } = useToDo(true, true);
  const [showInactive, setShowInactive] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
            maxWidth: "1300px",
            width: "100%",
            backgroundColor: "burlywood",
            p: 3,
            borderRadius: 2,
            border: "5px groove white",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, 350px)",
            gap: 2,
            justifyContent: "center",
            justifyItems: "start",
            height: "65vh",
            overflowY: "auto",
          }}
          style={{
            boxShadow: mode === "dark" ? "0 2px 10px azure" : "0 2px 10px grey",
          }}
        >
          {fetchedToDos?.map(
            (todo) =>
              (todo.status !== "inactive" || showInactive) && (
                <ToDoCard
                  key={todo._id}
                  todo={todo}
                  handleUpdateTask={handleUpdateTask}
                  handleStatusChange={handleStatusChange}
                />
              )
          )}
        </Box>
      </Box>

      <PlusButton
        onClick={() => {
          setIsAddDialogOpen(true);
        }}
      />

      <AddFormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Add a ToDo"
        formComponent={<AddToDo setIsDialogOpen={setIsAddDialogOpen} />}
      />
    </Page>
  );
};

export default TodosBoard;
