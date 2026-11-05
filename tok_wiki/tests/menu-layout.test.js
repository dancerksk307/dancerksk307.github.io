// 実行: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const { normalize, moveItem, toggleLine, menuHideHeight, toolGroups, FIXED, CLEAR, COLUMNS } = require('../menu-layout.js');

const _ = null;
const ITEMS = [CLEAR, 'hokora', 'tower', 'korok', 'cave', 'lynel'];
// 1段目と2段目（地底用の段）の左端は、どちらも固定マス
const DEFAULT = {
  version: 1,
  rows: [
    [FIXED, 'hokora', 'tower', _, _, _, _],
    [FIXED, 'korok', 'cave', _, _, _, _],
    ['lynel', CLEAR, _, _, _, _, _],
  ],
  lines: [1, 2],
};

function allItems(layout) {
  return layout.rows.flat().filter((item) => item && item !== FIXED);
}

test('保存した並びが無い・壊れているときは、初期配置を使う', () => {
  assert.deepEqual(normalize(null, ITEMS, DEFAULT), DEFAULT);
  assert.deepEqual(normalize({ version: 1, rows: 'x' }, ITEMS, DEFAULT), DEFAULT);
  assert.deepEqual(normalize({ version: 2, rows: [[]] }, ITEMS, DEFAULT), DEFAULT);
});

test('保存した並びは、そのまま使う', () => {
  const saved = {
    version: 1,
    rows: [
      [FIXED, 'lynel', _, _, _, _, 'hokora'],
      [FIXED, _, CLEAR, _, _, _, 'tower'],
      [_, 'korok', 'cave', _, _, _, _],
    ],
    lines: [2],
  };

  assert.deepEqual(normalize(saved, ITEMS, DEFAULT), saved);
});

test('左上は、何が保存されていても「表示設定」の固定マスになる（置かれていた項目は空いたマスへ移る）', () => {
  const saved = { version: 1, rows: [['hokora', 'tower', _, _, _, _, _], [FIXED, 'korok', 'cave', 'lynel', CLEAR, _, _]], lines: [] };
  const result = normalize(saved, ITEMS, DEFAULT);

  assert.equal(result.rows[0][0], FIXED);
  assert.deepEqual(result.rows[1], [FIXED, 'korok', 'cave', 'lynel', CLEAR, 'hokora', _]);
});

// 地底では2段目が閉じていても見える段になり、左端に「表示設定」が重なる。
// 固定マスを2段目にも作る前に保存した並び（2段目の左端に全てOFF）も、全てOFF を空いたマスへ移して使う
test('2段目（地底用の段）の左端も固定マスになる（置かれていた項目は空いたマスへ移る）', () => {
  const saved = { version: 1, rows: [[FIXED, 'hokora', _, _, _, _, _], [CLEAR, 'korok', 'cave', 'lynel', _, _, _]], lines: [] };
  const result = normalize(saved, ITEMS, DEFAULT);

  assert.deepEqual(result.rows[1], [FIXED, 'korok', 'cave', 'lynel', CLEAR, 'tower', _]);
  assert.deepEqual(allItems(result).sort(), [...ITEMS].sort());
});

test('種類が増えたら、2段目以降の空いたマスに足す（置き場所の無い項目が出ない）', () => {
  const saved = { version: 1, rows: [[FIXED, 'hokora', _, _, _, _, _], [FIXED, 'korok', 'cave', 'lynel', CLEAR, _, _]], lines: [] };
  const result = normalize(saved, ITEMS, DEFAULT);

  assert.deepEqual(result.rows[1], [FIXED, 'korok', 'cave', 'lynel', CLEAR, 'tower', _]);
  assert.deepEqual(allItems(result).sort(), [...ITEMS].sort());
});

test('空いたマスが無ければ、段を足して置く', () => {
  const full = [FIXED, 'a', 'b', 'c', 'd', 'e', 'f'];
  const items = ['a', 'b', 'c', 'd', 'e', 'f', 'hokora', 'new'];
  const saved = { version: 1, rows: [[FIXED, 'hokora', _, _, _, _, _], full], lines: [] };
  const result = normalize(saved, items, DEFAULT);

  assert.equal(result.rows.length, 3);
  assert.deepEqual(result.rows[2], ['new', _, _, _, _, _, _]);
});

test('知らない項目（種類を減らしたとき）と、2回目以降に出てくる項目は消す', () => {
  const saved = {
    version: 1,
    rows: [[FIXED, 'hokora', 'gone', _, _, _, _], [FIXED, 'hokora', 'tower', 'korok', 'cave', 'lynel', CLEAR]],
    lines: [],
  };
  const result = normalize(saved, ITEMS, DEFAULT);

  assert.deepEqual(result.rows[0], [FIXED, 'hokora', _, _, _, _, _]);
  assert.deepEqual(result.rows[1], [FIXED, _, 'tower', 'korok', 'cave', 'lynel', CLEAR]);
});

test('何も無い段は詰め、その段の上の線は次の段の上へ移す', () => {
  const saved = {
    version: 1,
    rows: [
      [FIXED, 'hokora', 'tower', _, _, _, _],
      [FIXED, 'korok', _, _, _, _, _],
      [_, _, _, _, _, _, _],
      ['lynel', CLEAR, 'cave', _, _, _, _],
    ],
    lines: [2, 3],
  };
  const result = normalize(saved, ITEMS, DEFAULT);

  assert.equal(result.rows.length, 3);
  assert.deepEqual(result.lines, [2]);
});

test('2段目（地底用の段）は、固定マスのほかに何も無くても消さない。1段しか無い並びには足す', () => {
  const emptySecond = { version: 1, rows: [[FIXED, 'hokora', _, _, _, _, _], [FIXED, _, _, _, _, _, _], ['korok', 'cave', 'lynel', CLEAR, 'tower', _, _]], lines: [] };
  const oneRow = { version: 1, rows: [[FIXED, 'hokora', 'tower', 'korok', 'cave', 'lynel', CLEAR]], lines: [] };

  assert.deepEqual(normalize(emptySecond, ITEMS, DEFAULT).rows[1], [FIXED, _, _, _, _, _, _]);
  assert.deepEqual(normalize(oneRow, ITEMS, DEFAULT).rows, [oneRow.rows[0], [FIXED, _, _, _, _, _, _]]);
});

test('おかしな線の番号（0・段の数以上・小数・重なり）は消す', () => {
  const saved = { ...DEFAULT, lines: [0, 1, 1, 1.5, 3, 9] };

  assert.deepEqual(normalize(saved, ITEMS, DEFAULT).lines, [1]);
});

test('どの段も横7マスにそろえる', () => {
  const saved = { version: 1, rows: [[FIXED, 'hokora'], [FIXED, 'tower', 'korok', 'cave', 'lynel', CLEAR, _, 'extra']], lines: [] };

  normalize(saved, ITEMS, DEFAULT).rows.forEach((row) => assert.equal(row.length, COLUMNS));
});

test('開いたときに増える高さは「2段目以降の段×48px＋線×8px」で、8の倍数になる', () => {
  assert.equal(menuHideHeight(DEFAULT), 2 * 48 + 2 * 8);
  assert.equal(menuHideHeight(DEFAULT) % 8, 0);
  assert.equal(menuHideHeight({ rows: [[FIXED]], lines: [] }), 0);
});

test('地図ツールに渡す組は、1組目が閉じていても見える段の種類、2組目が残りの種類（表示設定・全てOFFは含めない）', () => {
  assert.deepEqual(toolGroups(DEFAULT), [
    { typeNames: ['hokora', 'tower'] },
    { typeNames: ['korok', 'cave', 'lynel'] },
  ]);
});

// ---- 並べ替え画面の操作 ----

test('並べ替え: 空いたマスに置くと、項目がそこへ移る', () => {
  const result = moveItem(DEFAULT, { row: 0, col: 1 }, { row: 0, col: 6 });

  assert.deepEqual(result.rows[0], [FIXED, _, 'tower', _, _, _, 'hokora']);
});

test('並べ替え: 他の項目の上に置くと、入れ替わる', () => {
  const result = moveItem(DEFAULT, { row: 0, col: 1 }, { row: 2, col: 0 });

  assert.equal(result.rows[0][1], 'lynel');
  assert.equal(result.rows[2][0], 'hokora');
});

test('並べ替え: 一番下の空の段に置くと、段が増える', () => {
  const result = moveItem(DEFAULT, { row: 2, col: 0 }, { row: 3, col: 3 });

  assert.equal(result.rows.length, 4);
  assert.equal(result.rows[3][3], 'lynel');
});

test('並べ替え: 固定マス（1段目と2段目の左端）は動かせず、そこへも置けない', () => {
  assert.deepEqual(moveItem(DEFAULT, { row: 0, col: 0 }, { row: 1, col: 5 }), DEFAULT);
  assert.deepEqual(moveItem(DEFAULT, { row: 0, col: 1 }, { row: 0, col: 0 }), DEFAULT);
  assert.deepEqual(moveItem(DEFAULT, { row: 1, col: 0 }, { row: 2, col: 5 }), DEFAULT);
  assert.deepEqual(moveItem(DEFAULT, { row: 2, col: 1 }, { row: 1, col: 0 }), DEFAULT);
});

test('並べ替え: 元の並び（保存前のもの）は書き換えない', () => {
  const before = JSON.stringify(DEFAULT);
  moveItem(DEFAULT, { row: 0, col: 1 }, { row: 2, col: 0 });
  toggleLine(DEFAULT, 1);

  assert.equal(JSON.stringify(DEFAULT), before);
});

test('区切り線: 段の間を押すと、線が付いたり外れたりする', () => {
  assert.deepEqual(toggleLine(DEFAULT, 2).lines, [1]);
  assert.deepEqual(toggleLine({ ...DEFAULT, lines: [2] }, 1).lines, [1, 2]);
});
