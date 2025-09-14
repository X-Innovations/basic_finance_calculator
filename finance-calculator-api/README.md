# Finance Calculator API

A REST API service for quote generation and persistence.

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn

## Setup Instructions

1. Clone the repository
```bash
git clone [repository-url]
cd finance-calculator-api
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration.

4. Start development server
```bash
npm run dev
```

The API will be available at `http://localhost:3000` by default.

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint and fix issues

## Project Architecture

### Tech Stack
- Node.js with Express
- TypeScript
- LowDB for data storage
- CORS enabled
- Environment configuration with dotenv

### Project Structure
```
src/
  ├── server.ts       # Entry point
  ├── routes/         # API route definitions
  ├── controllers/    # Request handlers
  ├── models/         # Data models
  └── services/       # Business logic
```
