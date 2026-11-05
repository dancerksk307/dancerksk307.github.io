// 実行: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const { normalize, menuHideHeight, toolGroups, FIXED, CLEAR, COLUMNS } = require('../menu-layout.js');

const _ = null;
const ITEMS = [CLEAR, 'hokora', 'tower', 'korok', 'cave', 'lynel'];
const DEFAULT = {
  version: 1,
  rows: [
    [FIXED, 'hokora', 'tower', _, _, _, _],
    [CLEAR, 'korok', 'cave', _, _, _, _],
    ['lynel', _, _, _, _, _, _],
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
      ['tower', _, CLEAR, _, _, _, _],
      [_, 'korok', 'cave', _, _, _, _],
    ],
    lines: [2],
  };

  assert.deepEqual(normalize(saved, ITEMS, DEFAULT), saved);
});

test('左上は、何が保存されていても「表示設定」の固定マスになる（置かれていた項目は空いたマスへ移る）', () => {
  const saved = { version: 1, rows: [['hokora', 'tower', _, _, _, _, _], [CLEAR, 'korok', 'cave', 'lynel', _, _, _]], lines: [] };
  const result = normalize(saved, ITEMS, DEFAULT);

  assert.equal(result.rows[0][0], FIXED);
  assert.deepEqual(result.rows[1], [CLEAR, 'korok', 'cave', 'lynel', 'hokora', _, _]);
});

test('種類が増えたら、2段目以降の空いたマスに足す（置き場所の無い項目が出ない）', () => {
  const saved = { version: 1, rows: [[FIXED, 'hokora', _, _, _, _, _], [CLEAR, 'korok', 'cave', 'lynel', _, _, _]], lines: [] };
  const result = normalize(saved, ITEMS, DEFAULT);

  assert.deepEqual(result.rows[1], [CLEAR, 'korok', 'cave', 'lynel', 'tower', _, _]);
  assert.deepEqual(allItems(result).sort(), [...ITEMS].sort());
});

test('空いたマスが無ければ、段を足して置く', () => {
  const full = [CLEAR, 'a', 'b', 'c', 'd', 'e', 'f'];
  const items = [...full, 'hokora', 'new'];
  const saved = { version: 1, rows: [[FIXED, 'hokora', _, _, _, _, _], full], lines: [] };
  const result = normalize(saved, items, DEFAULT);

  assert.equal(result.rows.length, 3);
  assert.deepEqual(result.rows[2], ['new', _, _, _, _, _, _]);
});

test('知らない項目（種類を減らしたとき）と、2回目以降に出てくる項目は消す', () => {
  const saved = {
    version: 1,
    rows: [[FIXED, 'hokora', 'gone', _, _, _, _], [CLEAR, 'hokora', 'tower', 'korok', 'cave', 'lynel', _]],
    lines: [],
  };
  const result = normalize(saved, ITEMS, DEFAULT);

  assert.deepEqual(result.rows[0], [FIXED, 'hokora', _, _, _, _, _]);
  assert.deepEqual(result.rows[1], [CLEAR, _, 'tower', 'korok', 'cave', 'lynel', _]);
});

test('何も無い段は詰め、その段の上の線は次の段の上へ移す', () => {
  const saved = {
    version: 1,
    rows: [
      [FIXED, 'hokora', 'tower', _, _, _, _],
      [_, _, _, _, _, _, _],
      [CLEAR, 'korok', 'cave', 'lynel', _, _, _],
    ],
    lines: [1, 2],
  };
  const result = normalize(saved, ITEMS, DEFAULT);

  assert.equal(result.rows.length, 2);
  assert.deepEqual(result.lines, [1]);
});

test('おかしな線の番号（0・段の数以上・小数・重なり）は消す', () => {
  const saved = { ...DEFAULT, lines: [0, 1, 1, 1.5, 3, 9] };

  assert.deepEqual(normalize(saved, ITEMS, DEFAULT).lines, [1]);
});

test('どの段も横7マスにそろえる', () => {
  const saved = { version: 1, rows: [[FIXED, 'hokora'], [CLEAR, 'tower', 'korok', 'cave', 'lynel', _, _, 'extra']], lines: [] };

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
