# Freelancer Profile Auto-Creation System

## Overview
The freelancer profile auto-creation system ensures that users with photographer-related roles automatically get freelancer profiles, enabling them to immediately use the enlist/delist feature on the hire page. This system also provides manual profile creation for users who want to customize their profiles.

## Database Functions

### `ensure_freelancer_profile()`
**Purpose**: Automatically creates a freelancer profile for users with photographer roles if one doesn't exist.

**Logic**:
1. Checks if user has photographer-related role (`photographer`, `videographer`, `editor`)
2. Returns empty result if user doesn't have appropriate role
3. Checks if freelancer profile already exists
4. Creates new profile with default values if none exists
5. Returns the profile (existing or newly created)

**Default Values**:
- **Name**: User's full name or "Photographer"
- **Role**: User's role from user_roles table
- **Location**: User's location from profiles or "Location not specified"
- **Rating**: 0.0
- **Review Count**: 0
- **Hourly Rate**: "$50-100/hour"
- **Avatar**: "/photosyncwork-logo.svg"
- **Specialties**: Role-specific defaults
  - Photographer: `['Photography', 'Portrait', 'Event']`
  - Videographer: `['Videography', 'Cinematography', 'Editing']`
  - Editor: `['Photo Editing', 'Video Editing', 'Retouching']`
- **Bio**: "Professional [role] with expertise in creative services."
- **Enlist Status**: "enlisted" (visible by default)
- **Experience Years**: 0

### `get_or_create_freelancer_profile()`
**Purpose**: Gets existing freelancer profile or creates one automatically.

**Logic**:
1. Attempts to get existing freelancer profile
2. If no profile found, calls `ensure_freelancer_profile()`
3. Returns the profile

### `get_current_user_freelancer_profile()` (Updated)
**Purpose**: Updated to use the new auto-creation logic.

**Changes**:
- Now calls `get_or_create_freelancer_profile()`
- Automatically creates profiles for photographer roles
- Maintains backward compatibility

## UI Components

### FreelancerProfileForm
**Location**: `src/components/hire/FreelancerProfileForm.tsx`

**Features**:
- **Comprehensive Form**: All freelancer profile fields
- **Role Selection**: Photographer, Videographer, Editor, etc.
- **Specialty Management**: Add/remove specialties with common options
- **Contact Information**: Email, phone, social links
- **Experience Tracking**: Years of experience
- **Bio Section**: Rich text description
- **Validation**: Required fields marked with asterisks
- **Auto-population**: Pre-fills with user data when available

**Form Fields**:
- Full Name (required)
- Role (required) - dropdown with options
- Location (required)
- Hourly Rate (required) - predefined ranges
- Email (required)
- Phone (optional)
- Website, LinkedIn, Instagram (optional)
- Years of Experience (number)
- Specialties (required) - dynamic list
- Bio (optional) - textarea

### Hire Page Integration
**Location**: `src/pages/Hire.tsx`

**Smart Button Logic**:
- **Authenticated Users**: Shows profile management button
- **With Profile**: Shows "Enlist/Delist My Profile" button
- **Without Profile**: Shows "Create Profile" button
- **Unauthenticated**: No profile button shown

**Modal Integration**:
- Profile creation opens in modal overlay
- Success callback refreshes page data
- Cancel option to close modal

## User Experience Flow

### For Photographer Role Users
1. **Automatic Creation**: Profile created automatically when accessing hire page
2. **Immediate Access**: Can immediately use enlist/delist feature
3. **Customization**: Can edit profile through dashboard or profile management

### For Other Users
1. **Manual Creation**: Must click "Create Profile" button
2. **Form Completion**: Fill out comprehensive profile form
3. **Immediate Access**: After creation, can use enlist/delist feature

### For All Users
1. **Profile Management**: Edit profile details anytime
2. **Visibility Control**: Toggle enlist/delist status
3. **Portfolio Integration**: Link to portfolio for enhanced visibility

## Technical Implementation

### Database Security
- **RLS Policies**: Users can only create/modify their own profiles
- **SECURITY DEFINER**: Functions run with elevated privileges for auto-creation
- **User Validation**: Functions check `auth.uid()` for security

### API Integration
- **React Query**: Caches profile data and handles mutations
- **Error Handling**: Comprehensive error handling with toast notifications
- **Loading States**: UI feedback during API operations

### Performance Considerations
- **Efficient Queries**: Single query to get or create profile
- **Caching**: React Query caches profile data
- **Lazy Loading**: Profile form only loads when needed

## Migration Instructions

### Apply Database Migration
1. Run migration: `supabase/migrations/20250104000003_auto_freelancer_profile.sql`
2. This creates the auto-creation functions
3. Updates existing `get_current_user_freelancer_profile()` function

### Frontend Updates
1. **New Component**: `FreelancerProfileForm.tsx` added
2. **Updated Hire Page**: Enhanced with profile creation modal
3. **Import Updates**: Added new imports for profile creation

## Role-Based Auto-Creation

### Eligible Roles
- **photographer**: Creates photography-focused profile
- **videographer**: Creates videography-focused profile  
- **editor**: Creates editing-focused profile

### Non-Eligible Roles
- **manager**: No auto-creation (business management role)
- **accounts**: No auto-creation (financial role)
- **crm**: No auto-creation (customer relationship role)

### Customization Options
- Users can edit auto-created profiles
- All fields are customizable
- Specialties can be modified
- Bio can be personalized

## Benefits

### For Users
- **Immediate Access**: No setup required for photographer roles
- **Flexibility**: Can create custom profiles manually
- **Control**: Full control over profile visibility
- **Professional**: Comprehensive profile management

### For Platform
- **Higher Engagement**: More users can participate in hiring
- **Better Data**: Consistent profile structure
- **Reduced Friction**: Automatic setup for target users
- **Scalability**: Handles both automatic and manual creation

## Future Enhancements

### Potential Features
1. **Profile Templates**: Pre-defined templates for different specialties
2. **Bulk Import**: Import profiles from external platforms
3. **Profile Verification**: Verification badges for verified professionals
4. **Skill Assessments**: Built-in skill testing and certification
5. **Portfolio Integration**: Automatic portfolio linking
6. **Recommendation Engine**: Suggest profiles based on user behavior

### Performance Optimizations
1. **Background Creation**: Create profiles during user registration
2. **Batch Operations**: Handle multiple profile creations efficiently
3. **Caching Strategy**: Advanced caching for profile data
4. **Search Optimization**: Optimize profile search and filtering

## Testing Scenarios

### Auto-Creation Testing
1. **Photographer Role**: Verify auto-creation works
2. **Non-Photographer Role**: Verify no auto-creation
3. **Existing Profile**: Verify existing profile is returned
4. **Missing User Data**: Verify graceful handling of missing data

### Manual Creation Testing
1. **Form Validation**: Test all required fields
2. **Specialty Management**: Test add/remove specialties
3. **Success Flow**: Test successful profile creation
4. **Error Handling**: Test error scenarios

### Integration Testing
1. **Hire Page**: Test button visibility logic
2. **Modal Functionality**: Test modal open/close
3. **Data Refresh**: Test data updates after creation
4. **Enlist/Delist**: Test visibility toggle functionality
