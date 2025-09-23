# Task 001: Setup Full Stack App (React + Tailwind + Express)

## Goal

Initialize a full stack TypeScript project with:

- **Frontend**: React + TailwindCSS
- **Backend**: Node.js + Express
- Shared config (e.g. package management, prettier, eslint, gitignore)

## Requirements

- Frontend in `/frontend`
  - Bootstrapped with Vite + React
  - TailwindCSS configured
  - Example component rendering successfully
- Backend in `/backend`
  - Node.js + Express
  - Health check API route
- Root-level `README.md` explaining how to run both servers

## Steps

1. Initialize a monorepo structure
2. Setup React frontend:
   - Use Vite for fast dev server
   - Install Tailwind and configure `tailwind.config.ts`
   - Add sample component using Tailwind styles
3. Setup backend:
   - Initialize Node project with Express
   - Create health check API endpoint at `/api/health`
4. Update root `README.md` with:
   - Install instructions
   - Start commands to run both the frontend and backend servers concurrently
