// 実行: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const { normalize, toData, newer, formatDate } = require('../red-moon.js');

test('保存データが無い・壊れているときは記録なし（null）にする', () => {
  assert.equal(normalize(null), null);
  assert.equal(normalize({}), null);
  assert.equal(normalize({ last: 123 }), null);
  assert.equal(normalize({ last: 'あいう' }), null);
});

test('保存した日時をそのまま読み戻せる', () => {
  const date = new Date(2026, 10, 16, 14, 32, 5);
  const data = toData(date);
  assert.equal(data.version, 1);
  assert.equal(normalize(data).getTime(), date.getTime());
});

test('GitHub とブラウザの記録は、新しい方を使う', () => {
  const old = new Date(2026, 10, 16, 11, 0);
  const recent = new Date(2026, 10, 16, 14, 0);
  assert.equal(newer(old, recent), recent);
  assert.equal(newer(recent, old), recent);
  assert.equal(newer(null, old), old);
  assert.equal(newer(old, null), old);
  assert.equal(newer(null, null), null);
});

test('日時は「年/月/日(曜) 時:分」で、1桁は0で埋める', () => {
  assert.equal(formatDate(new Date(2026, 10, 16, 14, 32)), '2026/11/16(月) 14:32');
  assert.equal(formatDate(new Date(2026, 0, 4, 9, 5)), '2026/01/04(日) 09:05');
});
