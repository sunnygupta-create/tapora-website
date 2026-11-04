# TAPORA starter website

This is the first-stage TAPORA website: landing page, product enquiry links, and one demo digital business profile.

## Important before publishing
1. In `app/page.tsx`, replace `919334578433` with the WhatsApp number you want customers to contact, in international format without `+`.
2. In `app/p/[slug]/page.tsx`, replace the demo profile's sample name, phone number, and links before sharing it.
3. The displayed prices are introductory placeholders. Confirm your costs and final prices before publishing.
4. TAPORA is a working project name, not a confirmation that the trademark or domain is available.

## Run locally
Install Node.js, then:
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Deploy
The easiest phone-friendly route is:
1. Create a GitHub account and a new repository named `tapora-website`.
2. Upload the contents of this project folder to the repository (not the ZIP file itself).
3. Sign in to Vercel using GitHub and import `tapora-website`.
4. Choose the default Next.js settings and press Deploy.

You can use GitHub's mobile website in Chrome. If uploading a folder is awkward on Android, extract the ZIP first and upload files through GitHub's web interface, or use a browser-based coding workspace.

## Demo profile
After deployment, open `/p/demo-cafe` on your domain.

## What's not included yet
Customer accounts, Supabase database, admin dashboard, payments, order management and production analytics are the next build stages. The demo profile is hard-coded sample data and must not be treated as a live customer record.
