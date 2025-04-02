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
import DialogXButton from "../../DialogXButton";
import html2canvas from "html2canvas";
import { useRef, useState } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Image as PDFImage,
  StyleSheet,
} from "@react-pdf/renderer";

type BalanceEntriesChartsDialogProps = {
  open: boolean;
  onClose: () => void;
  data: (
    | {
        id: string | undefined;
        name: string;
        date: string;
        type: "income" | "expense";
        price: string | number;
        withVat: boolean;
        notes: string;
        status: string | undefined;
      }
    | {
        id: string;
        name: string;
        price: string;
      }
  )[];
};

function parseDDMMYYYY(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`);
}

const styles = StyleSheet.create({
  image: {
    width: 500,
    height: 600,
    objectFit: "contain",
    margin: "20 auto",
  },
});

const BalanceEntriesChartsDialog = ({
  open,
  onClose,
  data,
}: BalanceEntriesChartsDialogProps) => {
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
        Notes Report
        <DialogXButton onClose={onClose} />
      </DialogTitle>

      <DialogContent>
        <div ref={chartRef} style={{ padding: 16 }}>
          <DialogContentText sx={{ mb: 1 }}>By Name</DialogContentText>
          <BarChart
            xAxis={[
              {
                id: "categories",
                data: data.filter((d) => d.id !== "total").map((d) => d.name),
                scaleType: "band",
              },
            ]}
            yAxis={[{ id: "price-axis", min: -10000, max: 10000 }]}
            series={[
              {
                data: data
                  .filter((d) => d.id !== "total")
                  .map((d) =>
                    typeof d.price === "string" ? parseFloat(d.price) : d.price
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
                id: "dates",
                data: data
                  .filter((d) => d.id !== "total" && "date" in d)
                  .map((d) => parseDDMMYYYY((d as { date: string }).date)),
                scaleType: "time",
              },
            ]}
            yAxis={[{ id: "price-axis", min: -10000, max: 10000 }]}
            series={[
              {
                id: "prices",
                label: "Amount",
                data: data
                  .filter((d) => d.id !== "total" && "price" in d)
                  .map((d) =>
                    typeof d.price === "string" ? parseFloat(d.price) : d.price
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

export default BalanceEntriesChartsDialog;
