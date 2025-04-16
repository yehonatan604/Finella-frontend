import { useCallback, useEffect, useState } from "react";
import Page from "../../Common/components/Page";
import { sendApiRequest } from "../../Common/helpers/sendApiRequest";
import { HTTPMethodTypes } from "../../Common/types/HTTPMethodTypes";
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
import { TNoteAutomation } from "../types/TNoteAutomation";
import DeleteIcon from "@mui/icons-material/Delete";
import { TNote } from "../types/TNote";
import useAuth from "../../Auth/hooks/useAuth";

const NoteAutomationPage = () => {
  const { user } = useAuth();
  const [noteAutomations, setNoteAutomations] = useState<TNoteAutomation[]>([]);
  const [allNotes, setAllNotes] = useState<TNote[]>([]);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);

  const addNoteAutomation = useCallback(() => {
    setNoteAutomations((prev) => [
      ...prev,
      {
        _id: `temp-${Date.now()}`, // a unique temp ID
        noteId: "",
        dateTime: new Date().toISOString().slice(0, 16),
        repeat: "none",
        notes: "",
        lastTriggeredAt: null,
        status: "active",
      },
    ]);
  }, []);

  useEffect(() => {
    const fetchNoteAutomations = async () => {
      try {
        const resAutomations = await sendApiRequest(
          "/note-automations",
          HTTPMethodTypes.GET
        );
        const resNotes = await sendApiRequest("/note", HTTPMethodTypes.GET);
        if (resAutomations && resNotes) {
          setNoteAutomations(resAutomations.data);
          setAllNotes(resNotes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNoteAutomations();
  }, []);

  const handleSaveChanges = useCallback(async () => {
    try {
      noteAutomations.forEach(async (automation) => {
        if (automation._id?.startsWith("temp-")) {
          delete automation._id; // Remove the temp ID
          await sendApiRequest("/note-automations", HTTPMethodTypes.POST, {
            ...automation,
            userId: user?._id,
          });
        } else {
          await sendApiRequest(`/note-automations`, HTTPMethodTypes.PUT, automation);
        }
      });
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  }, [noteAutomations, user?._id]);

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
            width: "60vw",
            maxHeight: "80vh",
            overflowY: "scroll",
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
                  label="Date & Time"
                  type="datetime-local"
                  value={automation.dateTime}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  sx={{ minWidth: 200 }}
                  onChange={(e) => {
                    setNoteAutomations((prev) =>
                      prev.map((note) =>
                        note._id === automation._id
                          ? { ...note, dateTime: e.target.value }
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
          mt: 2,
          p: 2,
          width: "61vw",
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
