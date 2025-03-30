import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { exportDataToExcel } from "../helpers/exportDataToExcel";
import { exportDataToPDF } from "../helpers/exportDataToPDF";

type DocProps = {
  fileName: string;
  rows: Record<string, unknown>[];
  Doc: React.FC<{ rows: Record<string, unknown>[] }>;
};

const ActionButtons = (props: DocProps) => {
  const { fileName, rows, Doc } = props;
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, ml: 2 }}
        onClick={() => {
          exportDataToExcel([...rows], `${fileName}`);
        }}
      >
        Export to Excel
      </Button>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, ml: 2 }}
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
        color="success"
        sx={{ mt: 2, ml: 2 }}
        onClick={() => {}}
      >
        Create Report
      </Button>
      <Button
        variant="contained"
        color="warning"
        sx={{ mt: 2, ml: 2 }}
        onClick={() => {}}
      >
        Load Report
      </Button>
      <Button variant="contained" color="error" sx={{ mt: 2, ml: 2 }} onClick={() => {}}>
        Reset
      </Button>
    </Box>
  );
};

export default ActionButtons;
