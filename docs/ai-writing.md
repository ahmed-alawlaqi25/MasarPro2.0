# AI writing

The CV summary button calls `/api/ai/summary` and presents a suggestion for review.
Applying the suggestion uses the existing CV autosave flow. Editing the source
summary invalidates the suggestion, preventing stale text from replacing edits.

`/cover-letter` lists the user's CVs. `/cover-letter/:resumeID` opens a two-step
editor with company, job description, language, generation, and manual editing.
One letter is stored in `resumes.content.coverLetter` per CV. Existing JSON content
storage and row-level security apply. No database migration is required.
Generating again asks before replacing a saved letter. Failed requests preserve
the current draft. PDF download opens the browser print dialog, using US Letter
paper and excluding editor controls. Select Save as PDF and disable browser
headers and footers. Longer letters flow onto additional pages.

## Server configuration

Set these in the Render backend service environment:

- `GEMINI_API_KEY`
- `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`, or the existing
  `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- Optional `GEMINI_MODEL`, default `gemini-3.5-flash-lite`

The server loads its `.env`, then the repository `.env`, then `client/.env`.
Deployment environment values take precedence. Never prefix the Gemini key with
`VITE_`. Rebuild the client and restart the server after deployment.
If the frontend is hosted separately, forward `/api/ai/*` to this Express server,
as with `/api/contact`.

The backend verifies the Supabase access token with `/auth/v1/user` before calling
Gemini. It allows ten requests per verified user per fifteen minutes and one
concurrent request per user. Limits live in process memory. Multiple server
instances require a shared limiter. Gemini's own project quota still applies.
Requests time out, provider errors stay private, and incomplete model responses
are rejected. No request text or keys are logged.

Summary generation sends only the summary. Letter generation sends the company,
job description, and career sections. Contact fields and raw imported CV text are
excluded from the structured background. User-entered career text still needs
review for personal information. The UI explains the Google Gemini transfer.

Google's current model and pricing references:
https://ai.google.dev/gemini-api/docs/models
https://ai.google.dev/gemini-api/docs/pricing
https://ai.google.dev/api/generate-content

## Verification

- `npm test` in `server` covers authentication, validation, language, usage limits,
  oversized Arabic input, provider failures, and truncated output.
- `node --test tests/coverLetter.test.mjs` in `client` covers letter persistence
  through CV normalization and background data selection.
- `npm run build` in `client` builds the production UI.
- With Playwright installed, `node tests/careerAi.browser.cjs` in `client`
  checks the built UI in headless Edge using mocked authentication, persistence,
  and AI responses. It requires the existing public Supabase URL in `client/.env`.
  `QA_OUTPUT_DIR` optionally selects the screenshot and PDF output directory.
