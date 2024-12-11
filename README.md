# User Management Dashboard

A modern React-based user management dashboard with authentication, analytics, and user management features.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:   ```bash
   git clone <repository-url>   ```

2. Navigate to the project directory:   ```bash
   cd user-management-dashboard   ```

3. Install dependencies:   ```bash
   npm install
   # or
   yarn install   ```

4. Start the development server:   ```bash
   npm run dev
   # or
   yarn dev   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Features Implemented

### Authentication
- User registration with email and password
- User login with email and password
- Persistent authentication state
- Protected routes
- Logout functionality

### User Management
- View list of users with pagination
- Add new users
- Delete existing users
- Search users by name or email
- Filter users by role and status
- Responsive table layout
- Mobile-friendly interface

### Analytics Dashboard
- Overview cards showing key metrics:
  - Total Users
  - Active Users
  - Deleted Users
  - User Activity Rate
- User Registration Trend chart
- Active vs Inactive Users distribution
- Users by Region visualization
- Responsive charts and graphs
- Filter analytics by date range and region

### Profile Management
- View and edit user profile
- Update username
- Change password functionality
- Profile picture placeholder
- Success/error notifications

### UI/UX Features
- Responsive design for mobile and desktop
- Modern, clean interface
- Loading states and animations
- Error handling and validation
- Interactive navigation
- Collapsible sidebar for mobile
- Toast notifications for actions

## Technical Stack

### Frontend
- React 18
- TypeScript
- Redux Toolkit for state management
- React Router v6 for navigation
- Tailwind CSS for styling
- Recharts for data visualization
- Feather icons

### Development Tools
- Vite
- ESLint
- Prettier
- TypeScript

## Assumptions Made

### Authentication
- No backend implementation; using mock authentication
- Passwords are stored in plain text (in a real app, they would be hashed)
- Test user credentials: 
  - Email: test@example.com
  - Password: password
- User sessions persist only in memory (cleared on page refresh)

### User Management
- Limited to basic CRUD operations
- User roles are simplified to "Admin" and "User"
- User status is limited to "active" and "inactive"
- Maximum of 5 users per page in pagination

### Analytics
- Using mock data for charts and metrics
- Analytics data is not persistent
- Simplified date range filtering
- Basic region categorization

### Data Persistence
- All data is stored in Redux store
- No local storage implementation
- Data resets on page refresh

## Future Improvements
1. Backend Integration
   - Implement RESTful API
   - Add database persistence
   - Add proper authentication

2. Enhanced Security
   - Implement JWT authentication
   - Add password hashing
   - Add input sanitization
   - Implement rate limiting

3. Additional Features
   - User roles and permissions
   - Bulk user operations
   - Data export functionality
   - Advanced analytics
   - Real-time updates
   - Email notifications

4. Testing
   - Unit tests
   - Integration tests
   - E2E tests
   - Performance testing

