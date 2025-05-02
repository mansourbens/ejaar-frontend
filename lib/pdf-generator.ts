"use client";

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Quotation } from './mock-data';
import autoTable from 'jspdf-autotable';

interface PDFGenOptions {
  title?: string;
  filename?: string;
  author?: string;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

export function generateQuotationPDF(quotation: Quotation, options?: PDFGenOptions) {
  const {
    title = 'EJAAR - Hardware Leasing Quotation',
    filename = `ejaar-quotation-${quotation.id}.pdf`,
    author = 'EJAAR IT Leasing'
  } = options || {};

  // Create new PDF document
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title,
    author,
    subject: 'IT Hardware Leasing Quotation',
    keywords: 'quotation, lease, hardware, IT'
  });

  // Add company logo and header
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102);
  doc.text('EJAAR', 20, 20);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('IT Hardware Leasing Solutions', 20, 25);
  
  // Add quotation details
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Quotation Details', 20, 40);
  
  doc.setFontSize(10);
  doc.text(`Date: ${new Date(quotation.createdAt).toLocaleDateString()}`, 20, 50);
  doc.text(`Quotation ID: ${quotation.id}`, 20, 55);
  doc.text(`Status: ${quotation.status.toUpperCase()}`, 20, 60);
  
  // Add customer info
  doc.setFontSize(16);
  doc.text('Customer Information', 20, 75);
  
  doc.setFontSize(10);
  doc.text('Customer Name: [Customer Name]', 20, 85);
  doc.text('Email: [Customer Email]', 20, 90);
  doc.text('Company: [Company Name]', 20, 95);
  
  // Add hardware details
  doc.setFontSize(16);
  doc.text('Hardware Details', 20, 110);
  
  const returnValue = quotation.price * (parseInt(quotation.returnRate.toString()) / 100);
  const monthlyPayment = quotation.totalAmount / parseInt(quotation.duration);
  
  // Add table for hardware details
  doc.autoTable({
    startY: 120,
    head: [['Item', 'Details']],
    body: [
      ['Hardware Type', quotation.hardwareType],
      ['Price (USD)', `$${quotation.price.toFixed(2)}`],
      ['Lease Duration', `${quotation.duration} months`],
      ['Return Rate', `${quotation.returnRate}%`],
      ['Return Value', `$${returnValue.toFixed(2)}`],
      ['Monthly Payment', `$${monthlyPayment.toFixed(2)}`],
      ['Total Lease Amount', `$${quotation.totalAmount.toFixed(2)}`]
    ],
    theme: 'striped',
    headStyles: { fillColor: [0, 51, 102] }
  });
  
  // Add terms and conditions
  const finalY = (doc as any).lastAutoTable.finalY || 120;
  
  doc.setFontSize(16);
  doc.text('Terms & Conditions', 20, finalY + 20);
  
  doc.setFontSize(10);
  const terms = [
    '1. This quotation is valid for 30 days from the date of issue.',
    '2. Hardware specifications are subject to availability.',
    '3. Monthly payments are due on the 1st of each month.',
    '4. Early termination fees may apply.',
    '5. Hardware must be returned in good working condition.',
    '6. Maintenance and support services are included.'
  ];
  
  terms.forEach((term, index) => {
    doc.text(term, 20, finalY + 30 + (index * 5));
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      'EJAAR IT Hardware Leasing | www.ejaar.com | +1 (555) 123-4567',
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  return {
    save: () => doc.save(filename),
    output: () => doc.output('blob')
  };
}