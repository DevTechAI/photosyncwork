import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  Phone, 
  Mail, 
  User, 
  CheckCircle, 
  XCircle,
  Clock,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEnquiries } from "@/contexts/EnquiryContext";
import { cn } from "@/lib/utils";

// Refined field names based on your SQL table
interface QuoteEnquiry {
  enquiryId: string;           // EnquiryReqId
  requestDetails: string;      // Req_Details_Text
  shootStartDate: string;      // ShootStartDate
  shootEndDate: string;        // ShootEndDate
  quoteAmount: number;        // QuoteAmount
  customerPhone: string;       // customerContactNum
  customerEmail: string;       // customerEmail
  customerName: string;        // customerName
  enquiryDateTimeStamp: string; // EnquiryDateTimeStamp
  status: 'pending' | 'accepted' | 'rejected';
  receivedDate: string;
}

// Mock data for demonstration
const mockEnquiries: QuoteEnquiry[] = [
  {
    enquiryId: "EQ001",
    requestDetails: "Wedding photography for 200 guests at Taj Palace Hotel",
    shootStartDate: "2024-06-15",
    shootEndDate: "2024-06-15",
    quoteAmount: 45000,
    customerPhone: "+91 98765 43210",
    customerEmail: "priya.sharma@email.com",
    customerName: "Priya Sharma",
    enquiryDateTimeStamp: "2024-05-20T10:30:00Z",
    status: 'pending',
    receivedDate: "2024-05-20"
  },
  {
    enquiryId: "EQ002",
    requestDetails: "Corporate event photography for product launch",
    shootStartDate: "2024-06-22",
    shootEndDate: "2024-06-22",
    quoteAmount: 25000,
    customerPhone: "+91 87654 32109",
    customerEmail: "rajesh.kumar@company.com",
    customerName: "Rajesh Kumar",
    enquiryDateTimeStamp: "2024-05-21T14:15:00Z",
    status: 'pending',
    receivedDate: "2024-05-21"
  },
  {
    enquiryId: "EQ003",
    requestDetails: "Maternity photoshoot in outdoor location",
    shootStartDate: "2024-06-28",
    shootEndDate: "2024-06-28",
    quoteAmount: 15000,
    customerPhone: "+91 76543 21098",
    customerEmail: "anita.singh@email.com",
    customerName: "Anita Singh",
    enquiryDateTimeStamp: "2024-05-22T09:45:00Z",
    status: 'pending',
    receivedDate: "2024-05-22"
  },
  {
    enquiryId: "EQ004",
    requestDetails: "Birthday party photography for 50 guests",
    shootStartDate: "2024-07-05",
    shootEndDate: "2024-07-05",
    quoteAmount: 12000,
    customerPhone: "+91 65432 10987",
    customerEmail: "vikram.patel@email.com",
    customerName: "Vikram Patel",
    enquiryDateTimeStamp: "2024-05-23T16:20:00Z",
    status: 'pending',
    receivedDate: "2024-05-23"
  },
  {
    enquiryId: "EQ005",
    requestDetails: "Fashion portfolio shoot for modeling agency",
    shootStartDate: "2024-07-12",
    shootEndDate: "2024-07-12",
    quoteAmount: 35000,
    customerPhone: "+91 54321 09876",
    customerEmail: "meera.joshi@fashion.com",
    customerName: "Meera Joshi",
    enquiryDateTimeStamp: "2024-05-24T11:10:00Z",
    status: 'pending',
    receivedDate: "2024-05-24"
  },
  {
    enquiryId: "EQ006",
    requestDetails: "Real estate photography for luxury apartments",
    shootStartDate: "2024-07-18",
    shootEndDate: "2024-07-20",
    quoteAmount: 28000,
    customerPhone: "+91 43210 98765",
    customerEmail: "arjun.gupta@realestate.com",
    customerName: "Arjun Gupta",
    enquiryDateTimeStamp: "2024-05-25T13:35:00Z",
    status: 'pending',
    receivedDate: "2024-05-25"
  },
  {
    enquiryId: "EQ007",
    requestDetails: "Food photography for restaurant menu",
    shootStartDate: "2024-07-25",
    shootEndDate: "2024-07-25",
    quoteAmount: 18000,
    customerPhone: "+91 32109 87654",
    customerEmail: "chef.sanjay@restaurant.com",
    customerName: "Chef Sanjay",
    enquiryDateTimeStamp: "2024-05-26T08:50:00Z",
    status: 'pending',
    receivedDate: "2024-05-26"
  },
  {
    enquiryId: "EQ008",
    requestDetails: "Graduation ceremony photography for university",
    shootStartDate: "2024-08-02",
    shootEndDate: "2024-08-02",
    quoteAmount: 22000,
    customerPhone: "+91 21098 76543",
    customerEmail: "dean.university@edu.in",
    customerName: "Dr. Ravi Verma",
    enquiryDateTimeStamp: "2024-05-27T15:25:00Z",
    status: 'pending',
    receivedDate: "2024-05-27"
  }
];

export default function QuoteEnquiries() {
  const navigate = useNavigate();
  const { enquiries, setEnquiries, pendingCount } = useEnquiries();
  const [selectedEnquiry, setSelectedEnquiry] = useState<QuoteEnquiry | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Sort enquiries: pending first, then accepted/rejected
  // But keep currently selected enquiry visible even if processed
  const sortedEnquiries = [...enquiries].sort((a, b) => {
    // If one is selected and the other isn't, selected one comes first
    if (selectedEnquiry && a.enquiryId === selectedEnquiry.enquiryId && b.enquiryId !== selectedEnquiry.enquiryId) return -1;
    if (selectedEnquiry && b.enquiryId === selectedEnquiry.enquiryId && a.enquiryId !== selectedEnquiry.enquiryId) return 1;
    
    // Otherwise, sort by status: pending first, then accepted/rejected
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return 0;
  });

  const handleAccept = async (enquiryId: string) => {
    setIsProcessing(enquiryId);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update enquiry status in memory
      setEnquiries(prevEnquiries => 
        prevEnquiries.map(enquiry => 
          enquiry.enquiryId === enquiryId 
            ? { ...enquiry, status: 'accepted' as const }
            : enquiry
        )
      );
      
      // Update selected enquiry if it's the one being processed
      if (selectedEnquiry?.enquiryId === enquiryId) {
        setSelectedEnquiry(prev => prev ? { ...prev, status: 'accepted' } : null);
      }
      
      console.log(`Enquiry ${enquiryId} accepted successfully`);
    } catch (error) {
      console.error(`Failed to accept enquiry ${enquiryId}:`, error);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (enquiryId: string) => {
    setIsProcessing(enquiryId);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update enquiry status in memory
      setEnquiries(prevEnquiries => 
        prevEnquiries.map(enquiry => 
          enquiry.enquiryId === enquiryId 
            ? { ...enquiry, status: 'rejected' as const }
            : enquiry
        )
      );
      
      // Update selected enquiry if it's the one being processed
      if (selectedEnquiry?.enquiryId === enquiryId) {
        setSelectedEnquiry(prev => prev ? { ...prev, status: 'rejected' } : null);
      }
      
      console.log(`Enquiry ${enquiryId} rejected successfully`);
    } catch (error) {
      console.error(`Failed to reject enquiry ${enquiryId}:`, error);
    } finally {
      setIsProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/dashboard")}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <MessageSquare className="h-8 w-8 mr-3 text-primary" />
                Quote Enquiries
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage and respond to photography quote requests
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            {pendingCount} Pending
          </Badge>
        </div>

        {/* Chat-like Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enquiries List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Enquiries
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                  {sortedEnquiries.map((enquiry) => (
                    <div
                      key={enquiry.enquiryId}
                      className={`p-4 border-b cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedEnquiry?.enquiryId === enquiry.enquiryId ? 'bg-primary/5 border-primary' : ''
                      }`}
                      onClick={() => setSelectedEnquiry(enquiry)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-sm truncate">
                              {enquiry.customerName}
                            </h4>
                            <Badge 
                              variant={enquiry.status === 'pending' ? 'default' : 
                                     enquiry.status === 'accepted' ? 'default' : 'destructive'}
                              className={cn(
                                "text-xs",
                                enquiry.status === 'accepted' && "bg-green-100 text-green-800 border-green-200",
                                enquiry.status === 'rejected' && "bg-red-100 text-red-800 border-red-200"
                              )}
                            >
                              {enquiry.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {enquiry.requestDetails}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs font-medium text-primary">
                              {formatCurrency(enquiry.quoteAmount)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(enquiry.shootStartDate)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 mt-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(enquiry.enquiryDateTimeStamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enquiry Details */}
          <div className="lg:col-span-2">
            {selectedEnquiry ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      {selectedEnquiry.customerName}
                    </CardTitle>
                    <Badge 
                      variant={selectedEnquiry.status === 'pending' ? 'default' : 
                             selectedEnquiry.status === 'accepted' ? 'default' : 'destructive'}
                      className={cn(
                        selectedEnquiry.status === 'accepted' && "bg-green-100 text-green-800 border-green-200",
                        selectedEnquiry.status === 'rejected' && "bg-red-100 text-red-800 border-red-200"
                      )}
                    >
                      {selectedEnquiry.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Customer Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{selectedEnquiry.customerEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{selectedEnquiry.customerPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Enquiry Received</p>
                        <p className="text-sm text-muted-foreground">{formatDateTime(selectedEnquiry.enquiryDateTimeStamp)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Project Details</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                        {selectedEnquiry.requestDetails}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Start Date</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(selectedEnquiry.shootStartDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">End Date</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(selectedEnquiry.shootEndDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Quote Amount</p>
                          <p className="text-sm font-medium text-primary">
                            {formatCurrency(selectedEnquiry.quoteAmount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedEnquiry.status === 'pending' && (
                    <div className="flex space-x-3 pt-4 border-t">
                      <Button 
                        onClick={() => handleAccept(selectedEnquiry.enquiryId)}
                        disabled={isProcessing === selectedEnquiry.enquiryId}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                      >
                        {isProcessing === selectedEnquiry.enquiryId ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        {isProcessing === selectedEnquiry.enquiryId ? 'Accepting...' : 'Accept Enquiry'}
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleReject(selectedEnquiry.enquiryId)}
                        disabled={isProcessing === selectedEnquiry.enquiryId}
                        className="flex-1 disabled:opacity-50"
                      >
                        {isProcessing === selectedEnquiry.enquiryId ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        {isProcessing === selectedEnquiry.enquiryId ? 'Rejecting...' : 'Reject Enquiry'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select an Enquiry</h3>
                    <p className="text-muted-foreground">
                      Choose an enquiry from the list to view details and take action
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
