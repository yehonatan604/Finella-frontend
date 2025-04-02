import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import DialogXButton from "../DialogXButton";

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

const BalanceEntriesChartsDialog = (props: BalanceEntriesChartsDialogProps) => {
  const { open, onClose, data } = props;

  function parseDDMMYYYY(dateStr: string): Date {
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  }

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
        {"Notes Report"}
        <DialogXButton onClose={onClose} />
      </DialogTitle>
      <DialogContent>
        <BarChart
          xAxis={[
            {
              id: "categories",
              data: data.filter((d) => d.id !== "total").map((d) => d.name),
              scaleType: "band",
            },
          ]}
          yAxis={[
            {
              id: "price-axis",
              min: -10000,
              max: 10000,
            },
          ]}
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
          yAxis={[
            {
              id: "price-axis",
              min: -10000,
              max: 10000,
            },
          ]}
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
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained">
          Export To Pdf
        </Button>
        <Button onClick={onClose} color="error" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BalanceEntriesChartsDialog;
