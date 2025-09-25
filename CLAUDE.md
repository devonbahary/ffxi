# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Status

This is a full-stack FFXI (Final Fantasy XI) project with multiple packages including frontend, backend, ingestion services, and shared SQL utilities.

## Development Workflow

Code quality is handled automatically by Husky pre-commit hooks that run `lint-staged`, which will:

- Fix ESLint issues automatically
- Format code with Prettier
- Only process staged files for efficiency

No manual intervention needed - just commit your changes and the hooks handle the rest.

## Common Commands

### Code Quality (optional/on-demand)

- `npm run lint` - check for lint issues across all workspaces
- `npm run lint:fix` - automatically fix lint issues across all workspaces
- `npm run format` - format all files with Prettier

### Development

- `npm run dev` - start development server with hot reload
- `npm run dev:once` - run once without hot reload
- `npm run build` - TypeScript compilation
- `npm run start` - run compiled JavaScript

### Testing

- Testing commands will be documented as they're established

## Architecture Notes

- **Frontend:** React application
- **Backend:** Express.js API server
- **Ingestion Services:**
  - Discovery service (sitemap parsing)
  - Processing service (content extraction)
- **Shared Packages:** SQL utilities with TypeORM

## Important Reminders

- Follow established patterns in the codebase
- Use absolute imports where configured
- Code quality is enforced automatically by pre-commit hooks
