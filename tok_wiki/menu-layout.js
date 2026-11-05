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

  return {
    COLUMNS: COLUMNS,
    FIXED: FIXED,
    CLEAR: CLEAR,
    normalize: normalize,
    menuHideHeight: menuHideHeight,
    toolGroups: toolGroups,
    apply: apply,
  };
});
