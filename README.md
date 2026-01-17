# Activity Booking API

A robust Activity Booking Application built with Next.js (App Router), Prisma (PostgreSQL), and TailwindCSS. Features secure JWT authentication and a premium UI.

## Features

- **Authentication**: Secure User Registration & Login (hashed passwords, JWT).
- **Activities**: Browse, create (Admin), and view details of activities.
- **Bookings**: Book available activities, view personal booking history.
- **Validation**: Prevents double-booking and exceeding capacity.
- **UI**: Modern, responsive design with Dark Mode support.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: PostgreSQL (via Prisma)
- **Styling**: TailwindCSS
- **Language**: TypeScript

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd BackendWorks
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your PostgreSQL connection string and JWT secret:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/activity_db?schema=public"
    JWT_SECRET="your-super-secret-key"
    ```

4.  **Database Migration:**
    Push the Prisma schema to your database:
    ```bash
    npx prisma db push
    ```

5.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app.

## API Usage

### Authentication

#### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```
**Response:** `{"token": "..."}`. Use this token in the `Authorization` header for protected routes (`Bearer <token>`).

### Activities

#### List Activities
```bash
curl http://localhost:3000/api/activities
```

#### Create Activity (Admin only)
```bash
curl -X POST http://localhost:3000/api/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title": "Hiking", "description": "Mountain hike", "date": "2024-12-01T10:00:00Z", "capacity": 20}'
```

### Bookings

#### Book an Activity
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"activityId": 1}'
```

#### View My Bookings
```bash
curl -X GET http://localhost:3000/api/bookings/me \
  -H "Authorization: Bearer <TOKEN>"
```

## Folder Structure

- `src/app/api`: API Routes
- `src/components`: UI Components
- `src/context`: React Context (Auth)
- `src/lib`: Utilities (Prisma, Auth)
- `prisma`: Database Schema
