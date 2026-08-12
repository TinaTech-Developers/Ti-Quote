import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

interface Props {
  invoice: any;
  company: any;
}

const GREEN = "#00A651";
const HEADER = "#DCE6F2";
const DARK = "#16365D";

const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: "#fff",
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#222",
  },

  topBar: {
    height: 6,
    backgroundColor: GREEN,
  },

  header: {
    backgroundColor: HEADER,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  leftHeader: {
    flexDirection: "row",
    width: "65%",
  },

  logo: {
    width: 58,
    height: 58,
    objectFit: "contain",
  },

  companyInfo: {
    marginLeft: 12,
    justifyContent: "center",
  },

  companyName: {
    fontSize: 13,
    fontWeight: "bold",
    color: DARK,
    marginBottom: 3,
  },

  companyText: {
    fontSize: 8,
    color: "#444",
    lineHeight: 1.45,
  },

  rightHeader: {
    width: "28%",
    alignItems: "flex-end",
  },

  invoiceTitle: {
    fontSize: 22,
    color: DARK,
    fontWeight: "bold",
    marginBottom: 10,
  },

  invoiceDate: {
    fontSize: 8,
    marginBottom: 4,
  },

  label: {
    fontSize: 8,
    color: "#666",
    marginTop: 8,
  },

  invoiceNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: DARK,
    marginTop: 2,
  },

  status: {
    marginTop: 8,
    fontSize: 8,
    color: GREEN,
    fontWeight: "bold",
  },

  clientWrapper: {
    paddingHorizontal: 20,
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  clientBox: {
    width: "46%",
  },

  clientHeading: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },

  underline: {
    borderBottomWidth: 1,
    borderBottomColor: "#777",
    marginBottom: 8,
  },

  clientText: {
    fontSize: 8,
    marginBottom: 3,
    color: "#222",
  },

  // ===========================
  // ITEMS TABLE
  // ===========================

  tableWrapper: {
    marginTop: 22,
    marginHorizontal: 20,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: GREEN,
    color: "#fff",
    height: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: GREEN,
  },

  headerText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "bold",
  },

  tableRow: {
    flexDirection: "row",
    minHeight: 22,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#bfbfbf",
    alignItems: "center",
  },

  itemCell: {
    width: "46%",
    paddingLeft: 6,
  },

  numberCell: {
    width: "10%",
    textAlign: "center",
  },

  qtyCell: {
    width: "16%",
    textAlign: "center",
  },

  rateCell: {
    width: "14%",
    textAlign: "right",
    paddingRight: 6,
  },

  totalCell: {
    width: "14%",
    textAlign: "right",
    paddingRight: 6,
  },

  cellText: {
    fontSize: 8,
  },

  // ===========================
  // REMARKS
  // ===========================

  remarksRow: {
    marginHorizontal: 20,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#bfbfbf",
    minHeight: 35,
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  remarksTitle: {
    fontWeight: "bold",
    fontSize: 8,
  },

  remarksText: {
    marginTop: 3,
    fontSize: 8,
    color: "#444",
  },

  // ===========================
  // TOTALS
  // ===========================

  totalsWrapper: {
    marginTop: 8,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  totalsBox: {
    width: 220,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#cfcfcf",
    paddingVertical: 4,
  },

  totalLabel: {
    fontSize: 8,
    color: "#444",
  },

  totalValue: {
    fontSize: 8,
  },

  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 2,
    borderBottomColor: "#444",
  },

  grandLabel: {
    fontSize: 9,
    fontWeight: "bold",
  },

  grandValue: {
    fontSize: 9,
    fontWeight: "bold",
  },

  balanceWrapper: {
    marginTop: 10,
    flexDirection: "row",
  },

  balanceLabel: {
    flex: 1,
    backgroundColor: "#E6E6E6",
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 9,
    fontWeight: "bold",
  },

  balanceCurrency: {
    width: 30,
    backgroundColor: GREEN,
    color: "#fff",
    textAlign: "center",
    paddingTop: 8,
    fontWeight: "bold",
  },

  balanceAmount: {
    width: 90,
    backgroundColor: GREEN,
    color: "#fff",
    textAlign: "center",
    paddingTop: 8,
    fontSize: 11,
    fontWeight: "bold",
  },

  // ===========================
  // TERMS & FOOTER
  // ===========================

  bottomSection: {
    marginTop: 28,
    marginHorizontal: 20,
  },

  greenDivider: {
    height: 3,
    backgroundColor: GREEN,
    marginBottom: 12,
  },

  termsTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: DARK,
    marginBottom: 8,
  },

  termsBlock: {
    marginBottom: 10,
  },

  termsHeading: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },

  termsText: {
    fontSize: 8,
    color: "#444",
    lineHeight: 1.5,
  },

  footer: {
    marginTop: 25,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerLeft: {
    width: "55%",
  },

  footerRight: {
    width: "40%",
    alignItems: "flex-end",
  },

  footerText: {
    fontSize: 8,
    color: "#555",
    marginBottom: 3,
  },

  footerBold: {
    fontSize: 8,
    fontWeight: "bold",
    color: DARK,
  },

  thankYou: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 9,
    color: DARK,
    fontWeight: "bold",
  },
});

export default function InvoicePDF({ invoice, company }: Props) {
  const subtotal = Number(invoice.subtotal);

  const discount = Number(invoice.discount);

  const tax = Number(invoice.tax);

  const total = Number(invoice.total);

  const balance = Number(invoice.balance);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} />

        <View style={styles.header}>
          <View style={styles.leftHeader}>
            {company.logoUrl && (
              <Image src={company.logoUrl} style={styles.logo} />
            )}

            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{company.name}</Text>

              {company.address && (
                <Text style={styles.companyText}>{company.address}</Text>
              )}

              {company.phone && (
                <Text style={styles.companyText}>{company.phone}</Text>
              )}

              {company.email && (
                <Text style={styles.companyText}>{company.email}</Text>
              )}

              {company.website && (
                <Text style={styles.companyText}>{company.website}</Text>
              )}
            </View>
          </View>

          <View style={styles.rightHeader}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>

            <Text style={styles.invoiceDate}>
              Issued: {new Date(invoice.createdAt).toLocaleDateString()}
            </Text>

            {invoice.dueDate && (
              <Text style={styles.invoiceDate}>
                Due: {new Date(invoice.dueDate).toLocaleDateString()}
              </Text>
            )}

            <Text style={styles.label}>INVOICE NUMBER</Text>

            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>

            <Text style={styles.status}>{invoice.status}</Text>
          </View>
        </View>

        <View style={styles.clientWrapper}>
          <View style={styles.clientBox}>
            <Text style={styles.clientHeading}>BILL TO</Text>

            <View style={styles.underline} />

            <Text style={styles.clientText}>{invoice.client?.name}</Text>

            {invoice.client?.companyName && (
              <Text style={styles.clientText}>
                {invoice.client.companyName}
              </Text>
            )}

            {invoice.client?.address && (
              <Text style={styles.clientText}>{invoice.client.address}</Text>
            )}

            {invoice.client?.phone && (
              <Text style={styles.clientText}>{invoice.client.phone}</Text>
            )}
          </View>

          <View style={styles.clientBox}>
            <Text style={styles.clientHeading}>CLIENT DETAILS</Text>

            <View style={styles.underline} />

            {invoice.client?.email && (
              <Text style={styles.clientText}>{invoice.client.email}</Text>
            )}

            {invoice.client?.phone && (
              <Text style={styles.clientText}>{invoice.client.phone}</Text>
            )}
          </View>
        </View>
        <View style={styles.tableWrapper}>
          <View style={styles.tableHeader}>
            <View style={styles.itemCell}>
              <Text style={styles.headerText}>Item</Text>
            </View>

            <View style={styles.numberCell}>
              <Text style={styles.headerText}>No.</Text>
            </View>

            <View style={styles.qtyCell}>
              <Text style={styles.headerText}>Qty</Text>
            </View>

            <View style={styles.rateCell}>
              <Text style={styles.headerText}>RATE</Text>
            </View>

            <View style={styles.totalCell}>
              <Text style={styles.headerText}>TOTAL</Text>
            </View>
          </View>

          {invoice.items.map((item: any, index: number) => (
            <View key={item.id} style={styles.tableRow} wrap={false}>
              <View style={styles.itemCell}>
                <Text style={styles.cellText}>{item.description}</Text>
              </View>

              <View style={styles.numberCell}>
                <Text style={styles.cellText}>{index + 1}</Text>
              </View>

              <View style={styles.qtyCell}>
                <Text style={styles.cellText}>{Number(item.quantity)}</Text>
              </View>

              <View style={styles.rateCell}>
                <Text style={styles.cellText}>
                  {company.currency || "$"} {Number(item.unitPrice).toFixed(2)}
                </Text>
              </View>

              <View style={styles.totalCell}>
                <Text style={styles.cellText}>
                  {company.currency || "$"} {Number(item.total).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.remarksRow}>
          <Text style={styles.remarksTitle}>
            Remarks / Payment Instructions
          </Text>

          {invoice.notes && (
            <Text style={styles.remarksText}>{invoice.notes}</Text>
          )}
        </View>
        <View style={styles.totalsWrapper}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>SUBTOTAL</Text>

              <Text style={styles.totalValue}>
                {company.currency || "$"} {subtotal.toFixed(2)}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>DISCOUNT</Text>

              <Text style={styles.totalValue}>
                {company.currency || "$"} {discount.toFixed(2)}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TAX</Text>

              <Text style={styles.totalValue}>
                {company.currency || "$"} {tax.toFixed(2)}
              </Text>
            </View>

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandLabel}>TOTAL</Text>

              <Text style={styles.grandValue}>
                {company.currency || "$"} {total.toFixed(2)}
              </Text>
            </View>

            <View style={styles.balanceWrapper}>
              <Text style={styles.balanceLabel}>Balance Due</Text>

              <Text style={styles.balanceCurrency}>
                {company.currency || "$"}
              </Text>

              <Text style={styles.balanceAmount}>{balance.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomSection}>
          <View style={styles.greenDivider} />

          <Text style={styles.termsTitle}>Terms & Conditions</Text>

          <View style={styles.termsBlock}>
            <Text style={styles.termsHeading}>Payment Terms</Text>

            <Text style={styles.termsText}>
              {invoice.terms ?
                invoice.terms
              : "Payment is required according to the agreed payment arrangement. Goods or services will only be processed after confirmation of payment."
              }
            </Text>
          </View>

          <View style={styles.termsBlock}>
            <Text style={styles.termsHeading}>Other Terms & Conditions</Text>

            <Text style={styles.termsText}>
              • Prices quoted are subject to the agreed invoice terms.
            </Text>

            <Text style={styles.termsText}>
              • Any additional work outside this invoice will be charged
              separately.
            </Text>

            <Text style={styles.termsText}>
              • Goods remain the property of the company until payment is
              received in full.
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <Text style={styles.footerBold}>{company.name}</Text>

              {company.address && (
                <Text style={styles.footerText}>{company.address}</Text>
              )}

              {company.phone && (
                <Text style={styles.footerText}>Tel: {company.phone}</Text>
              )}

              {company.email && (
                <Text style={styles.footerText}>Email: {company.email}</Text>
              )}

              {company.taxNumber && (
                <Text style={styles.footerText}>
                  Tax No: {company.taxNumber}
                </Text>
              )}
            </View>

            <View style={styles.footerRight}>
              <Text style={styles.footerText}>Invoice Number</Text>

              <Text style={styles.footerBold}>{invoice.invoiceNumber}</Text>

              <Text style={styles.footerText}>Status: {invoice.status}</Text>

              <Text style={styles.footerText}>
                Generated: {new Date().toLocaleDateString("en-GB")}
              </Text>
            </View>
          </View>

          <Text style={styles.thankYou}>Thank you for your business</Text>
        </View>
      </Page>
    </Document>
  );
}
