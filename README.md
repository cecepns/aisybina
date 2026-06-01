# Aisybina Export — Product Catalog

Premium Indonesian export company catalog with admin panel.

## Tech Stack

| Layer | Stack |
|-------|--------|
| Frontend | React + Vite + TailwindCSS + PWA |
| Backend | Express.js + MySQL |
| Auth | JWT |

## Project Structure

```
aisybina/
├── frontend/          # Public website + admin panel
├── backend/           # Express API (server.js)
│   └── uploads-aisybina/  # Product images
└── logo.png
```

## Setup

### 1. Database

```bash
mysql -u root -p < backend/sql/database.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit DB credentials in .env
npm install
npm run dev
```

API: **http://localhost:3001**

Default admin:
- Email: `admin@aisybinaexport.com`
- Password: `admin123`

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

- Website: **http://localhost:5173**
- Admin: **http://localhost:5173/admin**

## Features

### Public Website
- Product catalog (API-driven)
- About, Vision, Mission, Values
- Contact form → saved to database

### Admin Panel
- JWT login
- Products CRUD (modal, image upload, pagination, search)
- Categories CRUD
- Contact inquiries management
- Responsive sidebar (mobile toggle)

## API Endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/login` | — |
| GET | `/api/catalog` | — |
| GET | `/api/products?page&limit&search&category` | — |
| POST | `/api/products` | ✓ |
| GET | `/api/categories` | — |
| POST | `/api/contact/inquiry` | — |
| GET | `/api/contact/inquiries` | ✓ |

## Production Build

```bash
cd frontend && npm run build
cd backend && npm start
```
# aisybina
