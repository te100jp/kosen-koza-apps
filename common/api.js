/* 生徒のスマホの答えを、先生の画面に集めるための部品（KozaAPI）
 * ・config.js の API_URL があれば、Googleスプレッドシート（Apps Script）に送る（オンライン）
 * ・なければ、この端末の中だけで動く（ローカル。同じ端末の別タブには伝わる）
 * 送るのは「部屋の名前・項目の名前・端末ごとのランダムな番号・答え」だけで、名前などは送らない。
 */
(function () {
  "use strict";
  var cfg = window.KOZA_CONFIG || {};
  var qs = new URLSearchParams(location.search);
  var API_URL = (qs.get("api") || cfg.API_URL || "").trim();
  var ROOM = ((qs.get("room") || cfg.ROOM || "koza") + "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40) || "koza";

  function rid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); }
  var CLIENT;
  try { CLIENT = localStorage.getItem("koza_client") || rid(); localStorage.setItem("koza_client", CLIENT); }
  catch (e) { CLIENT = rid(); }

  // ---- 状態の表示（右下の小さな表示） ----
  var statusEl = null;
  function setStatus(kind, text) {
    if (!statusEl) {
      statusEl = document.createElement("div"); statusEl.className = "status";
      (document.body || document.documentElement).appendChild(statusEl);
    }
    statusEl.className = "status " + kind;
    statusEl.textContent = text || (kind === "online" ? "つながっています" : kind === "local" ? "この端末だけモード" : "つながりません（再試行中）");
  }

  // ---- 共通のルール：最後のリセットより後の行だけ、かくした行は除く ----
  function filterRows(rows) {
    var start = 0;
    rows.forEach(function (r, i) { if (r.client === "__reset__") start = i + 1; });
    rows = rows.slice(start);
    var hidden = {};
    rows.forEach(function (r) { if (r.client === "__hide__") hidden[Number(r.value)] = true; });
    return rows.filter(function (r) { return r.client.indexOf("__") !== 0 && !hidden[r.id]; });
  }

  // ---- ローカル（この端末だけ） ----
  var LKEY = "koza_local_db";
  var bc = ("BroadcastChannel" in window) ? new BroadcastChannel("koza_local") : null;
  var listeners = [];
  if (bc) bc.onmessage = function () { listeners.forEach(function (f) { try { f(); } catch (e) {} }); };
  function lload() { try { return JSON.parse(localStorage.getItem(LKEY) || "[]"); } catch (e) { return []; } }
  function lsave(rows) { try { localStorage.setItem(LKEY, JSON.stringify(rows.slice(-6000))); } catch (e) {} }
  function local(p) {
    var rows = lload();
    if (p.a === "put" || p.a === "reset" || p.a === "hide") {
      var id = (rows.length ? rows[rows.length - 1].id : 0) + 1;
      var client = p.a === "put" ? p.client : "__" + p.a + "__";
      var value = p.a === "hide" ? String(p.id) : (p.a === "reset" ? "" : String(p.value));
      rows.push({ id: id, t: Date.now(), room: p.room, key: p.key, client: client, value: value });
      lsave(rows); if (bc) bc.postMessage(1);
      return Promise.resolve({ ok: true, id: id });
    }
    if (p.a === "list") {
      return Promise.resolve({ ok: true, rows: filterRows(rows.filter(function (r) { return r.room === p.room && r.key === p.key; })) });
    }
    return Promise.resolve({ ok: true });
  }

  // ---- オンライン（Apps Script） ----
  function call(params, post) {
    params.room = ROOM;
    if (!API_URL) { setStatus("local"); return local(params); }
    var ctrl = ("AbortController" in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 12000);
    var req = post
      ? fetch(API_URL, { method: "POST", body: JSON.stringify(params), signal: ctrl && ctrl.signal })
      : fetch(API_URL + (API_URL.indexOf("?") < 0 ? "?" : "&") + new URLSearchParams(params).toString() + "&_=" + Date.now(), { signal: ctrl && ctrl.signal });
    return req.then(function (r) { return r.json(); })
      .then(function (j) { clearTimeout(timer); setStatus(j && j.ok ? "online" : "error", j && j.ok ? null : "エラー：" + (j && j.error)); return j; })
      .catch(function (e) { clearTimeout(timer); setStatus("error"); throw e; });
  }

  var API = {
    mode: API_URL ? "online" : "local",
    room: ROOM, client: CLIENT, url: API_URL,
    put: function (key, value) {
      if (typeof value !== "string") value = JSON.stringify(value);
      return call({ a: "put", key: key, client: CLIENT, value: value.slice(0, 500) }, true);
    },
    list: function (key) { return call({ a: "list", key: key }).then(function (j) { return (j && j.rows) || []; }); },
    latest: function (key) { return API.list(key).then(function (rows) { return rows.length ? rows[rows.length - 1] : null; }); },
    reset: function (key, pin) { return call({ a: "reset", key: key, pin: pin }, true); },
    hide: function (key, id, pin) { return call({ a: "hide", key: key, id: id, pin: pin }, true); },
    ping: function () { return call({ a: "ping", key: "ping" }); },
    /* 端末ごとに最後の答えだけを残す（投票など） */
    byClient: function (rows) {
      var m = {}; rows.forEach(function (r) { m[r.client] = r; }); return m;
    },
    /* くり返し取りに行く。止めるときは戻り値の関数を呼ぶ */
    poll: function (key, fn, ms) {
      var stopped = false, t = null; ms = ms || 2500;
      function tick() {
        if (stopped) return;
        if (document.hidden) { t = setTimeout(tick, ms); return; }
        API.list(key).then(function (rows) { if (!stopped) fn(rows); })
          .catch(function () {})
          .then(function () { if (!stopped) t = setTimeout(tick, ms); });
      }
      tick();
      if (!API_URL) listeners.push(function () { if (!stopped) { clearTimeout(t); tick(); } });
      return function () { stopped = true; clearTimeout(t); };
    },
    /* JSONの答えを安全に読む */
    parse: function (s, d) { try { return JSON.parse(s); } catch (e) { return d === undefined ? s : d; } },
    setStatus: setStatus
  };
  window.KozaAPI = API;
  // 集計を使わないページ（config.js を読みこまないページ）では、右下の表示を出さない
  document.addEventListener("DOMContentLoaded", function () { if (!window.KOZA_CONFIG && !qs.get("api")) return; setStatus(API_URL ? "online" : "local", API_URL ? "接続を確かめています" : null); if (API_URL) API.ping().catch(function () {}); });
})();

/* QRコードを canvas に描く（qrcode.js が読みこまれているとき） */
window.drawQR = function (canvas, text, size) {
  if (!window.qrcode) return;
  var q = qrcode(0, "M"); q.addData(unescape(encodeURIComponent(text))); q.make();
  var n = q.getModuleCount(), cell = Math.max(2, Math.floor((size || 240) / (n + 4)));
  canvas.width = canvas.height = cell * (n + 4);
  var c = canvas.getContext("2d"); c.fillStyle = "#fff"; c.fillRect(0, 0, canvas.width, canvas.height); c.fillStyle = "#2B2140";
  for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (q.isDark(y, x)) c.fillRect((x + 2) * cell, (y + 2) * cell, cell, cell);
};
/* 先生のPIN（リセットなどに使う）。ブラウザを閉じるまで覚える */
window.teacherPin = function () {
  var p = sessionStorage.getItem("koza_pin");
  if (!p) { p = prompt("先生用の番号（PIN）を入れてください"); if (p) sessionStorage.setItem("koza_pin", p); }
  return p || "";
};
/* 文字を安全に表示する */
window.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
