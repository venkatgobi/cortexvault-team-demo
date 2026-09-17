# CortexVault Team Demo

Deploy-ready React + Vite + Tailwind prototype for collecting team feedback.

## What's included
- Demo landing page with role selection
- End User Workspace
- Admin Console
- Tenant switching only in Admin Console
- Users CRUD-style interactions
- User Groups CRUD-style interactions
- Roles & Permissions CRUD-style interactions
- Security Policies
- Tenant/group-scoped Metadata Schema
- KMS/BYOK and Audit screens
- Prototype/sample-data banner
- Send Feedback mail link

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New Project**.
3. Import the GitHub repository.
4. Framework preset should detect **Vite**.
5. Build command: `npm run build`
6. Output directory: `dist`
7. Deploy and share the generated URL with your team.

## Suggested review paths
### End user
Documents -> select file -> Ask AI -> Share

### Admin
Tenants -> Users -> User Groups -> Roles & Permissions -> Security Policies -> Metadata Schema

## Feedback button
The prototype uses a `mailto:` link by default. Replace the `href` in `src/App.jsx` with a Microsoft Forms, Google Forms, Jira, or internal feedback URL if preferred.
