# Ashes XI

A Squad Roller version of the viral 7-0 style squad game.

Roll previous Ashes squads, lock one player at a time into your XI, then simulate a five-Test series against an all-star XI built from the same sample pool.

## Run locally

Last updated for the Ashes XI test-match simulation.

Serve the `site/` directory with any static server:

```bash
cd site
python3 -m http.server 4173
```

Open `http://localhost:4173`.

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

You only need to replace the sheet name if you want something different, then deploy the script as a web app and paste that URL into `GOOGLE_APPS_SCRIPT_URL`.
