import React from "react";
import { Card, CardContent, Typography, Menu, MenuItem, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { TNote } from "../types/TNote";
import useNote from "../hooks/useNote";
import PushPinIcon from "@mui/icons-material/PushPin";
import CreateIcon from "@mui/icons-material/Create";
import { blue } from "@mui/material/colors";
import FormDialog from "../../Common/components/dialogs/FormDialog";
import NoteForm from "../forms/Note.form";

type TNoteCardProps = {
  note: TNote;
};

export const NoteCard = (props: TNoteCardProps) => {
  const { note } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    onDelete,
    onUndelete,
    onUpdate,
    selectedNote,
    setSelectedNote,
    isUpdateDialogOpen,
    setIsUpdateDialogOpen,
  } = useNote();

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (note) {
      setSelectedNote(note);
    }
  }, [note, setSelectedNote]);

  const handlePinClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteUndelete = () => {
    void (note.status === "inactive" ? onUndelete(note._id!) : onDelete(note._id!));
    handleMenuClose();
  };

  const handleEdit = () => {
    setIsUpdateDialogOpen(true);
    handleMenuClose();
  };

  const handleToggleSticky = () => {
    const updatedNote = {
      ...note,
      isSticky: !note.isSticky,
    };
    onUpdate(updatedNote);
    handleMenuClose();
  };

  return (
    <Card
      key={note._id}
      sx={{
        width: "250px",
        height: 170,
        position: "relative",
        backgroundColor: note.isSticky ? "#fffbe6" : "#f9f9f9",
        borderLeft: note.isSticky ? "6px solid orange" : "none",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" color="black" gutterBottom noWrap>
          {note.name}
        </Typography>
        <Typography variant="body2" color="silver" sx={{ mb: 1 }}>
          {new Date(note.date).toLocaleString()}
        </Typography>
        <Typography variant="body1" color="grey" sx={{ whiteSpace: "pre-line" }}>
          {note.content.length > 70 ? note.content.slice(0, 70) + "..." : note.content}
        </Typography>
      </CardContent>

      {note.isSticky ? (
        <>
          <IconButton
            onClick={handlePinClick}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "orange",
              transform: "rotate(45deg)",
            }}
          >
            <PushPinIcon sx={{ fontSize: 24 }} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleDeleteUndelete}>
              {note.status === "inactive" ? "Undelete" : "Delete"}
            </MenuItem>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleToggleSticky}>Toggle Sticky</MenuItem>
          </Menu>
        </>
      ) : (
        <>
          <IconButton
            onClick={handlePinClick}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: blue[300],
            }}
          >
            <CreateIcon sx={{ fontSize: 24 }} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleDeleteUndelete}>
              {note.status === "inactive" ? "Undelete" : "Delete"}
            </MenuItem>
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleToggleSticky}>Toggle Sticky</MenuItem>
          </Menu>
        </>
      )}

      <FormDialog
        open={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        title="Edit a Note"
        formComponent={
          <NoteForm setIsUpdateDialogOpen={setIsUpdateDialogOpen} note={selectedNote} />
        }
      />
    </Card>
  );
};

export default NoteCard;
