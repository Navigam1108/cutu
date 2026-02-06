# Deployment Guide: Valentine's Adventure

This guide covers how to host your site for free using **Vercel** (Frontend + API) and **MongoDB Atlas** (Database).

## 1. Cloud Database Setup (MongoDB Atlas)
You cannot use `localhost` for a deployed site. You need a cloud database.

1.  **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up (Free).
2.  **Deploy Cluster**:
    *   Click **+ Create** button.
    *   Select **M0 Free** (Shared) tier.
    *   Choose a provider (AWS) and region closest to you.
    *   Click **Create Deployment**.
3.  **Network Access**:
    *   Go to **Security > Network Access** in the sidebar.
    *   Click **+ Add IP Address**.
    *   Select **Allow Access from Anywhere** (0.0.0.0/0). (This ensures Vercel can connect).
    *   Click **Confirm**.
4.  **Database User**:
    *   Go to **Security > Database Access**.
    *   Click **+ Add New Database User**.
    *   Username: `valentine_user` (or similar).
    *   Password: **Generate a strong password and COPY IT**. You need this later.
    *   Click **Add User**.
5.  **Get Connection String**:
    *   Go back to **Deployment > Database**.
    *   Click **Connect** on your cluster.
    *   Select **Drivers**.
    *   Copy the connection string. It looks like:
        `mongodb+srv://valentine_user:<db_password>@cluster0.abcd.mongodb.net/?retryWrites=true&w=majority`
    *   **Replace `<db_password>`** with the password you just created.

## 2. Vercel Deployment (Frontend + Backend)
Next.js API routes eliminate the need for a separate backend server. Vercel hosts both using Serverless Functions.

1.  **Push to GitHub**:
    *   Ensure your project is committed and pushed to a GitHub repository.
2.  **Setup Vercel**:
    *   Go to [vercel.com](https://vercel.com) and log in.
    *   Click **Add New > Project**.
    *   Import your `cutu` repository.
3.  **Configure Environment**:
    *   In the **Configure Project** screen, find **Environment Variables**.
    *   Add the following:
        *   `MONGODB_URI`: Paste your MongoDB Atlas string from Step 1.
        *   `NEXT_PUBLIC_START_DATE`: `2026-02-07`
        *   `(Optional) NEXT_PUBLIC_DEBUG_DATE`: Leave empty for production.
4.  **Deploy**:
    *   Click **Deploy**.
    *   Wait for the build to finish. (It might take a minute).

## 3. Post-Deployment Setup
Once deployed, your live site is empty. You need to verify the database and seed it.

1.  **Seed the Data**:
    *   Visit your live URL: `https://your-project-name.vercel.app/api/seed`
    *   You should see `{"success": true, "message": "Seeded 7 days"}`.
    *   *Note: If you disabled seeding in production in `route.ts`, you might need to temporarily enable it or use a GUI like MongoDB Compass to import the data.*

## Common Issues & Fixes
*   **"MongooseServerSelectionError"**: Usually means your IP isn't allowlisted in MongoDB Atlas (Step 1.3) or your password in the URI is wrong.
*   **"Not allowed in production"**: If `/api/seed` fails, check `src/app/api/seed/route.ts`. You may need to comment out the production check for the first run, deploy, seed, and then uncomment it.

## Running Locally with Cloud DB
To fix your `npm run dev` error (`ECONNREFUSED`):
1.  Open `.env.local` in your project.
2.  Replace `MONGODB_URI` with your **Atlas Connection String**.
3.  Restart `npm run dev`.
This allows you to develop locally while connected to the real cloud database.
