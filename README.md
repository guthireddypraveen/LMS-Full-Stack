# Full-Stack Learning Management System (LMS)

A comprehensive Learning Management System similar to Udemy, built with React, Node.js, MongoDB, Clerk Authentication, Stripe Payments, and Cloudinary.

## 🚀 Features

### Student Features
- ✅ Browse and search courses by category, level, and keywords
- ✅ View detailed course information with syllabus and reviews
- ✅ Enroll in courses via Stripe or Sandbox payment
- ✅ Access course content (videos, text, documents)
- ✅ Track learning progress
- ✅ Take chapter-wise and full-course quizzes (timed/untimed)
- ✅ Earn certificates upon course completion
- ✅ Download certificates as PDF
- ✅ Rate and review courses

### Educator Features
- ✅ Create and manage courses
- ✅ Add chapters and lessons (video, text, document)
- ✅ Upload videos and materials to Cloudinary
- ✅ Create quizzes with multiple question types
- ✅ View enrolled students
- ✅ Track course performance
- ✅ Design and issue certificates

### Admin Features
- ✅ Manage users, courses, and enrollments
- ✅ View platform statistics
- ✅ Monitor payments and revenue
- ✅ Manage user roles

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Clerk account (for authentication)
- Stripe account (for payments)
- Cloudinary account (for file storage)

## 🛠️ Installation

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Copy `.env.example` to `.env`
- Fill in all required values:
  - `MONGODB_URI`: Your MongoDB connection string
  - `CLERK_SECRET_KEY` & `CLERK_PUBLISHABLE_KEY`: From Clerk dashboard
  - `STRIPE_SECRET_KEY` & `STRIPE_PUBLISHABLE_KEY`: From Stripe dashboard
  - `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY`: From Cloudinary

4. Start the backend server:
```bash
npm run dev
```

Server runs on: `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Copy `.env.example` to `.env`
- Fill in:
  - `VITE_BACKEND_URL=http://localhost:5000`
  - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
  - `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
  - `VITE_CURRENCY=usd`

4. Start the development server:
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 📁 Project Structure

```
LMS-Full-Stack/
├── server/                   # Backend (Node.js/Express)
│   ├── config/              # Database, Cloudinary, Clerk, Stripe configs
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Auth, upload, error handling
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── utils/               # Helper functions
│   └── server.js            # Entry point
├── client/                   # Frontend (React/Vite)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── public/              # Static assets
└── README.md
```

## 🔑 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://...
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
CLOUDINARY_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_SECRET_KEY=...
```

### Frontend (.env)
```
VITE_BACKEND_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_CURRENCY=usd
```

## 📡 API Endpoints

### Courses
- `GET /api/course/all` - Get all courses
- `GET /api/course/:id` - Get course details
- `POST /api/course/create` - Create course (Educator)
- `PUT /api/course/:id` - Update course (Educator)
- `DELETE /api/course/:id` - Delete course (Educator)

### Enrollments
- `POST /api/enrollment/create` - Enroll in course
- `PUT /api/enrollment/:id/progress` - Update progress
- `GET /api/enrollment/course/:courseId/progress` - Get progress

### Quizzes
- `POST /api/quiz/create` - Create quiz (Educator)
- `GET /api/quiz/:id` - Get quiz
- `POST /api/quiz/:id/submit` - Submit quiz answers

### Payments
- `POST /api/payment/sandbox` - Sandbox payment (testing)
- `POST /api/payment/stripe/create` - Create Stripe session
- `POST /api/payment/stripe/verify` - Verify payment

### Certificates
- `POST /api/certificate/generate` - Generate certificate
- `GET /api/certificate/:id/download` - Download PDF
- `GET /api/certificate/verify/:certificateId` - Verify certificate

## 🎯 Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Clerk (Authentication)
- Axios
- React Quill (Rich text editor)
- React YouTube (Video player)
- React Toastify (Notifications)

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- Clerk Express SDK
- Stripe
- Cloudinary
- Multer (File uploads)
- PDFKit (Certificate generation)
- Nodemailer (Email)

## 🔐 Authentication & Authorization

- **Clerk** handles user authentication
- Role-based access control (Student, Educator, Admin)
- JWT tokens for API requests
- Protected routes on frontend and backend

## 💳 Payment System

- **Sandbox Mode**: Mock payments for testing
- **Stripe Integration**: Real payment processing
- Receipt generation
- Transaction tracking

## 📜 Certificate System

- Auto-generated upon course completion
- Unique certificate ID
- PDF download
- Online verification
- Customizable design

## 🎓 Course Content Types

1. **Video Lessons**: YouTube or uploaded videos
2. **Text Content**: Rich text with formatting
3. **Documents**: PDF, DOC files via Cloudinary

## 📊 Quiz System

- Multiple choice questions
- True/False questions
- Short answer questions
- Timed and untimed quizzes
- Automatic scoring
- Progress tracking

## 🚀 Deployment

### Backend Deployment (e.g., Render, Railway)
1. Push code to GitHub
2. Connect repository to hosting service
3. Set environment variables
4. Deploy

### Frontend Deployment (e.g., Vercel, Netlify)
1. Push code to GitHub
2. Connect repository to hosting service
3. Set environment variables
4. Deploy

## 📝 License

MIT License

## 🤝 Support

For issues or questions, please open an issue on GitHub or contact support.

---

Built with ❤️ using React, Node.js, and MongoDB
