# tok_wiki

ティアーズ オブ ザ キングダムの攻略マップ（GameWith の地図部分だけを抜き出したもの）。

| ページ | 内容 | 元ページ |
|---|---|---|
| `hokora.html` | 祠マップ | https://gamewith.jp/zelda-totk/article/show/397434 |
| `korogu.html` | コログマップ | https://gamewith.jp/zelda-totk/article/show/397662 |

公開先: https://dancerksk307.github.io/tok_wiki/hokora.html

画面左上の ☰ からページを切り替えられる。

## チェックデータの保存

チェック状態は GitHub 上の json に保存する。どのブラウザ・端末で開いても同じ状態になる。

- 保存先: `dancerksk307/dancerksk307.github.io` の `save-data` ブランチ、`tok_wiki/data/save.json`（`config.js` で変更できる）
- 最後のチェックから約3秒後に、その間の変更をまとめて1コミットで保存する
- 祠とコログのチェックは同じ1つのファイルに入る（「すべてのチェックをリセットする」は両方消える）
- 保存状態は画面右上に出る（「保存済み」「未保存の変更あり」など）

公開用の master ではなく `save-data` ブランチに保存しているのは、master に保存するとチェックのたびに GitHub Pages の再公開が走り、履歴も保存コミットで埋まるため。ブランチは初回の保存時に自動で作られる。

## 初回の準備

1. このフォルダを `dancerksk307.github.io` リポジトリの `tok_wiki/` として push する
2. GitHub で保存用のトークンを作る
   - GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token
   - Repository access: 「Only select repositories」で `dancerksk307.github.io` だけを選ぶ
   - Permissions → Repository permissions → **Contents: Read and write**（これだけ）
3. 地図ページを開き、☰ →「保存設定」にトークンを貼って「設定」を押す（ブラウザごとに1回）

トークンを設定していない間は、チェックはそのブラウザの中にだけ残り、設定した時点でまとめて保存される。

### トークンの扱い

- トークンはコードやリポジトリに書かない。入力したブラウザの中にだけ保存される
- 地図ページは外部サイト（GameWith・cdnjs）のプログラムを読み込んでいるため、権限は上記の最小限にする
- 漏れた疑いがあれば、GitHub の同じ画面でトークンを削除して作り直す

## ファイル構成

| ファイル | 役割 |
|---|---|
| `hokora.html` `korogu.html` | 各マップ（地図設定とピンデータを含む） |
| `common.css` `drawer.js` | 上部バーとドロワーメニュー、保存設定の入力欄 |
| `save.js` | GitHub との読み書き |
| `config.js` | 保存先の設定 |
| `tests/` | `save.js` のテスト |

ページを増やすときは、`drawer.js` の `PAGES` に1行足し、新しい html に既存ページと同じ読み込みタグ（`common.css` `config.js` `save.js` `drawer.js`）を入れる。

## テスト

```
node --test tests/
```
