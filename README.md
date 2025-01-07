# AthleteDB

Performance assessment and tracking system for athletes built with MERN stack.

## Features

- Athlete profiles with demographic data
- Movement screen assessments
- Performance measurements and tracking
- Analytics and trend visualization
- Customizable measurement types
- Mobile-responsive design

## Tech Stack

### Frontend
- React 18
- TanStack Query for data management
- React Router DOM v6
- React Hook Form
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization

### Backend
- Node.js/Express
- MongoDB with Mongoose
- RESTful API
- Async error handling

## Installation

1. Clone and install dependencies:
```bash
git clone https://github.com/YOUR_USERNAME/athleteDB.git
cd athleteDB

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

2. Configure environment:
```bash
# In server/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/athleteDB
```

3. Start development servers:
```bash
# Start backend (from server/)
npm run dev

# Start frontend (from client/)
npm start
```

Access at `http://localhost:3000`

## API Endpoints

### Athletes
- `GET /api/athletes` - List athletes
- `GET /api/athletes/:id` - Get athlete details
- `POST /api/athletes` - Create athlete
- `PUT /api/athletes/:id` - Update athlete
- `DELETE /api/athletes/:id` - Delete athlete
- `GET /api/athletes/:id/statistics` - Get athlete stats
- `GET /api/athletes/:id/trends` - Get performance trends

### Assessments
- `GET /api/assessments` - List assessments
- `GET /api/assessments/:id` - Get assessment details
- `POST /api/assessments` - Create assessment
- `PUT /api/assessments/:id` - Update assessment
- `DELETE /api/assessments/:id` - Delete assessment

### Measurement Types
- `GET /api/measurement-types` - List measurement types
- `POST /api/measurement-types` - Create measurement type
- `PUT /api/measurement-types/:id` - Update measurement type
- `DELETE /api/measurement-types/:id` - Delete measurement type
- `POST /api/measurement-types/reinitialize-defaults` - Reset default types

## Project Structure

```
athleteDB/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   └── lib/          # Utilities
│   └── public/           # Static assets
└── server/               # Express backend
    ├── controllers/      # Route controllers
    ├── models/          # Mongoose models
    ├── routes/          # API routes
    └── config/          # Configuration
```