# 📊 Services Layer Documentation

## 🏗️ **Architecture Overview**

The services layer provides a modular, maintainable structure for database operations and data management across the PhotoWorkSync application.

## 📁 **Directory Structure**

```
src/services/
├── dashboard/
│   ├── queries.ts      # Dashboard-specific SQL queries
│   ├── hooks.ts        # React hooks for dashboard data
│   └── index.ts        # Dashboard service exports
├── finance/
│   └── queries.ts      # Finance-related queries
├── events/
│   └── queries.ts      # Event scheduling queries
├── invoices/
│   └── queries.ts      # Invoice management queries
└── index.ts            # Main services export
```

## 🔧 **Key Features**

### **1. Type Safety**
- Full TypeScript support with proper interfaces
- Database schema types imported from Supabase
- Consistent error handling patterns

### **2. Modular Design**
- Separate services for different business domains
- Reusable query functions
- Centralized configuration

### **3. React Integration**
- Custom hooks for data fetching
- Loading states and error handling
- Automatic refetch capabilities

### **4. Error Handling**
- Consistent error logging
- Graceful fallbacks
- User-friendly error messages

## 📊 **Dashboard Service**

### **Usage Example:**
```typescript
import { useDashboard } from '@/services/dashboard';

function Dashboard() {
  const { metrics, loading, error, refetch } = useDashboard();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <h2>Monthly Revenue: ₹{metrics?.monthlyRevenue?.toLocaleString()}</h2>
      <h2>Upcoming Events: {metrics?.upcomingEvents}</h2>
      <h2>Pending Invoices: {metrics?.pendingInvoices}</h2>
      <h2>Active Projects: {metrics?.activeProjects}</h2>
    </div>
  );
}
```

### **Available Functions:**
- `getMonthlyRevenue()` - Calculate current month income
- `getUpcomingEventsCount()` - Count upcoming events
- `getPendingInvoicesCount()` - Count pending invoices
- `getActiveProjectsCount()` - Count active projects
- `getDashboardMetrics()` - Get all metrics in one call

## 🔄 **Data Flow**

1. **Component** calls `useDashboard()` hook
2. **Hook** calls `getDashboardMetrics()` function
3. **Function** executes parallel Supabase queries
4. **Data** is returned with loading states
5. **Component** renders with real-time data

## 🚀 **Adding New Services**

### **1. Create Query File:**
```typescript
// src/services/[domain]/queries.ts
import { supabase } from '../../integrations/supabase/client';

export interface [Domain]Data {
  // Define your data types
}

export async function get[Domain]Data(): Promise<[Domain]Data[]> {
  try {
    const { data, error } = await supabase
      .from('[table_name]')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching [domain] data:', error);
    return [];
  }
}
```

### **2. Create Hook File:**
```typescript
// src/services/[domain]/hooks.ts
import { useState, useEffect } from 'react';
import { get[Domain]Data } from './queries';

export function use[Domain]() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await get[Domain]Data();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
}
```

### **3. Export from Index:**
```typescript
// src/services/[domain]/index.ts
export * from './queries';
export * from './hooks';
```

## 🔧 **Configuration**

Service configuration is centralized in `src/services/index.ts`:

```typescript
export const SERVICE_CONFIG = {
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  DEFAULT_ERROR_MESSAGE: 'An error occurred while fetching data'
} as const;
```

## 📈 **Performance Benefits**

- **Parallel Queries**: Dashboard metrics fetched simultaneously
- **Caching**: Built-in caching mechanisms (configurable)
- **Error Recovery**: Automatic retry with exponential backoff
- **Loading States**: Smooth user experience with skeleton loaders

## 🔒 **Security**

- **Row Level Security**: All queries respect Supabase RLS policies
- **Type Safety**: Prevents SQL injection through typed queries
- **Error Sanitization**: Sensitive data not exposed in error messages

## 🧪 **Testing**

Each service can be tested independently:

```typescript
// Example test
import { getMonthlyRevenue } from '@/services/dashboard/queries';

describe('Dashboard Queries', () => {
  it('should calculate monthly revenue correctly', async () => {
    const revenue = await getMonthlyRevenue();
    expect(revenue).toBeGreaterThanOrEqual(0);
  });
});
```

## 📝 **Best Practices**

1. **Always use TypeScript interfaces** for data structures
2. **Handle errors gracefully** with try-catch blocks
3. **Provide loading states** for better UX
4. **Use parallel queries** when possible for performance
5. **Cache frequently accessed data** to reduce API calls
6. **Log errors** for debugging and monitoring
7. **Keep queries focused** on single responsibilities
8. **Use consistent naming conventions** across services

---

This modular approach ensures maintainable, scalable, and testable code while providing excellent developer experience and user performance.
