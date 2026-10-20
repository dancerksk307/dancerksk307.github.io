// ドロワーメニュー（進捗・保存設定・リセット）と、それを開くボタンを画面に差し込む。
// save.js と config.js を先に読み込んでおくこと。
// 開くボタン（.totk-menu-button）は、地図ツールの起動後に index.html が地図の中へ移す。移すまでは見えない（common.css）
(function () {
  'use strict';

  // 進捗を出す種類。チェック欄がある種類だけ（施設・神殿・岩オクタは地図ツール側にチェック欄が無い）
  var PROGRESS_GROUPS = [
    {
      heading: '進捗',
      items: [
        { type: 'hokora', title: '祠' },
        { type: 'hokorachallenge', title: '祠チャレ' },
        { type: 'tower', title: '鳥望台' },
        { type: 'cave', title: '洞窟' },
        { type: 'well', title: '井戸' },
        { type: 'korok', title: 'コログ' },
        { type: 'stables', title: '馬宿' },
      ],
    },
    {
      heading: '進捗（ボス）',
      items: [
        { type: 'hinokkusu', title: 'ヒノックス' },
        { type: 'iwarokku', title: 'イワロック' },
        { type: 'ierokku', title: 'イエロック' },
        { type: 'block', title: 'ゴーレム' },
        { type: 'frox', title: 'デグガーマ' },
        { type: 'gurioku', title: 'グリオーク' },
        { type: 'lynel', title: 'ライネル' },
        { type: 'morudora', title: 'モルドラ' },
        { type: 'phantom', title: 'ファントム' },
        { type: 'koga', title: 'コーガ様' },
        { type: 'boss_temple', title: '神殿ボス' },
      ],
    },
    {
      heading: '進捗（地底）',
      items: [
        { type: 'root', title: '地底の根' },
        { type: 'hole', title: '深穴' },
      ],
    },
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

  var root = document.createElement('div');
  root.innerHTML =
    '<button type="button" class="totk-menu-button" aria-label="メニューを開く">☰</button>' +
    '<div class="totk-overlay"></div>' +
    '<nav class="totk-drawer">' +
      '<div class="totk-drawer__head">メニュー<button type="button" class="totk-drawer__close" aria-label="メニューを閉じる">✕</button></div>' +
      '<div class="totk-drawer__progress"></div>' +
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
      '<div class="totk-drawer__reset">' +
        '<p class="totk-drawer__heading">チェックのリセット</p>' +
        // 地図ツールは起動時に .js-check-reset-all へリセット処理（確認つき）を付けるので、このクラス名は変えない。
        // 地図ツールより先に画面にある必要があるので、ここで作っている。誤って押さないよう、メニューの一番下に置いている
        '<button type="button" class="totk-drawer__reset-button js-check-reset-all" data-confirm="すべてのチェックを消します。よろしいですか？">すべてのチェックを消す</button>' +
      '</div>' +
    '</nav>';

  function find(selector) { return root.querySelector(selector); }

  find('.totk-drawer__dest').textContent = config.owner && config.repo
    ? '保存先: ' + config.owner + '/' + config.repo + '（' + config.branch + ' ブランチ）'
    : '保存先: 未設定（config.js）';

  // 数字は地図ツールが入れる。ツールは画面内の .w-achievement-count（チェック数）と .w-achievement-total-count（総数）を
  // data-types の種類で数えて書き換えるので、このクラス名と属性名は変えない
  PROGRESS_GROUPS.forEach(function (group) {
    var heading = document.createElement('p');
    heading.className = 'totk-drawer__heading';
    heading.textContent = group.heading;
    var list = document.createElement('ul');
    group.items.forEach(function (progress) {
      var item = document.createElement('li');
      item.innerHTML =
        '<span>' + progress.title + '</span>' +
        '<span>' +
          '<span class="w-achievement-count" data-types="' + progress.type + '"></span> / ' +
          '<span class="w-achievement-total-count" data-types="' + progress.type + '"></span>' +
        '</span>';
      list.appendChild(item);
    });
    find('.totk-drawer__progress').appendChild(heading);
    find('.totk-drawer__progress').appendChild(list);
  });

  function setOpen(open) { root.classList.toggle('totk-is-open', open); }
  find('.totk-menu-button').addEventListener('click', function () { setOpen(true); });
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
