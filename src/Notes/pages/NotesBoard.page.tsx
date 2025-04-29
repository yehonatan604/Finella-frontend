import React from "react";
import { Box } from "@mui/material";
import useNote from "../hooks/useNote";
import Page from "../../Common/components/Page";
import useTheme from "../../Common/hooks/useTheme";
import AddFormDialog from "../../Common/components/dialogs/AddFormDialog";
import AddNoteForm from "../forms/AddNote.form";
import { useState } from "react";
import PlusButton from "../../Common/components/PlusButton";
import ShowInactiveCheckbox from "../../Common/components/ShowInactiveCheckbox";
import NoteCard from "../components/NoteCard";

const NotesBoard = () => {
  const { fetchedNotes } = useNote(true);
  const { mode } = useTheme();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  return (
    <Page title="Notes Board">
      <ShowInactiveCheckbox
        label="Show Deleted Records"
        setShowInactive={setShowInactive}
        showInactive={showInactive}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            maxWidth: "1200px",
            width: "100%",
            backgroundColor: "burlywood",
            p: 3,
            borderRadius: 2,
            border: "5px groove white",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, 250px)",
            columnGap: 2,
            rowGap: 2,
            justifyContent: "center",
            justifyItems: "start",
            alignContent: "start",
            height: "65vh",
            overflowY: "auto",
          }}
          style={{
            boxShadow: mode === "dark" ? "0 2px 10px azure" : "0 2px 10px grey",
          }}
        >
          {fetchedNotes?.map(
            (note) =>
              (note.status !== "inactive" || showInactive) && (
                <NoteCard note={note} key={note._id} />
              )
          )}
        </Box>
      </Box>

      <PlusButton onClick={() => setIsAddDialogOpen(true)} />

      <AddFormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Add a Note"
        formComponent={<AddNoteForm setIsDialogOpen={setIsAddDialogOpen} />}
      />
    </Page>
  );
};

export default NotesBoard;
