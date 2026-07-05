# 🏡 WanderLust MERN - AI Powered Travel & Booking Platform

<p align="center">
  <img src="https://img.shields.io/badge/MERN-FullStack-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-brightgreen?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Cloudinary-Image%20Storage-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/OpenAI-AI%20Assistant-black?style=for-the-badge&logo=openai" />
</p>

<p align="center">
A modern, scalable, AI-powered travel booking platform built using the MERN Stack.
Users can explore destinations, create listings, upload images, write reviews, book stays, and interact with an AI travel assistant—all through a responsive React application powered by a secure REST API.
</p>

---

# 🚀 Features

## 👤 Authentication & User Management

- Secure User Registration
- Login & Logout
- Passport.js Authentication
- Cookie-Based Session Authentication
- Protected Routes
- Persistent Login Sessions
- User Profile Management
- Owner Authorization
- Session Storage using MongoDB

---

# 🏠 Listings Management

- Create Listing
- Update Listing
- Delete Listing
- View Listing Details
- Listing Categories
- Search Listings
- Location Search
- Country Search
- Price Management
- Image Upload
- Listing Ownership Verification
- Image Preview
- Listing Validation

---

# 🖼️ Cloudinary Integration

- Secure Image Upload
- Cloud Image Storage
- Automatic Image Optimization
- Image Replacement
- File Size Validation
- Image Type Validation
- Memory Storage Upload
- Cloudinary Folder Organization

---

# 🔍 Smart Search & Filtering

- Search by Title
- Search by Country
- Search by Location
- Category Filtering
- Combined Search + Filter
- Fast MongoDB Regex Search

---

# ⭐ Reviews System

- Add Reviews
- Delete Reviews
- Review Validation
- Author Verification
- Automatic Population
- Cascade Delete
- Review Ownership Protection

---

# 📅 Booking System

- Create Booking
- Multi-Step Booking Flow
- Booking Confirmation
- Booking History
- My Bookings Page
- Booking Status
- Booking Cancellation
- Booking Validation

---

# 🤖 AI Travel Assistant

- OpenAI Integration
- AI Chat Interface
- Conversation History
- Clear Chat
- Travel Recommendations
- Destination Suggestions
- Error Handling
- Rate Limited API

---

# 🔐 Security Features

- Passport Authentication
- Express Sessions
- Mongo Session Store
- Protected APIs
- Owner Authorization
- Joi Validation
- ObjectId Validation
- Rate Limiting
- CORS Protection
- Environment Variable Validation
- Secure Cookies
- Input Sanitization
- Centralized Error Handling

---

# ⚡ Performance Optimizations

- Async/Await Architecture
- Modular Controllers
- Modular Routes
- Optimized Database Queries
- Populate Optimization
- Lazy React Rendering
- Context API State Management
- RESTful API Design
- Clean Project Structure
- Efficient Image Upload Flow

---

# 🎨 Frontend Features

- React 18
- React Router DOM
- Context API
- Axios API Layer
- Reusable Components
- Responsive UI
- Loading Indicators
- Toast Messages
- Form Validation
- Error Handling
- Protected Pages
- Search Interface
- Booking Progress Bar

---

# ⚙️ Backend Features

- Express REST API
- MongoDB Database
- Mongoose ODM
- Passport Local Strategy
- Session Authentication
- Cloudinary Upload API
- Multer Middleware
- Joi Validation
- Modular Controllers
- Modular Routes
- Error Middleware
- Booking API
- Review API
- AI Chat API

---

# 📡 REST API

## Authentication

```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

---

## Listings

```
GET    /api/listings
GET    /api/listings/:id
POST   /api/listings
PUT    /api/listings/:id
DELETE /api/listings/:id
```

---

## Reviews

```
POST    /api/listings/:listingId/reviews
DELETE  /api/listings/:listingId/reviews/:reviewId
```

---

## Bookings

```
POST    /api/bookings
GET     /api/bookings/my
GET     /api/bookings/:id
PATCH   /api/bookings/:id/confirm
DELETE  /api/bookings/:id
```

---

## AI Assistant

```
POST   /api/chat
GET    /api/chat/history
POST   /api/chat/clear
```

---

# 🛠️ Tech Stack

## Frontend

- React 18
- Vite
- React Router DOM
- Axios
- Bootstrap
- Context API

---

## Backend

- Node.js
- Express.js
- Passport.js
- Express Session
- Multer
- Joi
- Cloudinary SDK

---

## Database

- MongoDB
- Mongoose
- Connect Mongo

---

## AI

- OpenAI API

---

## Cloud

- Cloudinary

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/wanderlust-mern.git
cd wanderlust-mern
```

---

## Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

# 🔑 Environment Variables

## Backend

```env
PORT=8080

ATLASDB_URL=

SECRET=

CLIENT_URL=http://localhost:5173

CLOUD_NAME=

CLOUD_API_KEY=

CLOUD_API_SECRET=

OPENAI_API_KEY=
```

---

## Frontend

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

# ✅ Bug Fixes & Improvements

- Fixed image upload validation
- Added ObjectId validation
- Improved authentication middleware
- Fixed deleted listing review issue
- Added secure session management
- Added centralized error handling
- Added rate limiting
- Added Joi validation
- Improved CORS configuration
- Removed deprecated dependencies
- Added environment validation
- Improved API response consistency
- Added booking system
- Improved React state management
- Added AI chat support
- Improved error messages
- Added secure Cloudinary upload flow

---

# 🚀 Future Enhancements

- Payment Gateway Integration
- Wishlist
- Favorites
- Google Maps Integration
- Email Notifications
- Admin Dashboard
- Real-time Notifications
- Advanced Analytics
- Multi-language Support
- Dark Mode
- Social Login
- Image Gallery
- Availability Calendar
- Recommendation Engine

---

# 📈 Project Highlights

- Full MERN Stack Architecture
- Secure Session Authentication
- RESTful API
- AI Powered Travel Assistant
- Cloudinary Image Upload
- Booking Management
- Review System
- Smart Search & Filters
- Responsive Design
- Production Ready Backend
- Clean Modular Architecture
- Scalable Codebase

---

# 👨‍💻 Author

**Avnesh Kumar**

**MCA Graduate | Full Stack MERN Developer**

GitHub: https://github.com/AvneshTech

LinkedIn: https://linkedin.com/in/your-linkedin

Email: avneshbaghel.30july@gmailcom

---

# ⭐ Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub.