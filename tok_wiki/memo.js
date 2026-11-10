// メモ。地図の左下の「メモ」ボタンで画面の下半分に開き、プレーンテキストを読み書きする。
// 中身は GitHub の保存先（config.js の memoPath）に、書いたとおりの文字のまま保存する（空白・改行も変えない）。
// チェックのファイルとは別のファイルなので、メモの保存がチェックのデータに触れることはない。
// save.js（TotkSave.start）を先に動かしておくこと。ボタンは、地図ツールの起動後に index.html が地図の中へ移す。移すまでは見えない（common.css）
(function () {
  'use strict';

  var LOCAL_KEY = 'TotkMemo'; // ブラウザ内の控え（GitHub から読めないとき・トークンが無いときに使う）
  var config = window.TOTK_SAVE_CONFIG || {};

  function readLocal() {
    try { return localStorage.getItem(LOCAL_KEY); } catch (e) { return null; }
  }

  function writeLocal(text) {
    try { localStorage.setItem(LOCAL_KEY, text); } catch (e) { /* 保存できないブラウザでも GitHub 側は使える */ }
  }

  function open() {
    // 読むときは下半分にしか出さないので、画面の形によってはメモのボタンが隠れずに見えている。2枚目を開かないようにする
    if (document.querySelector('.totk-memo')) return;
    var store = window.TotkSave.openFile(config.memoPath, 'text');
    var text = readLocal() || '';
    var editing = false;
    var loading = true;

    var root = document.createElement('div');
    root.className = 'totk-memo';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-label', 'メモ');
    root.innerHTML =
      '<div class="totk-memo__head">メモ</div>' +
      '<div class="totk-memo__body">' +
        '<div class="totk-memo__view"></div>' +
        '<textarea class="totk-memo__input" spellcheck="false"></textarea>' +
      '</div>' +
      '<p class="totk-memo__message"></p>' +
      '<div class="totk-memo__buttons">' +
        '<button type="button" class="totk-memo__edit"></button>' +
        '<button type="button" class="totk-memo__close">閉じる</button>' +
        '<button type="button" class="totk-memo__size"></button>' +
      '</div>';
    function find(selector) { return root.querySelector(selector); }
    var view = find('.totk-memo__view');
    var input = find('.totk-memo__input');
    // 1つのボタンを、読んでいる間は「編集」、編集中は「保存」として使う
    var editButton = find('.totk-memo__edit');
    var sizeButton = find('.totk-memo__size');
    var saving = false;

    function message(textToShow, isError) {
      var p = find('.totk-memo__message');
      p.textContent = textToShow;
      p.classList.toggle('is-error', !!isError);
    }

    // 読むときは文字をそのまま出す（空白・改行は CSS の white-space: pre-wrap でそのまま見せる）
    function render() {
      root.classList.toggle('is-editing', editing);
      view.textContent = text;
      view.classList.toggle('is-empty', text === '');
      editButton.textContent = editing ? '保存' : '編集';
      editButton.classList.toggle('is-save', editing);
      editButton.disabled = loading || saving;
      var full = root.classList.contains('is-full');
      sizeButton.textContent = full ? '半分' : '全画面';
      sizeButton.setAttribute('aria-pressed', String(full));
    }

    // 開いたら GitHub の最新を読む（他の端末で書いたメモも見えるように）。読み終わるまでは編集できない。
    // 古い内容のまま編集を始めると、保存したときに他の端末で書いた分を上書きしてしまうため
    message('読み込み中…');
    store.load().then(function (remote) {
      if (remote !== null) {
        text = remote;
        writeLocal(remote);
      }
      message('');
    }, function (error) {
      message('GitHub から読めませんでした（' + window.TotkSave.errorReason(error.status) + '）。このブラウザに残っているメモを出しています', true);
    }).then(function () {
      loading = false;
      render();
    });

    function startEdit() {
      editing = true;
      input.value = text;
      message('');
      render();
      input.focus();
    }

    function save() {
      var newText = input.value;
      saving = true;
      render();
      writeLocal(newText);
      message('保存中…');
      store.save(newText).then(function (result) {
        text = newText;
        editing = false;
        saving = false;
        render();
        message(result === 'saved' ? '保存しました' : 'このブラウザだけに保存しました（GitHub のトークンが未設定）');
      }, function (error) {
        saving = false;
        render();
        message('GitHub に保存できませんでした（' + window.TotkSave.errorReason(error.status) + '）。もう一度「保存」を押してください', true);
      });
    }

    editButton.addEventListener('click', function () {
      if (editing) save(); else startEdit();
    });

    // 下半分と全画面を切り替える。開くたびに下半分から始める（上の地図を使えるようにするのがふだんの形のため）
    sizeButton.addEventListener('click', function () {
      root.classList.toggle('is-full');
      render();
    });

    find('.totk-memo__close').addEventListener('click', function () {
      if (editing && input.value !== text && !window.confirm('保存していない変更があります。閉じますか？')) return;
      document.body.removeChild(root);
    });

    render();
    document.body.appendChild(root);
  }

  var button = document.createElement('button');
  button.type = 'button';
  button.className = 'totk-memo-button';
  button.setAttribute('aria-label', 'メモを開く');
  // 鉛筆のアイコン。絵文字は機種によって色や形が変わるので、☰ と同じ白一色になるよう線で描く（色は CSS の color）
  button.innerHTML =
    '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/><path d="M15 5l4 4"/>' +
    '</svg>';
  button.addEventListener('click', open);
  document.body.appendChild(button);
})();
