# EduNify

An AI-native learning platform where learning, teaching, and hiring adapt to you. EduNify builds personalized dashboards for students, educators, and companies based on goals, skills, and context.

---

## Overview

EduNify is a full-stack educational platform that unifies three user roles—Students, Teachers, and Companies (Founders)—into a single adaptive workspace. The interface and available tools change dynamically based on who you are and what you want to achieve. Powered by AI (Tambo AI, OpenAI), it helps users create content, practice skills, and demonstrate verified outcomes.

---

## Features

### Platform-Wide Features

- **AI-Generated Dashboards** — Personalized interfaces that adapt to your goals and learning style
- **Goal-Driven Learning** — Set objectives and AI creates a tailored path with real-world tasks
- **Skill-Proof Profiles** — Demonstrate expertise through verified performance, not just credentials
- **AI-Assisted Creation** — Intelligent tools to create and scale educational content
- **Real-World Practice** — Learn through practical tasks that mirror industry challenges
- **Performance Hiring** — Companies hire based on demonstrated skills and project outcomes

### Core Modules

| Module | Description |
|--------|-------------|
| **MCQ Generator** | Generate multiple-choice quizzes by topic, difficulty, and question count. Timer-based practice with instant scoring and answer review |
| **Notes Generator** | AI-generated notes in formats: summary, detailed, concept map, flashcards, cheat sheet, comparison, timeline, formula sheet. Configurable depth (basic to expert) |
| **Assignment Builder** | Create assignments with multiple question types: multiple choice, short answer, long answer, true/false, fill in the blanks. Learning objectives, difficulty levels, and submission deadlines |
| **Lesson Planner** | AI-assisted curriculum design with overview, learning objectives, key topics, materials, lesson flow, assessment, homework, and differentiation strategies |
| **Study Plan Generator** | Custom weekly learning schedules tailored to your goals |
| **Resume Analysis** | AI-powered resume review with ATS, content, skills, structure, and tone analysis |
| **Chat** | AI conversation assistant with thread history and streaming responses |
| **Explore** | Browse all MCQs, assignments, and notes with filtering by type, difficulty, subject, and search |
| **Profile & Activity** | User profile management and recent activity feed (MCQs, assignments, notes) |

---

## Role-Based Experience

### Student

- **Color Theme:** Yellow / Amber
- **Features:** MCQ practice sheets, AI notes, study plans, resume builder, concept explainer
- **Focus:** Learn skills through real projects and get hired based on proven performance

### Teacher

- **Color Theme:** Green
- **Features:** Lesson planning, assignment creation, assessment builder, student progress tracking, resource generator
- **Focus:** Create, scale, and track educational impact with AI-assisted content and analytics

### Founder (Company)

- **Color Theme:** Orange
- **Features:** Interview questions, pitch deck builder, market research, business plan generator, investor outreach
- **Focus:** Hire talent based on verified skills and real project performance, not just resumes

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Auth:** Clerk
- **Database:** MongoDB (Mongoose)
- **AI:** Tambo AI, OpenAI
- **UI Components:** Radix UI, Lucide Icons
- **Forms:** React Hook Form, Zod
- **State:** React Context (Room, Chat, Auth)
- **Cloud:** Cloudinary (media)

---

## Setup

### Prerequisites

- Node.js 18+
- npm
- MongoDB (local or Atlas)
- Clerk account
- Tambo AI API key (optional, for AI features)
- OpenAI API key (optional, for AI features)
- Cloudinary account (optional, for media)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd edunify
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment variables**

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_TAMBO_API_KEY=...
OPENAI_API_KEY=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open the app**

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |

---

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/explore` | GET | List MCQs, assignments, notes with filters (type, difficulty, subject, search) |
| `/api/activity` | GET | Fetch current user's recent activity (MCQs, assignments, notes) |
| `/api/mcq` | GET, POST | List or create MCQs |
| `/api/mcq/me` | GET | Fetch MCQ by uniqueId |
| `/api/assignments` | GET, POST | List or create assignments; GET by uniqueId when id provided |
| `/api/note` | GET, POST | Fetch note by uniqueId or create notes |
| `/api/lession` | GET | Fetch lesson plan by uniqueId |
| `/api/resume` | GET | Fetch resume analysis by uniqueId |
| `/api/chat` | POST | Chat completion endpoint |

---

## Key Pages

| Path | Description |
|------|-------------|
| `/` | Home page with hero, features, how it works, CTA |
| `/login` | Sign in |
| `/signup` | Sign up with role selection |
| `/room` | Role-based workspace (MCQ, notes, assignments, etc.) |
| `/explore` | Browse and filter MCQs, assignments, notes |
| `/mcq?id=xyz` | View and take MCQ by ID |
| `/assignment?id=xyz` | View assignment by ID |
| `/note?id=xyz` | View note by ID |
| `/profile?type=info` | User profile |
| `/profile?type=activity` | Recent activity feed |
| `/about` | About the platform |

---

## Authentication & Roles

- **Clerk** handles sign-up, sign-in, and session management
- Role (`student`, `teacher`, `founder`) is stored in Clerk session claims
- Protected routes require authentication
- Room and Explore pages render content based on user role
- Activity API returns only the authenticated user's data

---

## Data Models

- **MCQ** — Topic, difficulty, timer, questions (4 options each), userId, uniqueId
- **Assignment** — Subject, grade level, topic, learning objectives, questions (multiple types), lastSubmissionHours
- **Note** — Title, content, subject, noteType, depthLevel
- **Lesson Plan** — Overview, objectives, topics, flow, assessment, homework
- **Chat** — Messages, thread history
- **Resume** — Analysis scores and tips
- **Category** — Topic aggregation for MCQs and notes

---

## Theming

The app uses a consistent color system:

- **Primary:** Amber / Yellow (`#FFC107`, `#FFF8E1`)
- **Accents:** Orange, Green for role differentiation
- **Student:** Yellow borders, amber backgrounds
- **Teacher:** Green borders, green backgrounds
- **Founder:** Orange borders, orange backgrounds

---

## License

Private. All rights reserved.
