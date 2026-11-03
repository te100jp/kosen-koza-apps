/* 設定ファイル（先生が1回だけ書きかえる）
 *
 * API_URL：Googleスプレッドシートに貼った Apps Script を「ウェブアプリ」として公開したときのURL
 *          （https://script.google.com/macros/s/……/exec）を、" " の中に貼りつける。
 *          空のままだと「この端末だけモード」で動く（クラス全員の集計はできないが、練習や見本には使える）。
 * ROOM   ：講座ごとの部屋の名前。毎回の講座で変えると、前回の答えとまざらない（英数字のみ）。
 */
window.KOZA_CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbyvzMST3zsAF1WLU-2-FRXg3uabYo1JX15fidjFIccWCu-DqKeG2LMOHwYeL8I2_ha6/exec",
  ROOM: "koza2027"
};
