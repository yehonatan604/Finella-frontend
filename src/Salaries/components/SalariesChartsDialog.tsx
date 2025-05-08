import React, { useRef, useState } from "react";
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

type SalariesChartsDialogProps = {
  open: boolean;
  onClose: () => void;
  data: (
    | {
        id: string | undefined;
        workplace: string;
        year: string;
        month: string;
        "total hours": string | number;
        "total sum": string | number;
        status: string | undefined;
        notes: string;
      }
    | {
        id: string;
        workplace: string;
        "total hours": string;
        "total sum": string;
      }
  )[];
};

const styles = StyleSheet.create({
  image: {
    width: 500,
    height: 600,
    objectFit: "contain",
    margin: "20 auto",
  },
});

const SalariesChartsDialog = ({ open, onClose, data }: SalariesChartsDialogProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartImage, setChartImage] = useState<string | null>(null);
  const [pdfReady, setPdfReady] = useState(false);

  const filtered = data.filter(
    (d) =>
      d.id !== "total" &&
      d.workplace?.trim() !== "" &&
      d["total sum"] !== "" &&
      !isNaN(Number(d["total sum"]))
  );

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
        Salaries Report
        <DialogXButton onClose={onClose} />
      </DialogTitle>

      <DialogContent>
        <div ref={chartRef} style={{ padding: 16 }}>
          <DialogContentText sx={{ mb: 1 }}>By Workplace</DialogContentText>
          <BarChart
            xAxis={[
              {
                id: "workplaces",
                data: filtered.map((d) => d.workplace),
                scaleType: "band",
              },
            ]}
            yAxis={[{ id: "sum-axis", min: 0 }]} // let it auto-scale
            series={[
              {
                label: "Total Sum",
                data: filtered.map((d) =>
                  typeof d["total sum"] === "string"
                    ? parseFloat(d["total sum"])
                    : d["total sum"]
                ),
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
                id: "date",
                data: filtered.map((d) =>
                  "year" in d && "month" in d
                    ? new Date(`${d.year}-${String(d.month).padStart(2, "0")}-01`)
                    : null
                ),
                scaleType: "time",
              },
            ]}
            yAxis={[{ id: "sum-axis", min: 0 }]}
            series={[
              {
                id: "sum",
                label: "Total Sum",
                data: filtered.map((d) =>
                  typeof d["total sum"] === "string"
                    ? parseFloat(d["total sum"])
                    : d["total sum"]
                ),
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

export default SalariesChartsDialog;
