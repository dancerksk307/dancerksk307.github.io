// 実行: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const { gearList, matches, countByMap, summary } = require('../gear-filter.js');

const pins = [
  { id: '1', mapId: '空', type: 'zonai', customData: { items: '扇風機,翼,操縦桿' } },
  { id: '2', mapId: '空', type: 'zonai', customData: { items: '扇風機,ロケット' } },
  { id: '3', mapId: '地上', type: 'zonai', customData: { items: '翼,バネ' } },
];

test('ギアの一覧は、重なりを除いて名前順にする', () => {
  assert.deepEqual(gearList(pins), ['操縦桿', '扇風機', '翼', 'バネ', 'ロケット'].sort((a, b) => a.localeCompare(b, 'ja')));
  assert.equal(new Set(gearList(pins)).size, gearList(pins).length);
});

test('何も選んでいなければ、すべての製造機を残す', () => {
  assert.equal(matches(['扇風機'], [], 'all'), true);
  assert.equal(matches([], [], 'any'), true);
});

test('「すべて含む」は、選んだギアがすべて出る製造機だけを残す', () => {
  assert.equal(matches(['扇風機', '翼', '操縦桿'], ['扇風機', '翼'], 'all'), true);
  assert.equal(matches(['扇風機', 'ロケット'], ['扇風機', '翼'], 'all'), false);
});

test('「どれか含む」は、選んだギアが1つでも出る製造機を残す', () => {
  assert.equal(matches(['扇風機', 'ロケット'], ['翼', 'ロケット'], 'any'), true);
  assert.equal(matches(['バネ'], ['翼', 'ロケット'], 'any'), false);
});

test('当てはまる製造機の数を、地図ごとに数える（無い地図は0）', () => {
  assert.deepEqual(countByMap(pins, ['翼'], 'all'), { 空: 1, 地上: 1, 地底: 0 });
  assert.deepEqual(countByMap(pins, ['扇風機', '翼'], 'all'), { 空: 1, 地上: 0, 地底: 0 });
  assert.deepEqual(countByMap(pins, ['扇風機', 'バネ'], 'any'), { 空: 2, 地上: 1, 地底: 0 });
});

test('ボタンの文字は、選んでいないときは案内、選んだときは条件とギアの名前', () => {
  assert.equal(summary([], 'all'), 'ギアで絞り込み');
  assert.equal(summary(['扇風機', '翼'], 'all'), 'すべて: 扇風機・翼');
  assert.equal(summary(['扇風機'], 'any'), 'どれか: 扇風機');
});

test('影の像に使うときは、ボタンの案内を「武器で絞り込み」にする', () => {
  assert.equal(summary([], 'any', '武器'), '武器で絞り込み');
  assert.equal(summary(['兵士の剣', '騎士の剣'], 'any', '武器'), 'どれか: 兵士の剣・騎士の剣');
});

test('地図のゾナウギア製造機・影の像には、どれも出るものの一覧が入っている', () => {
  const html = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');
  const data = new Function('return ' + html.match(/var data = (\[[\s\S]*?\]);\s*\n/)[1])();
  ['zonai', 'shadow-sword', 'shadow-large', 'shadow-lance'].forEach((type) => {
    const pins = data.filter((pin) => pin.type === type);
    assert.ok(pins.length > 0, type + ' のピンが無い');
    pins.forEach((pin) => assert.ok(pin.customData && pin.customData.items, pin.id + ' に出るものの一覧が無い'));
  });
});
