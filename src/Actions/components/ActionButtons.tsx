import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { exportDataToExcel } from "../helpers/exportDataToExcel";
import { exportDataToPDF } from "../helpers/exportDataToPDF";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

type DocProps = {
  fileName: string;
  rows: Record<string, unknown>[];
  Doc: React.FC<{ rows: Record<string, unknown>[] }>;
  openCharts?: () => void;
};

const ActionButtons = (props: DocProps) => {
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

      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 2, ml: 2 }}
        startIcon={<AutoFixHighIcon />}
        onClick={openCharts}
      >
        Create Report
      </Button>
    </Box>
  );
};

export default ActionButtons;
