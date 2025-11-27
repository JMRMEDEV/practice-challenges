# E-Learning Platform - Quick Start Guide

## Getting Started in 5 Minutes

### Option 1: Docker (Recommended)

```bash
# 1. Start all services
docker-compose up --build

# 2. Wait for services to start (about 2-3 minutes)

# 3. Seed sample data (in a new terminal)
cd /home/jmrmedev/repos/practice-challenges/e-learning
node scripts/seed-data.js

# 4. Access the application
# Frontend: http://localhost:3000
# BFF API: http://localhost:3003
# Auth Service: http://localhost:3001
# Content Service: http://localhost:3002
# CouchDB: http://localhost:5984/_utils
```

### Option 2: Local Development

```bash
# Terminal 1 - Auth Service
cd auth-service
yarn install
yarn dev

# Terminal 2 - Content Service
cd content-service
yarn install
yarn dev

# Terminal 3 - BFF
cd bff
yarn install
yarn dev

# Terminal 4 - Frontend
cd frontend
yarn install
yarn dev

# Terminal 5 - Seed Data
node scripts/seed-data.js
```

## Test the Application

### 1. Register a New User
- Go to http://localhost:3000/register
- Fill in:
  - Name: Your Name
  - Email: test@example.com
  - Password: password123
- Click "Register"

### 2. Browse Courses
- Navigate to "Courses" in the navbar
- Filter by category or level
- Click on any course to view details

### 3. Enroll in a Course
- On course detail page, click "Enroll Now"
- Course will appear in "My Courses"

### 4. View Your Courses
- Click "My Courses" in navbar
- See your enrolled courses with progress

## Sample Data

After running the seed script, you'll have:

**Test Account:**
- Email: instructor@example.com
- Password: password123
- Role: Instructor

**Sample Courses:**
1. Introduction to TypeScript (Beginner, Programming)
2. React for Beginners (Beginner, Programming)
3. Advanced Node.js (Advanced, Programming)
4. UI/UX Design Fundamentals (Intermediate, Design)

## API Testing

### Register a User
```bash
curl -X POST http://localhost:3003/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "instructor@example.com",
    "password": "password123"
  }'
```

### Get Courses
```bash
curl http://localhost:3003/api/courses
```

### Get Course by ID
```bash
curl http://localhost:3003/api/courses/COURSE_ID
```

## Features to Try

### As a Student:
1. Register and login
2. Browse course catalog
3. Filter courses by category/level
4. View course details
5. Enroll in courses
6. View enrolled courses
7. Track progress

### As an Instructor:
1. All student features
2. Create new courses
3. Add lessons to courses
4. View "Create Course" option in navbar

## Troubleshooting

### Services won't start
```bash
# Check if ports are available
lsof -i :3000  # Frontend
lsof -i :3001  # Auth Service
lsof -i :3002  # Content Service
lsof -i :3003  # BFF
lsof -i :5984  # CouchDB

# Kill processes if needed
kill -9 PID
```

### Docker issues
```bash
# Clean up and restart
docker-compose down -v
docker-compose up --build
```

### Seed script fails
```bash
# Make sure all services are running first
# Wait 30 seconds after starting services
# Then run seed script
node scripts/seed-data.js
```

### Frontend can't connect to API
```bash
# Check BFF is running
curl http://localhost:3003/health

# Check environment variable
echo $NEXT_PUBLIC_API_URL
# Should be: http://localhost:3003
```

## Service Health Checks

```bash
# Auth Service
curl http://localhost:3001/health

# Content Service
curl http://localhost:3002/health

# BFF
curl http://localhost:3003/health

# All should return: {"service":"...","status":"running"}
```

## UI Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | http://localhost:3000 | Landing page |
| Login | http://localhost:3000/login | User login |
| Register | http://localhost:3000/register | User registration |
| Courses | http://localhost:3000/courses | Course catalog |
| Course Detail | http://localhost:3000/courses/[id] | Single course |
| My Courses | http://localhost:3000/my-courses | Enrolled courses |

## Authentication Flow

1. User registers → Creates account in Auth Service
2. User logs in → Receives access token (15min) + refresh token (7 days)
3. Access token stored in memory
4. Refresh token stored in HttpOnly cookie
5. API requests include access token in Authorization header
6. On 401 error → Automatically refresh token
7. On refresh failure → Redirect to login

## What's Included

### Backend Services
- JWT authentication with refresh tokens
- Password hashing with bcrypt
- PouchDB for data persistence
- CORS configuration
- Error handling
- Request validation

### Frontend
- Next.js with TypeScript
- Authentication context
- Protected routes
- Responsive design
- Form validation
- Error handling
- Loading states
- SWR for data fetching

### Infrastructure
- Docker Compose setup
- Service orchestration
- Environment configuration
- Volume persistence

## Next Steps

1. **Explore the code**
   - Check out the microservices architecture
   - Review the authentication flow
   - Understand the BFF pattern

2. **Customize**
   - Add more course categories
   - Implement video player
   - Add user profiles
   - Create instructor dashboard

3. **Deploy**
   - Set up production environment
   - Configure SSL/TLS
   - Add monitoring
   - Set up CI/CD

## Documentation

- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Full implementation details
- [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md) - Frontend documentation
- [README.md](./README.md) - Project overview

## Tips

- Use Chrome DevTools to inspect API calls
- Check browser console for errors
- Monitor Docker logs: `docker-compose logs -f`
- Use Postman for API testing
- Check CouchDB admin panel for data

## Utility Scripts

### Seed Sample Data
```bash
node scripts/seed-data.js
```
Creates sample courses and instructor account for testing.

### Clear All Data
```bash
node scripts/clear-data.js
```
Removes all courses while preserving user accounts.

## Support

If you encounter issues:
1. Check service health endpoints
2. Review Docker logs
3. Verify environment variables
4. Ensure all ports are available
5. Try restarting services

Happy Learning!
