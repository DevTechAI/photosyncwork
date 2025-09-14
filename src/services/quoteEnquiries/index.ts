// =====================================================
// Quote Enquiries Service Exports
// =====================================================

// Query functions
export * from './queries';

// React hooks
export * from './hooks';

// Re-export types for convenience
export type { QuoteEnquiry, QuoteEnquiryMetrics } from './queries';
export type { 
  UseQuoteEnquiriesReturn, 
  UsePendingQuoteEnquiriesReturn,
  UseQuoteEnquiryReturn,
  UseQuoteEnquiryActionsReturn,
  UseQuoteEnquiryMetricsReturn,
  UsePendingQuoteEnquiriesCountReturn
} from './hooks';
