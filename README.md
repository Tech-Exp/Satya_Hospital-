# Satya Hospital Project

This repository contains a complete hospital management system with three main components:
1. Backend - Node.js/Express API server
2. Frontend - Patient-facing website
3. Dashboard - Admin/Doctor management portal

## Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (database)

## Environment Setup

The project uses environment variables stored in `.env` files. The backend configuration is already set up in `/Backend/config/config.env`.

## Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   This will start the backend server on port 4000 (http://localhost:4000).

## Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   This will start the frontend development server on port 5173 (http://localhost:5173).

## Dashboard Setup

1. Navigate to the Dashboard directory:
   ```bash
   cd Dashboard
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   This will start the dashboard development server on port 5174 (http://localhost:5174).

## Running All Components Together

For a complete setup, you'll need to run all three components simultaneously. You can use separate terminal windows or use the provided project runner with [concurrently](https://www.npmjs.com/package/concurrently).

### Using the Project Runner (Recommended):

The project includes a pre-configured setup using concurrently that lets you run all components with a single command.

1. Navigate to the project-runner directory:
   ```bash
   cd project-runner
   ```

2. Install concurrently if not already installed:
   ```bash
   npm install
   ```

3. Run all components together:
   ```bash
   npm run dev:all
   ```

   This will start the backend server on port 4000, the frontend on port 5173, and the dashboard on port 5174.

### Using separate terminals (Alternative):

Terminal 1:
```bash
cd Backend && npm run dev
```

Terminal 2:
```bash
cd Frontend && npm run dev
```

Terminal 3:
```bash
cd Dashboard && npm run dev
```

## Project Structure

- `Backend/`: Contains the server-side Node.js/Express API
  - `controller/`: API route handlers
  - `models/`: MongoDB schemas
  - `router/`: API route definitions
  - `middlewares/`: Express middleware functions
  - `utils/`: Utility functions

- `Frontend/`: Contains the patient-facing React application
  - `src/components/`: Reusable UI components
  - `src/pages/`: Page components
  - `src/api/`: API integration

- `Dashboard/`: Contains the admin portal React application
  - `src/components/`: Dashboard UI components

## Features

- User authentication (patients, doctors, admins)
- Appointment scheduling
- Doctor management
- Patient records
- Messaging system
- Department information

## Production Deployment

To build the Frontend and Dashboard for production:

```bash
cd Frontend && npm run build
cd Dashboard && npm run build
```

This will create optimized builds in their respective `dist` directories, which can be deployed to a web server.

For the Backend, set up appropriate environment variables for production use, and use a process manager like [PM2](https://pm2.keymetrics.io/) to run the server in production.

## Notes

- The default admin credentials are not provided in this README. Please contact the system administrator for access.
- Make sure MongoDB is running before starting the backend server.
- For email functionality, ensure the SMTP settings in the config.env file are properly configured.
