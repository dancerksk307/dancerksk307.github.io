// お気に入りのリンク。☰ のサイドメニューの一番上に一覧を出し、押すと別のタブで開く。
// 攻略サイト（GameWith・Game8 など）は他のページの中への埋め込みを禁止しているので、地図の中には出さない。
// 追加・書き換え・削除・並べ替えも、サイドメニューの中で行う（利用者の要望）。
// 一覧は GitHub の保存先（config.js の linksPath）に保存する。チェックのファイルとは別なので、チェックのデータには触れない（メモと同じ作り）。
// 保存するデータ: { version: 1, links: [{ name: '名前（空でもよい）', url: 'https://…' }] }
// drawer.js（入れ物 .totk-drawer__links と ☰ ボタン）と save.js（TotkSave.start）を先に動かしておくこと
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.TotkLinks = api;
    api.setup();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = 1;
  var LOCAL_KEY = 'TotkLinks'; // ブラウザ内の控え（GitHub から読めないとき・トークンが無いときに使う）

  // 開いたときにページの中で何かが動く URL（javascript: など）を保存しないよう、http と https だけを通す
  function isSafeUrl(url) {
    return typeof url === 'string' && /^https?:\/\/\S+$/i.test(url);
  }

  // 保存データを一覧にする。壊れたデータは空の一覧にし、GitHub 上で直接書き換えられた危ない URL も捨てる
  function normalize(data) {
    if (!data || !Array.isArray(data.links)) return [];
    return data.links
      .filter(function (link) { return link && isSafeUrl(link.url); })
      .map(function (link) { return { name: typeof link.name === 'string' ? link.name : '', url: link.url }; });
  }

  function toData(links) {
    return { version: VERSION, links: links };
  }

  // 編集中の行を保存する形に整える。名前も URL も空の行は捨てる。
  // URL が空・http(s) 以外の行があれば、その行（invalid）を返し、呼び出し側は保存しない
  function clean(rows) {
    var links = [];
    var invalid = null;
    rows.forEach(function (row) {
      var link = { name: String(row.name || '').trim(), url: String(row.url || '').trim() };
      if (!link.name && !link.url) return;
      if (!isSafeUrl(link.url)) {
        if (!invalid) invalid = link;
        return;
      }
      links.push(link);
    });
    return { links: links, invalid: invalid };
  }

  // index の行を delta（-1 で上、1 で下）だけ動かした新しい一覧。端より外へは動かさない
  function move(list, index, delta) {
    var copy = list.slice();
    var to = index + delta;
    if (index < 0 || index >= copy.length || to < 0 || to >= copy.length) return copy;
    var item = copy.splice(index, 1)[0];
    copy.splice(to, 0, item);
    return copy;
  }

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY)); } catch (e) { return null; }
  }

  function writeLocal(data) {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); } catch (e) { /* 保存できないブラウザでも GitHub 側は使える */ }
  }

  function element(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function setup() {
    var container = document.querySelector('.totk-drawer__links');
    if (!container) return;
    var config = window.TOTK_SAVE_CONFIG || {};
    var store = window.TotkSave.openFile(config.linksPath);
    var links = normalize(readLocal());
    var draft = null; // 編集中の行（null のときは一覧を出している）
    var loading = false;
    var saving = false;

    // 名前や URL は textContent・value・href で入れ、HTML として組み立てない（入力した文字が画面の部品にならないように）
    var head = element('div', 'totk-links__head');
    head.appendChild(element('p', 'totk-drawer__heading', 'お気に入り'));
    var editButton = element('button', 'totk-links__edit', '編集');
    editButton.type = 'button';
    head.appendChild(editButton);
    var body = element('div', 'totk-links__body');
    var messageLine = element('p', 'totk-links__message');
    container.appendChild(head);
    container.appendChild(body);
    container.appendChild(messageLine);

    function message(text, isError) {
      messageLine.textContent = text;
      messageLine.classList.toggle('is-error', !!isError);
    }

    function button(className, text, label, onClick) {
      var b = element('button', className, text);
      b.type = 'button';
      if (label) b.setAttribute('aria-label', label);
      b.addEventListener('click', onClick);
      return b;
    }

    function renderList() {
      var list = element('ul', 'totk-links__list');
      if (!links.length) list.appendChild(element('li', 'is-empty', 'まだありません。「編集」から足せます'));
      links.forEach(function (link) {
        var item = element('li');
        var a = element('a', '', link.name || link.url);
        a.href = link.url;
        // 地図のページを残したまま開く
        a.target = '_blank';
        a.rel = 'noopener';
        item.appendChild(a);
        list.appendChild(item);
      });
      body.appendChild(list);
    }

    function renderEditor() {
      draft.forEach(function (row, index) {
        var line = element('div', 'totk-links__row');
        var name = element('input', 'totk-links__name');
        name.placeholder = '名前（空なら URL を出す）';
        name.value = row.name;
        name.addEventListener('input', function () { row.name = name.value; });
        var url = element('input', 'totk-links__url');
        url.type = 'url';
        url.placeholder = 'https://…';
        url.value = row.url;
        url.addEventListener('input', function () { row.url = url.value; });
        var up = button('totk-links__move', '↑', '上へ', function () { draft = move(draft, index, -1); render(); });
        var down = button('totk-links__move', '↓', '下へ', function () { draft = move(draft, index, 1); render(); });
        var remove = button('totk-links__remove', '✕', '消す', function () { draft.splice(index, 1); render(); });
        up.disabled = index === 0;
        down.disabled = index === draft.length - 1;
        [name, url, up, down, remove].forEach(function (el) { line.appendChild(el); });
        body.appendChild(line);
      });
      body.appendChild(button('totk-drawer__wide-button totk-links__add', '＋追加', '', function () {
        draft.push({ name: '', url: '' });
        render();
        var names = body.querySelectorAll('.totk-links__name');
        names[names.length - 1].focus();
      }));
      var buttons = element('div', 'totk-drawer__buttons totk-links__buttons');
      var saveButton = button('totk-links__save', '保存', '', save);
      saveButton.disabled = saving;
      buttons.appendChild(saveButton);
      buttons.appendChild(button('totk-links__cancel', 'やめる', '', function () {
        draft = null;
        message('');
        render();
      }));
      body.appendChild(buttons);
    }

    function render() {
      body.textContent = '';
      editButton.hidden = !!draft;
      editButton.disabled = loading;
      if (draft) renderEditor(); else renderList();
    }

    // サイドメニューを開くたびに GitHub の最新を読む（他の端末で足した分も見えるように）。読み終わるまでは編集できない。
    // 古い一覧から編集を始めると、保存したときに他の端末で足した分を消してしまうため。編集中は読み直さない（書きかけを残す）
    function reload() {
      if (draft || loading || saving) return;
      loading = true;
      message('読み込み中…');
      render();
      store.load().then(function (remote) {
        if (remote !== null) {
          links = normalize(remote);
          writeLocal(remote);
        }
        message('');
      }, function (error) {
        message('GitHub から読めませんでした（' + window.TotkSave.errorReason(error.status) + '）。このブラウザに残っている一覧を出しています', true);
      }).then(function () {
        loading = false;
        render();
      });
    }

    function save() {
      var result = clean(draft);
      if (result.invalid) {
        message('「' + (result.invalid.name || result.invalid.url || '名前なし') + '」の URL は、http:// か https:// で始まる形で入れてください', true);
        return;
      }
      var data = toData(result.links);
      saving = true;
      render();
      writeLocal(data);
      message('保存中…');
      store.save(data).then(function (state) {
        links = result.links;
        draft = null;
        saving = false;
        render();
        message(state === 'saved' ? '保存しました' : 'このブラウザだけに保存しました（GitHub のトークンが未設定）');
      }, function (error) {
        saving = false;
        render();
        message('GitHub に保存できませんでした（' + window.TotkSave.errorReason(error.status) + '）。もう一度「保存」を押してください', true);
      });
    }

    editButton.addEventListener('click', function () {
      draft = links.map(function (link) { return { name: link.name, url: link.url }; });
      if (!draft.length) draft.push({ name: '', url: '' });
      message('');
      render();
    });

    var menuButton = document.querySelector('.totk-menu-button');
    if (menuButton) menuButton.addEventListener('click', reload);
    render();
  }

  return {
    isSafeUrl: isSafeUrl,
    normalize: normalize,
    toData: toData,
    clean: clean,
    move: move,
    setup: setup,
  };
});
