import { useCallback, useEffect, useState } from "react";
import Page from "../../Common/components/Page";
import { sendApiRequest } from "../../Common/helpers/sendApiRequest";
import { HTTPMethodTypes } from "../../Common/types/HTTPMethodTypes";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { TNote } from "../../Actions/types/TNote";
import { TNoteAutomation } from "../types/TNoteAutomation";

const repeatOptions = ["none", "daily", "weekly", "monthly"];

const NoteAutomationPage = () => {
  const [noteAutomations, setNoteAutomations] = useState<TNoteAutomation[]>([]);
  const [allNotes, setAllNotes] = useState<TNote[]>([]);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);

  const addNoteAutomation = useCallback(() => {
    setNoteAutomations((prev) => [
      ...prev,
      {
        _id: `temp-${Date.now()}`, // give it a unique temp ID
        noteId: "",
        dateTime: new Date().toISOString().slice(0, 16),
        repeat: "none",
        notes: "",
        lastTriggeredAt: null,
        status: "inactive",
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

  return (
    <Page title="Note Automations">
      <Box component={Paper} display="flex" flexDirection="column" gap={2} p={2}>
        {noteAutomations.map((automation, index) => (
          <>
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
                {allNotes.map((note) => (
                  <MenuItem key={note._id} value={note._id}>
                    {note.name}
                  </MenuItem>
                ))}
              </TextField>

              {/* DateTime */}
              <TextField
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
              />

              {/* Repeat Select */}
              <Select value={automation.repeat} fullWidth sx={{ minWidth: 150 }}>
                {repeatOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>

              {/* Notes multiline */}
              <TextField
                label="Extra Notes"
                fullWidth
                multiline
                value={automation.notes || ""}
                sx={{ minWidth: 300 }}
              />

              {/* Last triggered text */}
              {automation.lastTriggeredAt && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last triggered at:{" "}
                    {new Date(automation.lastTriggeredAt).toLocaleString()}
                  </Typography>
                </Box>
              )}

              {/* Active/Inactive circle Box */}
              <Box
                sx={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  padding: "15px",
                  backgroundColor: automation.status === "active" ? "green" : "red",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor:
                      automation.status === "active" ? "darkgreen" : "darkred",
                  },
                }}
                onClick={() => {
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
              />
            </Box>
          </>
        ))}
        <Button variant="contained" color="primary" onClick={addNoteAutomation}>
          +
        </Button>
      </Box>
      {showAddNoteDialog && <></>}
    </Page>
  );
};

export default NoteAutomationPage;
