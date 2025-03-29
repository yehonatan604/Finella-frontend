import * as xlsx from "xlsx";
import { useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

type UploadExcelDialogProps = {
  open: boolean;
  onClose: () => void;
  onUpload: (json: unknown) => void;
};

const UploadExcelDialog = (props: UploadExcelDialogProps) => {
  const { open, onClose, onUpload } = props;

  const handleUpload = useCallback(
    (file: Blob) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = xlsx.read(data, {
          type: "array",
          cellDates: true,
          dateNF: "DD/MM/YYYY",
        });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const json = xlsx.utils.sheet_to_json(sheet, {
          raw: false,
        });

        onUpload(json);
        onClose();
      };
      reader.readAsArrayBuffer(file);
    },
    [onUpload, onClose]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Upload Excel"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onUpload} color="primary" autoFocus>
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadExcelDialog;
