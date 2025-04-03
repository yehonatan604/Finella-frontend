import {
  Box,
  Button,
  TextField,
  Container,
  Divider,
  MenuItem,
  Paper,
} from "@mui/material";
import useSalary from "../hooks/useSalary";
import Page from "../../Common/components/Page";
import UploadExcelDialog from "../components/dialogs/UploadExcelDialog";

const AddSalary = () => {
  const {
    addNewSalaryHour,
    addSalaryFromExcel,
    handleSubmit,
    register,
    setValue,
    errors,
    onSubmit,
    toggleUploadDialog,
    isUploadDialogOpen,
    salaryHours,
    workplaces,
  } = useSalary();

  return (
    <Page title="Add a Salary">
      <Container
        maxWidth="md"
        component={Paper}
        sx={{
          borderRadius: 3,
          p: 4,
          textAlign: "center",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="workPlace"
              {...register("workPlaceId")}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.workPlaceId ? "error" : "primary"}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              select
              defaultValue={""}
            >
              <MenuItem value={""}>Select Workplace</MenuItem>
              {workplaces?.map((workplace) => (
                <MenuItem key={workplace._id} value={workplace._id}>
                  {workplace.name}
                </MenuItem>
              )) || []}
            </TextField>

            <TextField
              label="Date"
              {...register("date")}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              color={errors.date ? "error" : "primary"}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
            {salaryHours.map((item, index) => (
              <Box key={index} sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
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
                    value={item.day || ""}
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
                    value={item.startTime || ""}
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
                    defaultValue={item.endTime || ""}
                    onChange={(e) => {
                      setValue(`hours.${index}.endTime`, e.target.value);
                    }}
                  />
                  <TextField
                    label="Break Start"
                    {...register(`hours.${index}.breakStart`)}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    color={errors.hours?.[index]?.breakStart ? "error" : "primary"}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                  <TextField
                    label="Break End"
                    {...register(`hours.${index}.breakEnd`)}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    color={errors.hours?.[index]?.breakEnd ? "error" : "primary"}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </Box>

                <Divider sx={{ my: 2, background: "silver" }} />
              </Box>
            ))}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={addNewSalaryHour}
              >
                +
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 2, background: "silver" }} />

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={toggleUploadDialog}
            >
              Add from Excel
            </Button>
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
      {isUploadDialogOpen && (
        <UploadExcelDialog
          open={isUploadDialogOpen}
          onClose={toggleUploadDialog}
          onUpload={addSalaryFromExcel}
        />
      )}
    </Page>
  );
};

export default AddSalary;
