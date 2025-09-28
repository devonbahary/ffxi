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
# Build both frontend and backend
npm run build
```

Then start the backend (which will serve the frontend):

```bash
cd backend
npm start
```

The application will be available at `http://localhost:3001` with both the React frontend and API endpoints served from the same port.

## API Endpoints

- `GET /api/health` - Returns server health status

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

## Docker Commands

The project includes Docker support with several convenience commands available from the root:

### Basic Docker Operations

```bash
# Build all Docker images
npm run docker:build

# Start all continuous services in development mode (detached)
npm run docker:up

# Build and start all services in detached mode (rebuild if needed)
npm run docker:up:build

# Stop all services
npm run docker:down

# View logs from all services
npm run docker:logs

# Clean up (stop services, remove volumes, and prune system)
npm run docker:clean
```

### URL Discovery Service

The discovery service is a one-time job that populates the Redis queue with URLs from BG-Wiki's sitemap. It runs separately from the main services:

```bash
# Run discovery service once (development)
npm run docker:discovery

# Run discovery service once (production)
npm run docker:discovery:prod
```

**Workflow:**

1. First, start the main services: `npm run docker:up`
2. Then, populate the URL queue: `npm run docker:discovery`
3. Repeat step 2 whenever you want to refresh the URL queue

### Scaling Services

```bash
# Scale processing workers to 3 instances
npm run docker:scale:processing
```

**Note:** To change the number of workers, edit the `docker:scale:processing` script in `package.json` and modify the number after `processing=`.

### Production Docker Commands

```bash
# Build production images
npm run docker:prod:build

# Start production services (detached)
npm run docker:prod:up

# Stop production services
npm run docker:prod:down

# View production logs
npm run docker:prod:logs

# Run discovery service once (production)
npm run docker:discovery:prod
```

### Docker Services

The main Docker Compose setup includes:

- **postgres** - PostgreSQL database (port 5432)
- **redis** - Redis for queuing (port 6379)
- **redis-commander** - Redis GUI management (port 8081)
- **pgadmin** - Database management UI (port 8080)
- **processing** - Page processing workers (scalable)
- **frontend** - React development server (port 5173)
- **backend** - Express API server (port 3000)

The discovery service runs separately as a one-time job to populate the URL queue.

### Redis Queue Management

You can monitor and manage your Redis queues using the Redis Commander web interface:

**Access Redis Commander:** http://localhost:8081

**Key Information:**

- **Queue name**: `bg-wiki-urls` (Redis Set)
- **View queue size**: Look for the `bg-wiki-urls` key and check its cardinality
- **Inspect URLs**: Click on the key to see individual URLs in the queue
- **Monitor in real-time**: Refresh to see queue changes as discovery and processing services run

**Queue Operations:**

- **SADD** - Discovery service adds URLs to the set
- **SPOP** - Processing workers pop URLs from the set
- **SCARD** - Get current queue size
- **SRANDMEMBER** - Peek at random URLs without removing them

### Environment Variables

Services are configured with environment variables for database connections, Redis URLs, and other settings. Check `docker-compose.yml` for the complete configuration.

## Development

The project uses a monorepo structure with npm workspaces. Hot reloading is enabled for both frontend and backend development servers when running `npm run dev`.
