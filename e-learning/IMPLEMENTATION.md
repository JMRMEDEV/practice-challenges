# E-Learning Platform - Implementation Guide

## Architecture Overview

This E-Learning platform is built using a **Microservices Architecture** with the following components:

### Services

1. **Auth Service** (Port 3001)
   - User registration and authentication
   - JWT-based access tokens (15min expiry)
   - Refresh tokens stored in HttpOnly cookies (7 days expiry)
   - Password hashing with bcrypt
   - PouchDB for user and token storage

2. **Content Service** (Port 3002)
   - Course management (CRUD operations)
   - Enrollment management
   - Progress tracking
   - Video upload simulation with multer
   - PouchDB for courses and enrollments

3. **BFF (Backend for Frontend)** (Port 3003)
   - API Gateway aggregating auth and content services
   - Request forwarding with authentication middleware
   - Cookie management for refresh tokens
   - Simplified API for frontend consumption

4. **Frontend** (Port 3000)
   - Next.js application (to be implemented)
   - Server-side rendering support
   - Authentication flow
   - Course browsing and enrollment

5. **CouchDB** (Port 5984)
   - Persistent database for PouchDB replication
   - Admin credentials: admin/password

## Features Implemented

### Authentication Service
- User registration with role-based access (student/instructor/admin)
- Login with JWT access tokens
- Refresh token rotation
- Token verification endpoint
- Logout with token invalidation
- Password hashing with bcrypt
- HttpOnly cookie for refresh tokens

### Content Service
- Course CRUD operations
- Course filtering by category and level
- Enrollment management
- Progress tracking per user
- Lesson completion tracking
- Video upload simulation
- PouchDB indexes for performance

### BFF
- Authentication endpoints proxy
- Course management proxy
- Enrollment proxy
- Auth middleware for protected routes
- Cookie forwarding
- Error handling and status code forwarding

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Yarn package manager

### Quick Start with Docker

```bash
# Build and start all services
docker-compose up --build

# Services will be available at:
# - Frontend: http://localhost:3000
# - BFF: http://localhost:3003
# - Auth Service: http://localhost:3001
# - Content Service: http://localhost:3002
# - CouchDB: http://localhost:5984
```

### Local Development

#### Auth Service
```bash
cd auth-service
yarn install
yarn dev
```

#### Content Service
```bash
cd content-service
yarn install
yarn dev
```

#### BFF
```bash
cd bff
yarn install
yarn dev
```

#### Frontend
```bash
cd frontend
yarn install
yarn dev
```

## API Documentation

### Authentication Endpoints (via BFF)

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "student"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "accessToken": "jwt-token",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Cookie: refreshToken=<token>

Response:
{
  "accessToken": "new-jwt-token"
}
```

#### Logout
```http
POST /api/auth/logout
Cookie: refreshToken=<token>
```

### Course Endpoints (via BFF)

#### Get All Courses
```http
GET /api/courses?category=programming&level=beginner
```

#### Get Course by ID
```http
GET /api/courses/:id
```

#### Create Course (Protected)
```http
POST /api/courses
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "title": "Introduction to TypeScript",
  "description": "Learn TypeScript from scratch",
  "instructorId": "user_id",
  "instructorName": "John Doe",
  "level": "beginner",
  "category": "programming",
  "lessons": [
    {
      "id": "lesson_1",
      "title": "Getting Started",
      "description": "Introduction to TypeScript",
      "videoUrl": "/videos/lesson1.mp4",
      "duration": 600,
      "order": 1
    }
  ]
}
```

### Enrollment Endpoints (via BFF)

#### Enroll in Course (Protected)
```http
POST /api/enrollments
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "userId": "user_id",
  "courseId": "course_id"
}
```

#### Get User Enrollments (Protected)
```http
GET /api/user/enrollments
Authorization: Bearer <access-token>
```

#### Update Progress (Protected)
```http
PUT /api/enrollments/:id/progress
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "lessonId": "lesson_1",
  "progress": 50
}
```

## Database Schema

### Users (PouchDB)
```typescript
{
  _id: string;
  email: string;
  password: string; // bcrypt hashed
  name: string;
  role: 'student' | 'instructor' | 'admin';
  createdAt: string;
}
```

### Refresh Tokens (PouchDB)
```typescript
{
  _id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}
```

### Courses (PouchDB)
```typescript
{
  _id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  thumbnail: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  lessons: ILesson[];
  createdAt: string;
  updatedAt: string;
}
```

### Enrollments (PouchDB)
```typescript
{
  _id: string;
  userId: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
  enrolledAt: string;
  lastAccessedAt: string;
}
```

## Security Features

1. **JWT Access Tokens**: Short-lived (15 minutes) for API authentication
2. **Refresh Tokens**: Long-lived (7 days) stored in HttpOnly cookies
3. **Password Hashing**: bcrypt with salt rounds
4. **CORS**: Configured with credentials support
5. **Token Verification**: Middleware for protected routes
6. **Secure Cookies**: HttpOnly, SameSite=strict in production

## Next Steps

### Frontend Implementation
- Implement authentication pages (login, register)
- Create course catalog with filtering
- Build course detail pages
- Implement enrollment flow
- Add progress tracking UI
- Create user dashboard

### Additional Features
- Email verification
- Password reset flow
- Course reviews and ratings
- Search functionality
- Video streaming optimization
- Real-time progress updates
- Notifications system

## Testing

```bash
# Test Auth Service
curl http://localhost:3001/health

# Test Content Service
curl http://localhost:3002/health

# Test BFF
curl http://localhost:3003/health

# Seed sample data
node scripts/seed-data.js

# Clear all data
node scripts/clear-data.js

# Register a user
curl -X POST http://localhost:3003/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:3003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## Troubleshooting

### PouchDB Issues
- PouchDB stores data in `./node_modules/.pouchdb` by default
- For persistent storage, configure CouchDB replication

### Port Conflicts
- Ensure ports 3000-3003 and 5984 are available
- Modify `docker-compose.yml` if needed

### CORS Issues
- BFF is configured with `origin: true` for development
- Update CORS settings for production deployment

## Production Considerations

1. **Environment Variables**: Use proper secrets management
2. **Database**: Migrate to CouchDB cluster for production
3. **Load Balancing**: Add nginx or similar for service distribution
4. **Monitoring**: Implement logging and metrics
5. **SSL/TLS**: Enable HTTPS for all services
6. **Rate Limiting**: Add API rate limiting
7. **Caching**: Implement Redis for session management
