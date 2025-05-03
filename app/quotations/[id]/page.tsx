"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  FileDown, 
  FilePlus, 
  Loader2,
  FileText,
  Calendar,
  DollarSign,
  Clock,
  Percent
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {  Quotation } from '@/lib/mock-data';
import MainLayout from "@/components/layouts/main-layout";


export default function QuotationDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    // In a real app, this would be fetched from an API

    
    setLoading(false);
  }, [params.id, router, toast]);
  
  const handleDownloadPDF = () => {

  };
  
  const handleUploadDocument = () => {
    setUploading(true);
    // Simulate document upload
    setTimeout(() => {
      if (quotation) {
        const updatedQuotation = {
          ...quotation,
          documents: [
            ...quotation.documents,
            {
              id: "new-doc-id",
              name: "New Document.pdf",
              url: "#",
              uploadedAt: new Date().toISOString()
            }
          ]
        };
        setQuotation(updatedQuotation);
        toast({
          title: "Document uploaded",
          description: "Your document has been successfully uploaded.",
        });
      }
      setUploading(false);
    }, 2000);
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!quotation) {
    return (
        <MainLayout>

        <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-lg text-muted-foreground">Quotation not found</p>
        <Link href="/quotations">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quotations
          </Button>
        </Link>
      </div>
        </MainLayout>
    );
  }
  
  const returnValue = quotation.price * (quotation.returnRate / 100);
  const monthlyPayment = quotation.amount / parseInt(quotation.duration);
  
  return (
      <MainLayout>
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/quotations">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Quotation Details</h1>
            <Badge className={`${getStatusBadgeColor(quotation.status)} capitalize`}>
              {quotation.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Created on {new Date(quotation.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadPDF}>
            <FileDown className="mr-2 h-4 w-4" /> Download PDF
          </Button>
          {(quotation.status === 'approved' || quotation.status === 'completed') && (
            <Button 
              variant="default" 
              onClick={handleUploadDocument}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <FilePlus className="mr-2 h-4 w-4" /> Upload Document
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quotation Information</CardTitle>
            <CardDescription>
              Details about your hardware leasing request.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Hardware Information
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center p-3 bg-secondary rounded-md">
                          <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Hardware Type</div>
                            <div className="font-medium">{quotation.hardwareType}</div>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-secondary rounded-md">
                          <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Hardware Price</div>
                            <div className="font-medium">${quotation.price.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Lease Terms
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center p-3 bg-secondary rounded-md">
                          <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Duration</div>
                            <div className="font-medium">{quotation.duration} months</div>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-secondary rounded-md">
                          <Percent className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Return Rate</div>
                            <div className="font-medium">{quotation.returnRate}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Payment Details
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="p-3 bg-secondary rounded-md">
                          <div className="text-sm text-muted-foreground">Monthly Payment</div>
                          <div className="font-medium">${monthlyPayment.toFixed(2)}</div>
                        </div>
                        <div className="p-3 bg-secondary rounded-md">
                          <div className="text-sm text-muted-foreground">Return Value</div>
                          <div className="font-medium">${returnValue.toFixed(2)}</div>
                        </div>
                        <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-md">
                          <div className="text-sm font-medium">Total Lease Amount</div>
                          <div className="text-lg font-bold">${quotation.amount.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Status Information
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center p-3 bg-secondary rounded-md">
                          <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Current Status</div>
                            <div className="font-medium capitalize">{quotation.status}</div>
                          </div>
                        </div>
                        <div className="p-3 bg-secondary rounded-md">
                          <div className="text-sm text-muted-foreground">Estimated Completion</div>
                          <div className="font-medium">
                            {quotation.status === 'waiting' 
                              ? '2-3 business days' 
                              : quotation.status === 'approved'
                              ? '1-2 business days'
                              : 'Completed'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-4">
                {quotation.documents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center bg-secondary rounded-md">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Documents</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md">
                      {quotation.status === 'waiting' 
                        ? 'You can upload documents once your quotation is approved.' 
                        : 'Upload the required documents to proceed with your leasing process.'}
                    </p>
                    {(quotation.status === 'approved' || quotation.status === 'completed') && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={handleUploadDocument}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                          </>
                        ) : (
                          <>
                            <FilePlus className="mr-2 h-4 w-4" /> Upload Document
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Uploaded Documents</h3>
                      {(quotation.status === 'approved' || quotation.status === 'completed') && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleUploadDocument}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                            </>
                          ) : (
                            <>
                              <FilePlus className="mr-2 h-4 w-4" /> Upload Document
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {quotation.documents.map((doc) => (
                        <div 
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-secondary rounded-md"
                        >
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{doc.name}</div>
                              <div className="text-xs text-muted-foreground">
                                Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <FileDown className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Quotation History</h3>
                  
                  <div className="space-y-3">
                    {/* Simulated history events */}
                    <div className="flex items-start space-x-3 p-3 bg-secondary rounded-md">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                      <div>
                        <div className="font-medium">Quotation Created</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(quotation.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    {quotation.status !== 'waiting' && (
                      <div className="flex items-start space-x-3 p-3 bg-secondary rounded-md">
                        <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                        <div>
                          <div className="font-medium">Quotation Approved</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(new Date(quotation.createdAt).getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {quotation.documents.length > 0 && (
                      <div className="flex items-start space-x-3 p-3 bg-secondary rounded-md">
                        <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-yellow-500"></div>
                        <div>
                          <div className="font-medium">Document Uploaded</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(quotation.documents[0].uploadedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {quotation.status === 'completed' && (
                      <div className="flex items-start space-x-3 p-3 bg-secondary rounded-md">
                        <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                        <div>
                          <div className="font-medium">Leasing Process Completed</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(new Date(quotation.createdAt).getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Follow these steps to complete your leasing process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Next Steps</h3>
                
                <ol className="space-y-4 mt-2">
                  <li className="flex items-start">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      quotation.status !== 'waiting' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {quotation.status !== 'waiting' ? '✓' : '1'}
                    </div>
                    <div>
                      <p className={`font-medium ${quotation.status !== 'waiting' ? 'text-muted-foreground line-through' : ''}`}>
                        Quotation Review
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Our team will review your quotation request.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      quotation.status === 'approved' || quotation.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : quotation.status === 'waiting' 
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {quotation.status === 'approved' || quotation.status === 'completed' 
                        ? '✓' 
                        : '2'}
                    </div>
                    <div>
                      <p className={`font-medium ${
                        quotation.status === 'completed' ? 'text-muted-foreground line-through' : ''
                      }`}>
                        Document Submission
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Upload required documents for verification.
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex items-start">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      quotation.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {quotation.status === 'completed' ? '✓' : '3'}
                    </div>
                    <div>
                      <p className="font-medium">
                        Contract Finalization
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Sign the leasing contract and arrange delivery.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
              
              <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4">
                <h3 className="text-sm font-medium mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions about your quotation or the leasing process, please contact our support team.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
      </MainLayout>
  );
}
