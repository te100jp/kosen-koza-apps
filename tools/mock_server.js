// テスト用：アプリのファイルを配り、Apps Script と同じ動きをする /api を用意する（node tools/mock_server.js 8080）
const http = require("http"), fs = require("fs"), path = require("path"), url = require("url");
const ROOT = path.resolve(__dirname, ".."), PORT = +process.argv[2] || 8080, PIN = "0000";
let rows = [];
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".json": "application/json" };
function filter(rs) {
  let s = 0; rs.forEach((r, i) => { if (r.client === "__reset__") s = i + 1; }); rs = rs.slice(s);
  const h = {}; rs.forEach(r => { if (r.client === "__hide__") h[+r.value] = 1; });
  return rs.filter(r => r.client.indexOf("__") !== 0 && !h[r.id]);
}
function handle(p) {
  if (p.a === "ping") return { ok: true };
  const room = String(p.room || "").replace(/[^A-Za-z0-9_-]/g, ""), key = String(p.key || "").replace(/[^A-Za-z0-9_.-]/g, "");
  if (p.a === "put") { const id = rows.length + 1; rows.push({ id, t: Date.now(), room, key, client: String(p.client), value: String(p.value).slice(0, 500) }); return { ok: true, id }; }
  if (p.a === "list") return { ok: true, rows: filter(rows.filter(r => r.room === room && r.key === key)).map(({ id, t, client, value }) => ({ id, t, client, value })) };
  if (p.a === "reset" || p.a === "hide") { if (String(p.pin) !== PIN) return { ok: false, error: "pin" }; const id = rows.length + 1; rows.push({ id, t: Date.now(), room, key, client: "__" + p.a + "__", value: p.a === "hide" ? String(p.id) : "" }); return { ok: true, id }; }
  return { ok: false, error: "action" };
}
http.createServer((req, res) => {
  const u = url.parse(req.url, true);
  if (u.pathname === "/api") {
    const send = p => { res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }); res.end(JSON.stringify(handle(p))); };
    if (req.method === "POST") { let b = ""; req.on("data", c => b += c); req.on("end", () => { let p = {}; try { p = JSON.parse(b); } catch (e) {} send(p); }); }
    else send(u.query);
    return;
  }
  let f = path.join(ROOT, decodeURIComponent(u.pathname)); if (f.endsWith("/")) f += "index.html";
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); res.end("not found"); return; }
  res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
}).listen(PORT, () => console.log("mock on " + PORT));
