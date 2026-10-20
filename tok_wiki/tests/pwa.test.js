// 実行: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file));

const SCOPE = 'https://dancerksk307.github.io/tok_wiki/';

// sw.js を、ブラウザの代わりの部品（self・caches・fetch）の上で動かす
function loadWorker(fetchImpl, initialCaches) {
  const listeners = {};
  const store = new Map(Object.entries(initialCaches || {}).map(([name, entries]) => [name, new Map(entries)]));
  const caches = {
    keys: async () => [...store.keys()],
    delete: async (name) => store.delete(name),
    open: async (name) => {
      if (!store.has(name)) store.set(name, new Map());
      const entries = store.get(name);
      return { put: async (request, response) => { entries.set(request.url, response); } };
    },
    match: async (request) => {
      for (const entries of store.values()) if (entries.has(request.url)) return entries.get(request.url);
      return undefined;
    },
  };
  const self = {
    addEventListener: (type, listener) => { listeners[type] = listener; },
    skipWaiting: () => {},
    clients: { claim: async () => {} },
    location: new URL(SCOPE + 'sw.js'),
    registration: { scope: SCOPE },
  };
  vm.runInNewContext(read('sw.js').toString('utf8'), { self, caches, fetch: fetchImpl, URL, Promise });
  return { listeners, store };
}

function response(body) {
  return { ok: true, body, clone() { return response(body); } };
}

// fetch イベントを送り、サービスワーカーが応答を引き受けたかどうかと、その中身を返す
async function sendFetch(worker, url, method = 'GET') {
  let responded = null;
  const waits = [];
  worker.listeners.fetch({
    request: { url, method },
    respondWith: (promise) => { responded = promise; },
    waitUntil: (promise) => { waits.push(promise); },
  });
  const result = responded === null ? null : await responded;
  await Promise.all(waits);
  return result;
}

test('PWA: GitHub への保存の通信には関わらない（古い保存データを返すとチェックが巻き戻る）', async () => {
  const worker = loadWorker(async () => { throw new Error('呼ばれないはず'); });

  assert.equal(await sendFetch(worker, 'https://api.github.com/repos/someone/site/contents/tok_wiki/data/save.json'), null);
  assert.equal(await sendFetch(worker, 'https://api.github.com/repos/someone/site/contents/tok_wiki/data/save.json', 'PUT'), null);
});

test('PWA: 地図画像や地図ツールなど、外のサイトの通信には関わらない', async () => {
  const worker = loadWorker(async () => { throw new Error('呼ばれないはず'); });

  assert.equal(await sendFetch(worker, 'https://img.gamewith.jp/walkthrough/tools/zelda/totk/map/ground/totk_ground_2_1_1.jpg'), null);
  assert.equal(await sendFetch(worker, 'https://gamewith-tool.s3.ap-northeast-1.amazonaws.com/assets/js/article_maptool-3.0.0.zelda.min.js?52'), null);
});

test('PWA: 同じドメインでも、このフォルダの外のページには関わらない', async () => {
  const worker = loadWorker(async () => { throw new Error('呼ばれないはず'); });

  assert.equal(await sendFetch(worker, 'https://dancerksk307.github.io/other/index.html'), null);
});

test('PWA: このフォルダのファイルは、ネットから取って返し、控えを残す', async () => {
  const worker = loadWorker(async (request) => response('最新の ' + request.url));

  const result = await sendFetch(worker, SCOPE + 'index.html');

  assert.equal(result.body, '最新の ' + SCOPE + 'index.html');
  assert.equal(worker.store.get('totk-map-v1').get(SCOPE + 'index.html').body, '最新の ' + SCOPE + 'index.html');
});

test('PWA: ネットから取れないときだけ、控えを返す', async () => {
  const worker = loadWorker(async () => { throw new TypeError('Failed to fetch'); }, {
    'totk-map-v1': [[SCOPE + 'index.html', response('前回の index.html')]],
  });

  assert.equal((await sendFetch(worker, SCOPE + 'index.html')).body, '前回の index.html');
  await assert.rejects(sendFetch(worker, SCOPE + 'drawer.js'), TypeError);
});

test('PWA: 入れ替えのとき、自分の古い控えだけを消す（同じドメインの他のページの控えは残す）', async () => {
  const worker = loadWorker(async () => response(''), {
    'totk-map-v0': [],
    'totk-map-v1': [],
    'other-app-cache': [],
  });
  const waits = [];

  worker.listeners.activate({ waitUntil: (promise) => waits.push(promise) });
  await Promise.all(waits);

  assert.deepEqual([...worker.store.keys()].sort(), ['other-app-cache', 'totk-map-v1']);
});

test('PWA: 設定ファイルに、ホーム画面に追加するのに要る項目がある', () => {
  const manifest = JSON.parse(read('manifest.webmanifest').toString('utf8'));

  assert.ok(manifest.name && manifest.short_name);
  assert.equal(manifest.start_url, './');
  assert.equal(manifest.display, 'standalone');
  const sizes = manifest.icons.map((icon) => icon.sizes);
  assert.ok(sizes.includes('192x192') && sizes.includes('512x512'));
});

test('PWA: アイコンの画像があり、書いてある大きさと一致する', () => {
  const manifest = JSON.parse(read('manifest.webmanifest').toString('utf8'));
  const icons = [...manifest.icons, { src: 'icons/apple-touch-icon.png', sizes: '180x180' }];

  icons.forEach((icon) => {
    const png = read(icon.src);
    // PNG の先頭16〜23バイト目に幅と高さが入っている
    assert.equal(png.readUInt32BE(16) + 'x' + png.readUInt32BE(20), icon.sizes, icon.src);
  });
});

test('PWA: index.html が設定ファイルとサービスワーカーを読み込んでいる', () => {
  const html = read('index.html').toString('utf8');

  assert.match(html, /<link rel="manifest" href="manifest\.webmanifest">/);
  assert.match(html, /<link rel="apple-touch-icon" href="icons\/apple-touch-icon\.png">/);
  assert.match(html, /navigator\.serviceWorker\.register\('sw\.js'\)/);
});
