/* ミニ生成AIのしくみ（n-gram：前の1〜3語から、次の言葉を数えて確率で選ぶ） */
(function () {
  "use strict";
  var BOS = "<s>", EOS = "。";
  /* 文を言葉に分ける（空白で区切る）。最後に「。」をつける */
  function tokenize(s) {
    s = String(s || "").replace(/[。．.！!？?]+\s*$/, "").trim();
    if (!s) return [];
    var t = s.split(/[\s　]+/).filter(Boolean);
    t.push(EOS);
    return t;
  }
  /* つながり表を作る：table[n][前のn語] = { 次の言葉: 回数 } */
  function build(sentences) {
    var table = { 1: {}, 2: {}, 3: {} }, starts = {};
    sentences.forEach(function (s) {
      var t = tokenize(s); if (t.length < 2) return;
      var seq = [BOS, BOS, BOS].concat(t);
      for (var i = 3; i < seq.length; i++) {
        for (var n = 1; n <= 3; n++) {
          var ctx = seq.slice(i - n, i).join(" ");
          var row = table[n][ctx] || (table[n][ctx] = {});
          row[seq[i]] = (row[seq[i]] || 0) + 1;
        }
      }
      var st = t.slice(0, Math.min(2, t.length - 1)).join(" ");
      starts[st] = (starts[st] || 0) + 1;
      starts[t[0]] = (starts[t[0]] || 0) + 1;
    });
    return { table: table, starts: starts, size: sentences.length };
  }
  function pick(row, rnd) {
    var keys = Object.keys(row), total = 0;
    keys.forEach(function (k) { total += row[k]; });
    var r = (rnd || Math.random)() * total;
    for (var i = 0; i < keys.length; i++) { r -= row[keys[i]]; if (r < 0) return keys[i]; }
    return keys[keys.length - 1];
  }
  /* 次の言葉の候補（見る長さ k。見つからなければ短くする） */
  function nextRow(model, seq, k) {
    for (var n = k; n >= 1; n--) {
      var ctx = seq.slice(-n).join(" ");
      var row = model.table[n][ctx];
      if (row) return { row: row, n: n, ctx: ctx };
    }
    return { row: model.table[1][BOS] || null, n: 0, ctx: BOS };
  }
  /* 文を作る。start は "わたし は" のような書き出し（なくてもよい） */
  function generate(model, start, k, maxLen) {
    var first = start ? String(start).split(/[\s　]+/).filter(Boolean) : [];
    var seq = [BOS, BOS, BOS].concat(first), out = first.slice(), steps = [];
    maxLen = maxLen || 24;
    while (out.length < maxLen) {
      var nr = nextRow(model, seq, k || 2);
      if (!nr.row) break;
      var w = pick(nr.row);
      steps.push({ ctx: nr.ctx, n: nr.n, row: nr.row, word: w });
      if (w === EOS) break;
      out.push(w); seq.push(w);
    }
    return { words: out, text: out.join(" ") + EOS, steps: steps };
  }
  /* 書き出しの候補（よく出るものから） */
  function startList(model, limit) {
    return Object.keys(model.starts).sort(function (a, b) { return model.starts[b] - model.starts[a] || b.length - a.length; }).slice(0, limit || 30);
  }
  /* つながり表の1行を「回数の多い順」に */
  function rowList(row) {
    return Object.keys(row || {}).map(function (k) { return [k, row[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
  }
  window.MiniGPT = { tokenize: tokenize, build: build, generate: generate, startList: startList, nextRow: nextRow, rowList: rowList, BOS: BOS, EOS: EOS };

  /* 見本の文（先生の画面の「見本の文を入れる」で使う） */
  window.MINIGPT_SAMPLES = [
    "わたし は カレー が 好き です", "わたし は ラーメン が 好き です", "わたし は おすし が 好き です", "わたし は カレー を よく 食べます",
    "わたし は ハンバーグ が 大好き です", "わたし は ラーメン を 食べたい です", "給食 の カレー が いちばん 好き です",
    "休み の 日 は ゲーム を します", "休み の 日 は サッカー を します", "休み の 日 は 家 で ねて います", "休み の 日 は 友達 と 遊びます",
    "休み の 日 は ゲーム で 遊びます", "日曜日 は 公園 で サッカー を します",
    "将来 は ロボット を 作りたい です", "将来 は 先生 に なりたい です", "将来 は パティシエ に なりたい です", "将来 は ゲーム を 作りたい です",
    "高専 は 5年間 学ぶ 学校 です", "名古屋 は 愛知県 の 市 です"
  ];
})();
