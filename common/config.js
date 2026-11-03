/* 設定ファイル（先生が1回だけ書きかえる）
 *
 * API_URL：Googleスプレッドシートに貼った Apps Script を「ウェブアプリ」として公開したときのURL
 *          （https://script.google.com/macros/s/……/exec）を、" " の中に貼りつける。
 *          空のままだと「この端末だけモード」で動く（クラス全員の集計はできないが、練習や見本には使える）。
 * ROOM   ：講座ごとの部屋の名前。毎回の講座で変えると、前回の答えとまざらない（英数字のみ）。
 */
window.KOZA_CONFIG = {
  API_URL: "",
  ROOM: "koza2027"
};
