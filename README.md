# EduHive

EduHive is a modern academic knowledge sharing web application built with a React + Express stack.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens), bcrypt

## Features

- **Academic Dashboard & Feed**: Filter posts by subject, subtopic tags, or live search. Sort by latest, trending, or top upvoted content.
- **Interactive User Profile & Redirection**: 3-column academic profile view (`/profile` or `#profile`) styled with EduHive's signature dark slate aesthetic.
  - **Profile Navigation**: Quick view switcher, joined academic communities, and Level 12 progress tracker (5800/6000 XP).
  - **Profile Header & Verified Affiliation**: Display name, handle (`@AlexJ`), verified student badge, and MIT institutional tag.
  - **5-Day Streak Tracker & Monthly Calendar**: Interactive streak activity calendar highlighting study milestones.
  - **Level Up Guide & Gamification Hub**: Earned badges (`Top Contributor - Python`, `Scholar Initiate`, `Code Crafter`), leaderboard standings (Rank #4), saved resources, and posts.
  - **Personal Stats & Professor Connections**: Metrics on questions asked (45), answers given (78), resources shared (12), and faculty connections.

## Project Structure

```text
EduHive/
├── frontend/             # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/   # Reusable UI components (Navbar, LeftSidebar, RightSidebar, CenterFeed, etc.)
│   │   ├── pages/        # Page views (Home.jsx, PostPage.jsx, ProfilePage.jsx)
│   │   ├── services/     # API request services & mockData
│   │   ├── context/      # Global AppContext (Routing, Profile redirection, State management)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/              # Node.js + Express + Mongoose
│   ├── src/
│   │   ├── config/       # Database configuration (db.js)
│   │   ├── controllers/  # Controller functions
      ├── middleware/   # Custom middlewares (Auth, Error)
│   │   ├── models/       # Mongoose data schemas
│   │   ├── routes/       # API endpoints definition
│   │   ├── utils/        # Utility/helper scripts
│   │   └── server.js     # Entry point
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB Atlas cluster or local MongoDB instance

### Backend Setup

1. Navigate into the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/eduhive?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate into the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Access the Profile page directly by clicking the User Profile dropdown / **View Full Profile** or navigating to `#profile`.
