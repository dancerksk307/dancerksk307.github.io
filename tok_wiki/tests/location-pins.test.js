// 実行: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const { toggle, countChecked } = require('../location-pins.js');

test('地名をチェックしても、祠など他のチェックは消えない', () => {
  const saved = JSON.stringify({ 3001: true, 1002: true });

  assert.deepEqual(toggle(saved, '27001'), { 3001: true, 1002: true, 27001: true });
});

test('チェック済みの地名をもう一度押すと、その地名だけが外れる', () => {
  const saved = JSON.stringify({ 3001: true, 27001: true });

  assert.deepEqual(toggle(saved, '27001'), { 3001: true });
});

// 地図ツールのチェックは localStorage に書かれる。毎回それを読み直すので、地名の部品の側に古い控えが残らない
test('地図ツールが後から付けたチェックも、次の地名のチェックで消えない', () => {
  let stored = JSON.stringify(toggle(null, '27001'));
  // 地図ツールが祠をチェックした（ツールは自分の控えに足して丸ごと書く）
  stored = JSON.stringify({ ...JSON.parse(stored), 3001: true });

  assert.deepEqual(toggle(stored, '27002'), { 27001: true, 3001: true, 27002: true });
});

test('保存データが無い・壊れているときは、空から始める', () => {
  assert.deepEqual(toggle(null, '27001'), { 27001: true });
  assert.deepEqual(toggle('{壊れた', '27001'), { 27001: true });
});

test('チェック数は、地名の印のぶんだけを数える', () => {
  const pins = [{ id: '27001' }, { id: '27002' }, { id: '27003' }];
  const saved = JSON.stringify({ 27001: true, 27003: true, 3001: true });

  assert.equal(countChecked(saved, pins), 2);
});
