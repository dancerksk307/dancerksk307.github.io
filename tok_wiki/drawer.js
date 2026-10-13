// 上部バー・ドロワーメニュー・保存設定を画面に差し込む（全ページ共通）。
// save.js と config.js を先に読み込んでおくこと。
(function () {
  'use strict';

  // ページを増やすときはここに1行足す
  var PAGES = [
    { href: 'hokora.html', title: '祠マップ' },
    { href: 'korogu.html', title: 'コログマップ' },
    { href: 'doukutsu.html', title: '洞窟マップ' },
  ];

  var STATUS_TEXT = {
    'no-config': '保存先が未設定',
    'loading': '読み込み中…',
    'saved': '保存済み',
    'dirty': '未保存の変更あり',
    'saving': '保存中…',
    'no-token': 'トークン未設定（このブラウザ内のみ保存）',
    'load-error': '読み込めませんでした',
    'save-error': '保存できませんでした',
  };
  var WARN_STATES = ['no-config', 'no-token', 'load-error', 'save-error'];

  function errorReason(httpStatus) {
    if (!httpStatus) return '通信エラー';
    if (httpStatus === 401) return 'トークンが無効';
    if (httpStatus === 403) return '権限不足か回数制限';
    if (httpStatus === 404) return '保存先が見つからない';
    return 'HTTP ' + httpStatus;
  }

  var config = window.TOTK_SAVE_CONFIG || {};
  var currentFile = location.pathname.split('/').pop();
  var currentPage = PAGES.filter(function (page) { return page.href === currentFile; })[0];

  var root = document.createElement('div');
  root.innerHTML =
    '<header class="totk-bar">' +
      '<button type="button" class="totk-bar__menu" aria-label="メニューを開く">☰</button>' +
      '<span class="totk-bar__title"></span>' +
      // 地図ツールは起動時に .js-check-reset-all へリセット処理を付けるので、このクラス名は変えない。
      // 地図の操作中に誤って押さないよう、地図から離れたバーの右端に置いている
      '<button type="button" class="totk-bar__reset js-check-reset-all" data-confirm="すべてのページのチェックを消します。よろしいですか？">リセット</button>' +
    '</header>' +
    '<div class="totk-overlay"></div>' +
    '<nav class="totk-drawer">' +
      '<div class="totk-drawer__head">メニュー<button type="button" class="totk-drawer__close" aria-label="メニューを閉じる">✕</button></div>' +
      '<ul class="totk-drawer__pages"></ul>' +
      '<div class="totk-drawer__settings">' +
        '<p class="totk-drawer__heading">保存設定</p>' +
        '<p class="totk-drawer__dest"></p>' +
        '<p class="totk-drawer__status"></p>' +
        '<p class="totk-drawer__token-state"></p>' +
        '<input type="password" class="totk-drawer__token" placeholder="GitHub のトークンを貼り付け" autocomplete="off">' +
        '<div class="totk-drawer__buttons">' +
          '<button type="button" class="totk-drawer__set">設定</button>' +
          '<button type="button" class="totk-drawer__clear">削除</button>' +
        '</div>' +
      '</div>' +
    '</nav>';

  function find(selector) { return root.querySelector(selector); }

  find('.totk-bar__title').textContent = currentPage ? currentPage.title : document.title;
  find('.totk-drawer__dest').textContent = config.owner && config.repo
    ? '保存先: ' + config.owner + '/' + config.repo + '（' + config.branch + ' ブランチ）'
    : '保存先: 未設定（config.js）';

  PAGES.forEach(function (page) {
    var item = document.createElement('li');
    var link = document.createElement('a');
    link.href = page.href;
    link.textContent = page.title;
    if (page === currentPage) link.className = 'is-current';
    item.appendChild(link);
    find('.totk-drawer__pages').appendChild(item);
  });

  function setOpen(open) { root.classList.toggle('totk-is-open', open); }
  find('.totk-bar__menu').addEventListener('click', function () { setOpen(true); });
  find('.totk-drawer__close').addEventListener('click', function () { setOpen(false); });
  find('.totk-overlay').addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setOpen(false);
  });

  function showStatus(state, httpStatus) {
    var status = find('.totk-drawer__status');
    var isError = state === 'load-error' || state === 'save-error';
    status.textContent = '状態: ' + STATUS_TEXT[state] + (isError ? '（' + errorReason(httpStatus) + '）' : '');
    status.classList.toggle('is-warn', WARN_STATES.indexOf(state) !== -1);
  }

  // 地図ツールは #article-body の中だけを使うので、その外（body の先頭）に置く
  document.body.insertBefore(root, document.body.firstChild);

  var save = window.TotkSave.start({ config: config, onStatus: showStatus });

  function showTokenState() {
    find('.totk-drawer__token-state').textContent = 'トークン: ' + (save.hasToken() ? '設定済み' : '未設定');
  }
  showTokenState();

  find('.totk-drawer__set').addEventListener('click', function () {
    var input = find('.totk-drawer__token');
    var token = input.value.trim();
    if (!token) return;
    save.setToken(token);
    input.value = '';
    showTokenState();
    // 読み直すことで、トークンが正しいかをその場で確かめ、未保存の変更があれば送る
    save.reload();
  });

  find('.totk-drawer__clear').addEventListener('click', function () {
    save.setToken('');
    showTokenState();
    showStatus('no-token');
  });
})();
