import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

interface Props {
  quotation: any;
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

  /* ===========================
      HEADER
  =========================== */

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

  quoteTitle: {
    fontSize: 22,
    color: DARK,
    fontWeight: "bold",
    marginBottom: 10,
  },

  quoteDate: {
    fontSize: 8,
    marginBottom: 4,
  },

  quoteNumberLabel: {
    fontSize: 8,
    color: "#666",
    marginTop: 8,
  },

  quoteNumber: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 2,
    color: DARK,
  },

  /* ===========================
      CLIENT SECTION
  =========================== */

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
  /* ===========================
      ITEMS TABLE
=========================== */

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

  /* ===========================
      TOTALS
=========================== */

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
  /* ===========================
      TERMS & FOOTER
  =========================== */

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

export default function QuotationPDF({ quotation, company }: Props) {
  const subtotal = Number(quotation.subtotal);

  const discount = Number(quotation.discount);

  const taxRate = 15;

  const taxable = subtotal - discount;

  const vat = taxable * (taxRate / 100);

  const total = taxable + vat;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* GREEN BAR */}

        <View style={styles.topBar} />

        {/* HEADER */}

        <View style={styles.header}>
          {/* LEFT */}

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

          {/* RIGHT */}

          <View style={styles.rightHeader}>
            <Text style={styles.quoteTitle}>QUOTE</Text>

            <Text style={styles.quoteDate}>
              {new Date(quotation.createdAt).toLocaleDateString()}
            </Text>

            <Text style={styles.quoteNumberLabel}>QUOTE NUMBER</Text>

            <Text style={styles.quoteNumber}>{quotation.quotationNumber}</Text>
          </View>
        </View>

        {/* CLIENT DETAILS */}

        <View style={styles.clientWrapper}>
          {/* BILL TO */}

          <View style={styles.clientBox}>
            <Text style={styles.clientHeading}>BILL and Ship To</Text>

            <View style={styles.underline} />

            <Text style={styles.clientText}>{quotation.client?.name}</Text>

            {quotation.client?.companyName && (
              <Text style={styles.clientText}>
                {quotation.client.companyName}
              </Text>
            )}

            {quotation.client?.address && (
              <Text style={styles.clientText}>{quotation.client.address}</Text>
            )}

            {quotation.client?.phone && (
              <Text style={styles.clientText}>{quotation.client.phone}</Text>
            )}
          </View>

          {/* CLIENT DETAILS */}

          <View style={styles.clientBox}>
            <Text style={styles.clientHeading}>Client Details</Text>

            <View style={styles.underline} />

            {quotation.client?.companyName && (
              <Text style={styles.clientText}>
                {quotation.client.companyName}
              </Text>
            )}

            {quotation.client?.email && (
              <Text style={styles.clientText}>{quotation.client.email}</Text>
            )}

            {quotation.client?.phone && (
              <Text style={styles.clientText}>{quotation.client.phone}</Text>
            )}
          </View>
        </View>
        {/* ===========================
      ITEMS TABLE
=========================== */}

        <View style={styles.tableWrapper}>
          {/* HEADER */}

          <View style={styles.tableHeader}>
            <View style={styles.itemCell}>
              <Text style={styles.headerText}>Item</Text>
            </View>

            <View style={styles.numberCell}>
              <Text style={styles.headerText}>Number</Text>
            </View>

            <View style={styles.qtyCell}>
              <Text style={styles.headerText}>Quantity</Text>
            </View>

            <View style={styles.rateCell}>
              <Text style={styles.headerText}>RATE</Text>
            </View>

            <View style={styles.totalCell}>
              <Text style={styles.headerText}>TOTAL</Text>
            </View>
          </View>

          {/* ITEMS */}

          {quotation.items.map((item: any, index: number) => (
            <View key={item.id} style={styles.tableRow} wrap={false}>
              <View style={styles.itemCell}>
                <Text style={styles.cellText}>{item.description}</Text>
              </View>

              <View style={styles.numberCell}>
                <Text style={styles.cellText}>{index + 1}</Text>
              </View>

              <View style={styles.qtyCell}>
                <Text style={styles.cellText}>{item.quantity}</Text>
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

        {/* ===========================
      REMARKS
=========================== */}

        <View style={styles.remarksRow}>
          <Text style={styles.remarksTitle}>
            Remarks / Payment Instructions
          </Text>

          {quotation.notes && (
            <Text style={styles.remarksText}>{quotation.notes}</Text>
          )}
        </View>
        {/* ===========================
      TOTALS
=========================== */}

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
              <Text style={styles.totalLabel}>VAT ({taxRate}%)</Text>

              <Text style={styles.totalValue}>
                {company.currency || "$"} {vat.toFixed(2)}
              </Text>
            </View>

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandLabel}>TOTAL</Text>

              <Text style={styles.grandValue}>
                {company.currency || "$"} {total.toFixed(2)}
              </Text>
            </View>

            {/* BALANCE DUE */}

            <View style={styles.balanceWrapper}>
              <Text style={styles.balanceLabel}>Balance Due</Text>

              <Text style={styles.balanceCurrency}>
                {company.currency || "$"}
              </Text>

              <Text style={styles.balanceAmount}>{total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        {/* ===========================
      TERMS & FOOTER
=========================== */}

        <View style={styles.bottomSection}>
          {/* GREEN DIVIDER */}

          <View style={styles.greenDivider} />

          <Text style={styles.termsTitle}>Terms & Conditions</Text>

          {/* PAYMENT TERMS */}

          <View style={styles.termsBlock}>
            <Text style={styles.termsHeading}>Payment Terms</Text>

            <Text style={styles.termsText}>
              Payment is required according to the agreed payment arrangement.
              Goods or services will only be processed after confirmation of
              payment.
            </Text>
          </View>

          {/* OTHER TERMS */}

          <View style={styles.termsBlock}>
            <Text style={styles.termsHeading}>Other Terms & Conditions</Text>

            <Text style={styles.termsText}>
              • Prices quoted are valid for the period stated on this quotation.
            </Text>

            <Text style={styles.termsText}>
              • Any additional work outside this quotation will be charged
              separately.
            </Text>

            <Text style={styles.termsText}>
              • All goods remain the property of the company until payment is
              received in full.
            </Text>
          </View>

          {/* FOOTER */}

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
            </View>

            <View style={styles.footerRight}>
              <Text style={styles.footerText}>Quote Number</Text>

              <Text style={styles.footerBold}>{quotation.quotationNumber}</Text>

              <Text style={styles.footerText}>
                Generated: {new Date().toLocaleDateString()}
              </Text>
            </View>
          </View>

          <Text style={styles.thankYou}>Thank you for your business</Text>
        </View>
      </Page>
    </Document>
  );
}
