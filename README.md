# TaskFlow Manager 🚀

A premium, production-ready Task Management application built with **React**, **Tailwind CSS**, and **Supabase**. 

![Preview](https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&q=80&w=2000)

## Features
- **User Authentication**: Secure Sign up, Login, and Logout via Supabase Auth.
- **Task Management**: Full CRUD operations with detailed fields (Title, Description, Due Date, Priority).
- **Kanban Board**: Organize tasks into Status columns.
- **Responsive Design**: Flawless experience on Mobile, Tablet, and Desktop.
- **Dark Mode**: High-end dark theme toggle.
- **Animations**: Smooth transitions powered by Framer Motion.
- **Free Hosting**: Optimized for Vercel/Netlify free tiers.

## Tech Stack
- **Frontend**: React 18, Vite, TypeScript.
- **Styling**: Tailwind CSS (Custom Theme).
- **Icons**: Lucide React.
- **Animations**: Framer Motion.
- **Backend**: Supabase (PostgreSQL + RLS).

## Getting Started
Please refer to the [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions on how to set up the project and deploy it for free.

## Project Structure
```text
task-manager/
├── src/
│   ├── components/  # Reusable UI components
│   ├── context/     # Auth Context
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utilities
│   ├── pages/       # Page components (Dashboard, Auth)
│   ├── services/    # Supabase & Task API
│   ├── types/       # TypeScript definitions
│   ├── App.tsx      # Routing
│   └── main.tsx     # Entry point
├── SETUP_GUIDE.md   # Setup & Deployment instructions
└── supabase_schema.sql # Database schema
```

## License
MIT
