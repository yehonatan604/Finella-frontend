import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Divider,
  Box,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { capitalizeFirstLetter } from "../../../../Common/helpers/stringHelpers";
import { TSalary } from "../../../types/TSalary";
import { TSalaryHours } from "../../../types/TSalaryHours";
import { TWorkplace } from "../../../types/TWorkplace";
import DialogXButton from "../../DialogXButton";

type SalaryDetailsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  salary: TSalary;
  onSubmit: (toDo: TSalary) => void;
  workplaces: TWorkplace[];
};

const SalaryDetailsDialog = ({
  isOpen,
  onClose,
  salary,
  onSubmit,
  workplaces,
}: SalaryDetailsDialogProps) => {
  const [data, setData] = useState<TSalary>(salary);
  const [hours, setHours] = useState<TSalaryHours[]>(
    salary.hours || [
      {
        day: "",
        startTime: "",
        endTime: "",
        breakStart: "",
        breakEnd: "",
        notes: "",
      },
    ]
  );

  const handlChanges = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Submitting data:", data);
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="lg" sx={{ left: "15vw" }}>
      <DialogTitle
        sx={{
          backgroundColor: "primary.main",
          color: "#fff",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: "1rem",
        }}
      >
        <Typography variant="h6" color="#fff">
          Edit Salary Details
        </Typography>
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
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              type="text"
              name="date"
              value={data.date}
              label="Date"
              onChange={handlChanges}
            />

            <TextField
              type="select"
              name="workPlaceId"
              value={data.workPlaceId}
              sx={{ width: 200 }}
              label="Workplace"
              onChange={handlChanges}
              select
            >
              {workplaces.map((workplace) => (
                <MenuItem key={workplace._id} value={workplace._id}>
                  {capitalizeFirstLetter(workplace.name)}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Divider />

          <Box sx={{ maxHeight: 350, overflowY: "auto", pt: 1 }}>
            {data.hours?.map((hour, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                  <TextField
                    type="text"
                    name="day"
                    value={hour.day}
                    label="Day"
                    sx={{ width: 100 }}
                    size="small"
                    onChange={(e) => {
                      const updatedHours = [...hours];
                      updatedHours[index].day = e.target.value;
                      setHours(updatedHours);
                    }}
                  />
                  <TextField
                    type="text"
                    name="startTime"
                    value={hour.startTime}
                    sx={{ width: 100 }}
                    size="small"
                    label="Start Time"
                    onChange={(e) => {
                      const updatedHours = [...hours];
                      updatedHours[index].startTime = e.target.value;
                      setHours(updatedHours);
                    }}
                  />
                  <TextField
                    type="text"
                    name="endTime"
                    value={hour.endTime}
                    sx={{ width: 100 }}
                    size="small"
                    label="End Time"
                    onChange={(e) => {
                      const updatedHours = [...hours];
                      updatedHours[index].endTime = e.target.value;
                      setHours(updatedHours);
                    }}
                  />
                  <TextField
                    type="text"
                    name="breakStart"
                    value={hour.breakStart}
                    label="Break Start"
                    sx={{ width: 100 }}
                    size="small"
                    onChange={(e) => {
                      const updatedHours = [...hours];
                      updatedHours[index].breakStart = e.target.value;
                      setHours(updatedHours);
                    }}
                  />
                  <TextField
                    type="text"
                    name="breakEnd"
                    value={hour.breakEnd}
                    label="Break End"
                    sx={{ width: 100 }}
                    size="small"
                    onChange={(e) => {
                      const updatedHours = [...hours];
                      updatedHours[index].breakEnd = e.target.value;
                      setHours(updatedHours);
                    }}
                  />
                  <TextField
                    type="text"
                    name="notes"
                    value={hour.notes}
                    label="Notes"
                    sx={{ width: 250 }}
                    size="small"
                    onChange={(e) => {
                      const updatedHours = [...hours];
                      updatedHours[index].notes = e.target.value;
                      setHours(updatedHours);
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                  {hours.length > 1 && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        const updatedHours = [...hours];
                        updatedHours.splice(index, 1);
                        setHours(updatedHours);
                      }}
                    >
                      -
                    </Button>
                  )}
                  {index === hours.length - 1 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        const updatedHours = [
                          ...hours,
                          {
                            day: "",
                            startTime: "",
                            endTime: "",
                            breakStart: "",
                            breakEnd: "",
                            notes: "",
                          },
                        ];
                        setHours(updatedHours);
                      }}
                    >
                      +
                    </Button>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          <Divider sx={{ mb: 2 }} />

          <TextField
            type="text"
            name="notes"
            value={data.notes || ""}
            label="Notes"
            multiline
            rows={3}
            sx={{ width: 700, color: "#fff" }}
            onChange={handlChanges}
          />
        </Box>
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

export default SalaryDetailsDialog;
