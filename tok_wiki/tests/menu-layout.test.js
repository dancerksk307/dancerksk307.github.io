// 実行: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  normalize, moveItem, toggleLine, menuShowExtraHeight, menuHideHeight, toolGroups, FIXED, CLEAR, COLUMNS,
} = require('../menu-layout.js');

const _ = null;
const ITEMS = [CLEAR, 'hokora', 'tower', 'korok', 'cave', 'lynel'];
// 1段目はお気に入り（7マスとも自由）、2段目は地上の段（左端は表示設定）、3段目は地底の段（左端は全てOFF）
const DEFAULT = {
  version: 2,
  rows: [
    ['hokora', _, _, _, _, _, _],
    [FIXED, 'tower', _, _, _, _, _],
    [CLEAR, 'korok', 'cave', _, _, _, _],
    ['lynel', _, _, _, _, _, _],
  ],
  lines: [2, 3],
};

function allItems(layout) {
  return layout.rows.flat().filter((item) => item && item !== FIXED);
}

test('保存した並びが無い・壊れているときは、初期配置を使う', () => {
  assert.deepEqual(normalize(null, ITEMS, DEFAULT), DEFAULT);
  assert.deepEqual(normalize({ version: 2, rows: 'x' }, ITEMS, DEFAULT), DEFAULT);
  assert.deepEqual(normalize({ version: 3, rows: [[]] }, ITEMS, DEFAULT), DEFAULT);
});

test('保存した並びは、そのまま使う', () => {
  const saved = {
    version: 2,
    rows: [
      ['lynel', _, _, _, _, _, 'hokora'],
      [FIXED, _, _, _, _, _, 'tower'],
      [CLEAR, 'cave', _, _, _, _, _],
      [_, 'korok', _, _, _, _, _],
    ],
    lines: [1, 3],
  };

  assert.deepEqual(normalize(saved, ITEMS, DEFAULT), saved);
});

// お気に入りの段を作る前（version 1）に保存した並びも、そのまま使えるようにする
test('お気に入りの段が無かったころの並び（version 1）は、上に空のお気に入りの段を足して読み替える', () => {
  const version1 = {
    version: 1,
    rows: [[FIXED, 'hokora', 'tower', _, _, _, _], [CLEAR, 'korok', 'cave', _, _, _, _], ['lynel', _, _, _, _, _, _]],
    lines: [1, 2],
  };

  assert.deepEqual(normalize(version1, ITEMS, DEFAULT), {
    version: 2,
    rows: [[_, _, _, _, _, _, _], ...version1.rows],
    lines: [2, 3],
  });
});

test('地上の段の左端は「表示設定」、地底の段の左端は「全てOFF」になる（置かれていた項目は空いたマスへ移り、ほかの場所の全てOFF は消える）', () => {
  const saved = {
    version: 2,
    rows: [[CLEAR, _, _, _, _, _, _], ['hokora', 'tower', _, _, _, _, _], ['cave', 'korok', _, _, _, _, _], ['lynel', _, _, _, _, _, _]],
    lines: [],
  };
  const result = normalize(saved, ITEMS, DEFAULT);

  assert.deepEqual(result.rows[0], [_, _, _, _, _, _, _]);
  assert.deepEqual(result.rows[1], [FIXED, 'tower', _, _, _, _, _]);
  assert.deepEqual(result.rows[2], [CLEAR, 'korok', _, _, _, _, _]);
  assert.deepEqual(result.rows[3], ['lynel', 'hokora', 'cave', _, _, _, _]);
  assert.deepEqual(allItems(result).sort(), [...ITEMS].sort());
});

test('種類が増えたら、4段目以降（開いたときだけ見える段）の空いたマスに足す。閉じていても見える段には足さない', () => {
  const saved = { version: 2, rows: [['hokora', _, _, _, _, _, _], [FIXED, 'tower', _, _, _, _, _], [CLEAR, 'korok', 'cave', _, _, _, _]], lines: [] };
  const result = normalize(saved, ITEMS, DEFAULT);

  assert.deepEqual(result.rows.slice(0, 3), saved.rows);
  assert.deepEqual(result.rows[3], ['lynel', _, _, _, _, _, _]);
});

test('知らない項目（種類を減らしたとき）と、2回目以降に出てくる項目は消す', () => {
  const saved = {
    version: 2,
    rows: [['hokora', 'gone', _, _, _, _, _], [FIXED, 'hokora', 'tower', _, _, _, _], [CLEAR, 'korok', 'cave', 'lynel', _, _, _]],
    lines: [],
  };
  const result = normalize(saved, ITEMS, DEFAULT);

  assert.deepEqual(result.rows[0], ['hokora', _, _, _, _, _, _]);
  assert.deepEqual(result.rows[1], [FIXED, _, 'tower', _, _, _, _]);
});

test('4段目以降の何も無い段は詰め、その段の上の線は次の段の上へ移す', () => {
  const saved = {
    version: 2,
    rows: [['hokora', _, _, _, _, _, _], [FIXED, 'tower', _, _, _, _, _], [CLEAR, 'korok', 'cave', _, _, _, _], [_, _, _, _, _, _, _], ['lynel', _, _, _, _, _, _]],
    lines: [3, 4],
  };
  const result = normalize(saved, ITEMS, DEFAULT);

  assert.equal(result.rows.length, 4);
  assert.deepEqual(result.lines, [3]);
});

test('お気に入り・地上・地底の段は、空でも消さない。足りなければ足す', () => {
  const emptyBase = { version: 2, rows: [[_, _, _, _, _, _, _], [FIXED, _, _, _, _, _, _], [CLEAR, _, _, _, _, _, _], ['hokora', 'tower', 'korok', 'cave', 'lynel', _, _]], lines: [] };
  const oneRow = { version: 2, rows: [['hokora', 'tower', 'korok', 'cave', 'lynel', _, _]], lines: [] };

  assert.deepEqual(normalize(emptyBase, ITEMS, DEFAULT).rows.slice(0, 3), emptyBase.rows.slice(0, 3));
  assert.deepEqual(normalize(oneRow, ITEMS, DEFAULT).rows, [oneRow.rows[0], [FIXED, _, _, _, _, _, _], [CLEAR, _, _, _, _, _, _]]);
});

test('おかしな線の番号（0・段の数以上・小数・重なり）は消す', () => {
  const saved = { ...DEFAULT, lines: [0, 1, 1, 1.5, 4, 9] };

  assert.deepEqual(normalize(saved, ITEMS, DEFAULT).lines, [1]);
});

test('どの段も横7マスにそろえる', () => {
  const saved = { version: 2, rows: [['hokora'], [FIXED, 'tower'], [CLEAR, 'korok', 'cave', 'lynel', _, _, _, 'extra']], lines: [] };

  normalize(saved, ITEMS, DEFAULT).rows.forEach((row) => assert.equal(row.length, COLUMNS));
});

test('閉じていても見える2段のうち、増えた分の高さは「お気に入りの段（48px）＋その下の線（8px）」', () => {
  assert.equal(menuShowExtraHeight(DEFAULT), 48);
  assert.equal(menuShowExtraHeight({ ...DEFAULT, lines: [1, 2, 3] }), 48 + 8);
});

// version 1 の並びを読み替えるとお気に入りの段が空になる。そのときは閉じたときに空の帯を出さず、今までどおり1段だけ見せる
test('お気に入りの段に何も無いときは、閉じていても見えるのは1段だけ（増える高さは 0）', () => {
  const noFavorites = { ...DEFAULT, rows: [[_, _, _, _, _, _, _], ...DEFAULT.rows.slice(1)], lines: [1, 2, 3] };

  assert.equal(menuShowExtraHeight(noFavorites), 0);
});

test('開いたときに増える高さは「閉じていても見える2段より下の段×48px＋その線×8px」で、8の倍数になる', () => {
  assert.equal(menuHideHeight(DEFAULT), 2 * 48 + 2 * 8);
  // お気に入りの下の線（1）は閉じていても見えるので、増える高さには入らない
  assert.equal(menuHideHeight({ ...DEFAULT, lines: [1, 2, 3] }), 2 * 48 + 2 * 8);
  assert.equal(menuHideHeight(DEFAULT) % 8, 0);
});

test('地図ツールに渡す組は、1組目が閉じていても見える段（お気に入りと地上）の種類、2組目が残りの種類（表示設定・全てOFFは含めない）', () => {
  assert.deepEqual(toolGroups(DEFAULT), [
    { typeNames: ['hokora', 'tower'] },
    { typeNames: ['korok', 'cave', 'lynel'] },
  ]);
});

// ---- 並べ替え画面の操作 ----

test('並べ替え: 空いたマスに置くと、項目がそこへ移る（お気に入りの段の左端にも置ける）', () => {
  assert.deepEqual(moveItem(DEFAULT, { row: 1, col: 1 }, { row: 0, col: 6 }).rows[0], ['hokora', _, _, _, _, _, 'tower']);
  assert.deepEqual(moveItem(DEFAULT, { row: 3, col: 0 }, { row: 0, col: 1 }).rows[0], ['hokora', 'lynel', _, _, _, _, _]);
});

test('並べ替え: 他の項目の上に置くと、入れ替わる', () => {
  const result = moveItem(DEFAULT, { row: 0, col: 0 }, { row: 3, col: 0 });

  assert.equal(result.rows[0][0], 'lynel');
  assert.equal(result.rows[3][0], 'hokora');
});

test('並べ替え: 一番下の空の段に置くと、段が増える', () => {
  const result = moveItem(DEFAULT, { row: 3, col: 0 }, { row: 4, col: 3 });

  assert.equal(result.rows.length, 5);
  assert.equal(result.rows[4][3], 'lynel');
});

test('並べ替え: 固定マス（地上の段の表示設定と、地底の段の全てOFF）は動かせず、そこへも置けない', () => {
  assert.deepEqual(moveItem(DEFAULT, { row: 1, col: 0 }, { row: 0, col: 5 }), DEFAULT);
  assert.deepEqual(moveItem(DEFAULT, { row: 0, col: 0 }, { row: 1, col: 0 }), DEFAULT);
  assert.deepEqual(moveItem(DEFAULT, { row: 2, col: 0 }, { row: 3, col: 5 }), DEFAULT);
  assert.deepEqual(moveItem(DEFAULT, { row: 3, col: 0 }, { row: 2, col: 0 }), DEFAULT);
});

test('並べ替え: 元の並び（保存前のもの）は書き換えない', () => {
  const before = JSON.stringify(DEFAULT);
  moveItem(DEFAULT, { row: 0, col: 0 }, { row: 3, col: 0 });
  toggleLine(DEFAULT, 1);

  assert.equal(JSON.stringify(DEFAULT), before);
});

test('区切り線: 段の間を押すと、線が付いたり外れたりする', () => {
  assert.deepEqual(toggleLine(DEFAULT, 2).lines, [3]);
  assert.deepEqual(toggleLine(DEFAULT, 1).lines, [1, 2, 3]);
});
