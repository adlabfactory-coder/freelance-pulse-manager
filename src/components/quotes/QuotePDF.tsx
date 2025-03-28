
import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from "@react-pdf/renderer";
import { Quote, QuoteItem } from "@/types/quotes";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AgencySettings } from "@/services/supabase/agency-settings";

// Styles pour le document PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 12,
    padding: 30,
    lineHeight: 1.5,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    color: "#0f172a",
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    color: "#0f172a",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 10,
    color: "#0f172a",
  },
  text: {
    margin: 5,
    fontSize: 10,
    color: "#334155",
  },
  strong: {
    fontWeight: "bold",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    borderBottomStyle: "solid",
    alignItems: "center",
    minHeight: 30,
  },
  tableHeaderRow: {
    backgroundColor: "#f8fafc",
    fontWeight: "bold",
  },
  tableHeaderCell: {
    padding: 5,
    fontSize: 10,
    fontWeight: "bold",
    color: "#334155",
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    color: "#334155",
  },
  tableCellDescription: { width: "40%" },
  tableCellQuantity: { width: "15%" },
  tableCellPrice: { width: "15%" },
  tableCellDiscount: { width: "15%" },
  tableCellTotal: { width: "15%" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 5,
  },
  totalText: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#0f172a",
    marginRight: 10,
  },
  totalValue: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#0f172a",
  },
  logo: {
    width: 100,
    marginBottom: 10,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 3,
    padding: 10,
    marginBottom: 20,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    borderTopWidth: 1,
    borderColor: "#cbd5e1",
    paddingTop: 10,
    fontSize: 9,
    color: "#64748b",
  },
  agencyInfo: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 5,
  },
});

interface QuotePDFProps {
  quote: Quote;
  quoteItems: QuoteItem[];
  contact?: { name: string; email: string; phone?: string; company?: string } | null;
  freelancer?: { name: string; email: string } | null;
  agencySettings?: AgencySettings | null;
}

const QuotePDF: React.FC<QuotePDFProps> = ({
  quote,
  quoteItems,
  contact,
  freelancer,
  agencySettings,
}) => {
  // Formater la date pour l'afficher dans le PDF
  const formattedDate = quote.validUntil
    ? format(new Date(quote.validUntil), "dd MMMM yyyy", { locale: fr })
    : "N/A";

  // Calculer le total des éléments du devis
  const calculateTotal = () => {
    return quoteItems.reduce((acc, item) => {
      const price = item.unitPrice || 0;
      const quantity = item.quantity || 0;
      const discount = item.discount || 0;
      return acc + price * quantity * (1 - discount / 100);
    }, 0);
  };

  return (
    <PDFViewer style={{ width: "100%", height: "80vh" }}>
      <Document title={`Devis #${quote.id.substring(0, 8)}`}>
        <Page size="A4" style={styles.page}>
          {/* <Image src="/logo.png" style={styles.logo} /> */}
          
          <Text style={styles.header}>DEVIS</Text>
          
          <View style={styles.flexRow}>
            {/* Informations du freelancer */}
            <View style={styles.infoBox}>
              <Text style={styles.title}>De:</Text>
              <Text style={styles.text}>{freelancer?.name || "Non spécifié"}</Text>
              <Text style={styles.text}>{freelancer?.email || ""}</Text>
            </View>
            
            {/* Informations du client */}
            <View style={styles.infoBox}>
              <Text style={styles.title}>Pour:</Text>
              <Text style={styles.text}>{contact?.name || "Non spécifié"}</Text>
              <Text style={styles.text}>{contact?.email || ""}</Text>
              <Text style={styles.text}>{contact?.phone || ""}</Text>
              {contact?.company && <Text style={styles.text}>{contact.company}</Text>}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.subtitle}>
              Devis #{quote.id.substring(0, 8)} | Valable jusqu'au {formattedDate}
            </Text>
          </View>
          
          {/* Notes du devis */}
          {quote.notes && (
            <View style={styles.section}>
              <Text style={styles.title}>Détails:</Text>
              <Text style={styles.text}>{quote.notes}</Text>
            </View>
          )}
          
          {/* Tableau des éléments du devis */}
          <View style={styles.table}>
            {/* En-tête du tableau */}
            <View style={[styles.tableRow, styles.tableHeaderRow]}>
              <Text style={[styles.tableHeaderCell, styles.tableCellDescription]}>Description</Text>
              <Text style={[styles.tableHeaderCell, styles.tableCellQuantity]}>Quantité</Text>
              <Text style={[styles.tableHeaderCell, styles.tableCellPrice]}>Prix unitaire</Text>
              <Text style={[styles.tableHeaderCell, styles.tableCellDiscount]}>Remise (%)</Text>
              <Text style={[styles.tableHeaderCell, styles.tableCellTotal]}>Total</Text>
            </View>
            
            {/* Corps du tableau */}
            {quoteItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellDescription]}>{item.description}</Text>
                <Text style={[styles.tableCell, styles.tableCellQuantity]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.tableCellPrice]}>{item.unitPrice?.toFixed(2)} €</Text>
                <Text style={[styles.tableCell, styles.tableCellDiscount]}>{item.discount || 0}%</Text>
                <Text style={[styles.tableCell, styles.tableCellTotal]}>
                  {(
                    (item.unitPrice || 0) *
                    (item.quantity || 0) *
                    (1 - (item.discount || 0) / 100)
                  ).toFixed(2)} €
                </Text>
              </View>
            ))}
          </View>
          
          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalValue}>
              {calculateTotal().toFixed(2)} €
            </Text>
          </View>
          
          {/* Pied de page avec les informations de l'agence */}
          <View style={styles.footer}>
            {agencySettings && (
              <>
                <Text style={styles.agencyInfo}>{agencySettings.name}</Text>
                <Text style={styles.agencyInfo}>
                  RC: {agencySettings.rc} | IF: {agencySettings.if_number} | Capital: {agencySettings.capital}
                </Text>
                <Text style={styles.agencyInfo}>
                  Banque: {agencySettings.bank_name} | RIB: {agencySettings.rib}
                </Text>
              </>
            )}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default QuotePDF;
