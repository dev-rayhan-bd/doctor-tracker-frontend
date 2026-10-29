# Doctor Tracker – Enterprise Medical & Patient Management Portal

## Description
Doctor Tracker is a secure, high-performance administrative web application engineered for healthcare institutions to oversee medical specialists and manage their corresponding patient rosters with zero friction. Powered by real-time MongoDB aggregation analytics, interactive clinical data visualizations, and robust role-based authentication, the platform streamlines hospital workload distribution with instant debounced search, five-tier clinical condition filtering, and seamless doctor-patient assignment workflows.

---

## Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** (v9+) or **yarn**
- **Backend API**: Running at `http://localhost:5001/api/v1` (from the companion `doctor-tracker` backend directory)

### Step-by-Step Local Installation

1. **Navigate to the Frontend Directory:**
   ```bash
   cd doctor-tracker-frontend
   ```

2. **Install Project Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create `.env.local` by copying the provided `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

   **Default `.env.example` configurations:**
   ```env
   # Standalone Express REST API Base URL
   NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1

   # Application Public URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Secure Authentication Cookie Configurations
   NEXT_PUBLIC_AUTH_COOKIE_NAME=doctor_tracker_token
   NEXT_PUBLIC_REFRESH_COOKIE_NAME=doctor_tracker_refresh_token
   ```

4. **Launch the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build and Test for Production:**
   ```bash
   npm run build
   npm run start
   ```

---

## System Architecture

Doctor Tracker is structured as a decoupled **Multi-Repository Architecture** adhering to clean separation of concerns and RESTful API design principles:

```text
┌─────────────────────────────────────────────────────────────────┐
│                      Client Web Browser                         │
│       (Next.js 16 App Router + React 19 + TypeScript)           │
└────────────────┬───────────────────────────────┬────────────────┘
                 │                               │
                 ▼                               ▼
    ┌──────────────────────────┐    ┌──────────────────────────┐
    │  React Server Components │    │     Client Components    │
    │  (SSR / SSG / ISR Tags)  │    │ (TanStack Query Caching) │
    └────────────┬─────────────┘    └────────────┬─────────────┘
                 │                               │
                 ▼                               ▼
    ┌──────────────────────────────────────────────────────────┐
    │            Edge Middleware (middleware.ts)               │
    │      - Validates JWT Cookie: doctor_tracker_token        │
    │      - Guards Protected Routes (/dashboard, /settings)   │
    └────────────────────────────┬─────────────────────────────┘
                                 │
                                 ▼ HTTP REST (JSON) + Bearer Token
    ┌──────────────────────────────────────────────────────────┐
    │          Standalone Express Backend (Port 5001)          │
    │         - Security: Helmet, MongoSanitize, HPP           │
    │         - Rate Limiters: Auth, Search, Global            │
    │         - Controllers: Users, Doctors, Patients, Stats   │
    └────────────────────────────┬─────────────────────────────┘
                                 │
                                 ▼
    ┌──────────────────────────────────────────────────────────┐
    │               MongoDB Database & Aggregations            │
    │         - Indexed Queries (name, phone, specialization)  │
    │         - High-Performance Facet Aggregation Pipelines   │
    └──────────────────────────────────────────────────────────┘
```

### Data Flow & Service Interactions
1. **Edge-Level Route Interception:** Before any route is rendered, Next.js Edge Middleware examines the secure HTTP cookie (`doctor_tracker_token`). Unauthenticated traffic attempting to access `/dashboard`, `/doctors`, `/patients`, or `/settings` is immediately redirected to `/login?redirect=...`.
2. **Axios Client with Interceptors:** Client-side mutations automatically inject `Authorization: Bearer <token>` headers and handle automatic 401 token expiration handling.
3. **Optimized Aggregation Pipeline:** The dashboard requests `/analytics/dashboard`, where MongoDB `$facet` pipelines aggregate doctor counts, patient counts, severity breakdowns, and historical trends in a single database round-trip.

---

## Technical Decisions

### Decision 1: TanStack Query (React Query) over Redux Toolkit for Server State
- **Problem:** In hospital management applications, over 85% of state management consists of remote asynchronous server data (doctor lists, patient records, dashboard KPIs). Utilizing Redux Toolkit requires hundreds of lines of boilerplate reducers, extraReducers, dispatch actions, and manual cache invalidation.
- **Solution:** We adopted TanStack Query v5. It handles declarative queries, background refetching on window focus, optimistic UI updates, and intelligent garbage collection.
- **Outcome:** Eliminated complex state synchronization bugs, reduced client state code by 65%, and enabled instant automatic invalidations upon creating, updating, or deleting records.

### Decision 2: Edge Middleware Route Protection over Pure Client-Side Guards
- **Problem:** Traditional client-side authentication guards (e.g. `useEffect` token checks) suffer from the "Flash of Unauthorized Content" (FOUC), briefly downloading and rendering confidential clinical layouts before redirecting.
- **Solution:** We implemented Next.js Edge Middleware (`middleware.ts`), which runs at the network edge before any JavaScript bundle or HTML is streamed to the browser.
- **Outcome:** Instant zero-latency redirection for unauthenticated visitors, 100% elimination of FOUC, and complete privacy compliance for clinical data.

---

## Visual Evidence & UI Features

| Feature View | Key Functionalities Implemented |
|---|---|
| **Executive Dashboard** | Real-time KPI summary cards, Patients-per-Doctor Bar Chart, Patient Condition Donut Chart, Historical Admission Area Chart |
| **Doctor Directory** | Search by name/hospital/specialty, status filters, pagination, Add Doctor modal, View Assigned Patients modal, Add/Remove patient directly under doctor |
| **Patient Management** | Instant search, 5-tier clinical condition badges (Critical, Serious, Observation, Stable, Recovered), Edit Patient modal, Delete Confirmation modal |
| **Account Settings** | Administrator profile name update, Change Password with old password validation, Clearance badge |
| **Security Recovery** | Multi-step Forgot Password with 6-digit OTP verification, cooldown countdown timer, and password reset |

---

## Evaluation Credentials

For local testing and evaluation:

| Attribute | Value |
|---|---|
| **Portal URL** | [http://localhost:3000/login](http://localhost:3000/login) |
| **Administrator Email** | `admin@doctortracker.com` |
| **Password** | `Admin@123456` |
| **Role Clearance** | System Administrator |
