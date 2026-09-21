# Feedants Assignment

Full-stack mobile application featuring a React Native (Expo) client and an Express + TypeScript + MongoDB backend.

## Project Structure

```text
feedants-assignment/
├── frontend/             # Expo React Native mobile application
│   ├── app/              # Expo Router file-based routes
│   └── src/
│       ├── api/          # Axios API client & endpoints
│       ├── components/   # Reusable UI components
│       ├── hooks/        # Custom React hooks
│       └── types/        # TypeScript models and shared schemas
├── backend/              # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── config/       # Database and environment configurations
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Express middlewares (error handling, validation)
│   │   ├── models/       # Mongoose models & schemas
│   │   ├── routes/       # Express route definitions
│   │   └── index.ts      # Server entry point
│   ├── .env.example
│   └── tsconfig.json
└── README.md
```

---

## Overview

A mobile application and backend service designed for competition management and details exploration.

---

## Setup Instructions

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm or pnpm
- MongoDB instance (local or MongoDB Atlas)
- Expo Go app on physical mobile device or iOS Simulator / Android Emulator

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure MONGODB_URI and PORT in .env
npm run dev
```

The backend server runs on `http://localhost:5000` by default. Verify health check at:
```bash
curl http://localhost:5000/api/health
```

### 2. Frontend Setup

```bash
cd frontend
npm install
# Ensure EXPO_PUBLIC_API_BASE_URL is set if using custom API host
npx expo start
```

Scan the QR code in your terminal with Expo Go (Android) or Camera (iOS), or press `w` to run in web browser.

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default |
|---|---|---|
| `PORT` | Server listening port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/feedants` |
| `NODE_ENV` | Runtime environment (`development`, `production`) | `development` |

### Frontend (`frontend/.env`)
| Variable | Description | Default |
|---|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | Base API URL for backend calls | `http://localhost:5000/api` |

---

## Assumptions

- Backend REST API provides JSON payloads.
- MongoDB is used for primary data persistence with Mongoose ODM.
- Mobile frontend runs on Expo SDK with TypeScript and Expo Router navigation.

---

## Technical Decisions

- **Expo & Expo Router**: Modern React Native foundation with file-based routing and cross-platform support.
- **Express + TypeScript**: Type-safe REST API server with clear layering (controller-service-model pattern).
- **Mongoose**: Schema enforcement and data validation for MongoDB collections.
- **Axios**: Configurable HTTP client with centralized interceptors, base URL handling, and timeout configurations.

---

## Trade-offs

- Direct database connection inside backend instead of serverless functions to keep dev server straightforward and predictable for local mobile testing.
- Single repository structure without heavy monorepo tooling (like Turborepo) to keep setup minimal and easily runnable on any developer environment.

---

## Future Improvements

- MongoDB schema and endpoints for Competition Details, leaderboard, and entry management.
- Offline support and caching via TanStack Query / WatermelonDB.
- Authentication and role-based access control.
- Automated integration tests with Vitest and Jest/React Native Testing Library.
