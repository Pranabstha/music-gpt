# Music GPT Backend

This is a MusicGPT Backend — an AI music creation platform backend built with NestJS.
What it does in simple terms:
A user submits a prompt (e.g. "create a jazz song"), the system queues it, processes it in the background, generates an audio record, and notifies the user in real-time via WebSocket when it's done.

## JWT Implementation

This JWT flow uses Refresh Token Rotation with Hashed Database Revocation, an approach that combines stateless performance and stateful management. Upon login, the server generates a short-lived Access Token for routine requests and a long-lived Refresh Token, which is hashed and kept in the database to prevent plain-text exposure in the event of a data breach. When a client requests a new pair of tokens using the /auth/refresh endpoint, the server validates the provided token against the stored hash and instantly rotates it by delivering a new pair and updating the database, ensuring that each refresh token is effectively single-use.Authentication ends at the /auth/logout endpoint, which clears the hashed token from the database, immediately invalidating the session and prevents any further token rotation until the user re-authenticates.

## Prerequisites

- Docker & Docker Compose

## Setup

1. Clone the repository

```bash
git clone <repo-url>
cd backend
```

2. Create a `.env` file in the root

```
DATABASE_URL= 'DB_URL'
REDIS_URL='REDIS_URL'
PORT='PORT'
JWT_SECRET='JWT_SECRET'
JWT_REFRESH_SECRET='JWT_REFRESH_SECRET'
REDIS_HOST='REDIS_HOST'
REDIS_PORT='REDIS_PORT'

```

## Build & Run

```bash
docker compose up --build
```

API runs at: `http://localhost:8080`  
Swagger docs at: `http://localhost:8080/api/v1`

## Stop

```bash
docker compose down
```

## Reset (clear database)

```bash
docker compose down -v
docker compose up --build
```
