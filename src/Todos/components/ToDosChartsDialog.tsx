import { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  DialogContentText,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import html2canvas from "html2canvas";
import {
  PDFDownloadLink,
  Document,
  Page,
  Image as PDFImage,
  StyleSheet,
} from "@react-pdf/renderer";
import DialogXButton from "../../Common/components/dialogs/DialogXButton";

type ToDosChartsDialogProps = {
  open: boolean;
  onClose: () => void;
  data: {
    id: string | undefined;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    toDoStatus: "PENDING" | "COMPLETE" | "CANCELED" | "FAILED";
    tasks: number | undefined;
    status: string | undefined;
  }[];
};

const styles = StyleSheet.create({
  image: {
    width: 500,
    height: 600,
    objectFit: "contain",
    margin: "20 auto",
  },
});

function parseDDMMYYYY(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`);
}

const ToDosChartsDialogDialog = ({ open, onClose, data }: ToDosChartsDialogProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartImage, setChartImage] = useState<string | null>(null);
  const [pdfReady, setPdfReady] = useState(false);

  const handleExportToPdf = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: "#fff",
      scale: 2,
    });
    const dataUrl = canvas.toDataURL("image/png");
    setChartImage(dataUrl);
    setPdfReady(true);
  };

  const MyPDFDocument = () => (
    <Document>
      <Page size="A4">
        {chartImage && <PDFImage src={chartImage} style={styles.image} />}
      </Page>
    </Document>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" sx={{ left: "18vw" }}>
      <DialogTitle
        sx={{
          backgroundColor: "primary.main",
          color: "#fff",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: "1rem",
        }}
      >
        To Do's Report
        <DialogXButton onClose={onClose} />
      </DialogTitle>

      <DialogContent>
        <div ref={chartRef} style={{ padding: 16 }}>
          <DialogContentText sx={{ mb: 1 }}>By Workplace</DialogContentText>
          <BarChart
            xAxis={[
              {
                id: "todos",
                data: data.map((d) => d.name),
                scaleType: "band",
              },
            ]}
            yAxis={[
              {
                id: "task-count",
                label: "Tasks",
                min: 0,
              },
            ]}
            series={[
              {
                label: "Tasks",
                data: data.map((d) => d.tasks ?? 0),
              },
            ]}
            width={500}
            height={300}
          />

          <Divider sx={{ my: 2 }} />

          <DialogContentText sx={{ mb: 1 }}>By Date</DialogContentText>
          <LineChart
            xAxis={[
              {
                id: "start-dates",
                data: data.map((d) => parseDDMMYYYY(d.startDate)),
                scaleType: "time",
              },
            ]}
            yAxis={[
              {
                id: "task-count",
                label: "Tasks",
                min: 0,
              },
            ]}
            series={[
              {
                id: "tasks",
                label: "Tasks",
                data: data.map((d) => d.tasks ?? 0),
              },
            ]}
            width={600}
            height={300}
          />
        </div>
      </DialogContent>

      <DialogActions>
        {!pdfReady && (
          <Button onClick={handleExportToPdf} color="primary" variant="contained">
            Prepare PDF
          </Button>
        )}

        {pdfReady && chartImage && (
          <PDFDownloadLink
            document={<MyPDFDocument />}
            fileName="charts-report.pdf"
            style={{ textDecoration: "none" }}
          >
            {({ loading }) =>
              loading ? (
                <Button variant="contained" disabled>
                  Generating...
                </Button>
              ) : (
                <Button variant="contained">Download PDF</Button>
              )
            }
          </PDFDownloadLink>
        )}

        <Button onClick={onClose} color="error" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ToDosChartsDialogDialog;
