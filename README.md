# Michael John Buencamino — Portfolio

Personal portfolio for Michael John Buencamino, CRM & Technical Operations Specialist.

Built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, React Three Fiber and Lucide icons.

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Before publishing, run the same checks Vercel will:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Deploy to Vercel

1. **Create an empty GitHub repository** on your GitHub account (for example `portfolio`). Don't add a README, .gitignore or license — this project already has them.
2. **Push this project** to it. From this folder:

   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

   Git will ask you to sign in to GitHub the first time.
3. **Import it in Vercel**: in your Vercel account, choose *Add New → Project*, pick the GitHub repository, and keep the detected defaults (Framework: Next.js, build command `next build`). Click *Deploy*.
4. **Optional — custom domain**: in the Vercel project, open *Settings → Domains* and add your domain.

After the first deploy, every `git push` to `main` redeploys the site automatically.

### Site address (SEO)

The page metadata, sitemap and social-share image use the site's address. On Vercel this is picked up automatically from the production URL. If you add a custom domain, set it explicitly in *Settings → Environment Variables*:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |

Then redeploy.

## Updating content

All text lives in `src/data/` — edit these files rather than the components:

| File | What it holds |
| --- | --- |
| `site.ts` | Name, title, email, phone, WhatsApp, Calendly, résumé file |
| `skills.ts` | Expertise list, toolkit groups, moving logo strip |
| `projects.ts` | Case studies and their screenshots |
| `experience.ts` | Work history and education |
| `testimonials.ts` | Client quotes and work-sample screenshots |
| `resume.ts` | Résumé-only content (summary, competencies, references) |

Images: project and feedback screenshots in `public/work/`, tool logos in `public/tools/`, client logos in `public/logos/`.

## Regenerating the résumé PDF

The downloadable résumé (`public/Michael-John-Buencamino-Resume.pdf`) is generated from the `/resume` page, using the same data as the site.

```bash
npm run build
npm run start            # leave running, then in a second terminal:
npm run resume:pdf
```

This needs Google Chrome or Microsoft Edge installed (or set `CHROME_PATH`). The résumé's *Portfolio* link points to the Wix site until the new site has a public address; after deploying, set `NEXT_PUBLIC_SITE_URL` locally (or in `.env.local`), rebuild, and run `npm run resume:pdf` again so the link points to the new site. Commit and push the updated PDF.
