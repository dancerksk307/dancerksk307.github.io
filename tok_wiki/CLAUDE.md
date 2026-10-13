# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

ティアーズ オブ ザ キングダムの攻略マップ（祠・洞窟・コログ・ボスなど23種類を1つの地図に載せている）。ビルド工程のない静的サイトで、
`dancerksk307/dancerksk307.github.io` リポジトリの `tok_wiki/` フォルダとして GitHub Pages で公開する
（https://dancerksk307.github.io/tok_wiki/）。このフォルダ自体は git 管理下にない。

## コマンド

```
node --test tests/                                   # 全テスト
node --test --test-name-pattern="衝突" tests/        # 名前で絞って1件だけ
node --test tests/pins.test.js                       # ピンデータの検査だけ（件数・id の重なり・洞窟と同名のピン）
```

ビルド・lint・package.json は無い（依存ゼロ、Node 標準の `node:test` のみ）。
画面確認は `index.html` を直接開けばよい（`file://` でも GitHub API の読み込みは通る）。

## 全体の作り

### 地図は外部の圧縮済みツールに任せている

`index.html` は、GameWith の地図ツール
（`article_maptool-3.0.0.zelda.min.js`、jQuery プラグイン `$.fn.leafletArticleMapToolV3`）を元サイトから直接読み込み、
ページ内の `window._mapDatas` / `window._typeDatas` / `var data = [...]`（ピン）を渡すだけ。ツール本体は改造できない。
そのため次の制約がある。

- `#article-body` と `#RenderMap` の id は変えない（ツールが幅の判定や CSS で依存している）。
- **ピンの種類名（`type`）でツールの動きが決まる**。吹き出しに何を出すか（名前・画像・記事リンク・チェック欄）は
  ツール内の `switch(type)` で固定されており、独自の種類名を作ると吹き出し自体が出ない。既存の種類名から選ぶこと。
- 種類 `cave` は「同じ `name` のピンを1つのチェックにまとめる」特別扱いがある。進捗の分母はピン数のままなので、
  入口が複数ある洞窟の名前に（1）（2）…を付けて、あえて別名にしている。
  このまとめ方は **種類を問わず「cave と同じ名前のピン」の id を cave 側の id に書き換える**。
  他の種類に洞窟と同じ名前のピンを足すと id がぶつかる（元の祠マップにあった種類 `hokora-cave` の31ピンは、これに当たるため載せていない）。
- リセットはツールが起動時に `.js-check-reset-all` へ処理を付ける（確認文言は `data-confirm`）。
  このボタンは `drawer.js` が上部バーに差し込むので、ツール起動より前に DOM に存在している必要がある。
- 吹き出しの「取得済み／未取得」の文言は `#RenderMap` の `data-pin-checked` / `data-pin-unchecked` で変えられる。
  全種類で1つの文言しか持てないので、祠にも洞窟にも合う「チェック済み／未チェック」にしている。
- 種類のON/OFFはツールが保存しない。開くたびに起動オプションの `defaultOffTypes` の状態に戻る。
- 進捗の数字はツールが入れる。画面内の `.w-achievement-count`（チェック数）と `.w-achievement-total-count`（総数）を、
  `data-types` の種類で数えて書き換える。☰ の進捗一覧（`drawer.js`）はこの仕組みに乗っているだけ。
- 検索は、選んだピンへ地図を動かして吹き出しを開くだけで、種類のON/OFFは変えない。
  `index.html` の `showTypeOnSearch` が、選んだピンの種類をONにする処理を足している。
  検索の一覧は `name`（無ければ `label`）で作られる。対象の種類は `SEARCH_TYPES`。
- 地図は空島・地上・地底の3つ（`window._mapDatas`）。元ページには `mapId` が「ダミー」のピンが混ざることがあり、
  どの地図にも出ないのに検索の一覧には出るので、載せない。
- 地図の高さは `index.html` の `MAP_HEIGHT`。上部バーの高さ（`common.css` の `.totk-bar`）と、ツールが地図の下に空ける15pxを引いている。

### 下メニュー（index.html の MENU_GROUPS）

ツールの下メニュー（`.TotkSideMenu`）に、種類の組を配列で渡している。ツール側の決まりは次のとおり。

- 1つ目の組は、いつも見えている段。左に「全てOFF」、右に「表示設定」のボタンが付くので、スマホ幅では5種類まで。
- 2つ目以降の組（4つまで）は、「表示設定」を押して上に開いたときだけ見える。`subject` が見出しになる。
  スマホ幅で1段に6種類まで並び、7種類以上の組はツールが半分ずつ（切り上げ）の2段に分ける。
- 開いたメニューの高さは390pxで固定。今は 1段＋見出しつきの組3つ（うち1つは2段）で収まっている。組や段を増やすときは画面で確かめる。
- 組を2つ以上渡すと、ツールがメニュー全体にスワイプ用の処理を付け、ボタン（`label`）以外へのタッチを打ち消す。
  メニューの中に独自のボタンを足しても、スマホでは押せない。

### 同時に表示できる種類の上限（index.html の MAX_SHOWN_TYPES）

ピンを出しすぎて重くならないよう、ONにできる種類を3つまでにしている。`limitShownTypes` が各ボタンの `click` を取り消す
（取り消すとチェックが戻り、ツールの `change` の処理も走らない）。メニューの中のクリックは Leaflet が外へ伝えないので、
`document` ではなくボタン1つずつに付けている。検索からONにするとき（`showTypeOnSearch`）も同じ上限に従う。
上限に当たったときのお知らせは `showNotice`（`common.css` の `.totk-notice`）。全画面表示でも見えるよう `#RenderMap` の中に置いている。

### チェックデータの保存（save.js）

ツールはチェック状態を localStorage のキー `ZeldaTotkMap`（`{"3001":true,...}`）にしか読み書きしない。
すべての種類のチェックがこの1データに入る。`save.js` はツールに触れずに前後へ同期を挟む。

1. 起動前に GitHub Contents API から json を取り、localStorage に入れる。`index.html` は `TotkSave.ready` を待ってからツールを起動する。
2. `Storage.prototype.setItem/removeItem` を包んで `ZeldaTotkMap` への書き込みを検知し、3秒後にまとめて `PUT`（1保存＝1コミット）。
3. 最後に同期した状態を `ZeldaTotkMap_base` に持ち、**丸ごと上書きせず「base との差分」だけを最新に重ねる**。
   他の端末・タブとの衝突（409/422）や、送る前に閉じた変更の再送はこの差分方式で解決している。
   base が無い（そのブラウザで初めて）ときは GitHub 側を正とし、元からあるブラウザ内データは引き継がない。

`save.js` は `createSync`（通信・保存先を外から渡せる本体。テスト対象）と `start`（ブラウザ用の組み立て）に分かれた UMD。
保存先は `config.js`。公開用の master ではなく `save-data` ブランチに保存している（master だと保存のたびに Pages の再公開が走るため）。
ブランチが無ければ初回保存時に既定ブランチから自動で作る。

GitHub のトークンはコードに書かない。メニューから入力し、そのブラウザの localStorage（`TotkGithubToken`）にだけ置く。

### 上部バーとドロワー（drawer.js / common.css）

`drawer.js` が上部バー（☰・タイトル・リセット）、ドロワー（進捗・保存設定・保存状態）を body 先頭に差し込み、
`TotkSave.start()` を呼ぶ。読み込み順は `config.js` → `save.js` → `drawer.js` → `index.html` の起動スクリプト。
クラス名はツールの CSS とぶつからないよう `totk-` で始める。

## ピンの種類を追加するとき

1. `index.html` の `var data` にピンを足し、`MENU_GROUPS` のどれかの組に種類名を足す（既存の種類名から選ぶ。上の制約を参照）。
   開いた直後に出すなら `DEFAULT_ON_TYPES` に、名前で探せるようにするなら `SEARCH_TYPES` にも足す。
2. 下メニューの段の分かれ方が変わることがあるので、開いた状態の並びをスマホ幅の画面で確かめる。
3. チェック欄がある種類なら、`drawer.js` の `PROGRESS_GROUPS` に1行足す。
4. ピンの `id` は全体で重ならないようにする（保存データが共通のため）。GameWith 由来は5桁以下、Game8 由来は7桁。
5. `tests/pins.test.js` の内訳と、`README.md` の一覧を更新する。

GameWith のページはピンデータをそのまま抜き出せる。Game8 のページは地図の仕組みが別物（React 製、チェックは Game8 のサーバー保存）なので、
`https://game8.jp/api/tool_structural_mappings/{id}.json` のデータを GameWith の形式に変換して載せる。
座標は地図ごとにずれるため、両サイトに共通する祠・鳥望台を名前で突き合わせて1次式を求めて変換した（`index.html` のピンデータのコメント参照）。

## 編集時の注意

- 全ファイル LF・UTF-8。`index.html` はピンデータで1行が長く、行数も多い（約55万バイト）。
  スクリプトで置換するときはバイト列のまま行い、改行コードを変えない。
- ピンデータを書き換えたら、件数と種類ごとの内訳を数えて確かめる（`tests/pins.test.js` が内訳を検査している）。
