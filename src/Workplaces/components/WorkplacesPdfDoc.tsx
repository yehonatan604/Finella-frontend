import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type PdfDocProps = {
  rows: Record<string, unknown>[];
};

const WorkplacesPdfDoc = (props: PdfDocProps) => {
  const { rows } = props;

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      padding: 20,
      fontSize: 12,
      fontFamily: "Heebo",
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
          Workplaces Report
        </Text>

        {/* Table */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <Text style={styles.cell}>Name</Text>
            <Text style={styles.cell}>Address</Text>
            <Text style={styles.cell}>City</Text>
            <Text style={styles.cell}>Country</Text>
            <Text style={styles.cell}>Price per Hour</Text>
            <Text style={styles.cell}>Price per Month</Text>
          </View>

          {/* Data Rows */}
          {(rows as Record<string, string>[]).map((row, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>{row.name}</Text>
              <Text style={styles.cell}>{row.address}</Text>
              <Text style={styles.cell}>{row.city}</Text>
              <Text style={styles.cell}>{row.country}</Text>
              <Text style={styles.cell}>{row.pricePerHour}</Text>
              <Text style={styles.cell}>{row.pricePerMonth}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default WorkplacesPdfDoc;
