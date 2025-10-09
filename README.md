# 🧠 SafePitch — Supabase Local Setup Guide

This guide explains how to set up and run the SafePitch project locally using **Supabase** and **Node.js**.

---

## 🛠️ Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/en/download/) (v18+ recommended)  
- [Git](https://git-scm.com/downloads)
- [Supabase Account](https://supabase.com) (access to the shared project)

---

## 📦 Installation Steps

### 1. Clone the Repository

```bash
git clone <repo-link>
cd <repo-folder>
```

For example:
```bash
git clone https://github.com/your-org/safe-pitch.git
cd safe-pitch
```

---

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

---

### 3. Environment Variables

Copy the `.env.sample` file and rename it to `.env` in both backend folder:

```bash
cp .env.sample .env
```

Then fill in the values with the correct Supabase credentials (provided by the team lead or found in the Supabase Dashboard → Project Settings → API).

---

### 4. Running the Project Locally

#### Start the Backend Server
```bash
cd backend
npm run dev
```
Server should start at:
```
http://localhost:5001
```

#### Start the Frontend
```bash
cd ../frontend
npm run dev
```
Then open the URL shown in your terminal (usually `http://localhost:5173`).

---


## 🧠 Troubleshooting

| Issue | Possible Fix |
|-------|---------------|
| `Supabase URL not found` | Ensure `.env` file has the correct `SUPABASE_URL` |
| `Invalid API Key` | Check that you used the correct anon or service key |
| `Port already in use` | Change port in `server.js` (e.g., to 5001) |

