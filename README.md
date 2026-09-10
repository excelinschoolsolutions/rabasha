# Mụta Pioneer Platform — Stage 1: Project Setup

This is the foundation of the site: a Next.js project, styled with Tailwind
using the exact colors/fonts from the Stitch design, and already pointed at
your Supabase project (`muta-waiting-list`). Nothing is "live" yet — Stage 1
just proves the pipeline works end to end: code → GitHub → Vercel.

Follow these steps in order. Don't skip ahead even if a step looks optional.

## 1. Install the tools you need (one-time, on your computer)

1. **Node.js** — go to https://nodejs.org and install the **LTS** version.
   This gives you `node` and `npm`, which run and manage the project.
2. **Git** — go to https://git-scm.com/downloads and install it. This is
   what talks to GitHub.
3. **A code editor** — [VS Code](https://code.visualstudio.com/) is the
   standard choice, free, and works well with this stack.
4. **A GitHub account** — https://github.com if you don't have one.
5. **A Vercel account** — https://vercel.com — sign up using **"Continue
   with GitHub"** so the two are linked from the start.

Verify Node installed correctly by opening a terminal (on Mac: Terminal
app; on Windows: use "Git Bash", installed alongside Git) and running:

```bash
node -v
npm -v
```

You should see version numbers, not an error.

## 2. Open this project folder

Unzip the file I gave you, then in your terminal:

```bash
cd path/to/muta-pioneer
```

(Replace `path/to/` with wherever you unzipped it — you can usually drag
the folder into the terminal window and it will fill in the path.)

## 3. Install the project's dependencies

```bash
npm install
```

This reads `package.json` and downloads everything the project needs
(Next.js, Tailwind, Supabase's client library, etc.) into a `node_modules`
folder. It can take a minute or two. This step is why I couldn't fully
build this for you remotely — it needs your machine's internet connection.

## 4. Run it locally

```bash
npm run dev
```

Then open **http://localhost:3000** in your browser. You should see a
plain page that says "Mụta Pioneer platform" and confirms the setup is
working. If you see that, Stage 1 is functioning correctly.

Leave this running while you work — every time you save a code change,
the page updates automatically. Press `Ctrl + C` in the terminal to stop
it.

## 5. Put it on GitHub

In the same terminal (open a new tab if `npm run dev` is still running):

```bash
git init
git add .
git commit -m "Stage 1: project setup"
```

Then on github.com: click **New repository**, name it `muta-pioneer`,
leave it empty (no README/gitignore — we already have ours), and create
it. GitHub will show you commands like these — run them:

```bash
git remote add origin https://github.com/YOUR-USERNAME/muta-pioneer.git
git branch -M main
git push -u origin main
```

Refresh the GitHub page — your code should now be there.

## 6. Deploy it on Vercel

1. Go to https://vercel.com/new
2. Choose **Import** next to your `muta-pioneer` GitHub repo.
3. Vercel will auto-detect it's a Next.js project — leave the defaults.
4. Before clicking Deploy, open **Environment Variables** and add these
   two (copy the values from your local `.env.local` file):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**.

In about a minute, Vercel gives you a live URL
(something like `muta-pioneer.vercel.app`). Open it — you should see the
same "Mụta Pioneer platform" placeholder page, now live on the internet.

From now on, every time you `git push` to the `main` branch, Vercel
automatically rebuilds and redeploys the site. You don't need to repeat
step 6.

## What's in this folder, briefly

```
src/app/            Pages live here (Stage 2 fills this in)
src/lib/supabase/    Two small files that connect the app to your database
tailwind.config.ts   The Mụta color/font tokens, taken from the Stitch design
.env.local           Your Supabase keys (kept out of GitHub on purpose)
```

## Troubleshooting

- **`npm install` fails** — make sure Node's version is 18 or newer
  (`node -v`). Delete `node_modules` and `package-lock.json` if present,
  then try again.
- **Blank/error page at localhost:3000** — check the terminal running
  `npm run dev` for a red error message; copy it to me and I'll help.
- **Vercel build fails** — click into the failed deployment's logs; it's
  almost always a missing environment variable (step 6.4) or a typo.

---

Once you've confirmed the site is live on your Vercel URL, let me know and
we'll move to **Stage 2: turning the Stitch designs into real pages**.
