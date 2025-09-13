import { createContext, useContext, useState, ReactNode } from 'react';

interface QuoteEnquiry {
  enquiryId: string;
  requestDetails: string;
  shootStartDate: string;
  shootEndDate: string;
  quoteAmount: number;
  customerPhone: string;
  customerEmail: string;
  customerName: string;
  enquiryDateTimeStamp: string;
  status: 'pending' | 'accepted' | 'rejected';
  receivedDate: string;
}

interface EnquiryContextType {
  enquiries: QuoteEnquiry[];
  setEnquiries: React.Dispatch<React.SetStateAction<QuoteEnquiry[]>>;
  pendingCount: number;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [enquiries, setEnquiries] = useState<QuoteEnquiry[]>([
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
  ]);

  const pendingCount = enquiries.filter(e => e.status === 'pending').length;

  return (
    <EnquiryContext.Provider value={{ enquiries, setEnquiries, pendingCount }}>
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiries() {
  const context = useContext(EnquiryContext);
  if (context === undefined) {
    throw new Error('useEnquiries must be used within an EnquiryProvider');
  }
  return context;
}
