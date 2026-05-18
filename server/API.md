# Smart Leads Server API

Base URL: `/api`

Authentication: JWT in `Authorization: Bearer <token>` header

## Auth

### POST /api/auth/register
Request body (JSON):
- `name` (string, required)
- `email` (string, required)
- `password` (string, required, min 6)
- `role` (optional, 'admin'|'sales')

Response: `201` { success: true, data: { id, email } }

### POST /api/auth/login
Request body:
- `email` (string)
- `password` (string)

Response: `200` { success: true, data: { token } }

### GET /api/auth/me
Headers: `Authorization: Bearer <token>`
Response: current user object (without password)


## Leads
All `/api/leads` endpoints require authentication.

### GET /api/leads
Query params:
- `page` (number, default 1)
- `search` (string)
- `status` (New|Contacted|Qualified|Lost)
- `source` (Website|Instagram|Referral)
- `sort` ('latest' or 'oldest') default latest

Response: `200` { success: true, data: [leads], meta: { total, page, limit, pages } }

### GET /api/leads/:id
Response: `200` lead object

### POST /api/leads
Body: `{ name, email, status?, source? }` (name and email required)
Response: `201` created lead

### PUT /api/leads/:id
Body: any of `name`, `email`, `status`, `source`
Response: `200` updated lead

### DELETE /api/leads/:id
- Requires role `admin` (403 for sales)
- Response: `204` on success

### GET /api/leads/export
Same query params as list. Returns `text/csv` attachment with current result set.


## Errors
All error responses have shape: `{ success: false, error: <message> }` or for validation `{ success: false, errors: [...] }`.

*** End of API docs
