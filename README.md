# Smart Leads Dashboard — Full Stack MERN Application

A professional lead management system built with **MERN stack** (MongoDB, Express, React, Node.js) in **TypeScript**. Features JWT authentication, role-based access control, advanced filtering, pagination, and CSV export.

## ✨ Features Implemented

### Authentication & Authorization
- JWT-based login/register with password hashing (bcrypt)
- Role-based access control (Admin / Sales)
- Protected routes and API endpoints
- Secure token storage and refresh handling
- **Success messages** after registration and login
- Form validation with error feedback

### Lead Management
- **CRUD Operations**: Create, Read, Update, Delete leads
- **Advanced Filtering**: Filter by status and source
- **Smart Search**: Debounced name/email search (client-side)
- **Sorting**: Sort by latest or oldest
- **Pagination**: 10 items per page with metadata
- **CSV Export**: Download filtered leads as CSV

### User Interface
- **Dark Mode / Light Mode**: Toggle theme with persistent storage
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Form Validation**: Client & server-side validation with error feedback
- **Loading States**: User-friendly loading indicators
- **Empty States**: Clear messaging when no data
- **Error Handling**: Comprehensive error UI and messages
- **Modal Dialogs**: Add/Edit lead modals
- **Status Badges**: Color-coded lead status indicators

### API Standards
- RESTful endpoints with proper HTTP status codes
- Centralized error handling middleware
- Request validation with express-validator
- Consistent response format: `{ success, data, meta }`
- Full API documentation (see [server/API.md](server/API.md))

## 🛠️ Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (HTTP client)
- React Router DOM (routing)

**Backend**
- Node.js + Express + TypeScript
- MongoDB + Mongoose (ODM)
- JWT + bcrypt (authentication)
- express-validator (validation)
- Helmet (security headers)

**DevOps**
- Docker & Docker Compose
- npm scripts (dev, build, start, seed)

## 📋 Project Structure

```
.
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── pages/         # Login, Register, Leads pages
│   │   ├── components/    # Reusable components (Modal, FormField, etc.)
│   │   ├── hooks/         # useAuth, useDebounce
│   │   ├── api.ts         # Axios client with auth
│   │   └── App.tsx        # Routing
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
├── server/                 # Express backend (TypeScript)
│   ├── src/
│   │   ├── routes/        # Auth, Leads routes
│   │   ├── models/        # User, Lead schemas
│   │   ├── middleware/    # Auth, roles, error handling
│   │   ├── utils/         # Response helpers
│   │   ├── index.ts       # Server entrypoint
│   │   ├── app.ts         # Express app setup
│   │   └── seed.ts        # Database seeding
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── API.md
│
├── docker-compose.yml      # Multi-container setup
├── Dockerfile.server       # Server image
├── Dockerfile.client       # Client image
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Docker
- MongoDB (local or Atlas URI)

### Option 1: Local Development

**Server Setup**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI (default: mongodb://localhost:27017/smart-leads)
npm run dev
# Server runs on http://localhost:5000
```

**Client Setup**
```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

**Seed Admin User** (in new terminal)
```bash
cd server
npm run seed
# Creates admin user: admin@example.com / Password123
```

### Option 2: Docker Compose

```bash
docker-compose up --build
# Starts Mongo (27017), Server (5000), Client (5173)
```

Visit **http://localhost:5173**

Default credentials:
- Email: `admin@example.com`
- Password: `Password123`

## 📖 API Documentation

All endpoints require Bearer token auth (except `/auth/register` and `/auth/login`).

### Authentication

**POST /api/auth/register**
```json
{ "name": "John", "email": "john@ex.com", "password": "secret", "role": "sales" }
```

**POST /api/auth/login**
```json
{ "email": "admin@ex.com", "password": "Password123" }
// Returns: { success: true, data: { token } }
```

**GET /api/auth/me**
Returns current user profile (requires token)

### Leads

**GET /api/leads**
Query params: `page`, `search`, `status`, `source`, `sort` (latest|oldest)
Returns paginated leads with metadata

**POST /api/leads**
Create lead: `{ name, email, status?, source? }`

**PUT /api/leads/:id**
Update lead (partial update supported)

**DELETE /api/leads/:id**
Delete lead (admin only — returns 403 for sales role)

**GET /api/leads/export**
Download CSV with current filters applied

Full API docs: [server/API.md](server/API.md)

## 🔐 Role-Based Access

| Action | Admin | Sales |
|--------|-------|-------|
| View Leads | ✓ | ✓ |
| Create Lead | ✓ | ✓ |
| Edit Lead | ✓ | ✓ |
| Delete Lead | ✓ | ✗ |
| Export CSV | ✓ | ✓ |

## 🧪 Testing

### Manual Testing

1. **Register** a new user at `/register`
2. **Login** with credentials at `/login`
3. **Add Leads** using the "+ Add Lead" button
4. **Filter/Search** using dashboard controls
5. **Export** leads as CSV
6. **Edit** leads (all roles)
7. **Delete** leads (admin only)

### Sample Test Leads

Use the form to create test leads with various statuses and sources:
- Name: `Alice`, Email: `alice@ex.com`, Status: `Qualified`, Source: `Instagram`
- Name: `Bob`, Email: `bob@ex.com`, Status: `New`, Source: `Website`
- Name: `Charlie`, Email: `charlie@ex.com`, Status: `Lost`, Source: `Referral`

## 📦 Build & Deployment

### Build

**Client**
```bash
cd client
npm run build
# Output: dist/
```

**Server**
```bash
cd server
npm run build
# Output: dist/
```

### Docker Build

```bash
docker build -f Dockerfile.server -t smart-leads-server:latest .
docker build -f Dockerfile.client -t smart-leads-client:latest .
```

### Deployment Options

**Heroku / Railway / Render**
```bash
# Deploy server to Heroku
heroku login
heroku create <app-name>
git push heroku main

# Set environment variables
heroku config:set MONGO_URI=<your-mongo-uri>
heroku config:set JWT_SECRET=<strong-secret>
```

**Vercel (Frontend)**
```bash
cd client
npm install -g vercel
vercel --env VITE_API_BASE=https://your-api.com/api
```

**Docker Hub / AWS ECR**
```bash
docker tag smart-leads-server:latest <registry>/smart-leads-server:latest
docker push <registry>/smart-leads-server:latest
```

## ⚙️ Environment Variables

### Server `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_secret_key_here
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=Password123
```

### Client `.env` (optional)
```
VITE_API_BASE=http://localhost:5000/api
```

## 🎨 UI Features

- **Responsive Grid**: Adapts to mobile, tablet, desktop
- **Color-Coded Badges**: Status shown with distinct colors
- **Debounced Search**: Optimized API calls (400ms delay)
- **Modal Dialogs**: Clean add/edit flows
- **Disabled States**: Buttons disabled during loading
- **Success/Error Messages**: User feedback on all actions
- **Empty State**: Message when no leads found
- **Loading Spinner**: Visible during data fetch

## 🔍 Code Quality

✅ **TypeScript**: Full strict mode with interfaces for all models
✅ **Modular Architecture**: Separated concerns (routes, models, middleware, components)
✅ **Reusable Components**: FormField, Modal, Header
✅ **Error Handling**: Centralized middleware + try-catch
✅ **Validation**: Client & server-side with clear feedback
✅ **Security**: Hashed passwords, JWT auth, CORS, Helmet headers
✅ **Scalability**: Indexed MongoDB queries, pagination, efficient filtering

## 📝 Git Workflow

Recommended commit messages:
```
feat: add lead deletion for admin users
fix: debounce search function delay
docs: update API documentation
style: improve responsive design
refactor: extract modal component
test: add unit tests for auth
```

## 🤝 Contributing

1. Clone the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and test locally
4. Commit with clear messages
5. Push and create a pull request

## 📞 Support

For issues or questions:
1. Check [server/API.md](server/API.md) for API reference
2. Review error messages in browser console
3. Check server logs: `npm run dev` output
4. Verify MongoDB connection: `mongosh`

## ✅ Acceptance Criteria Checklist

- [x] **Authentication**: Register, login, JWT tokens, protected endpoints
- [x] **Leads CRUD**: Create, read, update, delete with full validation
- [x] **Filtering**: Status, source, multiple filters combined
- [x] **Search**: Debounced name/email search
- [x] **Sorting**: Latest / Oldest
- [x] **Pagination**: 10 per page with metadata
- [x] **CSV Export**: Download with current filters
- [x] **Role-Based**: Admin delete, sales read-only restrictions
- [x] **TypeScript**: Full strict mode, no `any`
- [x] **Validation**: Client & server-side with error feedback
- [x] **UI States**: Loading, empty, error states
- [x] **Docker**: docker-compose setup
- [x] **Documentation**: README, API docs, setup instructions

---

**Author**: Assignment Submission  
**Date**: May 2026  
**License**: MIT

