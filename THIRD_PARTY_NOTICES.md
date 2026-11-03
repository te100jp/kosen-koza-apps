# 使っている部品と、そのライセンス

このサイトのアプリは、HTML と JavaScript で作っています。外部の部品は、どれも自由に公開・配布してよいライセンスのものだけです。

| 部品 | 使っている場所 | ライセンス | 置き方 |
|---|---|---|---|
| QR Code Generator for JavaScript（Kazuhiko Arase） | QRコードを作る（common/qrcode.js） | MIT | このサイトに同梱 |
| TensorFlow.js（Google） | AIメーカーのAIの計算（common/vendor/tf.min.js） | Apache License 2.0 | このサイトに同梱 |
| MobileNet v1 0.25 の学習済みモデル（Google） | AIメーカーの「写真の特ちょう」 | Apache License 2.0 | 使うときに storage.googleapis.com から読みこむ |
| MediaPipe Tasks Vision（Google） | サウンドラボのハンドシンセ（手の位置） | Apache License 2.0 | 使うときに cdn.jsdelivr.net と storage.googleapis.com から読みこむ |

- 読みこめないとき（通信が止まっているときなど）は、AIメーカーは「かんたん版のAI」、ハンドシンセは「指でなぞる」に切りかわります。
- QR Code は株式会社デンソーウェーブの登録商標です。
- 銀河カードの絵は、このサイトのために作ったイラストです（tools/make_galaxy_cards.py）。

外部のサービス（Quick, Draw!、AI for Oceans、Interland、Galaxy Zoo、Blob Opera、Song Maker）は、リンクで開くだけで、このサイトには入っていません。
