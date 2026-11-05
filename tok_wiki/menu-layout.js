// 下メニューの並び（横7マスのマス目）。並びのデータの扱いと、地図ツールが作った下メニューをマス目に並べ直す処理。
// 地図ツールの下メニュー（TotkSideMenu）は「見出し付きの組」しか受け取れず、マスの位置や空きマスを指定できないので、
// ツールにボタンを作らせた後で、ボタンをこのマス目へ移している。
// 並びのデータ: { version: 1, rows: [[7マス分の項目名か null], ...], lines: [線を入れる行の番号] }
//   rows[0] は閉じていても見える段で、左端（rows[0][0]）は「表示設定」の固定マス（FIXED）。
//   項目名は種類名（hokora など）と CLEAR（全てOFF）。lines の n は「n 行目の上に線を引く」（1 以上）。
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TotkMenuLayout = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var COLUMNS = 7;
  var FIXED = '_toggle'; // 表示設定（開閉ボタン）。並べ替えの対象外
  var CLEAR = '_clear';  // 全てOFF
  var ROW_HEIGHT = 48;   // ボタン1段の高さ（地図ツールの段と同じ）
  var LINE_HEIGHT = 8;   // 区切り線1本ぶんの高さ（線1px＋上下の余白）。ROW_HEIGHT と合わせて、メニューの高さが8の倍数になるようにしている
  // 並べ替え画面で作れる段の数。開いたメニューが地図をほとんど隠してしまわない程度にしている
  var MAX_ROWS = 8;
  var LOCAL_KEY = 'TotkMenuLayout'; // ブラウザ内の控え（GitHub から読めないときに使う）

  function emptyRow() {
    var row = [];
    for (var c = 0; c < COLUMNS; c++) row.push(null);
    return row;
  }

  function isLayout(value) {
    return !!value && typeof value === 'object' && value.version === 1 &&
      Array.isArray(value.rows) && value.rows.length > 0 &&
      value.rows.every(function (row) { return Array.isArray(row); });
  }

  // 保存された並びを、今ある項目（items）に合わせて直す。壊れていれば fallback（初期配置）を使う。
  // - 知らない項目（種類を減らしたとき）と、2回目以降に出てくる項目は消す
  // - 置かれていない項目（種類を増やしたとき）は、2段目以降の空いたマスに足す。空きが無ければ段を足す
  // - 何も無い段は詰める（線はその下の段の上へ移す）
  function normalize(saved, items, fallback) {
    var source = isLayout(saved) ? saved : fallback;
    var placed = {};
    var rows = source.rows.map(function (row, r) {
      var cells = emptyRow();
      for (var c = 0; c < COLUMNS; c++) {
        var item = row[c];
        if (r === 0 && c === 0) cells[c] = FIXED;
        else if (items.indexOf(item) !== -1 && !placed[item]) { cells[c] = item; placed[item] = true; }
      }
      return cells;
    });
    var lines = (Array.isArray(source.lines) ? source.lines : []).filter(function (n) {
      return n === Math.floor(n) && n >= 1 && n < rows.length;
    });

    items.forEach(function (item) {
      if (placed[item]) return;
      for (var r = 1; r < rows.length; r++) {
        var c = rows[r].indexOf(null);
        if (c !== -1) { rows[r][c] = item; placed[item] = true; return; }
      }
      var row = emptyRow();
      row[0] = item;
      rows.push(row);
      placed[item] = true;
    });

    for (var r = rows.length - 1; r >= 1; r--) {
      var isEmpty = rows[r].every(function (cell) { return cell === null; });
      if (!isEmpty) continue;
      rows.splice(r, 1);
      lines = lines.map(function (n) { return n > r ? n - 1 : n; }).filter(function (n) { return n < rows.length; });
    }
    lines = lines.filter(function (n, i) { return lines.indexOf(n) === i; }).sort(function (a, b) { return a - b; });

    return { version: 1, rows: rows, lines: lines };
  }

  function copy(layout) {
    return { version: 1, rows: layout.rows.map(function (row) { return row.slice(); }), lines: layout.lines.slice() };
  }

  // 並べ替え画面の操作。from のマスの項目を to のマスへ動かす。to に項目があれば入れ替える。
  // to の行が今の段の数と同じなら、一番下に段を足して置く。固定マス（表示設定）は動かせず、そこへも置けない
  function moveItem(layout, from, to) {
    var result = copy(layout);
    var isFixed = function (cell) { return cell.row === 0 && cell.col === 0; };
    if (isFixed(from) || isFixed(to) || to.row > result.rows.length || to.row >= MAX_ROWS) return result;
    if (to.row === result.rows.length) result.rows.push(emptyRow());
    var item = result.rows[from.row][from.col];
    result.rows[from.row][from.col] = result.rows[to.row][to.col];
    result.rows[to.row][to.col] = item;
    return result;
  }

  // 並べ替え画面の操作。row 行目の上の線を付け外しする
  function toggleLine(layout, row) {
    var result = copy(layout);
    var i = result.lines.indexOf(row);
    if (i === -1) result.lines.push(row);
    else result.lines.splice(i, 1);
    result.lines.sort(function (a, b) { return a - b; });
    return result;
  }

  // メニューを開いたときに増える高さ（px）。地図ツールはメニューを8pxずつ動かすので、必ず8の倍数になる
  function menuHideHeight(layout) {
    return (layout.rows.length - 1) * ROW_HEIGHT + layout.lines.length * LINE_HEIGHT;
  }

  // 地図ツールの下メニューに渡す組。1組目＝閉じていても見える段。残りの種類は1組にまとめて渡す
  // （ツールに作らせたボタンは apply でマス目へ並べ直すので、組の分け方は見た目に関係ない）
  function toolGroups(layout) {
    function types(rows) {
      return rows.reduce(function (all, row) { return all.concat(row); }, [])
        .filter(function (item) { return item && item !== FIXED && item !== CLEAR; });
    }
    var rest = types(layout.rows.slice(1));
    var groups = [{ typeNames: types(layout.rows.slice(0, 1)) }];
    if (rest.length) groups.push({ typeNames: rest });
    return groups;
  }

  // 地図ツールが作った下メニューを、マス目に並べ直す（ブラウザ用。ツールの起動の後に呼ぶ）。
  // ボタンは作り直さずに移すので、ツールが付けた処理（ON/OFF・スマホでのスワイプ判定）はそのまま効く
  function apply(layout) {
    var $section = $('.leaflet-menu ._sidemenu-section');
    var $always = $section.children('.always-show-section');
    var $opened = $section.children('.opened-show-section');
    var buttons = {};
    // 先に外しておく。入れ物ごと消すと、jQuery がボタンに付いた処理まで消してしまう
    $section.find('.leaflet-side-marker-switch-ui').each(function () {
      buttons[$(this).children('input').data('type')] = $(this).detach();
    });
    buttons[CLEAR] = $section.children('._clear-btn').detach().addClass('totk-in-grid');

    function rowElement(row) {
      var $row = $('<div class="totk-menu-row"></div>');
      row.forEach(function (item) {
        var $cell = $('<div class="totk-menu-cell"></div>');
        if (buttons[item]) $cell.append(buttons[item]);
        $row.append($cell);
      });
      return $row;
    }

    $always.empty().append(rowElement(layout.rows[0]));
    $opened.empty();
    layout.rows.slice(1).forEach(function (row, i) {
      if (layout.lines.indexOf(i + 1) !== -1) $opened.append('<div class="totk-menu-line"></div>');
      $opened.append(rowElement(row));
    });
  }

  // ---- ここから下はブラウザ用（保存した並びの読み込みと、並べ替え画面） ----

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY)); } catch (e) { return null; }
  }

  function writeLocal(layout) {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(layout)); } catch (e) { /* 保存できないブラウザでも GitHub 側は使える */ }
  }

  // 保存した並びを読む。GitHub にあればそれを使い（他の端末で保存した並びも使えるように）、ブラウザ内の控えも更新する。
  // GitHub に無い・読めないときは控えを使い、それも無ければ null（初期配置を使う）。読めなくても地図の起動は止めない
  function loadSaved(store) {
    return store.load().then(function (remote) {
      if (!remote) return readLocal();
      writeLocal(remote);
      return remote;
    }, readLocal);
  }

  var TOOL_IMG = 'https://gamewith-tool.s3.ap-northeast-1.amazonaws.com/assets/img/';
  var editor = null; // setup で受け取る { layout, items, fallback, typeDatas, store }

  // 並べ替え画面に要るものを受け取る（地図ツールの起動の後に index.html が呼ぶ）。呼ばれる前は画面を開かない
  function setup(options) { editor = options; }

  // 並べ替え画面のマスに出すアイコンと名前。種類は地図ツールの種類データ（下メニューのボタンと同じ画像）から取る
  function itemView(item) {
    if (item === FIXED) return { name: '表示設定', icon: TOOL_IMG + 'cog_off.png' };
    if (item === CLEAR) return { name: '全てOFF', icon: TOOL_IMG + 'remove-icon.png' };
    var type = editor.typeDatas.filter(function (t) { return t.name === item; })[0] || {};
    return { name: String(type.text || item).replace(/<br>/g, ''), icon: type.buttonUrl };
  }

  function openEditor() {
    if (!editor || $('.totk-layout-editor').length) return;
    var draft = copy(editor.layout);
    var drag = null;
    var $root = $(
      '<div class="totk-layout-editor" role="dialog" aria-label="下メニューの並べ替え">' +
        '<div class="totk-layout-editor__head">下メニューの並べ替え' +
          '<button type="button" class="totk-layout-editor__close" aria-label="閉じる">✕</button></div>' +
        '<div class="totk-layout-editor__body">' +
          '<p class="totk-layout-editor__help">アイコンを指で動かして並べ替えます。空いたマスに置くと移動、ほかのアイコンの上に置くと入れ替えます。' +
            '段と段の間を押すと、区切りの線を付けたり外したりできます。いちばん上の段は、メニューを閉じていても見える段です。</p>' +
          '<div class="totk-layout-editor__grid"></div>' +
          '<p class="totk-layout-editor__message"></p>' +
        '</div>' +
        '<div class="totk-layout-editor__buttons">' +
          '<button type="button" class="totk-layout-editor__reset">初期配置に戻す</button>' +
          '<button type="button" class="totk-layout-editor__cancel">やめる</button>' +
          '<button type="button" class="totk-layout-editor__save">保存</button>' +
        '</div>' +
      '</div>').appendTo('body');
    var $grid = $root.find('.totk-layout-editor__grid');

    function message(text, isError) {
      $root.find('.totk-layout-editor__message').text(text).toggleClass('is-error', !!isError);
    }

    // 今の段の下に、空の段を1つ出しておく（そこへ置くと段が増える）
    function render() {
      $grid.empty();
      var rowCount = Math.min(draft.rows.length + 1, MAX_ROWS);
      for (var r = 0; r < rowCount; r++) {
        if (r >= 1 && r < draft.rows.length) {
          $('<button type="button" class="totk-layout-editor__gap"></button>')
            .attr({ 'data-row': r, 'aria-label': (r + 1) + '段目の上の区切り線' })
            .toggleClass('is-line', draft.lines.indexOf(r) !== -1)
            .appendTo($grid);
        }
        var $row = $('<div class="totk-layout-editor__row"></div>').toggleClass('is-always', r === 0).appendTo($grid);
        (draft.rows[r] || emptyRow()).forEach(function (item, c) {
          var $cell = $('<div class="totk-layout-editor__cell"></div>').attr({ 'data-row': r, 'data-col': c }).appendTo($row);
          if (!item) return;
          var view = itemView(item);
          $('<div class="totk-layout-editor__item"></div>')
            .toggleClass('is-fixed', item === FIXED)
            .append($('<span class="totk-layout-editor__icon"></span>').css('background-image', 'url("' + view.icon + '")'))
            .append($('<span class="totk-layout-editor__name"></span>').text(view.name))
            .appendTo($cell);
        });
      }
    }

    function cellAt(x, y) {
      var $cell = $(document.elementFromPoint(x, y)).closest('.totk-layout-editor__cell');
      return $cell.length ? $cell : null;
    }

    // 指でもマウスでも同じに扱えるよう Pointer Events を使う。掴んだアイコンの写しを指に付いて動かす。
    // 小さい画面ではマス目が縦に収まらないので、上下の端に近づけたらスクロールする（アイコンを掴んでいる間は指でスクロールできないため）
    var EDGE = 48;
    function moveGhost(x, y) {
      var body = $root.find('.totk-layout-editor__body')[0];
      var bounds = body.getBoundingClientRect();
      if (y > bounds.bottom - EDGE) body.scrollTop += 12;
      else if (y < bounds.top + EDGE) body.scrollTop -= 12;
      drag.$ghost.css({ left: x - drag.offsetX, top: y - drag.offsetY });
      $grid.find('.is-target').removeClass('is-target');
      var $cell = cellAt(x, y);
      if ($cell) $cell.addClass('is-target');
    }

    function endDrag(x, y) {
      var $cell = drag && x !== undefined ? cellAt(x, y) : null;
      var from = drag && drag.from;
      if (drag) drag.$ghost.remove();
      drag = null;
      $(document).off('.totkLayoutDrag');
      if ($cell) draft = moveItem(draft, from, { row: Number($cell.attr('data-row')), col: Number($cell.attr('data-col')) });
      render();
    }

    $grid.on('pointerdown', '.totk-layout-editor__item:not(.is-fixed)', function (event) {
      var e = event.originalEvent;
      var rect = this.getBoundingClientRect();
      var $cell = $(this).parent();
      event.preventDefault();
      drag = {
        from: { row: Number($cell.attr('data-row')), col: Number($cell.attr('data-col')) },
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        $ghost: $(this).clone().addClass('is-ghost').css({ width: rect.width, height: rect.height }).appendTo($root),
      };
      $(this).addClass('is-dragging');
      moveGhost(e.clientX, e.clientY);
      $(document)
        .on('pointermove.totkLayoutDrag', function (ev) { moveGhost(ev.originalEvent.clientX, ev.originalEvent.clientY); })
        .on('pointerup.totkLayoutDrag', function (ev) { endDrag(ev.originalEvent.clientX, ev.originalEvent.clientY); })
        .on('pointercancel.totkLayoutDrag', function () { endDrag(); });
    });

    $grid.on('click', '.totk-layout-editor__gap', function () {
      draft = toggleLine(draft, Number($(this).attr('data-row')));
      render();
    });

    function close() {
      $(document).off('.totkLayoutDrag');
      $root.remove();
    }
    $root.find('.totk-layout-editor__close, .totk-layout-editor__cancel').on('click', close);
    $root.find('.totk-layout-editor__reset').on('click', function () {
      draft = normalize(editor.fallback, editor.items, editor.fallback);
      message('初期配置に戻しました（まだ保存していません）');
      render();
    });
    // 保存したら読み直して、下メニューに反映する（地図ツールの下メニューは作り直せないため）
    $root.find('.totk-layout-editor__save').on('click', function () {
      var layout = normalize(draft, editor.items, editor.fallback);
      var $buttons = $root.find('.totk-layout-editor__buttons button').prop('disabled', true);
      writeLocal(layout);
      message('保存中…');
      editor.store.save(layout).then(function (result) {
        message(result === 'saved'
          ? '保存しました。地図を読み直します'
          : 'このブラウザだけに保存しました（GitHub のトークンが未設定）。地図を読み直します');
        setTimeout(function () { location.reload(); }, 800);
      }, function (error) {
        $buttons.prop('disabled', false);
        message('GitHub に保存できませんでした（' + window.TotkSave.errorReason(error.status) + '）。もう一度「保存」を押してください', true);
      });
    });

    render();
  }

  return {
    COLUMNS: COLUMNS,
    FIXED: FIXED,
    CLEAR: CLEAR,
    normalize: normalize,
    moveItem: moveItem,
    toggleLine: toggleLine,
    menuHideHeight: menuHideHeight,
    toolGroups: toolGroups,
    apply: apply,
    loadSaved: loadSaved,
    setup: setup,
    openEditor: openEditor,
  };
});
