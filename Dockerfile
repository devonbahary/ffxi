# Multi-stage build for FFXI Crawler
FROM node:20-alpine AS base

# Install dependencies needed for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
COPY packages/sql/package*.json ./packages/sql/
COPY ingestion/discovery/package*.json ./ingestion/discovery/
COPY ingestion/processing/package*.json ./ingestion/processing/

# Install dependencies (skip prepare script to avoid husky in production)
RUN npm ci --only=production --ignore-scripts

# Development stage
FROM node:20-alpine AS development

# Install dependencies needed for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
COPY packages/sql/package*.json ./packages/sql/
COPY ingestion/discovery/package*.json ./ingestion/discovery/
COPY ingestion/processing/package*.json ./ingestion/processing/

# Install all dependencies including dev
RUN npm ci

# Copy source code
COPY . .

# Build all packages
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy production dependencies and built code
COPY --from=base /app/node_modules ./node_modules
COPY --from=development /app/packages/sql/dist ./packages/sql/dist
COPY --from=development /app/packages/sql/package.json ./packages/sql/
COPY --from=development /app/ingestion/discovery/dist ./ingestion/discovery/dist
COPY --from=development /app/ingestion/discovery/package.json ./ingestion/discovery/
COPY --from=development /app/ingestion/processing/dist ./ingestion/processing/dist
COPY --from=development /app/ingestion/processing/package.json ./ingestion/processing/

# Copy package.json for workspace configuration
COPY package.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S crawler -u 1001

# Change ownership
RUN chown -R crawler:nodejs /app
USER crawler

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Default command (can be overridden)
CMD ["node", "ingestion/processing/dist/index.js"]