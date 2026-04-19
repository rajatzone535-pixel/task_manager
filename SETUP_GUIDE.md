# Setup Guide: TaskFlow Manager

Follow these steps to get your production-ready Task Management app running for **FREE**.

## 1. Supabase Setup (Backend & Auth)
Supabase provides a generous free tier for PostgreSQL and Authentication.

1. Go to [Supabase](https://supabase.com/) and create a free account.
2. Create a **New Project**.
3. Once the project is ready, go to the **SQL Editor** in the sidebar.
4. Click **New Query**, paste the contents of `supabase_schema.sql`, and click **Run**.
5. Go to **Project Settings** -> **API**.
6. Copy the `Project URL` and `anon public` key.

## 2. Local Environment Setup
1. Open the project folder in your terminal.
2. Create a file named `.env` in the root directory.
3. Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_public_key_here
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

## 3. Enable Email Authentication
1. In your Supabase dashboard, go to **Authentication** -> **Providers**.
2. Ensure **Email** is enabled.
3. Under **Auth Settings**, you can disable "Confirm Email" for faster testing, although it's recommended for production.

## 4. Deployment (Frontend)
Deployment to Vercel is free and easy:

1. Push your code to a **GitHub** repository.
2. Go to [Vercel](https://vercel.com/) and click **New Project**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.

## 5. Sample Credentials
After running the app, you can create a test user via the **Sign Up** page. 

**Recommended Test Flow:**
1. Sign up with a sample email (e.g., `test@example.com`).
2. Login.
3. Create a few tasks with different priorities.
4. Move them across columns using the arrow buttons.
5. Toggle Dark Mode for the premium experience.
