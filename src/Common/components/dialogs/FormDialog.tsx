import React from "react";
import { JSX } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import DialogXButton from "./DialogXButton";

type FormDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  formComponent: JSX.Element;
};

const FormDialog = (props: FormDialogProps) => {
  const { open, onClose, title, formComponent } = props;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth sx={{ left: "15vw" }}>
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
        {title}
        <DialogXButton onClose={onClose} />
      </DialogTitle>
      <DialogContent>{formComponent}</DialogContent>
    </Dialog>
  );
};

export default FormDialog;
