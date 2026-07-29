# Freelance Marketplace

A full-stack freelance task marketplace (a mini Upwork) built with the **MERN stack**. Clients post tasks, freelancers bid on them, clients accept a bid to assign the work, and both sides leave ratings and reviews once the task is completed.

Built as a portfolio project to demonstrate real full-stack engineering: JWT authentication, role-based authorization, ownership checks enforced server-side, relational data modeling in MongoDB, multi-step business logic, and a clean REST API — paired with a styled React frontend.

**Live demo:** [https://freelancer-marketplace-v-git-052465-sikandars-projects-04a38874.vercel.app](https://freelancer-marketplace-v-git-052465-sikandars-projects-04a38874.vercel.app)
**API:** `https://<your-backend-vercel-url>.vercel.app/api/v1`

---

## Features

**Authentication**
- Register/login with hashed passwords (bcrypt) and JWT-based sessions
- Two roles: `client` and `freelancer`, chosen at signup
- Protected routes enforced on the backend, not just hidden in the UI

**Tasks**
- Clients post tasks with a title, description, budget, deadline, and category
- Anyone can browse and view task details
- Only the owning client can edit, delete, or complete their own task

**Bidding**
- Freelancers submit one bid per task (proposed amount + message)
- Clients view all bids on their own tasks and accept one
- Accepting a bid automatically marks the task `in-progress`, assigns the freelancer, and rejects all other pending bids on that task

**Reviews & Profiles**
- After a task is marked `completed`, both the client and the assigned freelancer can review each other
- Public profile pages show a user's bio, skills, and average rating, calculated live from their reviews

**Dashboards**
- Clients see all tasks they've posted
- Freelancers see all bids they've placed, with live status

---

## Tech Stack

| Layer | Technology |
|---|---|
| Database | MongoDB + Mongoose |
| Backend | Node.js, Express (ES Modules) |
| Auth | JWT (`jsonwebtoken`), `bcryptjs` for password hashing |
| Frontend | React (Vite), React Router, Axios |
| Styling | Tailwind CSS v4, custom design tokens (Fraunces / Inter / IBM Plex Mono) |
| Deployment | Vercel (frontend + backend), MongoDB Atlas |

---

## Project Structure

```
Freelance_Marketplace/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── models/          # Mongoose schemas: User, Task, Bid, Review
│   ├── controllers/     # Route logic
│   ├── routes/          # Express route definitions
│   ├── middlewares/     # JWT auth verification
│   └── server.js        # App entry point
│
└── frontend/
    └── src/
        ├── api/          # Axios instance + per-resource API calls
        ├── components/   # Navbar and other shared UI
        ├── context/      # AuthContext, AuthProvider, useAuth hook
        ├── pages/        # TaskList, TaskDetail, Login, Register, PostTask, Dashboard, Profile
        ├── index.css     # Shared design tokens (colors, fonts)
        └── App.jsx       # Routes
```

---

## API Overview

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/users/register` | Public | Create an account |
| POST | `/users/login` | Public | Log in, receive a JWT |
| GET | `/users/:id` | Public | View a user's public profile |
| GET | `/users/:userId/reviews` | Public | View a user's reviews |
| GET | `/tasks` | Public | List all tasks |
| GET | `/tasks/:id` | Public | Get one task's details |
| POST | `/tasks` | Client only | Create a task |
| PUT | `/tasks/:id` | Owning client only | Update a task |
| DELETE | `/tasks/:id` | Owning client only | Delete a task |
| PATCH | `/tasks/:id/complete` | Owning client only | Mark a task completed |
| POST | `/tasks/:taskId/bids` | Freelancer only | Submit a bid |
| GET | `/tasks/:taskId/bids` | Owning client only | View bids on a task |
| GET | `/bids/my-bids` | Authenticated (freelancer) | View your own bids |
| PATCH | `/bids/:bidId/accept` | Owning client only | Accept a bid |
| POST | `/tasks/:taskId/reviews` | Client or assigned freelancer | Review the other party |

---

## Running Locally

### Prerequisites
- Node.js (v18+)
- A MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/Freelance_Marketplace.git
cd Freelance_Marketplace
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (see `.env.sample` for reference):
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run the backend:
```bash
npm run dev
```
The API will be available at `http://localhost:5000/api/v1`.

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/` (see `.env.sample` for reference):
```
VITE_API_URL=http://localhost:5000/api/v1
```

Run the frontend:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## Notes on Security

- Passwords are hashed with bcrypt before being stored — never saved or returned in plain text.
- All create/update/delete operations require a valid JWT, verified server-side.
- Ownership is checked on the server for every mutating action (a client can only edit their own tasks, a freelancer can only accept isn't possible for freelancers, etc.) — this isn't just hidden in the UI, it's enforced in the controller logic itself.
- `.env` files are excluded from version control; `.env.sample` files document the required variables without exposing real secrets.

---

## Possible Future Additions

- Stripe test-mode payments on task completion
- Real-time notifications via Socket.io (new bid, bid accepted)
- Search and filtering on the task list
- File uploads for portfolios/task attachments

---

## License

This project is open source and available for learning purposes.
