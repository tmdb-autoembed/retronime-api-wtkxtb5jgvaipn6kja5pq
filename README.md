# Cloudflare Workers Full-Stack Chat Demo

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/dhanjeerider/9-anime-api)

A production-ready full-stack chat application built on Cloudflare Workers. Features a reactive React frontend with Shadcn UI components, a type-safe Hono backend, and Durable Objects for stateful entities like users and chat boards with persistent messages.

## Features

- **Serverless Backend**: Hono-powered API with CORS, logging, and error handling.
- **Durable Objects**: Per-user and per-chat storage with automatic indexing for listings.
- **Real-time Chat**: Send and list messages in chat boards with timestamped persistence.
- **Modern UI**: Responsive design with Tailwind CSS, Shadcn UI, dark mode, sidebar layout, and animations.
- **Type Safety**: Shared types between frontend and worker; TanStack Query for data fetching.
- **Developer Experience**: Hot reload, TypeScript, ESLint, error reporting, and seamless deployment.
- **SPA Routing**: React Router with error boundaries.
- **Pagination**: Cursor-based listing for users and chats.

## Tech Stack

- **Frontend**: React 18, Vite, React Router, TanStack Query, Shadcn UI, Tailwind CSS, Lucide Icons, Sonner (toasts), Framer Motion.
- **Backend**: Cloudflare Workers, Hono, Durable Objects (SQLite-backed).
- **Data**: Type-safe entities (Users, ChatBoards) with indexes.
- **Tools**: Bun (package manager), TypeScript 5, ESLint, Wrangler.

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended package manager)
- [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install/)
- Node.js 18+ (for type generation)

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   bun install
   ```
3. Generate Worker types (if needed):
   ```bash
   bun run cf-typegen
   ```

### Development

Start the development server with hot reload:
```bash
bun dev
```

The app will be available at `http://localhost:3000` (or your configured `PORT`).

Frontend changes hot-reload automatically. Worker routes are available at `/api/*`.

### Build and Preview

Build for production:
```bash
bun run build
```

Preview the built app:
```bash
bun run preview
```

## Usage

### Frontend Pages

- **Home (`/`)**: Demo landing page (replace with your app).
- Uses `api-client.ts` for type-safe API calls.

### API Endpoints

All endpoints return `{ success: boolean; data?: T; error?: string }`.

#### Users
- `GET /api/users?cursor=&limit=`: List users (paginated).
- `POST /api/users` `{ "name": "string" }`: Create user.
- `DELETE /api/users/:id`: Delete user.
- `POST /api/users/deleteMany` `{ "ids": ["id1", "id2"] }`: Bulk delete.

#### Chats
- `GET /api/chats?cursor=&limit=`: List chats.
- `POST /api/chats` `{ "title": "string" }`: Create chat.
- `DELETE /api/chats/:id`: Delete chat.
- `POST /api/chats/deleteMany` `{ "ids": ["id1"] }`: Bulk delete.

#### Messages
- `GET /api/chats/:chatId/messages`: List messages.
- `POST /api/chats/:chatId/messages` `{ "userId": "string", "text": "string" }`: Send message.

#### Health
- `GET /api/health`: Status check.
- `POST /api/client-errors`: Error reporting (from frontend).

Test with `curl` or the built-in API client in the frontend.

## Project Structure

```
├── src/              # React frontend
│   ├── components/   # UI components (Shadcn + custom)
│   ├── hooks/        # Custom hooks (theme, mobile)
│   ├── lib/          # Utilities, API client, error reporter
│   └── pages/        # App pages
├── shared/           # Shared types
├── worker/           # Hono Worker backend
│   ├── core-utils.ts # DO entity base (DO NOT MODIFY)
│   ├── entities.ts   # Your entities (extend here)
│   └── user-routes.ts # Add custom routes here
└── ...              # Configs (Vite, Tailwind, Wrangler, TS)
```

**Key Files to Customize**:
- `src/pages/HomePage.tsx`: Your main app.
- `worker/entities.ts`: Add new entities.
- `worker/user-routes.ts`: Add API routes.
- `src/components/app-sidebar.tsx`: Customize sidebar.

## Deployment

Deploy to Cloudflare Workers with one command:
```bash
bun run deploy
```

This builds the frontend assets and deploys the Worker.

**Manual Steps** (if needed):
1. Login: `wrangler login`
2. Deploy: `wrangler deploy`
3. Custom domain: Edit `wrangler.jsonc`.

The app handles SPA routing automatically via `assets` config.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/dhanjeerider/9-anime-api)

## Local Development Workflow

- Frontend: Edit React files → hot reload.
- Backend: Edit `worker/user-routes.ts` or `entities.ts` → restart `bun dev` (or edit in dev mode).
- Data persists in preview/local via DO emulation.
- Seed data auto-loads on first request.

## Troubleshooting

- **Types missing**: Run `bun run cf-typegen`.
- **Worker routes fail**: Check `worker/user-routes.ts` imports.
- **CORS issues**: Pre-configured for `*`.
- **Dark mode**: Toggle via UI button (persists in localStorage).
- Logs: Check browser console and Worker tail logs.

## Contributing

1. Fork and clone.
2. Install with `bun install`.
3. Make changes.
4. Test locally with `bun dev`.
5. Submit PR.

## License

MIT. See [LICENSE](LICENSE) for details.