import React from "react";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { exportDataToExcel } from "../../Records/helpers/exportDataToExcel";
import { exportDataToPDF } from "../../Records/helpers/exportDataToPDF";

type PageButtonsProps = {
  fileName: string;
  rows: Record<string, unknown>[];
  Doc: React.FC<{ rows: Record<string, unknown>[] }>;
  openCharts?: () => void;
};

const PageButtons = (props: PageButtonsProps) => {
  const { fileName, rows, Doc, openCharts } = props;
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, ml: 2 }}
        startIcon={<FileDownloadIcon />}
        onClick={() => {
          exportDataToExcel([...rows], `${fileName}`);
        }}
      >
        Export to Excel
      </Button>

      <Button
        variant="contained"
        color="success"
        sx={{ mt: 2, ml: 2 }}
        startIcon={<PictureAsPdfIcon />}
        onClick={async () => {
          const data = [...rows];
          data.pop();
          exportDataToPDF(<Doc rows={data} />, `${fileName}`);
        }}
      >
        Export to PDF
      </Button>

      {openCharts && (
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2, ml: 2 }}
          startIcon={<AutoFixHighIcon />}
          onClick={openCharts}
        >
          Create Report
        </Button>
      )}
    </Box>
  );
};

export default PageButtons;
