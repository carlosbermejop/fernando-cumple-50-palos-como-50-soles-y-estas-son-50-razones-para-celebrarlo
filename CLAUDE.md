# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Fernando cumple 50 años como 50 soles

This is kind of a joke frontend application that will be referenced in a video to wish a friend a happy birthday. The idea is that each time you navigate to the home of the website, a random line will be read from `./data/reasons.json` including reasons to celebrate his 50th birthday.

## Commands

There is no build step and no dependencies. `fetch` is blocked on `file://`, so opening `index.html` directly shows the fallback message instead of a reason — always serve over HTTP:

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

There are no tests and no linter. If either is added later, document it here.

## Architecture

Plain static site: `index.html` + `styles.css` + `app.js`, deployed as-is.

The deploy artifact *is* the source tree, and that is a deliberate choice driven by the long project name (see below). With no bundler there is no `base`/`publicPath` to misconfigure, so **every path must stay relative** (`data/reasons.json`, not `/data/reasons.json`). That way the same files work both at `/` (custom domain, Netlify, Cloudflare Pages) and at `/<repo-name>/` (GitHub Pages project site) with no configuration. Do not introduce a framework or bundler without a concrete reason — the app is one screen and one interaction.

### Data

`data/reasons.json` is a flat JSON array of Spanish strings and is the single source of truth; it is expected to grow toward 50 entries. Keep it a plain array of strings — the app's only job is to pick one. Text is user-facing copy, so keep the Spanish accents correct.

### Reason picking

`app.js` uses a **shuffled bag**, not `Math.random()` per click: shuffle a copy of the array into a queue, show the first, take the next on each button press, and reshuffle when it empties (swapping if the new first entry equals the one on screen). This guarantees no reason repeats back-to-back and none repeats until all others have been shown, which makes a short list feel deep. It degrades sanely: one reason re-renders, zero shows a fallback.

The reason index/number is **never** displayed — the point is to imply there are more reasons than there are.

## Implementation

Not very opinionated on which technology should be used for the website, but I want to host it for very cheap. Initially, ready it to be deployed on Github Pages, and I might deploy it elsewhere. The name of the project is very long on purpose, it'd be funnier if it could renain this long, because it would be clumsy to say on the video. If it's technically not feasible / increases the price of hosting the app, we'll look for an alternative (probably using initials).

### Consequences of the long name

The directory (and intended repo) name is `fernando-cumple-50-años-como-50-soles-y-estas-son-50-razones-para-celebrarlo` — long, and containing non-ASCII characters (`ñ`, accents). Two things follow:

- GitHub Pages serves project sites from `/<repo-name>/`, hence the relative-paths rule above.
- Non-ASCII characters get percent-encoded in the URL. This is **unverified** until first push. If GitHub rejects the name, prefer ASCII substitution (`...50-anos-...`) which preserves the full length and clumsiness; initials are the last resort. Raise it, do not silently rename — the long name is the joke.

### Deployment

GitHub Pages serving from the `main` branch root; no Actions workflow, since there is nothing to build. `.nojekyll` stops Pages running the files through Jekyll. After the first deploy, verify on the live URL that the relative `data/reasons.json` fetch resolves under the subpath and that the encoded `ñ`/accents work.

## Visual design

Not married to any idea. Initially, my idea is to keep it very Spartan. If I include a photo of Fernando, I may want it to be decorated in like a GeoCities style (interpret that as you might).

### Current state and next pass

Pass 1 (done): Spartan — centered, typographic, system fonts. One reason on screen at a time plus an "otra razón" button. `<html lang="es">`, UTF-8, all copy in Spanish. The full long name is used as `<title>`, `<h1>` and in the Open Graph tags so it appears in full when the link is shared. Keyboard-accessible.

Pass 2 (pending): the GeoCities treatment, once a photo exists. `index.html` has an empty framed photo slot with its CSS already written, expecting `assets/fernando.jpg`; it renders nothing (no broken-image icon) while the file is absent.

Deliberately excluded: analytics, visitor counter, framework, CSS reset library, tests. For a single-screen joke site each costs more than it returns.
