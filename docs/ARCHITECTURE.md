# Genuin Architecture

## Overview
Genuin is a FastAPI backend with Next.js frontend, PostgreSQL DB, Redis for caching/rate limiting, Celery for background tasks.

## Data Flow
User requests -> FastAPI -> DB/Redis -> Response -> Next.js renders.

## Security
JWT auth, Argon2 hashing, RBAC, input validation.

## AI Risk
Heuristics-based scoring for moderation assistance.