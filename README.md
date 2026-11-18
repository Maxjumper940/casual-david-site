# casual-david-site

Casual_DAViD personal website — Quality of Life mods and plugins for Minecraft.

## Run locally

```bash
npm start
```

The site listens on [http://localhost:3000](http://localhost:3000). Optional environment variable: `PORT`. No API keys or other env vars are required.

| URL | What it returns |
| --- | --- |
| `/`, `/mods`, `/plugins` | Site pages |
| `/api/projects` | Mod and plugin list from `data/projects.json` |
| `/api/health` | `{ "ok": true }` |

Add a mod or plugin by editing `data/projects.json`:

```json
{
  "mods": [
    {
      "name": "Mod name",
      "summary": "What it does",
      "minecraft": "1.21",
      "link": "https://example.com/mod"
    }
  ],
  "plugins": []
}
```

## GitHub Pages

This repository did not have a Pages site, so every URL on `https://maxjumper940.github.io/casual-david-site/` returned GitHub's "There isn't a GitHub Pages site here" 404.

After this is merged, turn Pages on in the repo dashboard:

1. Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: **main**, folder: **/ (root)** — not `/docs`
4. Save, then wait for the Pages deploy

There is no build step and no base path to set. Pages cannot run `server.js`. The pages load `data/projects.json` when `/api/projects` is not available.

## Vercel or Netlify

If the project is imported there, set:

- Framework preset: **Other** (not Next.js, Vite, or another framework)
- Root directory: repository root
- Build command: empty
- Output directory: empty (do not set `dist`, `public`, or `.next` — those folders are not in this repo, and a wrong output directory 404s every route)

`vercel.json` and `netlify.toml` publish this folder and map `/api/projects` to `data/projects.json`.
