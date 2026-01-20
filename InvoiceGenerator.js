// src/components/kiosk/InvoiceGenerator.js
import { jsPDF } from 'jspdf';

export function generateInvoicePDF({ orderId, user, items, totals }) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('ABFRL — Invoice', 14, 22);

  doc.setFontSize(11);
  doc.text(`Order ID: ${orderId}`, 14, 36);
  doc.text(`Customer: ${user.name}`, 14, 44);
  doc.text(`Date: ${new Date().toLocaleString()}`, 14, 52);

  let y = 68;
  doc.setFontSize(11);
  doc.text('Items:', 14, y);
  y += 8;

  items.forEach(it => {
    const line = `${it.qty} x ${it.title} — ₹${it.price} = ₹${it.qty * it.price}`;
    doc.text(line, 14, y);
    y += 8;
  });

  y += 6;
  doc.text(`Subtotal: ₹${totals.subtotal}`, 14, y);
  y += 8;
  doc.text(`Loyalty Applied: -₹${totals.loyalty}`, 14, y);
  y += 8;
  doc.text(`Total Paid: ₹${totals.total}`, 14, y);

  doc.save(`invoice_${orderId}.pdf`);
}
