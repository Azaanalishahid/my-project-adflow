# 🚀 AdFlow Pro — Premium SaaS Ad Management

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://my-project-adflow.vercel.app/)

AdFlow Pro is a state-of-the-art SaaS platform designed for high-end ad management and distribution. Built with a focus on premium aesthetics, performance, and seamless user experience, it allows advertisers to launch, manage, and track campaigns with precision.

---

## 💎 Premium Experience

*   **Glassmorphism UI**: A sleek, modern interface with advanced CSS effects.
*   **Real-time Dashboards**: Specialized command centers for Clients, Moderators, and Admins.
*   **Workflow Automation**: Intelligent campaign lifecycle from draft to live listing.
*   **Supabase Integration**: Robust authentication and real-time database management.

---

## 🛠 Tech Stack

*   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Backend & Auth**: [Supabase](https://supabase.com/)
*   **Styling**: Vanilla CSS with Modern Tokens & Glassmorphism
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Deployment**: [Vercel](https://vercel.com/)

---

## 🏗 Project Structure

```bash
src/
├── app/            # Next.js App Router (Pages & APIs)
├── components/     # Reusable UI Components
├── lib/            # Shared utilities (Supabase client, etc.)
├── types/          # TypeScript interface definitions
└── styles/         # Global design system & animations
```

---

## 🚦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Azaanalishahid/my-project-adflow.git
cd my-project-adflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Launch Development Environment
```bash
npm run dev
```

---

## 📈 Roadmap

- [x] Initial Next.js Migration
- [x] Supabase Auth & DB Integration
- [x] Premium Dashboard Implementation
- [x] Multi-role Workflow (Client/Moderator/Admin)
- [ ] Advanced Analytics Integration
- [ ] Global Search & Filtering

---

## ⚖ License

This project is licensed under the MIT License.

---

<p align="center">
  Built with ❤️ for the next generation of advertisers.
</p>
