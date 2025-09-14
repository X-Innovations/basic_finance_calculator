# Finance Calculator UI

A modern web application for basic financial calculations built with Vue 3, TypeScript, and TailwindCSS.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Setup

1. Clone the repository
```bash
git clone [repository-url]
cd finance-calculator-ui
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```
Edit the `.env` file as needed.

4. Start development server
```bash
npm run dev
```

The UI will be available at `http://localhost:5173` by default.

## Project Structure

```
finance-calculator-ui/
├── src/                # Source code
│   ├── assets/        # Static assets
│   ├── components/    # Vue components
│   ├── stores/        # Pinia stores
│   ├── views/         # View components
│   └── App.vue        # Root component
├── public/            # Public static assets
└── vite.config.ts     # Vite configuration
```

## Tech Stack

- Vue 3 - Frontend framework
- TypeScript - Type safety
- Pinia - State management
- TailwindCSS - Styling
- Vite - Build tool and dev server
- Axios - HTTP client

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint and fix files

## Architecture

This application follows the Vue 3 Composition API pattern with TypeScript for type safety. State management is handled through Pinia stores, and the UI is styled using TailwindCSS utility classes.

Key architectural decisions:
- Component-based architecture
- Type-safe development with TypeScript
- Centralized state management with Pinia
- HTTP requests handled through Axios
- Utility-first CSS with TailwindCSS
- Standardized formatting with Prettier
