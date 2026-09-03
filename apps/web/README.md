# ShiftFlow Web

Next.js app for the ShiftFlow employee scheduling UI.

## Setup

Copy the example environment file and fill in Clerk values:

```bash
cp apps/web/.env.example apps/web/.env.local
```

By default, the browser talks to `/graphql`. Next.js rewrites that same-origin path to the API service at `GRAPHQL_API_URL`, which defaults to `http://localhost:4000`.

## Development

From the repository root:

```bash
pnpm dev
```

The web app runs on [http://localhost:3000](http://localhost:3000). The API must be running on port `4000` unless `GRAPHQL_API_URL` is changed.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
```
