// Torn Bazaar Finder - tiny zero-dependency server
// Serves the app and proxies/caches bazaar data from TornW3B (weav3r.dev).
// Run: node server.js   (PORT env var optional, default 3000 — Render sets PORT automatically)

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const UPSTREAM = "https://weav3r.dev/api/marketplace";
const LIST_TTL = 60 * 1000;  // full item list cache
const ITEM_TTL = 20 * 1000;  // single item listings cache

const cache = new Map(); // key -> { t, status, body }
const inflight = new Map();

async function upstream(url, ttl) {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.t < ttl) return hit;
  if (inflight.has(url)) return inflight.get(url);
  const p = (async () => {
    try {
      const r = await fetch(url, {
        headers: { "User-Agent": "TornBazaarFinder/1.0", Accept: "application/json" },
        signal: AbortSignal.timeout(15000),
      });
      const body = await r.text();
      const entry = { t: Date.now(), status: r.status, body };
      if (r.ok) cache.set(url, entry);
      return entry;
    } catch (e) {
      if (hit) return hit; // serve stale on failure
      return { t: Date.now(), status: 502, body: JSON.stringify({ error: "Upstream unavailable: " + e.message }) };
    } finally {
      inflight.delete(url);
    }
  })();
  inflight.set(url, p);
  return p;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  const send = (status, type, body) => {
    res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" });
    res.end(body);
  };

  if (url.pathname === "/healthz") return send(200, "application/json", JSON.stringify({ ok: true, uptime: process.uptime() }));

  if (url.pathname === "/api/marketplace") {
    const e = await upstream(UPSTREAM, LIST_TTL);
    return send(e.status, "application/json", e.body);
  }
  const m = url.pathname.match(/^\/api\/marketplace\/(-?\d+)$/);
  if (m) {
    const e = await upstream(`${UPSTREAM}/${m[1]}`, ITEM_TTL);
    return send(e.status, "application/json", e.body);
  }
  if (url.pathname === "/" || url.pathname === "/index.html") {
    return fs.readFile(path.join(__dirname, "index.html"), (err, data) =>
      err ? send(500, "text/plain", "index.html missing") : send(200, "text/html; charset=utf-8", data));
  }
  send(404, "text/plain", "Not found");
});

server.listen(PORT, "0.0.0.0", () => console.log(`Torn Bazaar Finder running on http://0.0.0.0:${PORT}`));

// Graceful shutdown (Render sends SIGTERM on deploys/restarts)
for (const sig of ["SIGTERM", "SIGINT"]) {
  process.on(sig, () => {
    console.log(`${sig} received, shutting down`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5000).unref();
  });
}
