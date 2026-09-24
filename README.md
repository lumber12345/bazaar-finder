# Torn Bazaar Finder

Search any Torn item and find the cheapest player bazaars.

## Run
```bash
npm start             # or: node server.js (Node 18+, no dependencies)
# open http://localhost:3000
```
`index.html` also works by itself if you open it in a browser. It falls back to calling weav3r.dev directly.

## Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/lumber12345/bazaar-finder)

**Option A: Blueprint (one click).** Click the button above, or in Render go to **New → Blueprint** and pick this repo. `render.yaml` sets up everything.

**Option B: set up a Web Service by hand.** Go to **New → Web Service** and connect this repo, then use:

| Setting | Value |
|---|---|
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/healthz` |
| Instance Type | Free works fine |

You don't need to set any environment variables. Render provides `PORT` automatically, and the server listens on `0.0.0.0`.

> On the free plan, the service goes to sleep after about 15 minutes with no visitors. The first page load after that takes around 30 to 50 seconds while it starts back up.

## Features
- Instant fuzzy item search with autocomplete (by name or item ID, press `/` to focus)
- Item page showing the cheapest bazaar listings, the % difference from market value, how long ago each listing was updated, and one-click links to each bazaar
- Bulk buy calculator that works out the cheapest way to fill N units across bazaars and highlights which bazaars to buy from
- Selling helper with undercut and market-value prices you can copy
- Browse and Deals tables you can sort, with filters for minimum market value, minimum number of bazaars and category
- **💵 The Buck Stops Here:** lists every item in player bazaars priced at **$1** (you can raise the filter to $10, $100 or $1,000). It reads Torn's official bazaar directory, starting with the *Dollar Sale* and *Bargain* lists, then checks each of those bazaars through the Torn API. Turn on Deep scan to add the other directory lists and all 24 category directories. You can also add player IDs to check. Needs a Torn API key (Public works; Limited returns fresher data). Requests are limited to about 85 per minute to stay under Torn's limit of 100.
- Watchlist with target prices that shows **BUY ✓** when a bazaar hits your target
- Optional Torn API key (Public is fine) to compare with the official Item Market and to filter by category
- Optional 30s auto-refresh

## Data
- Bazaar listings: TornW3B public API (`weav3r.dev/api/marketplace`). The server caches the item list for 60s and each item for 20s.
- Item Market, categories and $1 scanning: official Torn API (`/v2/market/{id}/itemmarket`, `/v2/torn/items`, `/v2/market/bazaar`, `/user/{id}?selections=bazaar`). Calls go straight from the browser, and the key is stored only in localStorage.
