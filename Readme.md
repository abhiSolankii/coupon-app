# Coupon Management System

Welcome to the Coupon Management System! This project is a full-stack application designed to manage coupons, allowing administrators to create, update, delete, and track coupon usage, while users can claim available coupons. The system includes an admin portal with authentication, a dashboard for coupon management, and a user-facing page to claim rewards.

- **Frontend**: Built with React, utilizing modern libraries like `react-router-dom`, `framer-motion`, and `react-hot-toast` for a dynamic user interface.
- **Backend**: Built with Node.js and Express, using MongoDB for data storage, JWT for authentication, and rate limiting for security.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Usage](#usage)
  - [Running the Frontend](#running-the-frontend)
  - [Running the Backend](#running-the-backend)
- [Implementation Details](#implementation-details)
  - [Frontend Overview](#frontend-overview)
  - [Backend Overview](#backend-overview)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Admin Authentication**: Secure login and registration for administrators with JWT-based authentication.
- **Coupon Management**: Create, update, delete, and toggle the status of coupons via the admin dashboard.
- **Coupon Claiming**: Users can claim available coupons with IP and session-based tracking.
- **Claim History**: View detailed claim history for each coupon in the admin dashboard.
- **Responsive Design**: Mobile-friendly interface with animations powered by Framer Motion.
- **Rate Limiting**: Prevents abuse of the coupon claim endpoint with a 24-hour limit per IP.
- **Error Handling**: Comprehensive error handling with user-friendly toast notifications.

## Project Structure

### Frontend

```
frontend/
├── src/
│   ├── components/           # Reusable UI components (e.g., Navbar, PrivateRoute)
│   ├── context/             # Authentication context
│   ├── hooks/               # Custom hooks (e.g., useApiRequest)
│   ├── pages/               # Page components (Home, AdminLogin, AdminDashboard, etc.)
│   ├── assets/              # Static assets (e.g., images like doctor.png, logo.png)
│   ├── App.js               # Main application component
│   └── index.js             # Entry point
├── public/                  # Public assets and index.html
├── package.json             # Frontend dependencies
```

### Backend

```
backend/
├── config/                  # Database configuration
├── controllers/             # Business logic for routes
├── middleware/              # Authentication and rate limiting middleware
├── models/                  # Mongoose schemas
├── routes/                  # API route definitions
├── server.js                # Main server file
├── package.json             # Backend dependencies
├── .env                     # Environment variables
```

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v14.x or later)
- **npm** (v6.x or later) or **yarn**
- **MongoDB** (local instance or MongoDB Atlas)
- **Git** (for cloning the repository)

## Installation

### Frontend Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/coupon-management-system.git
   cd frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

   This installs React, `react-router-dom`, `framer-motion`, `react-hot-toast`, `lucide-react`, and other dependencies.

3. **Configure Environment Variables**

   - Create a `.env` file in the `frontend` directory.
   - Add the following variable (adjust based on your backend URL):
     ```
     REACT_APP_API_URL=http://localhost:5000/api
     ```

4. **Add Assets**
   - Place your images (e.g., `doctor.png`, `logo.png`) in the `src/assets/` directory.

### Backend Setup 

https://documenter.getpostman.com/view/34455053/2sAYkBsgPh
https://documenter.getpostman.com/view/34455053/2sAYkBsgKR

1. **Clone the Repository**

   ```bash
   cd ../backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

   This installs Express, Mongoose, `jsonwebtoken`, `bcryptjs`, `cors`, `cookie-parser`, `express-rate-limit`, and other dependencies.

3. **Configure Environment Variables**

   - Create a `.env` file in the `backend` directory.
   - Add the following variables:
     ```
     NODE_ENV=development
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/coupondb
     JWT_SECRET=your-secure-jwt-secret
     FRONTEND_URL=http://localhost:3000
     MAX_CLAIMS_PER_COUPON=10
     ```

4. **Set Up MongoDB**
   - Ensure MongoDB is running locally or configure `MONGO_URI` for MongoDB Atlas.

## Usage

### Running the Frontend

1. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```
2. Open your browser and navigate to `http://localhost:3000`.

### Running the Backend

1. Start the server:
   ```bash
   npm start
   ```
2. The server will run on `http://localhost:5000`. You can test the API endpoints using tools like Postman or the frontend.

## Implementation Details

### Frontend Overview

- **Routing**: Uses `react-router-dom` for client-side routing, with protected routes via `PrivateRoute` for the admin dashboard.
- **Authentication**: Managed via `AuthContext`, storing admin data in `localStorage` and handling login/logout with JWT.
- **API Requests**: Custom hook `useApiRequest` abstracts Axios calls with loading and error states.
- **UI/UX**: Features animations with `framer-motion`, toast notifications with `react-hot-toast`, and icons from `lucide-react`.
- **Pages**:
  - **Home**: Allows users to claim coupons with a dynamic interface.
  - **AdminLogin**: Handles admin authentication with a secure form.
  - **AdminRegister**: Provides admin registration with password confirmation.
  - **AdminDashboard**: Displays a table of coupons with CRUD operations and claim history.

### Backend Overview

- **Server**: Built with Express, handling CORS and cookie parsing for JWT authentication.
- **Database**: Uses MongoDB with Mongoose for schema definition (Admin and Coupon models).
- **Authentication**: Implements JWT with `jsonwebtoken` and `cookie-parser`, protected by the `protect` middleware.
- **Rate Limiting**: Applies `express-rate-limit` to the coupon claim endpoint to prevent abuse.
- **Controllers**:
  - **AdminController**: Manages admin authentication, registration, logout, and profile retrieval.
  - **CouponController**: Handles coupon creation, updates, deletion, claiming, and history retrieval.
- **Middleware**: Includes authentication (`protect`) and rate limiting (`limiter`).
- **Error Handling**: Centralized error handling with custom middleware and helper functions.

## API Endpoints

### Admin Routes

- `POST /api/admin/auth` - Authenticate admin and get token.
- `POST /api/admin/register` - Register a new admin.
- `POST /api/admin/logout` - Logout admin.
- `GET /api/admin/profile` - Get admin profile (protected).

### Coupon Routes

- `POST /api/coupons/claim` - Claim a coupon (rate-limited).
- `GET /api/coupons` - Get all coupons (protected).
- `POST /api/coupons` - Create a coupon (protected).
- `PUT /api/coupons/:id` - Update a coupon (protected).
- `DELETE /api/coupons/:id` - Delete a coupon (protected).
- `GET /api/coupons/history` - Get claim history (protected).

## Environment Variables

- `NODE_ENV`: Environment mode (`development` or `production`).
- `PORT`: Server port (default: 5000).
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT signing.
- `FRONTEND_URL`: Frontend URL for CORS.
- `MAX_CLAIMS_PER_COUPON`: Maximum claims per coupon (default: 10).

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

For questions or support, contact [your-email@example.com](mailto:your-email@example.com) or open an issue on the GitHub repository.
