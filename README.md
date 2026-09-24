# Torn Bazaar Finder

Search any Torn item and find the cheapest player bazaars.

## Run
```bash
npm start             # or: node server.js (Node 18+, no dependencies)
# open http://localhost:3000
```
`index.html` also works by itself if you open it in a browser. It falls back to calling weav3r.dev directly.

## Features
- Instant fuzzy item search with autocomplete (by name or item ID, press `/` to focus)
- Item page showing the cheapest bazaar listings, the % difference from market value, how long ago each listing was updated, and one-click links to each bazaar
- Bulk buy calculator that works out the cheapest way to fill N units across bazaars and highlights which bazaars to buy from
- Selling helper with undercut and market-value prices you can copy
- Browse and Deals tables you can sort, with filters for minimum market value, minimum number of bazaars and category
- Watchlist with target prices that shows **BUY ✓** when a bazaar hits your target
- Optional Torn API key (Public is fine) to compare with the official Item Market and to filter by category
- Optional 30s auto-refresh

## Data
- Bazaar listings: TornW3B public API (`weav3r.dev/api/marketplace`). The server caches the item list for 60s and each item for 20s.
- Item Market and categories: official Torn API v2 (`/market/{id}/itemmarket`, `/torn/items`). Calls go straight from the browser, and the key is stored only in localStorage.
