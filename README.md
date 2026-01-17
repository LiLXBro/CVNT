# Activity Booking API

## Features

- **Authentication**: Secure User Registration & Login (hashed passwords, JWT).
- **Admin Dashboard**: Specialized interface for Admins to Manage Activities (Add, Edit, Delete).
  - **Dynamic UI**: Distinct, high-contrast actions (Black "Add" button, Red "Delete" button).
- **Activities**: Browse available events, view details including capacity and time.
- **Bookings**: Authenticated users can book activities with real-time capacity validation.
- **Validation**: Strict enforcement against double-booking and exceeding activity booking limits.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: PostgreSQL (via Prisma)
- **Styling**: TailwindCSS
- **Language**: TypeScript

## Offline Mode (Local DB)

**No Database? No Problem.**
This project includes a built-in **Mock Database** that allows you to run the full application without setting up PostgreSQL or Supabase.

### How it works:
1.  The app checks for `DATABASE_URL` in your `.env` file.
2.  If it's missing, it automatically switches to a **Local JSON Database**.
3.  A file named `local-db.json` will be created in the root directory.
4.  All Users, Activities, and Bookings are saved to this file.

### Technical Implementation:
- **`src/lib/prisma.ts`**: Contains conditional logic to export either the real `PrismaClient` or a `MockDB` instance.
- **`src/lib/mock-db.ts`**: A custom class that replicates Prisma's `findUnique`, `create`, `findMany`, etc., methods but reads/writes to a JSON file using Node.js `fs`.

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <https://github.com/LiLXBro/CVNT>
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
  -d '{"name": "Rekha Amitabh", "email": "rekha@example.com", "password": "password123"}'
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
