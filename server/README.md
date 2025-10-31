# LMS Backend - Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Clerk account (for authentication)
- Stripe account (for payments)
- Cloudinary account (for file storage)

## Installation Steps

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Fill in all required environment variables:
     - MongoDB URI from MongoDB Atlas
     - Clerk keys from Clerk dashboard
     - Stripe keys from Stripe dashboard
     - Cloudinary credentials

3. **Start the Server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

4. **Server will run on:** `http://localhost:5000`

## API Endpoints

### User Routes (`/api/user`)
- GET `/data` - Get user data
- GET `/enrolled-courses` - Get enrolled courses
- PUT `/profile` - Update profile

### Course Routes (`/api/course`)
- GET `/all` - Get all courses
- GET `/:id` - Get course by ID
- GET `/search` - Search courses
- POST `/create` - Create course (Educator)
- PUT `/:id` - Update course (Educator)
- DELETE `/:id` - Delete course (Educator)
- POST `/:id/rating` - Add rating

### Enrollment Routes (`/api/enrollment`)
- POST `/create` - Create enrollment
- GET `/:id` - Get enrollment
- PUT `/:id/progress` - Update progress
- GET `/course/:courseId/progress` - Get course progress

### Quiz Routes (`/api/quiz`)
- POST `/create` - Create quiz (Educator)
- GET `/:id` - Get quiz
- POST `/:id/submit` - Submit quiz
- GET `/course/:courseId` - Get course quizzes

### Payment Routes (`/api/payment`)
- POST `/sandbox` - Sandbox payment
- POST `/stripe/create` - Create Stripe session
- POST `/stripe/verify` - Verify Stripe payment
- GET `/receipt/:transactionId` - Get receipt

### Certificate Routes (`/api/certificate`)
- POST `/generate` - Generate certificate
- GET `/:id` - Get certificate
- GET `/:id/download` - Download certificate PDF
- GET `/verify/:certificateId` - Verify certificate

### Admin Routes (`/api/admin`)
- GET `/users` - Get all users
- GET `/enrollments` - Get all enrollments
- GET `/payments` - Get all payments
- GET `/statistics` - Get platform statistics

## Database Models

1. **User** - User accounts (students, educators, admins)
2. **Course** - Course information with chapters and lectures
3. **Enrollment** - Student enrollments and progress
4. **Quiz** - Quizzes with questions and attempts
5. **Certificate** - Course completion certificates
6. **Payment** - Payment transactions

## Features

✅ Clerk Authentication
✅ Role-based access control (Student, Educator, Admin)
✅ Course management with chapters and lectures
✅ Video, text, and document support
✅ Quiz system (timed and untimed)
✅ Progress tracking
✅ Stripe and Sandbox payments
✅ Certificate generation
✅ File uploads to Cloudinary
✅ Admin dashboard

## Support

For issues or questions, please check the documentation or contact support.
