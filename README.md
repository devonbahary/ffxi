# FFXI Full Stack Project

A full stack TypeScript application with React frontend and Express backend in a monorepo structure.

## Project Structure

```
├── frontend/          # React + TypeScript + TailwindCSS
├── backend/           # Node.js + Express + TypeScript
├── docs/              # Documentation and task files
├── package.json       # Root package.json with workspace scripts
└── README.md         # This file
```

## Prerequisites

- Node.js (v18 or higher)
- npm

## Installation

Install all dependencies from the root (npm workspaces handles everything automatically):

```bash
npm install
```

This single command will:
- Install root dependencies
- Install frontend dependencies
- Install backend dependencies
- Hoist shared dependencies to the root `node_modules`
- Create workspace-specific `node_modules` only when needed

## Running the Application

### Development Mode (Concurrent)

Run both frontend and backend servers concurrently from the root:

```bash
npm run dev
```

This will start:
- **Frontend** on `http://localhost:5173`
- **Backend** on `http://localhost:3001`

### Development Mode (Individual)

Start servers individually:

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Production Mode

Build and run for production:

```bash
# Build both
npm run build

# Or build individually
npm run build:frontend
npm run build:backend
```

Then start the backend:
```bash
cd backend
npm start
```

## API Endpoints

- `GET /api/hello` - Returns a hello world message

## Technology Stack

### Frontend
- React 18
- TypeScript
- TailwindCSS
- Vite

### Backend
- Node.js
- Express
- TypeScript
- ts-node (development)

## Monorepo Features

- **Workspaces**: NPM workspaces for automatic dependency management
- **Concurrent Development**: Run both servers with a single command
- **Shared Scripts**: Build and run commands from the root
- **TypeScript**: Full TypeScript support in both frontend and backend
- **Dependency Hoisting**: Shared dependencies are automatically hoisted to reduce duplication

## Development

The project uses a monorepo structure with npm workspaces. Hot reloading is enabled for both frontend and backend development servers when running `npm run dev`.