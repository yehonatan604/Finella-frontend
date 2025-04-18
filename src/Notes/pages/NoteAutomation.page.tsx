import Page from "../../Common/components/Page";
import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Switch,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useNoteAutomation from "../hooks/useNoteAutomation";
import { DateTime } from "luxon";
import useTheme from "../../Common/hooks/useTheme";

const NoteAutomationPage = () => {
  const {
    noteAutomations,
    allNotes,
    showAddNoteDialog,
    setShowAddNoteDialog,
    addNoteAutomation,
    handleSaveChanges,
    setNoteAutomations,
  } = useNoteAutomation();
  const { mode } = useTheme();

  return (
    <Page title="Note Automations">
      {noteAutomations.length > 0 && (
        <Box
          component={Paper}
          display="flex"
          flexDirection="column"
          gap={2}
          p={2}
          sx={{
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {noteAutomations.map((automation, index) => (
            <div key={automation._id}>
              <Box
                display="flex"
                flexDirection="row"
                gap={2}
                justifyContent="space-between"
                alignItems="center"
              >
                {/* Note Select */}
                <TextField
                  select
                  value={automation.noteId}
                  size="small"
                  fullWidth
                  sx={{ minWidth: 200 }}
                  label={
                    noteAutomations[index].noteId && noteAutomations[index].noteId !== ""
                      ? "Note"
                      : "Select a Note"
                  }
                  onChange={(e) => {
                    setNoteAutomations((prev) =>
                      prev.map((note) =>
                        note._id === automation._id
                          ? { ...note, noteId: e.target.value }
                          : note
                      )
                    );
                  }}
                >
                  <MenuItem
                    value=""
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAddNoteDialog(true);
                    }}
                  >
                    New Note
                  </MenuItem>
                  {allNotes
                    .filter((note) => note.status !== "inactive")
                    .map((note) => (
                      <MenuItem key={note._id} value={note._id}>
                        {note.name}
                      </MenuItem>
                    ))}
                </TextField>

                {/* DateTime */}
                <TextField
                  size="small"
                  fullWidth
                  className={mode === "dark" ? "dark" : ""}
                  label="Date & Time"
                  type="datetime-local"
                  value={
                    automation.dateTime
                      ? DateTime.fromISO(automation.dateTime, {
                          zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        }).toFormat("yyyy-MM-dd'T'HH:mm")
                      : ""
                  }
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  sx={{ minWidth: 200 }}
                  onChange={(e) => {
                    const newLocal = DateTime.fromISO(e.target.value, {
                      zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    });

                    const utcString =
                      newLocal.toUTC().toISO({ suppressMilliseconds: true }) || "";

                    setNoteAutomations((prev) =>
                      prev.map((note) =>
                        note._id === automation._id
                          ? { ...note, dateTime: utcString }
                          : note
                      )
                    );
                  }}
                />

                {/* Repeat Select */}
                <TextField
                  select
                  value={automation.repeat}
                  size="small"
                  fullWidth
                  sx={{ minWidth: 150 }}
                  label="Repeat"
                  onChange={(e) => {
                    setNoteAutomations((prev) =>
                      prev.map((note) =>
                        note._id === automation._id
                          ? { ...note, repeat: e.target.value }
                          : note
                      )
                    );
                  }}
                >
                  {["none", "daily", "weekly", "monthly"].map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Extra Notes */}
                <TextField
                  label="Extra Notes"
                  size="small"
                  fullWidth
                  value={automation.notes || ""}
                  sx={{ minWidth: 300 }}
                  onChange={(e) => {
                    setNoteAutomations((prev) =>
                      prev.map((note) =>
                        note._id === automation._id
                          ? { ...note, notes: e.target.value }
                          : note
                      )
                    );
                  }}
                />

                {/* Active/Inactive Switch */}
                <Switch
                  checked={automation.status === "active"}
                  onChange={() => {
                    setNoteAutomations((prev) =>
                      prev.map((note) =>
                        note._id === automation._id
                          ? {
                              ...note,
                              status: note.status === "active" ? "inactive" : "active",
                            }
                          : note
                      )
                    );
                  }}
                  slotProps={{
                    input: {
                      "aria-label": "controlled",
                    },
                  }}
                  size="small"
                  sx={{
                    "& .MuiSwitch-thumb": {
                      backgroundColor: automation.status === "active" ? "green" : "red",
                    },
                  }}
                />

                {/* Delete Button */}
                <IconButton
                  size="small"
                  onClick={() => {
                    setNoteAutomations((prev) =>
                      prev.filter((note) => note._id !== automation._id)
                    );
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <DeleteIcon
                    fontSize="small"
                    sx={{
                      color: "error.main",
                      cursor: "pointer",
                      "&:hover": {
                        color: "error.dark",
                      },
                    }}
                  />
                </IconButton>
              </Box>

              <Divider sx={{ mt: 2 }} />
            </div>
          ))}
        </Box>
      )}

      {/* Automations Buttons Box */}
      <Box
        sx={{
          display: "flex",
          justifyContent: noteAutomations.length > 0 ? "flex-start" : "center",
          gap: 2,
          p: 2,
          width: "1070px",
        }}
      >
        <Button variant="contained" color="success" onClick={handleSaveChanges}>
          Save Changes
        </Button>
        <Button variant="contained" color="primary" onClick={addNoteAutomation}>
          Add Automation
        </Button>
      </Box>

      {showAddNoteDialog && <></>}
    </Page>
  );
};

export default NoteAutomationPage;
