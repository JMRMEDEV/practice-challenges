# E-Learning Frontend - User Guide

## Features Implemented

### Authentication
- **Login Page** (`/login`)
  - Email and password authentication
  - Error handling with user feedback
  - Redirect to courses after successful login
  - Link to registration page

- **Register Page** (`/register`)
  - User registration with name, email, and password
  - Automatic login after registration
  - Password validation (minimum 6 characters)
  - Link to login page

- **Auth Context**
  - Global authentication state management
  - Automatic token refresh
  - Protected routes
  - Persistent sessions with refresh tokens

### Home Page (`/`)
- Hero section with call-to-action
- Feature highlights
- Dynamic navigation based on auth status
- Responsive design

### Courses Page (`/courses`)
- Course catalog with grid layout
- Filtering by:
  - Category (Programming, Design, Business, Marketing)
  - Level (Beginner, Intermediate, Advanced)
- Course cards showing:
  - Thumbnail image
  - Title and instructor
  - Description preview
  - Level badge
  - Duration
- Responsive grid layout

### Course Detail Page (`/courses/[id]`)
- Detailed course information
- Course content/lessons list
- Enrollment button
- Instructor information
- Course metadata (level, duration, category)
- Sticky sidebar with course thumbnail
- Protected enrollment (requires login)

### My Courses Page (`/my-courses`)
- List of enrolled courses
- Progress tracking for each course
- Visual progress bars
- Quick access to enrolled courses
- Empty state with call-to-action

### Navigation
- Sticky navbar with:
  - Logo/home link
  - Courses link
  - My Courses link (authenticated users)
  - Create Course link (instructors only)
  - User name display
  - Login/Register buttons (unauthenticated)
  - Logout button (authenticated)

## Technology Stack

- **Next.js 14**: React framework with SSR support
- **TypeScript**: Type-safe development
- **SWR**: Data fetching and caching
- **Axios**: HTTP client with interceptors
- **CSS Modules**: Scoped styling

## Project Structure

```
frontend/
├── pages/
│   ├── _app.tsx              # App wrapper with providers
│   ├── index.tsx             # Home page
│   ├── login.tsx             # Login page
│   ├── register.tsx          # Register page
│   ├── courses.tsx           # Courses catalog
│   ├── my-courses.tsx        # User's enrolled courses
│   └── courses/
│       └── [id].tsx          # Course detail page
├── src/
│   ├── components/
│   │   ├── Navbar.tsx        # Navigation component
│   │   └── Navbar.module.css
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication context
│   ├── lib/
│   │   └── api.ts            # API client with interceptors
│   ├── styles/
│   │   ├── globals.css       # Global styles
│   │   ├── Home.module.css
│   │   ├── Auth.module.css
│   │   ├── Courses.module.css
│   │   ├── CourseDetail.module.css
│   │   └── MyCourses.module.css
│   └── types.ts              # TypeScript interfaces
└── package.json
```

## Key Features

### Authentication Flow
1. User registers or logs in
2. Access token stored in memory
3. Refresh token stored in HttpOnly cookie
4. Automatic token refresh on 401 errors
5. Redirect to login on refresh failure

### API Integration
- Centralized API client with Axios
- Request interceptor adds auth token
- Response interceptor handles token refresh
- Error handling with user feedback

### State Management
- React Context for global auth state
- SWR for server state caching
- Local state for form inputs

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Responsive navigation
- Touch-friendly interfaces

## Usage Examples

### Running Locally

```bash
cd frontend
yarn install
yarn dev
```

Access at: http://localhost:3000

### Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3003
```

### Testing the Application

1. **Register a new account**
   - Go to `/register`
   - Fill in name, email, password
   - Automatically logged in

2. **Browse courses**
   - Go to `/courses`
   - Filter by category or level
   - Click on a course to view details

3. **Enroll in a course**
   - View course details
   - Click "Enroll Now"
   - Course appears in "My Courses"

4. **View enrolled courses**
   - Go to `/my-courses`
   - See progress for each course
   - Click to continue learning

## Styling Approach

### Global Styles
- Consistent color scheme
- Reusable button classes
- Form input styles
- Badge components

### CSS Modules
- Component-scoped styles
- No naming conflicts
- Better maintainability

### Design System
- Primary color: #0070f3 (blue)
- Secondary color: #666 (gray)
- Success: #0070f3
- Error: #c00
- Background: #f5f5f5

## API Endpoints Used

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout
- `GET /api/user/profile` - Get user profile

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (instructor)

### Enrollments
- `POST /api/enrollments` - Enroll in course
- `GET /api/user/enrollments` - Get user enrollments
- `PUT /api/enrollments/:id/progress` - Update progress

## Future Enhancements

### Planned Features
- [ ] Video player integration
- [ ] Lesson completion tracking
- [ ] Course search functionality
- [ ] User profile page
- [ ] Course reviews and ratings
- [ ] Instructor dashboard
- [ ] Course creation wizard
- [ ] Real-time notifications
- [ ] Discussion forums
- [ ] Certificates on completion
- [ ] Dark mode support
- [ ] Accessibility improvements

### Performance Optimizations
- [ ] Image optimization with Next.js Image
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Service worker for offline support
- [ ] CDN integration

## Troubleshooting

### Common Issues

**Issue**: "Failed to fetch courses"
- **Solution**: Ensure BFF is running on port 3003

**Issue**: "Unauthorized" errors
- **Solution**: Check if access token is valid, try logging in again

**Issue**: Styles not loading
- **Solution**: Restart dev server, clear `.next` cache

**Issue**: CORS errors
- **Solution**: Verify BFF CORS configuration allows frontend origin

## Development Tips

1. **Hot Reload**: Changes auto-reload in dev mode
2. **Type Safety**: Use TypeScript interfaces for all data
3. **Error Handling**: Always wrap API calls in try-catch
4. **Loading States**: Show loading indicators for async operations
5. **User Feedback**: Display success/error messages

## Testing Credentials

After running seed script:
- **Email**: instructor@example.com
- **Password**: password123
- **Role**: Instructor

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

- Semantic HTML
- Keyboard navigation
- ARIA labels
- Focus indicators
- Color contrast compliance
