# Docker Setup for FFXI Crawler

This document explains how to run the FFXI crawler using Docker and Docker Compose.

## Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)

## Quick Start

### Development Environment

1. **Start all services:**

   ```bash
   npm run docker:up:build
   ```

2. **Scale processing workers (e.g., 3 workers):**

   ```bash
   npm run docker:scale:processing
   ```

3. **View logs:**

   ```bash
   npm run docker:logs
   ```

4. **Stop all services:**
   ```bash
   npm run docker:down
   ```

### Production Environment

1. **Set environment variables:**

   ```bash
   cp .env.prod .env
   # Edit .env with your production values
   ```

2. **Start production services:**

   ```bash
   npm run docker:prod:up
   ```

3. **View production logs:**
   ```bash
   npm run docker:prod:logs
   ```

## Services

### Core Services

- **postgres**: PostgreSQL database for storing crawled pages
- **redis**: Redis for URL queuing and rate limiting coordination
- **discovery**: Service that parses robots.txt and populates the URL queue
- **processing**: Workers that crawl pages (scalable)

### Optional Services

- **frontend**: React frontend for monitoring (development only)
- **backend**: Express API for crawler management (development only)

## Multi-Worker Testing

To test with multiple processing workers:

```bash
# Start with 3 processing workers
docker-compose up --scale processing=3

# Or use the npm script
npm run docker:scale:processing
```

Each worker will:

- Have a unique container name (`processing_1`, `processing_2`, `processing_3`)
- Connect to the same Redis queue
- Coordinate through shared cooldowns
- Process URLs independently

## Environment Configuration

### Development (.env.docker)

- Database: `postgres:5432`
- Redis: `redis://redis:6379`
- Moderate rate limiting for testing

### Production (.env.prod)

- Configurable external services
- Conservative rate limiting
- Optimized resource limits

## Docker Commands

### Development

```bash
# Build images
npm run docker:build

# Start services
npm run docker:up

# Start with rebuild
npm run docker:up:build

# Scale processing workers
docker-compose up --scale processing=3

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### Production

```bash
# Build production images
npm run docker:prod:build

# Start in background
npm run docker:prod:up

# Stop production
npm run docker:prod:down

# View production logs
npm run docker:prod:logs
```

### Cleanup

```bash
# Clean up containers and volumes
npm run docker:clean
```

## Health Checks

All services include health checks:

- **postgres**: `pg_isready`
- **redis**: `redis-cli ping`
- **applications**: Node.js process health

## Resource Limits

### Production Configuration

- **postgres**: 1 CPU, 1GB RAM
- **redis**: 0.5 CPU, 512MB RAM
- **processing**: 1 CPU, 1GB RAM per worker
- **discovery**: 0.5 CPU, 512MB RAM

## Volumes

- **postgres_data**: PostgreSQL data persistence
- **redis_data**: Redis data persistence
- **Development**: Source code mounted for hot reload

## Networking

- **Development**: `ffxi-crawler` network
- **Production**: `ffxi-crawler-prod` network
- **Service Discovery**: Automatic container name resolution

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 5432, 6379, 3000, 5173 are available
2. **Memory issues**: Increase Docker memory limit if containers crash
3. **Build failures**: Run `npm run docker:clean` and retry

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f processing

# Production logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Database Access

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d ffxi_dev

# Connect to Redis
docker-compose exec redis redis-cli
```

### Debugging Workers

```bash
# See worker coordination
docker-compose logs -f processing

# Check Redis queue
docker-compose exec redis redis-cli
> SCARD bg-wiki-urls
> SRANDMEMBER bg-wiki-urls 5
```

## Performance Monitoring

### Database Stats

Connect to PostgreSQL and run:

```sql
SELECT * FROM get_crawler_stats();
```

### Redis Monitoring

```bash
docker-compose exec redis redis-cli INFO stats
```

### Container Resources

```bash
docker stats
```

This Docker setup provides a complete, scalable environment for developing and deploying the FFXI crawler with proper service coordination and resource management.
