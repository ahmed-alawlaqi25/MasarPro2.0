# MasarPro | مسار برو

Manage your job applications, build your CV, and write cover letters in Arabic or English.

MasarPro started as my first full-stack project, built with Flask and Jinja2. I rebuilt the application with React and Node.js to make the frontend easier to maintain and improve the CV editing experience.

## Features

- Track applications on a drag-and-drop board with Wishlist, Applied, Interview, Offer, and Accepted stages.
- Search applications by company name or job title.
- Edit CVs with automatic saving and a live preview.
- Import an existing PDF CV to help fill in your draft.
- Get CV summary suggestions and cover letter drafts through Google Gemini.
- Edit cover letters based on your CV and a job description.
- Export CVs and cover letters through your browser’s Save as PDF option.
- Switch between Arabic and English, with right-to-left layout support.
- Manage account settings and upload a profile photo.
- Send messages through a contact form powered by Resend.

## Built with

| Area | Tools |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Authentication, database, and storage | Supabase |
| Writing assistance | Google Gemini |
| Contact emails | Resend |
| Translations | i18next |
| PDF import | PDF.js |

## Project structure

```text
client/    React frontend
server/    Express API and backend tests
docs/      AI writing and contact configuration
```

The frontend connects to Supabase for authentication and saved data. The backend handles Gemini requests and contact emails, keeping provider API keys outside the frontend.

## Getting started

Use Node.js 24 or newer and a configured Supabase project.

### 1. Install dependencies

From the project root:

```bash
cd client
npm install
cd ../server
npm install
```

### 2. Configure environment variables

Create `client/.env`:

```dotenv
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Create `server/.env`:

```dotenv
PORT=3001
SUPABASE_URL=your_supabase_project_url
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
MAIN_EMAIL=your_contact_recipient_email
```

See [AI writing setup](docs/ai-writing.md) and [contact form setup](docs/contact.md) for provider configuration. The contact form uses `noreply@masarpro.app` as the sender. Verify the domain in Resend or update the sender address for your deployment.

### 3. Start the application

Run the frontend from the project root:

```bash
cd client
npm run dev
```

Run the backend from the project root in a separate terminal:

```bash
cd server
npm run dev
```

Open the local URL printed by Vite. Vite forwards `/api` requests to the backend on port `3001`.

## Checks

Build the frontend from the project root:

```bash
cd client
npm run build
```

Run backend tests from the project root:

```bash
cd server
npm test
```

Backend tests cover contact form validation and AI request handling, including authentication, usage limits, and provider failures.

## Deployment

Build the frontend with `npm run build` in `client/`, then run `npm start` in `server/`. Express serves the built frontend and API together.

For separate frontend hosting, forward `/api/contact` and `/api/ai/*` to the Express server. Deployment details are in the [AI writing](docs/ai-writing.md) and [contact](docs/contact.md) guides.

## Current limitations

- Account deletion is not yet implemented.
- Contact and AI rate limits use server memory. Multiple server instances require a shared rate limiter.
- Generated text needs review before use.
- Imported CVs need a manual check for missing or misplaced details.
