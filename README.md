# SkillSwap (MERN)

Teach what you know, learn what you want. Users are matched with people who have complementary skills, send swap requests, complete sessions and rate each other.

## Setup
1. Start MongoDB locally (or paste an Atlas URI into `server/.env`).
2. Backend:
   cd server && npm install && npm run seed && npm run dev
3. Frontend (new terminal):
   cd client && npm install && npm run dev
4. Open http://localhost:5173

Demo login after seeding: aarav@demo.com / password123 (all seeded users share this password).

## Matching score
score = (mutual ? 100 : 0) + 10 x (skills they teach me) + 10 x (skills I teach them) + 2 x their rating

## Structure
server/: models (User, SwapRequest, Review), routes (auth, users, matches, swaps, reviews), middleware, seed.js
client/: Vite + React + Tailwind; pages, components, auth context
