// 赤い月の最終発生日時。☰ のサイドメニュー（お気に入りの下）に出し、ボタン1つで「今」の日時を記録する（確かめのダイアログあり）。
// 赤い月は一定の周期（利用者の話では3時間ごと）で起きるので、最後に起きた日時を控えておくためのもの（利用者の要望）。
// 記録は GitHub の保存先（config.js の redMoonPath）に保存する。チェックのファイルとは別なので、チェックのデータには触れない。
// 保存するデータ: { version: 1, last: '2026-11-16T05:32:00.000Z' }（ISO 形式。表示はスマホの時計の時刻にする）
// drawer.js（入れ物 .totk-drawer__redmoon と ☰ ボタン）と save.js（TotkSave.start）を先に動かしておくこと
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.TotkRedMoon = api;
    api.setup();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = 1;
  var LOCAL_KEY = 'TotkRedMoon'; // ブラウザ内の控え（GitHub から読めないとき・保存できなかったときに使う）
  var WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

  // 保存データを日時にする。無い・壊れているときは null
  function normalize(data) {
    if (!data || typeof data.last !== 'string') return null;
    var date = new Date(data.last);
    return isNaN(date.getTime()) ? null : date;
  }

  function toData(date) {
    return { version: VERSION, last: date.toISOString() };
  }

  // 新しい方の日時（片方が null ならもう片方）。GitHub に保存できなかった記録を、古い記録で上書きしないため
  function newer(a, b) {
    if (!a) return b;
    if (!b) return a;
    return a.getTime() >= b.getTime() ? a : b;
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  // 2026/11/16(月) 14:32 の形（この端末の時刻）
  function formatDate(date) {
    return date.getFullYear() + '/' + pad(date.getMonth() + 1) + '/' + pad(date.getDate()) +
      '(' + WEEKDAYS[date.getDay()] + ') ' + pad(date.getHours()) + ':' + pad(date.getMinutes());
  }

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY)); } catch (e) { return null; }
  }

  function writeLocal(data) {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); } catch (e) { /* 保存できないブラウザでも GitHub 側は使える */ }
  }

  function setup() {
    var container = document.querySelector('.totk-drawer__redmoon');
    if (!container) return;
    var config = window.TOTK_SAVE_CONFIG || {};
    var store = window.TotkSave.openFile(config.redMoonPath);
    var last = normalize(readLocal());
    var loading = false;
    var saving = false;

    container.innerHTML =
      '<p class="totk-drawer__heading">赤い月</p>' +
      '<p class="totk-redmoon__last">最終発生: <span class="totk-redmoon__date"></span></p>' +
      '<button type="button" class="totk-drawer__wide-button totk-redmoon__record">赤い月が出た（今の日時を記録）</button>' +
      '<p class="totk-redmoon__message"></p>';
    function find(selector) { return container.querySelector(selector); }
    var recordButton = find('.totk-redmoon__record');

    function message(text, isError) {
      var p = find('.totk-redmoon__message');
      p.textContent = text;
      p.classList.toggle('is-error', !!isError);
    }

    function render() {
      find('.totk-redmoon__date').textContent = last ? formatDate(last) : 'まだ記録がありません';
      recordButton.disabled = loading || saving;
    }

    // サイドメニューを開くたびに GitHub の最新を読む（他の端末で記録した分も見えるように）
    function reload() {
      if (loading || saving) return;
      loading = true;
      render();
      store.load().then(function (remote) {
        last = newer(last, normalize(remote));
        if (last) writeLocal(toData(last));
        message('');
      }, function (error) {
        message('GitHub から読めませんでした（' + window.TotkSave.errorReason(error.status) + '）。このブラウザの記録を出しています', true);
      }).then(function () {
        loading = false;
        render();
      });
    }

    recordButton.addEventListener('click', function () {
      var now = new Date();
      if (!window.confirm('今（' + formatDate(now) + '）を、赤い月の最終発生日時として記録しますか？')) return;
      var data = toData(now);
      last = now;
      saving = true;
      writeLocal(data);
      render();
      message('保存中…');
      store.save(data).then(function (state) {
        message(state === 'saved' ? '記録しました' : 'このブラウザだけに記録しました（GitHub のトークンが未設定）');
      }, function (error) {
        message('GitHub に保存できませんでした（' + window.TotkSave.errorReason(error.status) + '）。このブラウザには記録しました', true);
      }).then(function () {
        saving = false;
        render();
      });
    });

    var menuButton = document.querySelector('.totk-menu-button');
    if (menuButton) menuButton.addEventListener('click', reload);
    render();
  }

  return {
    normalize: normalize,
    toData: toData,
    newer: newer,
    formatDate: formatDate,
    setup: setup,
  };
});
