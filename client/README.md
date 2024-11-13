# AthleteDB

A MERN stack application for tracking and managing athlete assessments and performance metrics.

## Features

- Create, read, update, and delete athlete assessments
- Track movement screens and performance measurements
- Modern, responsive UI built with React and Tailwind CSS
- RESTful API backend with Express and MongoDB

## Tech Stack

- **Frontend:**
  - React
  - React Router DOM
  - React Hook Form
  - Tailwind CSS
  - shadcn/ui components

- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - Mongoose

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/athleteDB.git
cd athleteDB
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Create a .env file in the server directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/athleteDB
```

5. Start the development servers:

In the server directory:
```bash
npm start
```

In the client directory:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

- GET `/api/assessments` - Get all assessments
- POST `/api/assessments` - Create new assessment
- GET `/api/assessments/:id` - Get single assessment
- PUT `/api/assessments/:id` - Update assessment
- DELETE `/api/assessments/:id` - Delete assessment

## Project Structure

```
athleteDB/
├── client/              # React frontend
│   ├── public/
│   └── src/
│       ├── components/  # React components
│       └── lib/         # Utility functions
└── server/             # Express backend
    ├── controllers/    # Route controllers
    ├── models/         # Mongoose models
    └── routes/         # Express routes
```

## Future Enhancements

- User authentication
- Data visualization
- Export functionality
- Advanced search and filtering
- Performance analytics