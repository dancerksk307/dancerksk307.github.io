// チェックデータの保存先（GitHub）。トークンはここに書かない（メニューの「保存設定」からブラウザごとに入力する）
window.TOTK_SAVE_CONFIG = {
  owner: 'dancerksk307',
  repo: 'dancerksk307.github.io',
  // 公開用ブランチ（master）に保存すると、チェックのたびに GitHub Pages の再公開が走り履歴も埋まるため、保存専用ブランチに分けている
  branch: 'save-data',
  path: 'tok_wiki/data/save.json',
  // 下メニューの並び。チェックとはファイルを分け、並びの保存がチェックのデータに触れないようにしている
  layoutPath: 'tok_wiki/data/menu-layout.json',
  // メモ（地図の左下の「メモ」ボタン）。1ページ1ファイルで、プレーンテキストのまま保存する。
  // 1ページ目は、ページが1つだったころのファイルのまま（それまでのメモを引き継ぐため）
  memoPaths: ['tok_wiki/data/memo.txt', 'tok_wiki/data/memo-2.txt', 'tok_wiki/data/memo-3.txt'],
  // お気に入りのリンク（☰ のサイドメニュー）
  linksPath: 'tok_wiki/data/links.json',
  // 赤い月の最終発生日時（☰ のサイドメニュー）
  redMoonPath: 'tok_wiki/data/red-moon.json',
};
