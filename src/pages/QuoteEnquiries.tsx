import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  Loader2,
  Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuoteEnquiries, useQuoteEnquiryActions } from "@/services/quoteEnquiries";
import { cn } from "@/lib/utils";

export default function QuoteEnquiries() {
  const navigate = useNavigate();
  const { enquiries, loading, error, refetch } = useQuoteEnquiries();
  const { acceptEnquiry, rejectEnquiry, loading: actionLoading } = useQuoteEnquiryActions();
  const [selectedEnquiry, setSelectedEnquiry] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  // Filter states
  const [showPending, setShowPending] = useState(true);
  const [showAccepted, setShowAccepted] = useState(true);
  const [showRejected, setShowRejected] = useState(true);

  // Calculate counts for each status
  const pendingCount = enquiries.filter(e => e.status === 'pending').length;
  const acceptedCount = enquiries.filter(e => e.status === 'accepted').length;
  const rejectedCount = enquiries.filter(e => e.status === 'rejected').length;

  // Filter enquiries based on selected statuses
  const filteredEnquiries = enquiries.filter(enquiry => {
    if (enquiry.status === 'pending' && !showPending) return false;
    if (enquiry.status === 'accepted' && !showAccepted) return false;
    if (enquiry.status === 'rejected' && !showRejected) return false;
    return true;
  });

  // Sort filtered enquiries: pending first, then accepted/rejected
  // But keep currently selected enquiry visible even if processed
  const sortedEnquiries = [...filteredEnquiries].sort((a, b) => {
    // If one is selected and the other isn't, selected one comes first
    if (selectedEnquiry && a.id === selectedEnquiry && b.id !== selectedEnquiry) return -1;
    if (selectedEnquiry && b.id === selectedEnquiry && a.id !== selectedEnquiry) return 1;
    
    // Otherwise, sort by status: pending first, then accepted/rejected
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return 0;
  });

  const handleAccept = async (enquiryId: string) => {
    setIsProcessing(enquiryId);
    
    try {
      const success = await acceptEnquiry(enquiryId);
      if (success) {
        // Refresh the data
        await refetch();
        console.log(`Enquiry ${enquiryId} accepted successfully`);
      } else {
        console.error(`Failed to accept enquiry ${enquiryId}`);
      }
    } catch (error) {
      console.error(`Failed to accept enquiry ${enquiryId}:`, error);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (enquiryId: string) => {
    setIsProcessing(enquiryId);
    
    try {
      const success = await rejectEnquiry(enquiryId);
      if (success) {
        // Refresh the data
        await refetch();
        console.log(`Enquiry ${enquiryId} rejected successfully`);
      } else {
        console.error(`Failed to reject enquiry ${enquiryId}`);
      }
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
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'accepted':
        return <CheckCircle className="h-3 w-3" />;
      case 'rejected':
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading quote enquiries...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">Error loading quote enquiries: {error}</p>
            <Button onClick={refetch} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

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
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-3">
                <MessageSquare className="h-8 w-8" />
                <span>Quote Enquiries</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {pendingCount} Pending
                </Badge>
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage and respond to customer quote requests
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Enquiries List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Recent Enquiries</span>
                  </div>
                  <Filter className="h-4 w-4 text-gray-400" />
                </CardTitle>
                
                {/* Filter Checkboxes */}
                <div className="space-y-2 mt-4">
                  {/* Quick Actions */}
                  <div className="flex space-x-2 mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowPending(true);
                        setShowAccepted(true);
                        setShowRejected(true);
                      }}
                      className="text-xs h-7"
                    >
                      All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowPending(false);
                        setShowAccepted(false);
                        setShowRejected(false);
                      }}
                      className="text-xs h-7"
                    >
                      None
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-pending"
                      checked={showPending}
                      onCheckedChange={(checked) => setShowPending(checked as boolean)}
                    />
                    <label 
                      htmlFor="show-pending" 
                      className="text-sm font-medium cursor-pointer flex items-center space-x-2"
                    >
                      <Clock className="h-3 w-3 text-yellow-600" />
                      <span>Pending ({pendingCount})</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-accepted"
                      checked={showAccepted}
                      onCheckedChange={(checked) => setShowAccepted(checked as boolean)}
                    />
                    <label 
                      htmlFor="show-accepted" 
                      className="text-sm font-medium cursor-pointer flex items-center space-x-2"
                    >
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Accepted ({acceptedCount})</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-rejected"
                      checked={showRejected}
                      onCheckedChange={(checked) => setShowRejected(checked as boolean)}
                    />
                    <label 
                      htmlFor="show-rejected" 
                      className="text-sm font-medium cursor-pointer flex items-center space-x-2"
                    >
                      <XCircle className="h-3 w-3 text-red-600" />
                      <span>Rejected ({rejectedCount})</span>
                    </label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                  {sortedEnquiries.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No enquiries match the selected filters</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowPending(true);
                          setShowAccepted(true);
                          setShowRejected(true);
                        }}
                        className="mt-2"
                      >
                        Show All
                      </Button>
                    </div>
                  ) : (
                    sortedEnquiries.map((enquiry) => (
                    <div
                      key={enquiry.id}
                      className={cn(
                        "p-4 border rounded-lg mb-3 cursor-pointer transition-all duration-200 hover:shadow-md",
                        selectedEnquiry === enquiry.id 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => setSelectedEnquiry(enquiry.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{enquiry.customer_name}</h3>
                          <Badge 
                            variant="secondary" 
                            className={cn("text-xs mt-1", getStatusColor(enquiry.status))}
                          >
                            {getStatusIcon(enquiry.status)}
                            <span className="ml-1 capitalize">{enquiry.status}</span>
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {enquiry.request_details}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{formatCurrency(enquiry.quote_amount)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(enquiry.shoot_start_date)}</span>
                        </span>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-400 flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDateTime(enquiry.enquiry_datetime_stamp)}</span>
                        </span>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enquiry Details */}
          <div className="lg:col-span-2">
            {selectedEnquiry ? (
              (() => {
                const enquiry = enquiries.find(e => e.id === selectedEnquiry);
                if (!enquiry) return null;
                
                return (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-3">
                          <User className="h-6 w-6" />
                          <span>{enquiry.customer_name}</span>
                          <Badge 
                            variant="secondary" 
                            className={cn("text-sm", getStatusColor(enquiry.status))}
                          >
                            {getStatusIcon(enquiry.status)}
                            <span className="ml-1 capitalize">{enquiry.status}</span>
                          </Badge>
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-gray-600">{enquiry.customer_email || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Phone</p>
                            <p className="text-sm text-gray-600">{enquiry.customer_phone || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Enquiry Details */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Request Details</h3>
                        <p className="text-gray-700 leading-relaxed">{enquiry.request_details}</p>
                      </div>

                      {/* Project Information */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Shoot Start Date</h4>
                          <p className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{formatDate(enquiry.shoot_start_date)}</span>
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Shoot End Date</h4>
                          <p className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{formatDate(enquiry.shoot_end_date)}</span>
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Quote Amount</h4>
                          <p className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold">{formatCurrency(enquiry.quote_amount)}</span>
                          </p>
                        </div>
                      </div>

                      {/* Enquiry Timestamp */}
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500 flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Enquiry received: {formatDateTime(enquiry.enquiry_datetime_stamp)}</span>
                        </p>
                      </div>

                      {/* Action Buttons */}
                      {enquiry.status === 'pending' && (
                        <div className="flex space-x-4 pt-6 border-t border-gray-200">
                          <Button
                            onClick={() => handleAccept(enquiry.id)}
                            disabled={isProcessing === enquiry.id || actionLoading}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            {isProcessing === enquiry.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            Accept Enquiry
                          </Button>
                          <Button
                            onClick={() => handleReject(enquiry.id)}
                            disabled={isProcessing === enquiry.id || actionLoading}
                            variant="destructive"
                            className="flex-1"
                          >
                            {isProcessing === enquiry.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-2" />
                            )}
                            Reject Enquiry
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })()
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Select an Enquiry</h3>
                    <p className="text-gray-500">Choose an enquiry from the list to view details and take action</p>
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