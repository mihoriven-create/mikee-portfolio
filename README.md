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

This needs Google Chrome or Microsoft Edge installed (or set `CHROME_PATH`). The résumé's *Portfolio* link points to the live site, https://michaeljohnbuencamino.vercel.app (set as `productionUrl` in `src/data/site.ts`, which also drives the SEO metadata and sitemap). If you move to a custom domain, change it there, rebuild, run `npm run resume:pdf` again, then commit and push the updated PDF.

## The hero orb picture

The orb in the hero is a pre-rendered picture (`public/orb-poster.webp`) that appears with the very first paint. The live 3D scene downloads afterwards and fades in over it; visitors on data-saver, 2G or reduced-motion skip the live scene and keep the picture. If you ever change how the orb looks (`src/components/three/SystemsCore.tsx`), regenerate the picture so the two match:

```bash
npm run build
npm run start            # leave running, then in a second terminal:
npm run orb:poster
```

Commit the updated `public/orb-poster.webp`. It is rendered from the real scene (`?orb-poster` mode) at a fixed size, and positioned in CSS by `.orb-poster` in `src/app/globals.css`; if you change where the orb sits in the hero, update both.
