MasarPro (مسار برو)

MasarPro brings your job applications, CVs, and cover letters together in one place. Track your progress, update your CV, and prepare application documents in Arabic or English.

I originally built MasarPro with Flask and Jinja2 as my first full-stack project. This rebuild uses React and Node.js to make the frontend easier to maintain and improve the CV editing experience.

Features

• Track applications on a drag-and-drop board with Wishlist, Applied, Interview, Offer, and Accepted stages.
• Find applications by company name or job title.
• Build and edit CVs with automatic saving and a live preview.
• Import a PDF CV to help fill in your draft.
• Get CV summary suggestions through Google Gemini.
• Generate cover letter drafts from your CV and a job description, then edit the wording yourself.
• Export CVs and cover letters as PDFs through your browser’s print dialog.
• Switch between Arabic and English, with right-to-left layout support.
• Manage your account settings and upload a profile photo.
• Send a message through the contact form, with email delivery through Resend.

Technology

The frontend uses React, Vite, Tailwind CSS, and i18next. PDF.js reads uploaded CVs.

The backend uses Node.js and Express. Supabase provides authentication, database storage, and file storage. Google Gemini provides writing assistance, and Resend delivers contact emails.

Project structure

client/ contains the React application.
server/ contains the Express API and backend tests.
docs/ contains configuration details for AI writing and contact emails.

The frontend connects to Supabase for authentication and saved data. The server handles Gemini requests and contact emails, keeping provider API keys outside the frontend.

Running locally

Use Node.js 24 or newer. Run the following commands from the project root to install dependencies:

cd client
npm install
cd ../server
npm install

Create client/.env with your Supabase connection settings:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

Create server/.env with your backend settings:

PORT=3001
SUPABASE_URL=your_supabase_project_url
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
MAIN_EMAIL=your_contact_recipient_email

The contact form uses noreply@masarpro.app as the sender. Verify the sender domain in Resend, or update the sender address for your deployment.

See docs/ai-writing.md and docs/contact.md for configuration and deployment details.

Start the frontend from the project root:

cd client
npm run dev

Start the backend from the project root in a separate terminal:

cd server
npm run dev

Open the local URL printed by Vite. During development, Vite forwards /api requests to the backend on port 3001.

Production

Build the frontend from the project root:

cd client
npm run build

Start the backend from the project root:

cd server
npm start

Express serves the built frontend and API together. If you host the frontend separately, forward /api/contact and /api/ai/* requests to the Express server.

Checks

Build the frontend from client/:

npm run build

Run the backend tests from server/:

npm test

The backend tests cover contact form validation and AI request handling, including authentication, usage limits, and provider failures.

Current limitations

Account deletion is not yet implemented.

Contact and AI rate limits use server memory. Running multiple server instances requires a shared rate limiter.

Review AI-generated text before using your application documents. PDF imports also need a manual check for missing or misplaced details.
