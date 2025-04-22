import { Typography, Divider, Paper } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { DateTime } from "luxon";
import useBalanceEntry from "../../Records/hooks/useBalanceEntry";

function parseDDMMYYYY(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`);
}

const SummaryCharts = () => {
  const { fetchedBalanceEntries } = useBalanceEntry();

  const filteredData = (fetchedBalanceEntries ?? []).filter(
    (e) => e.status !== "inactive"
  );

  return (
    <Paper
      elevation={6}
      sx={{
        mt: 4,
        p: 3,
        maxWidth: 700,
        mx: "auto",
        borderRadius: 2,
        height: "45vh",
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        📊 Monthly Balance Entries
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2" color="text.secondary">
        By Name
      </Typography>
      <BarChart
        xAxis={[
          {
            id: "categories",
            data: filteredData.map((d) => d.name),
            scaleType: "band",
          },
        ]}
        yAxis={[{ id: "price-axis", min: -10000, max: 10000 }]}
        series={[
          {
            data: filteredData.map((d) =>
              typeof d.price === "string" ? parseFloat(d.price) : d.price
            ),
          },
        ]}
        width={600}
        height={300}
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" color="text.secondary">
        By Date
      </Typography>
      <LineChart
        xAxis={[
          {
            id: "dates",
            data: filteredData.map((d) =>
              parseDDMMYYYY(DateTime.fromISO(d.date).toFormat("dd/MM/yyyy"))
            ),
            scaleType: "time",
          },
        ]}
        yAxis={[{ id: "price-axis", min: -10000, max: 10000 }]}
        series={[
          {
            id: "prices",
            label: "Amount",
            data: filteredData.map((d) =>
              typeof d.price === "string" ? parseFloat(d.price) : d.price
            ),
          },
        ]}
        width={600}
        height={300}
      />
    </Paper>
  );
};

export default SummaryCharts;
