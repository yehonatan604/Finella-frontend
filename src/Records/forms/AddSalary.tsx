import React from "react";
import {
  Box,
  Button,
  TextField,
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
import { useForm } from "react-hook-form";
import { addSalaryFormDefault } from "./initialData/addSalaryFormDefault";
import { joiResolver } from "@hookform/resolvers/joi";
import { salarySchema } from "../validations/salary.schema";

const SalaryForm = ({
  setIsDialogOpen,
  setIsAddWorkplaceDialogOpen,
}: {
  setIsDialogOpen: (isOpen: boolean) => void;
  setIsAddWorkplaceDialogOpen: (isOpen: boolean) => void;
}) => {
  const {
    addNewSalaryHour,
    removeSalaryHour,
    addSalaryFromExcel,
    onSubmit,
    toggleUploadDialog,
    isUploadDialogOpen,
    salaryHours,
    workplaces,
    addBEntry,
    setAddBEntry,
    user,
  } = useSalary();

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<TSalary>({
    mode: "onChange",
    defaultValues: addSalaryFormDefault(user?._id || ""),
    resolver: joiResolver(salarySchema),
  });

  const onFormSubmit = async (data: TSalary) => {
    await onSubmit(data);
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
              <TextField
                label="workPlace"
                select
                value={watch("workPlaceId")}
                {...register("workPlaceId")}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "__new__") {
                    setValue("workPlaceId", "");
                    setIsAddWorkplaceDialogOpen(true);
                  } else {
                    setValue("workPlaceId", value);
                  }
                }}
                variant="outlined"
                sx={{ width: "30%", textAlign: "left" }}
                color={errors.workPlaceId ? "error" : "primary"}
              >
                <MenuItem value="" disabled>
                  Select a Workplace
                </MenuItem>
                <MenuItem value="__new__">Create New...</MenuItem>
                {workplaces?.map((workplace) => (
                  <MenuItem key={workplace._id} value={workplace._id}>
                    {workplace.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Month"
                select
                variant="outlined"
                sx={{ width: "24%" }}
                color={errors.date ? "error" : "primary"}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                value={watch("date").split("-")[0] || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    setValue("date", `${value}-${watch("date").split("-")[1]}`);
                  }
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Year"
                type="number"
                variant="outlined"
                sx={{ width: "24%" }}
                color={errors.date ? "error" : "primary"}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                value={watch("date").split("-")[1] || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    setValue("date", `${watch("date").split("-")[0]}-${value}`);
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
              {salaryHours.map((item, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", gap: 2, flexDirection: "column" }}
                >
                  <Box key={index} sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      label="Day"
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 2 }}
                      color={errors.hours?.[index]?.day ? "error" : "primary"}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      {...register(`hours.${index}.day`)}
                      defaultValue={item.day || ""}
                      onChange={(e) => {
                        setValue(`hours.${index}.day`, e.target.value);
                      }}
                    />
                    <TextField
                      label="Start Time"
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 2 }}
                      color={errors.hours?.[index]?.startTime ? "error" : "primary"}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      {...register(`hours.${index}.startTime`)}
                      defaultValue={item.startTime || ""}
                      onChange={(e) => {
                        setValue(`hours.${index}.startTime`, e.target.value);
                      }}
                    />
                    <TextField
                      label="End Time"
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 2 }}
                      color={errors.hours?.[index]?.endTime ? "error" : "primary"}
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      {...register(`hours.${index}.endTime`)}
                      defaultValue={item.endTime || ""}
                      onChange={(e) => {
                        setValue(`hours.${index}.endTime`, e.target.value);
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
                      {index === salaryHours.length - 1 && (
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
                Add
              </Button>

              <Button
                type="reset"
                variant="contained"
                color="error"
                fullWidth
                sx={{ fontSize: "1.2rem", py: 1 }}
                onClick={() => {
                  reset(addSalaryFormDefault(user?._id || ""));
                }}
              >
                Reset
              </Button>
            </Box>
          </form>
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
