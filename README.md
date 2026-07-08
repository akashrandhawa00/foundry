<div align="center">

# Foundry

**A role-based production tracking dashboard for manufacturing operations.**


<p align="center">
  <a href="https://usefoundry.vercel.app">
    <img src="https://img.shields.io/badge/🚀%20Live%20Demo-Click%20Here-blue?style=for-the-badge" alt="Live Demo" />
  </a>
</p>


---

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TanStack_Query-160440?style=for-the-badge&logo=react-query" />
  <img src="https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white" />
  
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  
</p>

---

### Preview

<div align="center">
<!--
  Add a screenshot or short GIF here once the current polish pass is done, e.g.:
  ![Foundry dashboard screenshot](./docs/screenshot-dashboard.png)
-->
<i>Screenshot coming soon</i>
</div>

---

## About

Foundry is a full-stack dashboard for tracking production runs on a manufacturing floor. It replaces manual, spreadsheet-based tracking with a live, role-aware web app — built with real production-floor context from hands-on experience coordinating logistics and production workflows.

## Features

- **Role-based access control** — Admin, Manager, and Operator roles see and can act on only what's relevant to them, enforced end-to-end with Supabase Row Level Security
- **Production run tracking** — create, update, and monitor runs with a clean, dark-themed interface
- **Optimized data layer** — TanStack Query-powered fetching and mutations with caching, background refetching, and optimistic updates
- **Responsive design** — mobile slide-in navigation drawer and a fully responsive table/dashboard layout
- **Secure by default** — authentication and authorization backed by Supabase Auth + PostgreSQL RLS policies

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| Data Fetching | TanStack Query |
| Backend / Database | Supabase (PostgreSQL, Auth, Row Level Security) |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Installation

```bash
git clone https://github.com/akashrandhawa00/foundry.git
cd foundry
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Run locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Roadmap

- [ ] Supabase Realtime subscriptions for live data sync across users
- [ ] Filterable production run views
- [ ] Dedicated user management tab (admin-only)

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
Built by <a href="https://github.com/akashrandhawa00">Akash Randhawa</a>
</div>
