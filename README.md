# Pitch Safe - Pitcher Injury Prevention & Performance Analytics

**Empowering baseball pitchers and coaches with data-driven insights to prevent injuries and optimize performance.**

---

## Mission Statement

Pitch Safe is a comprehensive web application designed to help baseball coaches and trainers monitor pitcher health, predict injury risks, and make data-informed decisions about player workload management. By combining real-time performance tracking with machine learning analysis, we aim to reduce pitcher injuries and extend athletic careers.

---

## Problem Statement

Pitcher injuries, particularly to the elbow and shoulder, have reached epidemic proportions in baseball at all levels. Studies show:

- **~25% of MLB pitchers** undergo Tommy John surgery during their careers
- **Youth pitcher injuries** have increased by over 500% in the past 20 years
- **Overuse and fatigue** are leading contributors to preventable injuries
- **Traditional monitoring methods** are reactive rather than proactive

### Current Challenges:

1. **Lack of Real-Time Data** — Coaches track performance manually with spreadsheets and paper
2. **No Early Warning System** — Injuries are noticed only after damage occurs
3. **Inconsistent Monitoring** — No standardized way to track pitcher workload across teams
4. **Limited Analysis Tools** — Difficulty identifying patterns and trends in performance data

---

## Our Solution

Pitch Safe provides:

**Injury Risk Prediction** — ML algorithms analyze patterns to flag potential injury risks  
**Historical Analytics** — Visualize trends over time to make informed decisions  
**Coach Dashboard** — Manage entire rosters with personalized player insights  
**Data-Driven Alerts** — Get notified when players show concerning patterns

---

## Technology Stack

### Backend

- **Node.js & Express** — RESTful API server
- **PostgreSQL** — Relational database (via Supabase)
- **Clean Architecture** — Maintainable, testable, scalable code
- **Jest** — Comprehensive testing framework (300+ tests)
- **Python/scikit-learn** — Machine learning injury prediction models

### Frontend

- **React** — Modern, component-based UI
- **Vite** — Fast development build tool
- **Recharts** — Data visualization and analytics
- **Clean Architecture** — Separation of concerns, dependency injection

### Infrastructure

- **Supabase** — Cloud PostgreSQL hosting
- **GitHub Actions** — CI/CD pipeline
- **Local PostgreSQL** — Isolated testing environment

---

## Prerequisites

Download

- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)
- [PostgreSQL 14+](https://www.postgresql.org/) (for local testing)
- [Supabase Account](https://supabase.com) (credentials from team lead)

---

## Quick Start Guide

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Pitch Safe
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment Variables

#### Backend Production (`.env`)

Create `backend/.env`:

```bash
# Supabase Database (Production/Development)
DB_USER=postgres
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_NAME=postgres
DB_PASSWORD=your_supabase_password
DB_PORT=5432

# ML Dataset Path
CSV_DATASET_PATH= # that is in the local. (here we are using yankees)

# Server Configuration
PORT=5001
NODE_ENV=development
```

#### Testing Environment (`.env.test`)

Create `backend/.env.test`:

```bash
# Local PostgreSQL (Testing Only)
DB_USER=postgres
DB_HOST=localhost
DB_NAME=pitchsafe_test_db
DB_PASSWORD=
DB_PORT=5432
```

### 4. Start the Application

```bash
# Terminal 1 - Start Backend
cd backend/ml_injury/training_pipeline
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

**Access the application:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

---

## Testing Setup

Pitch Safe uses **Jest** to ensure code quality and prevent regressions.

### One-Time Setup

#### Step 1: Install PostgreSQL

**macOS:**

```bash
brew install postgresql@14
brew services start postgresql@14
echo 'export PATH="/usr/local/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

#### Step 2: Create PostgreSQL User

```bash
psql postgres
CREATE ROLE postgres WITH LOGIN SUPERUSER CREATEDB CREATEROLE;
\q
```

#### Step 3: Create Test Database

```bash
createdb -U postgres pitchsafe_test_db
```

#### Step 4: Initialize Test Data

```bash
cd backend
npm run test:setup
```

#### Step 5: Run Tests

```bash
npm test
```

---
