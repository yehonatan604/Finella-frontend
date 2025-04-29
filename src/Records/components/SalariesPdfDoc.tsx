import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type PdfDocProps = {
  rows: Record<string, unknown>[];
};

const SalariesPdfDoc = (props: PdfDocProps) => {
  const { rows } = props;
  const totalHours = rows.reduce((sum, row) => sum + Number(row["total hours"] || 0), 0);
  const totalSum = rows.reduce((sum, row) => sum + Number(row["total sum"] || 0), 0);

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      padding: 20,
      fontSize: 12,
    },
    table: {
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      marginBottom: 10,
    },
    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      padding: 5,
    },
    headerRow: {
      flexDirection: "row",
      backgroundColor: "#1976D2",
      color: "#FFF",
      fontWeight: "bold",
      padding: 5,
    },
    totalRow: {
      flexDirection: "row",
      backgroundColor: "#E8F5E9",
      fontWeight: "bold",
      padding: 5,
    },
    cell: {
      flex: 1,
      textAlign: "center",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text
          style={{
            fontSize: 18,
            marginBottom: 10,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Salary Report
        </Text>

        {/* Table */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <Text style={styles.cell}>Workplace</Text>
            <Text style={styles.cell}>Year</Text>
            <Text style={styles.cell}>Month</Text>
            <Text style={styles.cell}>Total Hours</Text>
            <Text style={styles.cell}>Total Sum</Text>
          </View>

          {/* Data Rows */}
          {rows.map((row, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>{row.workplace + ""}</Text>
              <Text style={styles.cell}>{row.year + ""}</Text>
              <Text style={styles.cell}>{row.month + ""}</Text>
              <Text style={styles.cell}>{row["total hours"] + ""}</Text>
              <Text style={styles.cell}>{row["total sum"] + ""}</Text>
            </View>
          ))}

          {/* Total Row */}
          <View style={styles.totalRow}>
            <Text style={styles.cell}>Total</Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}>{totalHours.toFixed(2)}</Text>
            <Text style={styles.cell}>{totalSum.toFixed(2)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default SalariesPdfDoc;
