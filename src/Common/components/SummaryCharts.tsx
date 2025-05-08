import React from "react";
import { Typography, Divider, Paper } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { DateTime } from "luxon";
import useBalanceEntry from "../../BalanceEntries/hooks/useBalanceEntry";

function parseDDMMYYYY(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`);
}

const SummaryCharts = () => {
  const { fetchedBalanceEntries } = useBalanceEntry();

  const filteredData = (fetchedBalanceEntries ?? [])
    .filter((e) => e.status !== "inactive")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartData = filteredData.map((d) => {
    const price = d.type.toLowerCase().trim() === "expense" ? -d.price : d.price;
    const date = d.date.split("T")[0];

    return {
      x: parseDDMMYYYY(DateTime.fromISO(d.date).toFormat("dd/MM/yyyy")),
      y: typeof price === "string" ? parseFloat(price) : price,
      name: d.name,
      date,
    };
  });

  return (
    <Paper
      elevation={6}
      sx={{
        mt: 4,
        p: 3,
        pt: 1,
        maxWidth: 1000,
        mx: "auto",
        borderRadius: 2,
        height: "55vh",
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        📊 Yearly Balance
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
        series={[
          {
            data: filteredData.map((d) => {
              const price =
                d.type.toLowerCase().trim() === "expense" ? -d.price : d.price;
              return typeof price === "string" ? parseFloat(price) : price;
            }),
          },
        ]}
        width={900}
        height={450}
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" color="text.secondary">
        By Date
      </Typography>
      <LineChart
        xAxis={[
          {
            id: "dates",
            data: chartData.map((d) => d.x),
            scaleType: "time",
            tickMinStep: 30 * 24 * 60 * 60 * 1000,
            tickLabelInterval: () => true,
            valueFormatter: (value) => {
              return DateTime.fromJSDate(value).toFormat("dd LLL", { locale: "en" });
            },
          },
        ]}
        series={[
          {
            id: "prices",
            data: chartData.map((d) => d.y),
            showMark: true,
            valueFormatter: (value, ctx) => {
              const point = chartData[ctx.dataIndex];
              return `${value?.toLocaleString()}: ${point?.name} `;
            },
          },
        ]}
        width={900}
        height={450}
      />
    </Paper>
  );
};

export default SummaryCharts;
