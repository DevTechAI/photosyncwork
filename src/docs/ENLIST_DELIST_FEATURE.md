# Enlist/Delist Profile Feature

## Overview
The enlist/delist profile feature allows photographers to control whether their profile appears in the "Browse Talent" list on the hire page. This gives photographers the ability to temporarily hide themselves from potential clients while maintaining their profile.

## Database Changes

### New Column: `enlist_status`
- **Table**: `public.freelancers`
- **Type**: `TEXT`
- **Default**: `'enlisted'`
- **Values**: `'enlisted'` | `'delisted'`
- **Constraint**: `CHECK (enlist_status IN ('enlisted', 'delisted'))`

### Database Functions

#### `toggle_freelancer_enlist_status(f_id UUID)`
- **Purpose**: Toggles a freelancer's enlist status between 'enlisted' and 'delisted'
- **Security**: `SECURITY DEFINER` - ensures user can only modify their own profile
- **Returns**: New status ('enlisted' or 'delisted')
- **Error Handling**: Returns error message if freelancer not found or not owned by user

#### `get_current_user_freelancer_profile()`
- **Purpose**: Retrieves the current authenticated user's freelancer profile with enlist status
- **Security**: `SECURITY DEFINER` - ensures user can only access their own profile
- **Returns**: Complete freelancer profile including enlist_status

### Row Level Security (RLS) Updates

#### Public Visibility Policy
- **Old**: `"Public can view active freelancers"` - showed all available freelancers
- **New**: `"Public can view enlisted freelancers"` - only shows freelancers with `enlist_status = 'enlisted'`

#### User Access Policy
- **New**: `"Users can view their own freelancer profile"` - allows users to see their profile regardless of enlist status

## API Functions

### `getCurrentUserFreelancerProfile()`
```typescript
export const getCurrentUserFreelancerProfile = async (): Promise<Freelancer | null>
```
- Fetches current user's freelancer profile
- Returns `null` if no profile exists
- Includes enlist_status field

### `toggleFreelancerEnlistStatus(freelancerId: string)`
```typescript
export const toggleFreelancerEnlistStatus = async (freelancerId: string): Promise<string>
```
- Toggles enlist status for specified freelancer
- Returns new status ('enlisted' or 'delisted')
- Throws error if operation fails

## UI Components

### Hire Page Header
- **Location**: `src/pages/Hire.tsx`
- **Button**: Dynamic button that shows "Enlist My Profile" or "Delist My Profile"
- **Styling**: 
  - Enlisted: Red background with "Delist My Profile" text
  - Delisted: Outline style with "Enlist My Profile" text
- **Icons**: UserCheck (enlist) / UserX (delist)

### Button States
- **Enlisted**: Red button with UserX icon - "Delist My Profile"
- **Delisted**: Outline button with UserCheck icon - "Enlist My Profile"
- **Loading**: Disabled state during API calls
- **Hidden**: Only shows if user has a freelancer profile

## User Experience

### For Photographers
1. **Profile Creation**: When a photographer creates a freelancer profile, they are automatically enlisted
2. **Visibility Control**: They can toggle their visibility on the hire page
3. **Status Feedback**: Clear visual indicators and toast notifications
4. **Profile Management**: Can still manage their profile while delisted

### For Clients
1. **Browse Talent**: Only see photographers who have enlisted themselves
2. **No Impact**: Delisted photographers are simply not visible in the browse list
3. **Consistent Experience**: No changes to existing functionality

## Technical Implementation

### React Query Integration
- **Query**: `['current-user-freelancer']` - fetches user's freelancer profile
- **Mutation**: `toggleFreelancerEnlistStatus` - handles status toggle
- **Cache Invalidation**: Updates both current user profile and freelancer list

### Error Handling
- **API Errors**: Toast notifications for failed operations
- **Network Issues**: Graceful degradation with loading states
- **Permission Errors**: Clear error messages for unauthorized access

### Performance Considerations
- **Index**: `idx_freelancers_enlist_status` for efficient filtering
- **Caching**: React Query caches user profile and freelancer list
- **Optimistic Updates**: Immediate UI feedback with rollback on error

## Migration Instructions

### Apply Database Migration
1. Run the migration file: `supabase/migrations/20250104000002_add_enlist_status.sql`
2. This will:
   - Add `enlist_status` column to freelancers table
   - Set default value to 'enlisted' for existing records
   - Create database functions for toggle operations
   - Update RLS policies for proper access control
   - Add performance index

### Frontend Updates
1. **Types**: Updated `Freelancer` and `FreelancerFormData` interfaces
2. **API**: Added new functions to `freelancerApi.ts`
3. **Hooks**: Enhanced `useHireData` hook with enlist functionality
4. **UI**: Added enlist/delist button to hire page header

## Security Considerations

### Access Control
- Users can only modify their own freelancer profiles
- Database functions use `SECURITY DEFINER` with `auth.uid()` checks
- RLS policies prevent unauthorized access

### Data Integrity
- Check constraint ensures only valid enlist_status values
- Foreign key relationships maintained
- Audit trail with updated_at timestamps

## Future Enhancements

### Potential Features
1. **Bulk Operations**: Enlist/delist multiple profiles
2. **Scheduling**: Auto-enlist/delist based on availability
3. **Analytics**: Track enlist/delist patterns
4. **Notifications**: Alert clients when preferred photographers enlist
5. **Categories**: Different enlist statuses for different service types

### Performance Optimizations
1. **Caching**: Redis cache for frequently accessed profiles
2. **Pagination**: Limit freelancer list size for better performance
3. **Search**: Optimize search queries with enlist status filtering
4. **Real-time**: WebSocket updates for enlist status changes
