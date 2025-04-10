import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Divider,
  Box,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { DeepPartial } from "react-hook-form";
import { formatStringDate, formatDate } from "../../Common/helpers/dateHelpers";
import { capitalizeFirstLetter } from "../../Common/helpers/stringHelpers";
import CenterBox from "../../Common/components/CenterBox";
import DialogXButton from "../../Actions/components/DialogXButton";
import StyledTitleInput from "../../Actions/components/styled/StyledTitleInput";
import { TNote } from "../types/TNote";

type NoteDetailsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  note: TNote;
  onSubmit: (workplace: TNote) => void;
};

const NoteDetailsDialog = ({
  isOpen,
  onClose,
  note,
  onSubmit,
}: NoteDetailsDialogProps) => {
  const [data, setData] = useState<TNote | DeepPartial<TNote>>(note);

  const handleChanges = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(data as TNote);
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
          value={capitalizeFirstLetter(data.name!)}
          sx={{ width: 705 }}
          onChange={handleChanges}
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
            mb: 2,
            mt: 4,
            gap: 2,
          }}
        >
          <CenterBox sx={{ flexDirection: "row", gap: 2, flexWrap: "wrap" }}>
            <TextField
              type="date"
              name="date"
              label="Date"
              value={formatStringDate(formatDate(data.date!))}
              size="small"
              sx={{ width: 217 }}
              onChange={handleChanges}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={data.isSticky}
                  onChange={(e) => setData({ ...data, isSticky: e.target.checked })}
                />
              }
              label="Is Sticky"
            />
          </CenterBox>

          <Divider sx={{ width: "100%", my: 2 }} />

          <CenterBox
            sx={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 2,
              width: "100%",
            }}
          >
            <TextField
              type="text"
              name="content"
              value={data.content}
              multiline
              rows={4}
              label="Content"
              size="small"
              fullWidth
              onChange={handleChanges}
            />
          </CenterBox>

          <Divider sx={{ width: "100%", my: 2 }} />

          <TextField
            type="text"
            name="notes"
            value={data.notes}
            label="Notes"
            multiline
            rows={4}
            sx={{ width: "100%" }}
            onChange={handleChanges}
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

export default NoteDetailsDialog;
