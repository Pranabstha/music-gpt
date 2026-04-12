# Music GPT Backend

This is a MusicGPT Backend — an AI music creation platform backend built with NestJS.
What it does in simple terms:
A user submits a prompt (e.g. "create a jazz song"), the system queues it, processes it in the background, generates an audio record, and notifies the user in real-time via WebSocket when it's done.

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
