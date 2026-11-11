// 実行: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const { isSafeUrl, normalize, toData, clean, move } = require('../links.js');

test('http と https の URL だけを通す（開いたときにページの中で何かが動く URL は保存しない）', () => {
  assert.equal(isSafeUrl('https://gamewith.jp/zelda-totk/'), true);
  assert.equal(isSafeUrl('http://example.com'), true);
  assert.equal(isSafeUrl('HTTPS://EXAMPLE.COM'), true);
  assert.equal(isSafeUrl('javascript:alert(1)'), false);
  assert.equal(isSafeUrl('data:text/html,<p>x</p>'), false);
  assert.equal(isSafeUrl('/tok_wiki/'), false);
  assert.equal(isSafeUrl('gamewith.jp'), false);
  assert.equal(isSafeUrl('https://'), false);
  assert.equal(isSafeUrl('https://a b'), false);
  assert.equal(isSafeUrl(''), false);
  assert.equal(isSafeUrl(null), false);
});

test('保存データが無い・壊れているときは空の一覧にする', () => {
  assert.deepEqual(normalize(null), []);
  assert.deepEqual(normalize({}), []);
  assert.deepEqual(normalize({ links: 'x' }), []);
});

test('保存データの危ない URL・壊れた行は捨て、名前が無ければ空の名前にする', () => {
  const data = {
    version: 1,
    links: [
      { name: '完璧版', url: 'https://gamewith.jp/zelda-totk/article/show/398189' },
      { name: '危ない', url: 'javascript:alert(1)' },
      null,
      { url: 'https://game8.jp/zelda-totk/527468' },
    ],
  };
  assert.deepEqual(normalize(data), [
    { name: '完璧版', url: 'https://gamewith.jp/zelda-totk/article/show/398189' },
    { name: '', url: 'https://game8.jp/zelda-totk/527468' },
  ]);
});

test('保存する形は version 付き', () => {
  const links = [{ name: 'a', url: 'https://a.example' }];
  assert.deepEqual(toData(links), { version: 1, links });
  assert.deepEqual(normalize(toData(links)), links);
});

test('編集中の行は前後の空白を除き、名前も URL も空の行は捨てる。名前が空の行は残す', () => {
  const result = clean([
    { name: ' 完璧版 ', url: ' https://gamewith.jp/ ' },
    { name: '', url: '' },
    { name: '  ', url: '  ' },
    { name: '', url: 'https://game8.jp/' },
  ]);
  assert.equal(result.invalid, null);
  assert.deepEqual(result.links, [
    { name: '完璧版', url: 'https://gamewith.jp/' },
    { name: '', url: 'https://game8.jp/' },
  ]);
});

test('URL が空・http(s) 以外の行があれば、最初のその行を返す（保存しない）', () => {
  assert.deepEqual(clean([
    { name: 'ok', url: 'https://a.example' },
    { name: '名前だけ', url: '' },
    { name: '危ない', url: 'javascript:alert(1)' },
  ]).invalid, { name: '名前だけ', url: '' });
  assert.deepEqual(clean([{ name: '', url: 'javascript:alert(1)' }]).invalid, { name: '', url: 'javascript:alert(1)' });
});

test('行を上下に動かす。端より外へは動かさず、元の一覧は変えない', () => {
  const list = ['a', 'b', 'c'];
  assert.deepEqual(move(list, 1, -1), ['b', 'a', 'c']);
  assert.deepEqual(move(list, 1, 1), ['a', 'c', 'b']);
  assert.deepEqual(move(list, 0, -1), ['a', 'b', 'c']);
  assert.deepEqual(move(list, 2, 1), ['a', 'b', 'c']);
  assert.deepEqual(list, ['a', 'b', 'c']);
});
