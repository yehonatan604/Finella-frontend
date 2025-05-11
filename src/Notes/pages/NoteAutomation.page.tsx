import React, { useEffect, useState } from "react";
import Page from "../../Common/components/layout/Page";
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
import CircularProgress from "@mui/material/CircularProgress";

import DeleteIcon from "@mui/icons-material/Delete";
import useNoteAutomation from "../hooks/useNoteAutomation";
import { DateTime } from "luxon";
import useTheme from "../../Common/hooks/useTheme";
import FormDialog from "../../Common/components/dialogs/FormDialog";
import NoteForm from "../forms/Note.form";
import { TNoteAutomation } from "../types/TNoteAutomation";
import ShowInactiveCheckbox from "../../Common/components/ShowInactiveCheckbox";

const NoteAutomationPage = () => {
  const {
    noteAutomations = [],
    notes,
    showAddNoteDialog,
    setShowAddNoteDialog,
    addNoteAutomation,
    handleSaveChanges,
    loading,
  } = useNoteAutomation();
  const { mode } = useTheme();

  const [data, setData] = useState<TNoteAutomation>([]);
  const [showInactive, setShowInactive] = useState(true);

  useEffect(() => {
    setData(noteAutomations);
  }, [noteAutomations]);

  return (
    <Page title="Note Automations">
      {noteAutomations && noteAutomations.length > 0 && (
        <>
          <ShowInactiveCheckbox
            showInactive={showInactive}
            setShowInactive={setShowInactive}
            label="Show Inactive Automations"
            sx={{ width: "53vw" }}
          />
          <Box
            component={Paper}
            display="flex"
            flexDirection="column"
            gap={2}
            p={2}
            sx={{
              maxHeight: "80vh",
              overflowY: "auto",
              width: "55vw",
            }}
          >
            {noteAutomations
              .filter((automation) => {
                if (showInactive) return true;
                return automation.status !== "inactive";
              })
              .map((automation, index) => (
                <div key={automation._id}>
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap={2}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <TextField
                      select
                      defaultValue={automation.noteId}
                      size="small"
                      fullWidth
                      sx={{ minWidth: 200 }}
                      label={
                        noteAutomations[index].noteId &&
                        noteAutomations[index].noteId !== ""
                          ? "Note"
                          : "Select a Note"
                      }
                      onChange={(e) => {
                        setData((prev) =>
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
                      {notes!
                        .filter((note) => note.status !== "inactive")
                        .map((note) => (
                          <MenuItem key={note._id} value={note._id}>
                            {note.name}
                          </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                      size="small"
                      fullWidth
                      className={mode === "dark" ? "dark" : ""}
                      label="Date & Time"
                      type="datetime-local"
                      defaultValue={
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

                        setData((prev) =>
                          prev.map((note) =>
                            note._id === automation._id
                              ? { ...note, dateTime: utcString }
                              : note
                          )
                        );
                      }}
                    />

                    <TextField
                      select
                      defaultValue={automation.repeat}
                      size="small"
                      fullWidth
                      sx={{ minWidth: 150 }}
                      label="Repeat"
                      onChange={(e) => {
                        setData((prev) =>
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

                    <TextField
                      label="Extra Notes"
                      size="small"
                      fullWidth
                      defaultValue={automation.notes || ""}
                      sx={{ minWidth: 300 }}
                      onChange={(e) => {
                        setData((prev) =>
                          prev.map((note) =>
                            note._id === automation._id
                              ? { ...note, notes: e.target.value }
                              : note
                          )
                        );
                      }}
                      slotProps={{
                        inputLabel: {
                          shrink: automation.notes,
                        },
                      }}
                    />

                    <Switch
                      defaultChecked={automation.status === "active"}
                      onChange={() => {
                        setData((prev) =>
                          prev.map((note) =>
                            note._id === automation._id
                              ? {
                                  ...note,
                                  status:
                                    note.status === "active" ? "inactive" : "active",
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
                          backgroundColor:
                            automation.status === "active" ? "green" : "red",
                        },
                      }}
                    />

                    <IconButton
                      size="small"
                      onClick={() => {
                        setData((prev) =>
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
        </>
      )}

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            mt: 2,
          }}
        >
          <CircularProgress size={50} />
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent:
            noteAutomations && noteAutomations.length > 0 ? "flex-start" : "center",
          gap: 2,
          p: 2,
          width: "1070px",
        }}
      >
        {(noteAutomations?.length ?? 0) > 0 && (
          <Button
            variant="contained"
            color="success"
            onClick={() => handleSaveChanges(data)}
          >
            Save Changes
          </Button>
        )}
        <Button variant="contained" color="primary" onClick={addNoteAutomation}>
          Add Automation
        </Button>
      </Box>

      {showAddNoteDialog && (
        <FormDialog
          open={showAddNoteDialog}
          onClose={() => setShowAddNoteDialog(false)}
          title="Add a Note"
          formComponent={<NoteForm setIsDialogOpen={setShowAddNoteDialog} />}
        />
      )}
    </Page>
  );
};

export default NoteAutomationPage;
