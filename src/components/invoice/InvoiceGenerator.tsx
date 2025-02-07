'use client';

import React, { useState } from 'react';
import { Upload, FileText, Download } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Define PDF styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30
  },
  section: {
    margin: 10,
    padding: 10
  },
  header: {
    fontSize: 24,
    marginBottom: 20
  },
  businessInfo: {
    marginBottom: 20
  },
  customerInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5'
  },
  table: {
    display: 'table',
    width: '100%',
    marginBottom: 20
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    height: 24
  },
  tableHeader: {
    backgroundColor: '#f5f5f5'
  },
  tableCell: {
    flex: 1,
    padding: 5
  },
  total: {
    marginTop: 20,
    textAlign: 'right'
  }
});

// PDF Document Component
const InvoicePDF = ({ invoiceData, customerInfo }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text>INVOICE</Text>
      </View>
      
      <View style={styles.businessInfo}>
        <Text>{invoiceData.businessName}</Text>
        <Text>{invoiceData.address}</Text>
        <Text>Invoice #{invoiceData.invoiceNumber}</Text>
        <Text>Date: {invoiceData.date}</Text>
      </View>

      <View style={styles.customerInfo}>
        <Text>Bill To:</Text>
        <Text>{customerInfo.name}</Text>
        {customerInfo.company && <Text>{customerInfo.company}</Text>}
        <Text>{customerInfo.address}</Text>
        <Text>{customerInfo.email}</Text>
        <Text>{customerInfo.phone}</Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Description</Text>
          <Text style={styles.tableCell}>Qty</Text>
          <Text style={styles.tableCell}>Price</Text>
          <Text style={styles.tableCell}>Total</Text>
        </View>

        {invoiceData.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.description}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>${item.price.toFixed(2)}</Text>
            <Text style={styles.tableCell}>${item.total.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.total}>
        <Text>Subtotal: ${invoiceData.subtotal.toFixed(2)}</Text>
        <Text>Tax: ${invoiceData.tax.toFixed(2)}</Text>
        <Text>Total: ${invoiceData.total.toFixed(2)}</Text>
      </View>

      {customerInfo.notes && (
        <View style={styles.section}>
          <Text>Notes:</Text>
          <Text>{customerInfo.notes}</Text>
        </View>
      )}
    </Page>
  </Document>
);

const InvoiceGenerator = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    notes: ''
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      processReceipt(file);
    }
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const processReceipt = (file) => {
    // Simulating receipt processing with sample data
    setInvoiceData({
      businessName: "Cuisine of India",
      address: "10916 West Pico Blvd, Los Angeles, CA 90064",
      items: [
        { description: "Veg Samosa", quantity: 8, price: 5.00, total: 40.00 },
        { description: "Chicken Tikka Masala", quantity: 7, price: 14.95, total: 104.65 },
        { description: "Chana", quantity: 6, price: 12.00, total: 72.00 },
        { description: "Peas Pullav", quantity: 6, price: 4.50, total: 27.00 }
      ],
      subtotal: 291.15,
      tax: 27.66,
      total: 343.81,
      date: new Date().toISOString().split('T')[0],
      invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Receipt to Invoice Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="receipt-upload"
              />
              <label
                htmlFor="receipt-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-gray-400">
                  Supported formats: PNG, JPG, PDF
                </span>
              </label>
            </div>

            {/* Customer Information Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Customer Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleCustomerInfoChange}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  name="company"
                  value={customerInfo.company}
                  onChange={handleCustomerInfoChange}
                  placeholder="Company LLC"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={handleCustomerInfoChange}
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleCustomerInfoChange}
                  placeholder="(555) 555-5555"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleCustomerInfoChange}
                  placeholder="123 Main St, City, State, ZIP"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={customerInfo.notes}
                  onChange={handleCustomerInfoChange}
                  placeholder="Additional notes or special instructions"
                />
              </div>
            </div>

            {/* Preview Section */}
            {invoiceData && (
              <div className="mt-8 p-6 border rounded-lg">
                <div className="flex justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">{invoiceData.businessName}</h3>
                    <p className="text-sm text-gray-600">{invoiceData.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Invoice #{invoiceData.invoiceNumber}</p>
                    <p className="text-sm text-gray-600">Date: {invoiceData.date}</p>
                  </div>
                </div>

                {/* Customer Information Display */}
                <div className="mb-6 p-4 bg-gray-50 rounded">
                  <h4 className="font-medium mb-2">Bill To:</h4>
                  <p>{customerInfo.name}</p>
                  {customerInfo.company && <p>{customerInfo.company}</p>}
                  <p>{customerInfo.address}</p>
                  <p>{customerInfo.email}</p>
                  <p>{customerInfo.phone}</p>
                </div>
                
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Description</th>
                      <th className="text-right py-2">Qty</th>
                      <th className="text-right py-2">Price</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.description}</td>
                        <td className="text-right">{item.quantity}</td>
                        <td className="text-right">${item.price.toFixed(2)}</td>
                        <td className="text-right">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-right py-2">Subtotal:</td>
                      <td className="text-right">${invoiceData.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-right py-2">Tax:</td>
                      <td className="text-right">${invoiceData.tax.toFixed(2)}</td>
                    </tr>
                    <tr className="font-bold">
                      <td colSpan="3" className="text-right py-2">Total:</td>
                      <td className="text-right">${invoiceData.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>

                {customerInfo.notes && (
                  <div className="mt-6 p-4 bg-gray-50 rounded">
                    <h4 className="font-medium mb-2">Notes:</h4>
                    <p className="text-sm">{customerInfo.notes}</p>
                  </div>
                )}
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {invoiceData && (
            <PDFDownloadLink
              document={<InvoicePDF invoiceData={invoiceData} customerInfo={customerInfo} />}
              fileName={`invoice-${invoiceData.invoiceNumber}.pdf`}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {({ blob, url, loading, error }) => 
                loading ? 
                'Generating PDF...' : 
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Invoice</span>
                </>
              }
            </PDFDownloadLink>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default InvoiceGenerator;
