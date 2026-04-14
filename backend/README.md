# Music GPT Backend

This is a MusicGPT Backend — an AI music creation platform backend built with NestJS.
What it does in simple terms:
A user submits a prompt, the system queues it, processes it in the background, generates an audio record, and notifies the user in real-time via WebSocket when it's completed.

## Architecture Summary

Clean layered architecture with strict boundaries:

```
Controller → Application (Use Cases) → Domain (Entities/Interfaces) → Infrastructure (DB, Redis, Queue)
```

- **NestJS** — framework & dependency injection
- **Prisma** — ORM for PostgreSQL
- **BullMQ** — job queue for background prompt processing
- **Redis** — rate limiting + response caching
- **WebSockets** (Socket.IO) — real-time user notifications
- **NestJS Schedule** — cron jobs for polling PENDING prompts

## JWT Implementation

This JWT flow uses **Refresh Token Rotation with Hashed Database Revocation**, an approach that combines stateless performance and stateful management. Upon login, the server generates a short-lived Access Token for routine requests and a long-lived Refresh Token, which is hashed and kept in the database to prevent plain-text exposure in the event of a data breach. When a client requests a new pair of tokens using the `/auth/refresh` endpoint, the server validates the provided token against the stored hash and instantly rotates it by delivering a new pair and updating the database, ensuring that each refresh token is effectively single-use. Authentication ends at the `/auth/logout` endpoint, which clears the hashed token from the database, immediately invalidating the session and prevents any further token rotation until the user re-authenticates.

---

## Subscription Perks

| Feature            | FREE       | PAID        |
| ------------------ | ---------- | ----------- |
| Rate limit         | 20 req/min | 100 req/min |
| Job queue priority | Low        | High        |
| Prompt processing  | Standard   | Priority    |

Endpoints:

- `POST /subscription/subscribe` — upgrade to PAID
- `POST /subscription/cancel` — revert to FREE

---

## Rate Limiting

Redis-backed, enforced on all authenticated routes.

- **FREE**: 20 requests/minute
- **PAID**: 100 requests/minute

A sliding window counter is stored in Redis per user. On each request, the count is incremented and checked against the tier limit. Exceeding the limit returns `429 Too Many Requests`.

---

## Job Queue & Cron Flow

```
POST /prompts  →  status: PENDING
      ↓
Cron (every 10s) scans PENDING prompts
      ↓
Enqueues into BullMQ (PAID = high priority, FREE = low priority)
      ↓
Worker picks up job
  → status: PROCESSING
  → simulates generation delay
  → creates Audio record
  → status: COMPLETED
      ↓
WebSocket event emitted to user
```

- **Cron**: runs every 10 seconds via `@nestjs/schedule`
- **Queue**: BullMQ with two priority levels
- **Worker**: separate process/container consuming the queue

---

## Cache Strategy

- **What's cached**: `GET /users`, `GET /users/:id`, `GET /audio`, `GET /audio/:id`
- **TTL**: 60 seconds
- **Invalidation**: Cache key is deleted automatically on `PUT /users/:id` or `PUT /audio/:id`
- **Backend**: Redis, keyed by route + params (e.g., `audio:uuid`)

---

## Unified Search Ranking

`GET /search?q=&page=&limit=`

Searches across **Users** (email, display_name) and **Audio** (title).

Scoring logic:

1. **Exact match** → highest score
2. **Starts with query** → medium score
3. **Contains query** → lowest score

Results are sorted by score descending within each category. Cursor-based pagination is applied independently to `users` and `audio`.

---

## WebSockets

Connect to: `ws://localhost:8080/?userId=`

**Event emitted by server on prompt completion:**

```json
{
  "event": "prompt.completed",
  "data": {
    "promptId": "uuid",
    "audioId": "uuid",
    "audioUrl": "https://...",
    "status": "COMPLETED"
  }
}
```

Clients should authenticate and join their user-specific room upon connection. The worker emits directly to the user's room ID on job completion.

---

## Prerequisites

- Docker & Docker Compose

---

## Setup

1. Clone the repository

```bash
git clone <repo-url>
cd backend
```

2. Create a `.env` file in the root

```
DATABASE_URL='DB_URL'
REDIS_URL='REDIS_URL'
PORT='PORT'
JWT_SECRET='JWT_SECRET'
JWT_REFRESH_SECRET='JWT_REFRESH_SECRET'
REDIS_HOST='REDIS_HOST'
REDIS_PORT='REDIS_PORT'
```

---

## Build & Run (Docker)

```bash
docker compose up --build
```

Starts: API, Worker, PostgreSQL, Redis.

API runs at: `http://localhost:8080`  
Swagger docs at: `http://localhost:8080/api/v1`  
WebSocket at: `ws://localhost:8080`

---

## Run Locally (without Docker)

1. Ensure PostgreSQL and Redis are running locally
2. Install dependencies

```bash
npm install
```

3. Run Prisma migrations

```bash
npx prisma migrate dev
```

4. Start the API

```bash
npm run start:dev
```

5. Start the Worker (separate terminal)

```bash
npm run start:worker
```

---

## Stop

```bash
docker compose down
```

## Reset

```bash
docker compose down -v
docker compose up --build
```
