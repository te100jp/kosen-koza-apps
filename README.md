# 公開講座「使う人から作る人へ」の自作アプリ

愛知県立高等専門学校の、中学2年生向け公開講座（全5回）で使うアプリです。
生徒は自分のスマホのブラウザで開くだけで使えます（インストール・ログインなし）。

公開後のアドレス：https://te100jp.github.io/kosen-koza-apps/

## アプリの一覧

| 回 | アプリ | アドレス（公開後） | 先生の画面 |
|---|---|---|---|
| 第1弾 | AIメーカー（AIじゃんけんつき） | apps/aimaker/ | − |
| 第1弾 | ピクセル顕微鏡 | apps/pixel/ | − |
| 第2弾 | 投票アプリ | apps/vote/?set=koza2 | apps/vote/screen.html?set=koza2 |
| 第2弾 | ミニ生成AI | apps/minigpt/ | apps/minigpt/screen.html |
| 第3弾 | ゲームメーカー | apps/game/ | − |
| 第4弾 | ギャラクシーラボ | apps/galaxy/ | − |
| 第4弾 | みんなで銀河を分類（投票アプリ） | apps/vote/?set=koza4 | apps/vote/screen.html?set=koza4 |
| 第5弾 | サウンドラボ | apps/sound/ | − |

講座ページ（その回のアプリをまとめたページ）：k1/ 〜 k5/

## 1. GitHub Pages で公開する（最初に1回）

1. GitHub のリポジトリ kosen-koza-apps を開き、上の「Settings」→ 左の「Pages」を開く。
2. 「Build and deployment」の「Source」で「Deploy from a branch」を選ぶ。
3. 「Branch」で「main」と「/ (root)」を選び、「Save」を押す。
4. 数分たつと、https://te100jp.github.io/kosen-koza-apps/ で開けるようになる。

## 2. クラス全員の答えを集めるしくみ（Googleスプレッドシート）

投票アプリ・ミニ生成AI・みんなで銀河を分類は、生徒の答えを先生の画面に集めます。
集める先は、先生の Google アカウントのスプレッドシートです。生徒はログインしません。

1. Google ドライブで、スプレッドシートを新しく作る（名前の例：公開講座_集計）。
2. メニュー「拡張機能」→「Apps Script」を開く。
3. 最初から入っている文字を消し、このリポジトリの gas/Code.gs の中身を全部貼りつける。
4. 2行目あたりの `TEACHER_PIN = '0000'` の 0000 を、先生だけが知る数字に変える（リセットや非表示に使う）。
5. 保存（💾）してから、右上の「デプロイ」→「新しいデプロイ」。
   - 種類の選択（⚙）で「ウェブアプリ」
   - 次のユーザーとして実行：自分
   - アクセスできるユーザー：全員
6. 「デプロイ」を押す。初回は「アクセスを承認」を求められるので、自分のアカウントで許可する。
7. 表示された「ウェブアプリのURL」（https://script.google.com/macros/s/……/exec）をコピーする。
8. GitHub でこのリポジトリの common/config.js を開き、鉛筆のマーク（Edit）を押して、`API_URL: ""` の " " の中にURLを貼り、「Commit changes」を押す。
9. 数分後、アプリの右下に「● つながっています」と出れば完了。

- `ROOM` は講座ごとの部屋の名前です。回ごとに変えると、前回の答えとまざりません（英数字のみ）。
- URLを貼る前でも、アプリは「この端末だけモード」で動きます（練習や見本に使える）。

## 3. 講座の前に確かめること

- iPhone（Safari）と Android（Chrome）で、カメラ・マイク・傾きセンサーの許可が出るか。
- 第2弾のクイズの写真を apps/vote/img/ に置く（p01a.jpg・p01b.jpg … p10b.jpg、r01a.jpg … r02b.jpg）。
  写真は風景・動物・食べ物だけにし、人の顔は使わない。正解は apps/vote/questions.js の `answer` に書く。
- 外部の教材（AI for Oceans の日本語表示、Interland、Galaxy Zoo、Blob Opera、Song Maker）が会場のWi-Fiで開けるか。
- 会場のWi-Fiがつながりにくいときは、投票アプリの「手で数を入れる」（手挙げ）で続けられる。

## 4. 講座のあとで

- スプレッドシートのシート「data」の2行目から下を消すと、集めた答えはすべて消えます。

## 5. 記録すること・しないこと

- 送るのは「部屋の名前・項目の名前・端末ごとのランダムな番号・答え」だけ。名前・メール・写真・声は送りません。
- AIメーカー・ピクセル顕微鏡・サウンドラボの写真・映像・声は、スマホの中だけで使い、保存も送信もしません。
- ゲームメーカーのステージと、質問の木は、QRコード（URL）の中にだけ入ります。

## 6. ファイルの作り直し

- 銀河カード：`python3 tools/make_galaxy_cards.py`
- 講座ページ：`python3 tools/make_pages.py`
- 手もとで試す：`node tools/mock_server.js 8080` → http://localhost:8080/ （集計も手もとで試せる。URLの後ろに `?api=http://localhost:8080/api` を付ける）

## ライセンス

このアプリのプログラムは MIT License です（LICENSE）。使っている部品は THIRD_PARTY_NOTICES.md を見てください。
