import React from "react";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },

  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
  },

  section: {
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  line: {
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default function QuotationPDF({ quotation }: any) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>TinaSoft Nexus</Text>

        <Text style={styles.title}>QUOTATION</Text>

        <View style={styles.section}>
          <Text>
            Quotation Number:
            {quotation.quotationNumber}
          </Text>

          <Text>
            Client:
            {quotation.client.name}
          </Text>
        </View>

        <View style={styles.line} />

        <View>
          {quotation.items.map((item: any) => (
            <View key={item.id} style={styles.row}>
              <Text>
                {item.product?.name || item.service?.name || item.description}
              </Text>

              <Text>{item.quantity}</Text>

              <Text>${item.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.line} />

        <View style={styles.section}>
          <Text>Subtotal: ${quotation.subtotal.toFixed(2)}</Text>

          <Text>Discount: ${quotation.discount.toFixed(2)}</Text>

          <Text>Tax: ${quotation.tax.toFixed(2)}</Text>

          <Text>TOTAL: ${quotation.total.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
}


// ============to change to A4==========