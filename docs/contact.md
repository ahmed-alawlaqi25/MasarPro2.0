# Contact form

The public `/contact` page posts to `/api/contact`. Resend sends from
`MasarPro <noreply@masarpro.app>` to `MAIN_EMAIL`, with the visitor as Reply-To.
Verify the sender domain in Resend.

Use Node 24 or newer. Run `npm run dev` in both `server` and `client` in separate
terminals. Vite proxies `/api` to port 3001.

Deployment environment variables take precedence over `server/.env`. For the
existing local setup, missing settings fall back to the unprefixed
`RESEND_API_KEY` and `MAIN_EMAIL` in `client/.env`. Never add `VITE_` to these names.

Production: configure the two variables on the server, build the client, then run
`npm start` in `server`. Express serves the built frontend and API together.
Separate frontend hosting requires forwarding `/api/contact` to the server.

The endpoint validates fields, escapes email HTML, caps request size, and limits
each connection IP to five submissions per 15 minutes in memory. Proxy trust is
disabled. Configure trusted proxy addresses for your deployment before using
forwarded IPs. Multiple instances need a shared rate limiter.

Run `npm test` in `server` for endpoint tests with a mocked email provider.
