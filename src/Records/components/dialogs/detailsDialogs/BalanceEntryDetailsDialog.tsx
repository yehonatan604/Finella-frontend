import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Typography,
  Divider,
  Box,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { capitalizeFirstLetter } from "../../../../Common/helpers/stringHelpers";
import CenterBox from "../../../../Common/components/styled/CenterBox";
import { TBalanceEntry } from "../../../types/TBalanceEntry";
import DialogXButton from "../../../../Common/components/dialogs/DialogXButton";
import StyledTitleInput from "../../../../Common/components/styled/StyledTitleInput";
import useTheme from "../../../../Common/hooks/useTheme";

type BalanceEntriesDetailsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  bEntry: TBalanceEntry;
  onSubmit: (bentry: TBalanceEntry) => void;
};

const BalanceEntryDetailsDialog = ({
  isOpen,
  onClose,
  bEntry,
  onSubmit,
}: BalanceEntriesDetailsDialogProps) => {
  const [data, setData] = useState<TBalanceEntry>(bEntry);
  const { mode } = useTheme();

  const handlChanges = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    onSubmit(data);
    onClose();
  };

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
            alignItems: "start",
            justifyContent: "center",
            my: 2,
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>Start Date:</Typography>
              <TextField
                type="date"
                className={mode === "dark" ? "dark" : ""}
                name="date"
                value={data.date ? new Date(data.date).toISOString().split("T")[0] : ""}
                size="small"
                sx={{ minWidth: 130 }}
                onChange={handlChanges}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>Status:</Typography>
              <TextField
                select
                label="Entry Type"
                name="type"
                value={data.type}
                onChange={handlChanges}
                size="small"
                sx={{ minWidth: 130 }}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <CenterBox sx={{ flexDirection: "row", gap: 2 }}>
          <TextField
            type="number"
            name="price"
            value={data.price}
            label="Price"
            size="small"
            sx={{ width: 200, color: "#fff" }}
            onChange={handlChanges}
            slotProps={{
              htmlInput: {
                step: 0.1,
              },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={data.withVat}
                color="primary"
                onChange={(e) => {
                  setData({ ...data, withVat: e.target.checked });
                }}
              />
            }
            label="With VAT"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={data.isPayed}
                color="primary"
                onChange={(e) => {
                  setData({ ...data, isPayed: e.target.checked });
                }}
              />
            }
            label="Is Payed"
          />
        </CenterBox>

        <Divider sx={{ my: 2 }} />

        <TextField
          type="text"
          name="notes"
          value={data.notes}
          label="Notes"
          multiline
          rows={4}
          sx={{ width: "100%" }}
          onChange={handlChanges}
        />
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

export default BalanceEntryDetailsDialog;
