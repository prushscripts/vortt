import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 48, fontFamily: "Helvetica", backgroundColor: "#FFFFFF" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32 },
  logo: { fontSize: 24, fontWeight: 700 },
  invoiceNum: { fontSize: 14, color: "#666" },
  section: { marginBottom: 20 },
  label: { fontSize: 10, color: "#999", marginBottom: 4, textTransform: "uppercase" },
  value: { fontSize: 14 },
  lineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  total: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  totalLabel: { fontSize: 16, fontWeight: 700 },
  totalAmount: { fontSize: 20, fontWeight: 700, color: "#FF6B2B" },
});

export function InvoicePDF({ invoice }: { invoice: any }) {
  const items = Array.isArray(invoice.lineItems) ? invoice.lineItems : [{ description: "HVAC Service", amount: invoice.totalAmount }];
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>VORTT</Text>
          <View>
            <Text style={styles.invoiceNum}>{invoice.invoiceNo}</Text>
            <Text style={{ fontSize: 12, color: "#999" }}>{new Date(invoice.createdAt).toLocaleDateString()}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Bill To</Text>
          <Text style={styles.value}>{invoice.customer?.firstName} {invoice.customer?.lastName}</Text>
          <Text style={{ fontSize: 13, color: "#666" }}>{invoice.customer?.address}</Text>
        </View>
        {items.map((item: any, i: number) => (
          <View key={i} style={styles.lineItem}>
            <Text style={{ fontSize: 13 }}>{item.description}</Text>
            <Text style={{ fontSize: 13 }}>${item.amount}</Text>
          </View>
        ))}
        <View style={styles.total}>
          <Text style={styles.totalLabel}>Total Due</Text>
          <Text style={styles.totalAmount}>${invoice.totalAmount}</Text>
        </View>
      </Page>
    </Document>
  );
}
