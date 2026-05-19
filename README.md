# Mpintshi Survey

This project includes a sendable application form and a small Express backend for central submission storage.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the backend server:
   ```bash
   npm start
   ```

3. Open the public survey in the browser:
   ```
   http://localhost:3000/survey
   ```

4. Open the separate admin dashboard link:
   ```
   http://localhost:3000/admin
   ```

For deployment, set an admin token so submissions are not publicly readable:
```bash
ADMIN_TOKEN=replace-with-a-long-private-token npm start
```

Then open the admin dashboard with:
```
https://your-domain.example/admin?admin_token=replace-with-a-long-private-token
```

The token is stored in browser session storage and removed from the visible URL after the page loads.

If another service already uses port 3000, set a different port:
```bash
PORT=3005 npm start
```

## Features

- Add one or more additional groups per submission
- Preview the submission after the form is sent
- Admin dashboard summarizes submissions and group reach
- Separate public survey and admin dashboard URLs
- Central storage in `data/submissions.json`

## Deploy on Render

This repo includes `render.yaml` for a Render Blueprint deployment.

1. Push this repo to GitHub.
2. In Render, create a new Blueprint from the GitHub repo.
3. Choose the `mntase-survey` service.
4. Set the secret `ADMIN_TOKEN` when Render asks for it.
5. Deploy.

Render will run:
```bash
npm ci
npm start
```

The public survey will be available at:
```
https://your-render-url.onrender.com/survey
```

The admin dashboard will be available at:
```
https://your-render-url.onrender.com/admin?admin_token=your-admin-token
```

Submissions are stored on the mounted Render disk at `/var/data/submissions.json`.
