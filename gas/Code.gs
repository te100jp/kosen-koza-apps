/**
 * 公開講座「使う人から作る人へ」 集計用スクリプト（Google Apps Script）
 *
 * 使い方（くわしくは手順書）
 *  1. Googleスプレッドシートを新しく作る（名前の例：公開講座_集計）
 *  2. メニュー「拡張機能」→「Apps Script」を開き、このファイルの中身を全部貼りつける
 *  3. 下の TEACHER_PIN を、先生だけが知る数字に変える
 *  4. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
 *       次のユーザーとして実行：自分 ／ アクセスできるユーザー：全員
 *  5. 表示された URL（…/exec）を、アプリの common/config.js の API_URL に貼る
 *
 * 記録されるのは「部屋・項目・端末ごとのランダムな番号・答え」だけ。名前やメールは記録しない。
 * 講座が終わったら、シート「data」の2行目から下を消せば、記録はすべて消える。
 */
const TEACHER_PIN = '0000';   // ← 先生だけが知る数字に変える（リセットや非表示に使う）
const SHEET_NAME = 'data';
const MAX_VALUE = 500;

function doGet(e) { return out_(handle_((e && e.parameter) || {})); }
function doPost(e) {
  let p = {};
  try { p = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) {}
  return out_(handle_(p));
}
function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['id', 'time', 'room', 'key', 'client', 'value']);
    sh.setFrozenRows(1);
  }
  return sh;
}
function clean_(s, n, re) {
  s = String(s == null ? '' : s);
  if (re) s = s.replace(re, '');
  return s.slice(0, n);
}
function handle_(p) {
  try {
    const a = String(p.a || '');
    if (a === 'ping') return { ok: true, time: Date.now() };
    const room = clean_(p.room, 40, /[^A-Za-z0-9_-]/g);
    const key = clean_(p.key, 40, /[^A-Za-z0-9_.-]/g);
    if (!room || !key) return { ok: false, error: 'room/key' };
    if (a === 'put') {
      const client = clean_(p.client, 24, /[^A-Za-z0-9_-]/g);
      if (!client) return { ok: false, error: 'client' };
      return put_(room, key, client, clean_(p.value, MAX_VALUE));
    }
    if (a === 'list') return { ok: true, rows: list_(room, key) };
    if (a === 'reset' || a === 'hide') {
      if (String(p.pin) !== TEACHER_PIN) return { ok: false, error: 'pin' };
      return put_(room, key, '__' + a + '__', a === 'hide' ? clean_(p.id, 12, /[^0-9]/g) : '');
    }
    return { ok: false, error: 'action' };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
function put_(room, key, client, value) {
  // 表計算の式として動かないように、= + - @ で始まる答えは文字として記録する
  if (/^[=+\-@]/.test(value)) value = "'" + value;
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();
    const id = sh.getLastRow();            // 見出しが1行目なので、1から始まる番号になる
    sh.appendRow([id, new Date(), room, key, client, value]);
    return { ok: true, id: id };
  } finally {
    lock.releaseLock();
  }
}
function list_(room, key) {
  const sh = sheet_();
  const n = sh.getLastRow();
  if (n < 2) return [];
  const v = sh.getRange(2, 1, n - 1, 6).getValues();
  const rows = [];
  v.forEach(function (r) {
    if (r[2] === room && r[3] === key) {
      rows.push({ id: Number(r[0]), t: new Date(r[1]).getTime(), client: String(r[4]), value: String(r[5]) });
    }
  });
  return filter_(rows);
}
// 最後のリセットより後の行だけ、かくした行は除く（アプリ側の「この端末だけモード」と同じルール）
function filter_(rows) {
  let start = 0;
  rows.forEach(function (r, i) { if (r.client === '__reset__') start = i + 1; });
  rows = rows.slice(start);
  const hidden = {};
  rows.forEach(function (r) { if (r.client === '__hide__') hidden[Number(r.value)] = true; });
  return rows.filter(function (r) { return r.client.indexOf('__') !== 0 && !hidden[r.id]; });
}
