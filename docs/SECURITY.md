# Security

## Threat Model
- Unauthorized access via weak auth.
- SQL injection via ORM.
- XSS via input sanitization.
- AI content via human declaration + heuristics.

## Mitigations
- JWT with refresh, Argon2, Pydantic validation, CORS, security headers.