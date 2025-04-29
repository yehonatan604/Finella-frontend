import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type PdfDocProps = {
  rows: Record<string, unknown>[];
};

const BalanceEnetriesPdfDoc = (props: PdfDocProps) => {
  const { rows } = props;
  const totalPrice = rows.reduce((sum, row) => {
    return sum + Number(row.price);
  }, 0);

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
            <Text style={styles.cell}>Name</Text>
            <Text style={styles.cell}>Date</Text>
            <Text style={styles.cell}>Type</Text>
            <Text style={styles.cell}>Price</Text>
          </View>

          {/* Data Rows */}
          {rows.map((row, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>{row.name + ""}</Text>
              <Text style={styles.cell}>{row.date + ""}</Text>
              <Text style={styles.cell}>{row.type + ""}</Text>
              <Text style={styles.cell}>{row.price + ""}</Text>
            </View>
          ))}

          {/* Total Row */}
          <View style={styles.totalRow}>
            <Text style={styles.cell}>Total</Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}>{totalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default BalanceEnetriesPdfDoc;
