/* 投票アプリの問題（先生が書きかえる）
 *  id      ：問題の番号（英数字。変えると前の答えとまざらない）
 *  text    ：問題文
 *  choices ：選ぶもの（2〜5個）
 *  images  ：写真（img フォルダに置いたファイル名）。ないときは書かない
 *  texts   ：文章クイズの文。ないときは書かない
 *  answer  ：正解（choices の中の1つ）。正解がない問題は null
 *  hint    ：「正解を見せる」で出す説明
 * 写真は風景・動物・食べ物だけにし、人の顔は使わない。
 */
window.VOTE_SETS = {
  koza2: {
    title: "第2弾 ホンモノはどれだ？",
    questions: [
      { id: "p01", text: "第1問：AIが作った夕焼けはどっち？", choices: ["A", "B"], images: ["img/p01a.jpg", "img/p01b.jpg"], answer: null, hint: "どこを見て決めたかを、1つメモしよう" },
      { id: "p02", text: "第2問：AIが作った犬の写真はどっち？", choices: ["A", "B"], images: ["img/p02a.jpg", "img/p02b.jpg"], answer: null },
      { id: "p03", text: "第3問：AIが作ったケーキはどっち？", choices: ["A", "B"], images: ["img/p03a.jpg", "img/p03b.jpg"], answer: null },
      { id: "p04", text: "第4問：AIが作った森の写真はどっち？", choices: ["A", "B"], images: ["img/p04a.jpg", "img/p04b.jpg"], answer: null },
      { id: "p05", text: "第5問：AIが作ったねこの写真はどっち？", choices: ["A", "B"], images: ["img/p05a.jpg", "img/p05b.jpg"], answer: null },
      { id: "p06", text: "第6問：AIが作った海の写真はどっち？", choices: ["A", "B"], images: ["img/p06a.jpg", "img/p06b.jpg"], answer: null },
      { id: "p07", text: "第7問：AIが作ったラーメンはどっち？", choices: ["A", "B"], images: ["img/p07a.jpg", "img/p07b.jpg"], answer: null },
      { id: "p08", text: "第8問：AIが作った花の写真はどっち？", choices: ["A", "B"], images: ["img/p08a.jpg", "img/p08b.jpg"], answer: null },
      { id: "p09", text: "第9問：AIが作った山の写真はどっち？", choices: ["A", "B"], images: ["img/p09a.jpg", "img/p09b.jpg"], answer: null },
      { id: "p10", text: "第10問：AIが作った町の写真はどっち？", choices: ["A", "B"], images: ["img/p10a.jpg", "img/p10b.jpg"], answer: null },
      { id: "t01", text: "文章クイズ：AIが書いたのはどっち？", choices: ["文A", "文B"],
        texts: ["家族で海に行きました。波が高くて、少しこわかったけど、楽しかったです。", "家族で海に行きました。青い海と白い砂浜が広がり、心に残る一日となりました。"],
        answer: null, hint: "「きれいすぎる」文はAIの文に多いが、決め手にはならない" },
      { id: "n01", text: "「むかしむかし、」の次に来る言葉は？", choices: ["あるところに", "おじいさんと", "ももたろうが", "その他"], answer: null,
        hint: "みんなの答えの割合が、そのまま「確率」になる" },
      { id: "n02", text: "「今日の 給食 は、」の次に来る言葉は？", choices: ["カレー", "パン", "魚", "その他"], answer: null,
        hint: "同じ文でも、人によって予想が分かれる。分かれ方が「確率」" },
      { id: "n03", text: "「愛知県 の 名物 は、」の次に来る言葉は？", choices: ["みそかつ", "手羽先", "ういろう", "その他"], answer: null,
        hint: "みんなが知っていることほど、確率が高くなる" },
      { id: "r01", text: "もう一度クイズ①：出どころのヒントつき。AIが作ったのはどっち？", choices: ["A", "B"], images: ["img/r01a.jpg", "img/r01b.jpg"],
        texts: ["出どころ：○○市の観光協会のサイト（撮影者と日付あり）", "出どころ：だれが作ったか書いていないSNSの投稿"], answer: null },
      { id: "r02", text: "もう一度クイズ②：出どころのヒントつき。AIが作ったのはどっち？", choices: ["A", "B"], images: ["img/r02a.jpg", "img/r02b.jpg"],
        texts: ["出どころ：ニュースサイト（撮影した記者の名前あり）", "出どころ：「AIで作成」と小さく書かれた画像"], answer: null }
    ]
  },
  koza4: {
    title: "第4弾 みんなで銀河を分類しよう",
    questions: [1, 2, 3, 4, 5].map(function (i) {
      return { id: "g0" + i, text: "銀河" + i + "は、どの種類？", choices: ["だ円銀河", "渦巻銀河", "棒渦巻銀河", "不規則銀河", "分からない"],
               images: ["../galaxy/img/vote" + i + ".png"], answer: null, hint: "意見が分かれた銀河は、なぜ分かれたのかを話し合おう" };
    })
  }
};
