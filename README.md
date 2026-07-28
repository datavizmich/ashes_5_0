# Ashes XI

A Squad Roller version of the viral 7-0 style squad game.

Roll previous Ashes squads, lock one player at a time into your XI, then simulate a five-Test series against an all-star XI built from the same sample pool.

## Run locally

Last updated for the Ashes XI test-match simulation.

Use Cloudflare Pages local development so the `functions/` routes are active:

```bash
npm install
npm run db:migrate:local
npm run dev
```

Then open the local URL printed by Wrangler.

The local D1 database used by `wrangler pages dev` starts out separate from production and needs the repo migrations applied before DB-backed features work.

That migration step creates the `teams`, `team_players`, `players`, `challenges`, `results`, `daily_attempts`, and `daily_attempt_selections` tables and seeds the player data used by the leaderboard and saved-team flows.

Important:

- `python3 -m http.server` only serves static files from `site/`.
- It does not execute the Cloudflare Pages Functions in `functions/`.
- Public routes such as `/ashes`, `/daily`, `/challenge`, `/leaderboard`, `/how-to-play`, `/about`, and `/world-cup` therefore return 404 under a plain static server.
- The static server approach is no longer sufficient now that those routes are real server-rendered Pages routes.
- If you skip `npm run db:migrate:local`, DB-backed routes can fail locally with errors such as `no such table: teams`.
- On `localhost`, the read-only player leaderboard proxies `https://ashes-5-0.co.uk` so it shows the same live leaderboard data as the deployed site. Write flows still use the local D1 database.

## Data

Starter sample data lives in [`site/data/ashes-squads.js`](site/data/ashes-squads.js). It is intentionally lightweight example data, not a complete historical dataset.

## Feedback form

The site includes a footer feedback box that posts to a Cloudflare Pages Function at `/api/feedback`.
That function forwards submissions to a Google Apps Script web app, which can append rows into a Google Sheet.

To make it work, add this Pages environment variable in Cloudflare:

- `GOOGLE_APPS_SCRIPT_URL`

Then create a Google Sheet and deploy a small Apps Script web app that appends incoming feedback to the sheet.
The form stays on your site and the responses are stored in the sheet for you to read later.

Minimal Apps Script example:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Feedback");
  var params = e.parameter || {};
  sheet.appendRow([
    new Date(),
    params.message || "",
    params.pageUrl || "",
    params.mode || "",
    params.userAgent || ""
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

If this is a standalone script rather than one bound to the sheet, replace `getActiveSpreadsheet()` with `SpreadsheetApp.openById("YOUR_SHEET_ID")`.

When deploying:

- `Execute as` should be `Me`
- `Who has access` should be `Anyone` or `Anyone with Google account`
- use the `/exec` URL from the web app deployment, not the `/dev` URL

If you see a Google authorization prompt, open the Apps Script editor once and run a script function from there to grant access, then redeploy.

You only need to replace the sheet name if you want something different, then deploy the script as a web app and paste that URL into `GOOGLE_APPS_SCRIPT_URL`.
