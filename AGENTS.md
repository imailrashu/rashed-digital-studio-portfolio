# Rashed Digital Studio Repository Workflow

These instructions apply to the entire repository.

## Current Git and Vercel Setup

- GitHub repository: `imailrashu/rashed-digital-studio-portfolio`
- Primary and Vercel production branch: `main`
- Vercel project: `md-rashed/rashed-digital-studio-portfolio`
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- `vercel.json` is the source of truth for the Vercel framework, build command, and output directory.
- The GitHub repository is connected to Vercel. A push to `main` should create a production deployment automatically, while a push to another branch should create a Preview Deployment.

## Small Changes

Small changes include copy changes, minor CSS or UI fixes, link fixes, small responsive fixes, and minor bugs.

For a small change:

1. Make only the requested change.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Fix actual errors before publishing.
5. Commit only the intended files.
6. Push directly to `origin/main`.
7. Do not run a manual Vercel deployment.
8. Let the existing GitHub/Vercel integration deploy `main` to production automatically.
9. After pushing, verify the production deployment when possible.

## Major Changes

Major changes include redesigns, new sections, major animations, significant features, architecture changes, and substantial UI changes.

For a major change:

1. Do not work directly on or push the change directly to `main`.
2. Create a descriptive branch such as `feature/<name>`.
3. Implement the requested work on that feature branch.
4. Run `npm run lint`.
5. Run `npm run build`.
6. Fix actual errors before publishing.
7. Commit only the intended work.
8. Push the feature branch to GitHub.
9. Let Vercel generate a Preview Deployment from the feature branch.
10. Report the Preview Deployment URL when available.
11. Stop and wait for the user's explicit approval.
12. Never merge a major change into `main` without the user's explicit approval.

## After Preview Approval

After the user explicitly approves a Preview Deployment:

1. Confirm the feature branch is clean and validated.
2. Check out `main`.
3. Pull the latest `origin/main`.
4. Merge the approved feature branch safely.
5. Push `main` to GitHub.
6. Let the GitHub/Vercel integration deploy production automatically.
7. Verify the production deployment when possible.

## Safety Rules

- Never commit secrets, API keys, `.env` files, tokens, or credentials.
- Never force-push `main`.
- Never delete production branches.
- Never delete the Vercel project.
- Never change domains or DNS unless the user explicitly requests it.
- Do not run `vercel --prod` or another manual production deployment command for normal deployments.
- Do not modify unrelated approved design, content, data, links, or behavior.
- Keep `.vercel`, `.env.local`, and other ignored credentials or local project-link files out of commits.
