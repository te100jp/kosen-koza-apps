# -*- coding: utf-8 -*-
"""講座ページ（トップと第1〜5弾）を作る：python3 tools/make_pages.py"""
import os, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERIES = [
    ("k1", "第1弾", "使う人から作る人へ", "AIを使い、AIを作り、写真のしくみを知る",
     [("AIメーカー", "../apps/aimaker/", "カメラで物を見分けるAIを作る・AIじゃんけん", "sky"),
      ("ピクセル顕微鏡", "../apps/pixel/", "写真を拡大して、画素の数字を見る", "amb"),
      ("Quick, Draw!（Google）", "https://quickdraw.withgoogle.com/", "AIに絵を当ててもらう", "ghost")], []),
    ("k2", "第2弾", "ホンモノはどれだ？生成AIのひみつ", "生成AIのしくみを知り、見破る力をつける",
     [("投票アプリ", "../apps/vote/?set=koza2", "ホンモノクイズ・次の言葉の予想", "sky"),
      ("ミニ生成AI", "../apps/minigpt/", "クラスの文から文を作るAI・かたよりモード・ウソ探し", "amb"),
      ("AI for Oceans（Code.org）", "https://code.org/oceans", "AIをわざと失敗させる", "ghost"),
      ("Interland（Google）", "https://beinternetawesome.withgoogle.com/ja_jp/interland", "ニセモノを見破るゲーム", "ghost")],
     [("投票アプリ（先生の画面）", "../apps/vote/screen.html?set=koza2"), ("ミニ生成AI（先生の画面）", "../apps/minigpt/screen.html")]),
    ("k3", "第3弾", "スマホでゲームを作ろう", "傾け迷路で遊び、ルールを変え、ステージを作る",
     [("ゲームメーカー", "../apps/game/", "傾け迷路・ルールの数字・ステージづくり・QR交換", "mint")], []),
    ("k4", "第4弾", "宇宙の研究者になろう", "本物の銀河を分類して、宇宙の研究に参加する",
     [("ギャラクシーラボ", "../apps/galaxy/", "銀河カードの練習・質問の木・対訳", "coral"),
      ("みんなで銀河を分類", "../apps/vote/?set=koza4", "同じ5つの銀河をクラス全員で分類", "sky"),
      ("Galaxy Zoo（Zooniverse）", "https://www.zooniverse.org/projects/zookeeper/Galaxy-Zoo", "本物の銀河の写真を分類する", "ghost")],
     [("みんなで分類（先生の画面）", "../apps/vote/screen.html?set=koza4")]),
    ("k5", "第5弾", "音を見よう、音で動かそう", "声を波で見て、声で動かし、AIと奏でる",
     [("サウンドラボ", "../apps/sound/", "声の波・サンプリング・声でジャンプ・ハンドシンセ", "pur"),
      ("Blob Opera（Google Arts & Culture）", "https://artsandculture.google.com/experiment/blob-opera/AAHWrq360NcGbw", "AIが和音をつけて歌う", "ghost"),
      ("Song Maker（Chrome Music Lab）", "https://musiclab.chromeexperiments.com/Song-Maker/", "くり返しで曲を作る", "ghost")], []),
]
HEAD = """<!DOCTYPE html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title><link rel="stylesheet" href="{css}">
<style>.app-link{{display:block;text-decoration:none;margin-bottom:10px}}.app-link .btn{{width:100%;justify-content:flex-start;flex-direction:column;align-items:flex-start;gap:2px;min-height:64px}}
.app-link small{{font-weight:400;font-size:13px;opacity:.9}}.btn.ghost{{background:#fff;color:var(--pur);border:2px solid var(--pur)}}.btn.ghost small{{color:var(--sub)}}
.btn.sky{{background:var(--sky)}}.btn.mint{{background:var(--mint)}}.btn.amb{{background:var(--amb)}}.btn.coral{{background:var(--coral)}}</style></head>
<body><header class="app"><h1>{h1}</h1><span class="tag">愛知県立高専 公開講座</span></header><main>
"""
FOOT = """</main><footer class="app">愛知県立高等専門学校 公開講座「使う人から作る人へ」<br>名前やメールを入れる場面はありません。写真・声・映像はスマホの外に送りません。</footer></body></html>
"""
def page(k, no, name, lead, apps, teacher):
    s = HEAD.format(title=f"{no}「{name}」", css="../common/style.css", h1=f"{no}「{html.escape(name)}」")
    s += f'<div class="card"><h2>{html.escape(lead)}</h2><p class="muted">使うアプリは、ぜんぶここから開けます。インストール・ログインはいりません。</p></div>\n'
    for t, u, d, c in apps:
        ext = u.startswith("http")
        tgt = ' target="_blank" rel="noopener"' if ext else ""
        s += f'<a class="app-link" href="{u}"{tgt}><span class="btn {c}">{html.escape(t)}<small>{html.escape(d)}</small></span></a>\n'
    if teacher:
        s += '<div class="card"><h2>先生用</h2>' + "".join(f'<p><a href="{u}">{html.escape(t)}</a></p>' for t, u in teacher) + "<p class='muted'>スクリーンに映して使います。生徒用のQRコードが画面に出ます。</p></div>\n"
    s += '<p><a href="../">← シリーズのトップへ</a></p>\n' + FOOT
    os.makedirs(os.path.join(ROOT, k), exist_ok=True)
    open(os.path.join(ROOT, k, "index.html"), "w", encoding="utf-8").write(s)

def top():
    s = HEAD.format(title="公開講座「使う人から作る人へ」", css="common/style.css", h1="公開講座「使う人から作る人へ」")
    s += '<div class="card"><h2>中学2年生向け・全5回</h2><p>スマホのブラウザだけで、AI・生成AI・ゲーム・宇宙・音を「作る人」になる講座です。</p></div>\n'
    for k, no, name, lead, apps, teacher in SERIES:
        s += f'<a class="app-link" href="{k}/"><span class="btn">{no}「{html.escape(name)}」<small>{html.escape(lead)}</small></span></a>\n'
    s += FOOT.replace("</main>", '<p class="muted">アプリの作り：HTML・JavaScript（このサイトのアプリは自由に公開できる部品だけで作っています。くわしくは <a href="THIRD_PARTY_NOTICES.md">THIRD_PARTY_NOTICES.md</a>）</p></main>')
    open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(s)

if __name__ == "__main__":
    for x in SERIES: page(*x)
    top(); print("ok")
