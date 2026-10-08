# 🚀 Algorise — Interactive DSA Learning Platform

> **Learn the logic. Visualize the process. Solve the problem. Build your future.**

Algorise is an interactive, student-focused learning platform designed to make Data Structures and Algorithms (DSA), programming, and problem-solving easier to understand and practice. It combines structured learning, coding challenges, algorithm visualization, and interview preparation in one platform.

The platform helps learners understand programming concepts step by step, explore how algorithms work, practice problems at different difficulty levels, and develop logical thinking through hands-on learning. With guided explanations, coding practice, hints, solutions, and interactive visualizations, Algorise aims to make complex technical concepts more approachable for beginners and students preparing for technical interviews.

Algorise brings together DSA learning, problem-solving practice, algorithm visualization, programming exercises, learning roadmaps, technical interview preparation, and progress tracking to support continuous improvement.

**The goal of Algorise is simple:** help students move beyond memorizing code, understand the logic behind it, build confidence in problem-solving, and develop practical programming skills through consistent practice.

Algorise is built for computer science students, aspiring software developers, programming beginners, and anyone who wants to strengthen their understanding of algorithms and improve their coding skills.

---

## 🌟 Key Features

### 1. 🧩 Comprehensive Problem Catalog (3,088 Verified Problems)
- **3-Tier Level Progression:** Every canonical problem provides 3 difficulty levels:
  - **Level 1 (Beginner):** Easy target pair & hash map lookups.
  - **Level 2 (Intermediate):** Sorted array two-pointer approach with $O(1)$ extra memory constraints.
  - **Level 3 (Advanced):** Hard zero-sum multi-element combinations & advanced invariants.
- **Problem Metadata:** Time and space complexity bounds, constraints, starter templates, progressive hints, and full editorial walkthroughs.
- **Defensive Data Integrity:** 100% verified, executable problem test cases with zero dummy placeholder data.

### 2. ⚡ Multi-Language Online Code Judge
- **Supported Languages:** Python 3, JavaScript (Node.js), Java, C++, C, Go, and C#.
- **Real-Time Execution:** Real stdout/stderr capture, precise execution runtime measurement, and memory consumption metrics.
- **Judge Diagnostics:** Detailed error diagnostics for Compilation Errors, Runtime Errors (tracebacks), Time Limit Exceeded (TLE), and Wrong Answers.
- **Custom Input & Submit Modes:** Run code against custom stdin input or evaluate against full hidden test case suites.

### 3. 🔍 Algorithm & Data Structure Visualizers
- **Interactive Tracing:** Step-by-step trace mode for dynamic arrays, linked lists, trees, graphs, sorting, and dynamic programming.
- **Visual Memory Stepper:** Real-time state mutations, pointer tracking, and call-stack visualization.

### 4. 🕵️ Forensic Crime Lab (Bug Hunter)
- **Investigation Scenarios:** 100 cybersecurity and technical forensic debugging cases.
- **Realistic Stack Traces:** Suspect briefs, evidence logs, corrupted memory dumps, and code forensics questions.

### 5. 🛣️ Structured Flow of Learning (Curriculum Roadmap)
- **12 Foundational Stages:** From Arrays and Two Pointers to Dynamic Programming and Advanced Graph Algorithms.
- **Checkpoint Assessments:** Theory checkpoints, interactive mini-quizzes, and milestone tracking.

### 6. 🎙️ Technical & Behavioral Mock Interview Bank
- **1,700+ Questions:** Spanning Coding, System Design, Behavioral, HR, Managerial, Resume Deep-Dives, and Salary Negotiations.
- **Answer Persistence:** Server-synced personal answer storage and revision history.

### 7. 🛡️ Centralized Admin Control Panel & CMS
- **Role-Based Access Control (RBAC):** Server-enforced permissions distinguishing regular users, guests, and system administrators.
- **Live Platform Metrics:** Real-time analytics for user registrations, solved problems, active sessions, and submission volume.
- **Full Content Management:** Dynamic editor for problems, hints, curriculum stages, navigation menus, and homepage copy.
- **Security Audit Logs:** Comprehensive immutable server audit logging for all administrative operations.

### 8. 💬 Context-Aware Motivation Engine
- **Intelligent Feedback:** 102 dynamic, witty motivational messages triggered by user behavior (debugging streaks, compile errors, rapid solves, and idle time).

---

## 🛠️ Architecture & Tech Stack

```
                     ┌───────────────────────────────────┐
                     │          React 19 Client          │
                     │  (Vite 8 • TypeScript • Tailwind) │
                     └─────────────────┬─────────────────┘
                                       │ HTTP / REST
                                       ▼
                     ┌───────────────────────────────────┐
                     │      Express 5 Server (Node)      │
                     │  (server.js + adminServer bundle) │
                     └─────────┬───────────────┬─────────┘
                               │               │
                 ┌─────────────┴─────┐   ┌─────┴───────────────┐
                 │  Judge0 CE Engine │   │ JSON Flat-File DB   │
                 │  (Compiler API)   │   │ (Persistent Volume) │
                 └───────────────────┘   └─────────────────────┘
```

- **Frontend:** React 19, TypeScript, Vite 8, Lucide React, Clerk Authentication (`@clerk/react`).
- **Backend:** Node.js (v20+ / v24+), Express 5, `esbuild` server bundling.
- **Database:** Server JSON flat-file database with auto-seeding and persistent volume support.
- **Code Execution:** Secure compiler integration using Node system CA root certificates (`--use-system-ca`).
- **Code Quality:** Oxlint linter, TypeScript compiler (`tsc -b`).

---

## 📁 Repository Structure

```
algorise/
├── public/                 # Static assets, favicon, SVGs, and redirects
├── scripts/                # Utility scripts (e.g. zip packaging)
├── src/
│   ├── assets/             # Images and visual branding
│   ├── components/         # Reusable UI components
│   │   ├── admin/          # RBAC Admin Panel & CMS views
│   │   ├── common/         # Buttons, badges, code editor, modals, popups
│   │   ├── layout/         # Header, sidebar, navigation, footer
│   │   └── notes/          # Notes explorer and study guides
│   ├── context/            # React Context providers (Auth, Theme, Progress)
│   ├── data/               # Curated problems (3,088 verified), curriculum, interviews
│   │   ├── interview/      # Categorized interview question banks
│   │   └── server-db.json  # Database file (configurable path)
│   ├── pages/              # Main route views (Home, Problems, Visualizer, Crime Lab, etc.)
│   ├── server/             # Express API middleware (Auth, Compiler, CMS, Admin RBAC)
│   │   └── adminServer.ts  # Unified API middleware handler
│   ├── services/           # Code execution service, CMS client, API services
│   ├── styles/             # Global CSS design tokens and theme palettes
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Formatting and syntax highlighting utilities
├── tests/                  # Automated test suites (Compiler, Auth, Admin, Popups)
├── .env.example            # Environment variables template with safe placeholders
├── .gitignore              # Git ignore rules for secrets, builds, and dependencies
├── LICENSE                 # MIT License
├── package.json            # Project manifest, scripts, and dependencies
├── server.js               # Standalone production Node/Express server
├── tsconfig.json           # TypeScript project references
└── vite.config.ts          # Vite build and development middleware configuration
```

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- **Node.js** v20.6.0 or higher (v24 LTS recommended)
- **npm** v9 or higher

### 2. Clone the Repository
```bash
git clone https://github.com/pavana005/ALGOrise.git
cd ALGOrise
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy the template to create a local `.env.local` file:
```bash
cp .env.example .env.local
```

Configure your variables in `.env.local` as needed:
```env
PORT=5173
ADMIN_PASSWORD=your_secure_admin_password_here
# Optional Clerk authentication keys
VITE_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. Both frontend and backend API endpoints run together under Vite's development middleware.

---

## 🏗️ Production Build & Running

To build and run Algorise in production mode:

```bash
# 1. Compile both the frontend (dist/) and the backend API (dist-server/)
npm run build

# 2. Launch the standalone production server
npm start
```
The server will start on port `5173` (or the port defined in `PORT`), serving the compiled client and all API routes.

---

## 🧪 Automated Testing Suite

Algorise includes comprehensive automated test suites covering compiler execution, authentication, RBAC authorization, and motivation messages:

```bash
# Run online judge execution tests (Python, JS, C++, timeout, multiline stdin)
npm test

# Run compiler tests AND motivational popup message system tests
npm run test:all

# Run complete authentication and session security test suite
node tests/test-auth-suite.cjs

# Run complete Admin Panel RBAC and CMS test suite
node tests/test-admin-suite.cjs

# Run linter
npm run lint
```

---

## 📦 Packaging

To create a clean, deployment-ready ZIP archive of the project (excluding `node_modules` and build caches):

```bash
npm run zip
```
The zip file will be generated at `../algorise-clean-deploy.zip`.

---

## 🌐 Production Deployment

### Option 1: Railway / Render / Fly.io (Recommended)
1. Deploy as a **Node.js Web Service**.
2. **Build Command:** `npm run build`
3. **Start Command:** `npm start`
4. **Environment Variables:**
   - `NODE_ENV=production`
   - `PORT=5173` (or auto-assigned `$PORT`)
   - `ADMIN_PASSWORD=<your-secure-password>`
   - `DB_FILE_PATH=/data/server-db.json` *(optional, if mounting a volume)*
5. **Persistent Storage (Recommended):** Mount a persistent volume disk at `/data` and set `DB_FILE_PATH=/data/server-db.json`. The server will automatically seed the initial database on first launch and persist all user accounts, progress, and audit logs across redeploys.

### Option 2: Linux VPS / Docker
```bash
# On your server
git clone https://github.com/pavana005/ALGOrise.git
cd ALGOrise
npm ci
npm run build
PORT=80 NODE_ENV=production npm start
```

---

## 🔒 Security & Data Privacy

- **Zero Secret Leaks:** Real `.env` files, API keys, and local credentials are strictly excluded via `.gitignore`.
- **Credential Protection:** Admin and user passwords in database records and session tokens are strictly sanitized and never transmitted over public endpoints.
- **TLS Verification:** All backend HTTP and judge requests validate certificates against operating system root trust stores (`--use-system-ca`).
- **Server-Side RBAC:** All administrative routes (`/api/admin/*`) require verified administrator JWT/session authorization.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
