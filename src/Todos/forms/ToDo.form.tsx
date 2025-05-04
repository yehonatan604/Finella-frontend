import React from "react";
import {
  Box,
  Button,
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
import { TToDo } from "../types/TToDo";
import { FormProvider, useForm } from "react-hook-form";
import { addToDoFormDefault } from "../forms/initialData/addToDoFormDefault";
import FormButtons from "../../Common/components/form/FormButtons";
import { joiResolver } from "@hookform/resolvers/joi";
import { todoSchema } from "../validations/todo.schema";
import FormField from "../../Common/components/form/FormField";

const ToDoForm = ({
  setIsDialogOpen,
  setIsUpdateDialogOpen,
  toDo = null,
}: {
  setIsDialogOpen?: (isOpen: boolean) => void;
  setIsUpdateDialogOpen?: (isOpen: boolean) => void;
  toDo?: TToDo | null;
}) => {
  const { mode } = useTheme();
  const { onSubmit, onUpdate, user } = useToDo();

  const formMethods = useForm<TToDo>({
    mode: "onChange",
    defaultValues: toDo
      ? {
          ...toDo,
          startDate: new Date(toDo.startDate).toISOString().split("T")[0],
          endDate: new Date(toDo.endDate).toISOString().split("T")[0],
        }
      : addToDoFormDefault(user?._id),
    resolver: joiResolver(todoSchema),
  });

  const {
    register,
    formState: { isValid, errors },
    handleSubmit,
    watch,
    reset,
    setValue,
  } = formMethods;

  const [withTasks, setWithTasks] = useState(false);

  const onFormSubmit = async (data: TToDo) => {
    console.log("Form Data", data);

    const func = toDo ? onUpdate : onSubmit;
    await func(data);
    const setDialog =
      toDo && setIsUpdateDialogOpen ? setIsUpdateDialogOpen : setIsDialogOpen;
    setDialog!(false);
  };

  console.log("Form Errors", errors);
  console.log("Form Values", watch());
  console.log("Form Data", watch("tasks"));

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
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormField
                label="Name"
                name="name"
                required
                value={watch("name")}
                onChange={(e) => {
                  setValue("name", e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />

              <FormField
                label="Start Date"
                {...register("startDate")}
                type="date"
                className={mode === "dark" ? "dark" : ""}
                value={
                  watch("startDate")
                    ? DateTime.fromISO(watch("startDate"))
                        .setZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
                        .toFormat("yyyy-MM-dd")
                    : undefined
                }
                onChange={(e) => {
                  setValue("startDate", e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />

              <FormField
                label="End Date"
                {...register("endDate")}
                type="date"
                className={mode === "dark" ? "dark" : ""}
                value={
                  watch("endDate")
                    ? DateTime.fromISO(watch("endDate"))
                        .setZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
                        .toFormat("yyyy-MM-dd")
                    : undefined
                }
                onChange={(e) => {
                  setValue("endDate", e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormField
                label="Description"
                name="description"
                multiline
                rows={2}
                value={watch("description")}
                onChange={(e) => {
                  setValue("description", e.target.value, {
                    shouldValidate: true,
                  });
                }}
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
                    if (!e.target.checked) {
                      setValue(
                        "tasks",
                        [
                          {
                            name: "",
                            priority: 1,
                            taskStatus: "PENDING",
                          },
                        ],
                        {
                          shouldValidate: true,
                        }
                      );
                    } else {
                      setValue("tasks", watch("tasks") ?? []);
                    }
                  }}
                />
              }
              label="With Tasks"
              sx={{ mb: 2, textAlign: "left" }}
            />

            {withTasks && watch("tasks")!.length > 0 && (
              <>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {watch("tasks")!.map((task, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                        width: "100%",
                      }}
                    >
                      <FormField
                        label="Task Name"
                        name={`tasks.${index}.name`}
                        required={withTasks}
                        value={watch(`tasks.${index}.name`)}
                        onChange={(e) => {
                          setValue(`tasks.${index}.name`, e.target.value, {
                            shouldValidate: true,
                          });
                        }}
                      />
                      <FormField
                        label="Task Priority"
                        name={`tasks.${index}.priority`}
                        type="number"
                        value={watch(`tasks.${index}.priority`)}
                        onChange={(e) => {
                          setValue(
                            `tasks.${index}.priority`,
                            parseInt(e.target.value) || 1,
                            {
                              shouldValidate: true,
                            }
                          );
                        }}
                      />
                      <FormField
                        label="Task Notes"
                        name={`tasks.${index}.notes`}
                        multiline
                        rows={2}
                        value={watch(`tasks.${index}.notes`)}
                        onChange={(e) => {
                          setValue(`tasks.${index}.notes`, e.target.value, {
                            shouldValidate: true,
                          });
                        }}
                      />

                      {watch("tasks")!.length > 1 && (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => {
                            const updatedTasks = watch("tasks")!.filter(
                              (_, i) => i !== index
                            );
                            setValue("tasks", updatedTasks, {
                              shouldValidate: true,
                            });
                          }}
                          sx={{ mb: 2 }}
                        >
                          -
                        </Button>
                      )}

                      {index === watch("tasks")!.length - 1 && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            setValue(
                              "tasks",
                              [
                                ...watch("tasks")!,
                                { name: "", priority: 1, taskStatus: "PENDING" },
                              ],
                              {
                                shouldValidate: true,
                              }
                            );
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
              <FormField
                label="Notes"
                name="notes"
                multiline
                rows={3}
                value={watch("notes")}
                onChange={(e) => {
                  setValue("notes", e.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormButtons
                isValid={isValid}
                onReset={() => {
                  reset(toDo ? toDo : addToDoFormDefault(user._id));
                  const setDialog =
                    toDo && setIsUpdateDialogOpen
                      ? setIsUpdateDialogOpen
                      : setIsDialogOpen;
                  setDialog!(false);
                }}
              />
            </Box>
          </form>
        </FormProvider>
      </Container>
    </Box>
  );
};

export default ToDoForm;
