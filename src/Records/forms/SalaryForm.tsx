import React from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  MenuItem,
  Paper,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import useSalary from "../hooks/useSalary";
import UploadExcelDialog from "../components/dialogs/UploadExcelDialog";
import { TSalary } from "../types/TSalary";
import { FormProvider, useForm } from "react-hook-form";
import { addSalaryFormDefault } from "./initialData/addSalaryFormDefault";
import { joiResolver } from "@hookform/resolvers/joi";
import { salarySchema } from "../validations/salary.schema";
import FormField from "../../Common/components/FormField";
import useTheme from "../../Common/hooks/useTheme";

const SalaryForm = ({
  setIsDialogOpen,
  setIsAddWorkplaceDialogOpen,
  salary = null,
}: {
  setIsDialogOpen: (isOpen: boolean) => void;
  setIsAddWorkplaceDialogOpen: (isOpen: boolean) => void;
  salary?: TSalary | null;
}) => {
  const {
    addNewSalaryHour,
    removeSalaryHour,
    addSalaryFromExcel,
    onSubmit,
    onUpdate,
    toggleUploadDialog,
    isUploadDialogOpen,
    salaryHours,
    workplaces,
    addBEntry,
    setAddBEntry,
    user,
  } = useSalary();

  const { mode } = useTheme();

  const formMethods = useForm<TSalary>({
    defaultValues: salary ?? addSalaryFormDefault(user?._id || ""),
    resolver: joiResolver(salarySchema),
  });

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isValid },
  } = formMethods;

  const onFormSubmit = async (data: TSalary) => {
    const func = salary ? onUpdate : onSubmit;
    await func(data);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Box sx={{ p: 2, pb: 0 }}>
        <Container
          maxWidth="xl"
          component={Paper}
          sx={{
            p: 4,
          }}
        >
          <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "start",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <FormField
                  label="Workplace"
                  name="workPlaceId"
                  doRegister={false}
                  required
                  selectItems={[
                    <MenuItem key="" value="" disabled>
                      Select a Workplace
                    </MenuItem>,
                    <MenuItem key="__new__" value="__new__">
                      Create New...
                    </MenuItem>,
                    ...workplaces!.map((workplace) => (
                      <MenuItem key={workplace._id} value={workplace._id}>
                        {workplace.name}
                      </MenuItem>
                    )),
                  ]}
                  value={watch("workPlaceId") || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "__new__") {
                      setValue("workPlaceId", "", {
                        shouldValidate: true,
                      });
                      setIsAddWorkplaceDialogOpen(true);
                    } else {
                      setValue("workPlaceId", value, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  sx={{ width: "30%", mb: 0 }}
                />

                <FormField
                  label="Month"
                  name="month"
                  doRegister={false}
                  required
                  selectArray={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                  sx={{ width: "24%", mb: 0 }}
                  value={watch("date").split("-")[0] || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      setValue("date", `${value}-${watch("date").split("-")[1]}`, {
                        shouldValidate: true,
                      });
                    }
                  }}
                />

                <FormField
                  label="Year"
                  name="year"
                  doRegister={false}
                  required
                  sx={{ width: "24%", mb: 0 }}
                  value={watch("date").split("-")[1] || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      setValue("date", `${watch("date").split("-")[0]}-${value}`, {
                        shouldValidate: true,
                      });
                    }
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={addBEntry}
                      onChange={(e) => setAddBEntry(e.target.checked)}
                    />
                  }
                  label="Add Balance Entry"
                />
              </Box>

              <Divider sx={{ my: 2, background: "silver" }} />

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={addNewSalaryHour}
                >
                  Add Salary Hour
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={toggleUploadDialog}
                  size="small"
                  sx={{ width: "30%" }}
                >
                  Add Hours From Excel
                </Button>
              </Box>
              <Divider sx={{ my: 2, background: "silver" }} />

              <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
                {(salary ? watch("hours") : salaryHours).map((item, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", gap: 2, flexDirection: "column" }}
                  >
                    <Box key={index} sx={{ display: "flex", gap: 2 }}>
                      <FormField
                        label="Day"
                        name={`hours.${index}.day`}
                        type="number"
                        required
                        value={watch(`hours.${index}.day`)}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value) {
                            setValue(`hours.${index}.day`, value, {
                              shouldValidate: true,
                            });
                          }
                        }}
                      />

                      <FormField
                        className={mode === "dark" ? "dark" : ""}
                        label="Start Time"
                        name={`hours.${index}.startTime`}
                        type="time"
                        required
                        value={watch(`hours.${index}.startTime`)}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value) {
                            setValue(`hours.${index}.startTime`, value, {
                              shouldValidate: true,
                            });
                          }
                        }}
                      />

                      <FormField
                        className={mode === "dark" ? "dark" : ""}
                        label="End Time"
                        name={`hours.${index}.endTime`}
                        type="time"
                        required
                        value={watch(`hours.${index}.endTime`)}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value) {
                            setValue(`hours.${index}.endTime`, value, {
                              shouldValidate: true,
                            });
                          }
                        }}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          mb: 2,
                          gap: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => removeSalaryHour(index)}
                        >
                          -
                        </Button>
                        {index === (salary ? salary.hours : salaryHours).length - 1 && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={addNewSalaryHour}
                          >
                            +
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>

              {salaryHours.length > 0 && <Divider sx={{ my: 2, background: "silver" }} />}

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ fontSize: "1.2rem", py: 1 }}
                  disabled={!isValid}
                >
                  {salary ? "Update" : "Add"}
                </Button>

                <Button
                  type="reset"
                  variant="contained"
                  color="error"
                  fullWidth
                  sx={{ fontSize: "1.2rem", py: 1 }}
                  onClick={() => {
                    reset(salary ?? addSalaryFormDefault(user?._id || ""));
                  }}
                >
                  Reset
                </Button>
              </Box>
            </form>
          </FormProvider>
        </Container>
        {isUploadDialogOpen && (
          <UploadExcelDialog
            open={isUploadDialogOpen}
            onClose={toggleUploadDialog}
            onUpload={addSalaryFromExcel}
          />
        )}
      </Box>
    </>
  );
};

export default SalaryForm;
