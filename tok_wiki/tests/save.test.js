// 実行: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const TotkSave = require('../save.js');

const SAVE_KEY = 'ZeldaTotkMap';
const BASE_KEY = 'ZeldaTotkMap_base';
const CONFIG = { owner: 'someone', repo: 'site', branch: 'save-data', path: 'tok_wiki/data/save.json' };
const FILE_URL = 'https://api.github.com/repos/someone/site/contents/tok_wiki/data/save.json';

function createStorage(initial) {
  const items = new Map(Object.entries(initial || {}));
  return {
    getItem: (key) => (items.has(key) ? items.get(key) : null),
    setItem: (key, value) => items.set(key, String(value)),
    removeItem: (key) => items.delete(key),
  };
}

function response(status, json) {
  return { ok: status >= 200 && status < 300, status, json: async () => json };
}

// GitHub の代役。ファイル1つと、その版（sha）を持つ
function createGitHub(initialData) {
  const github = {
    data: initialData === undefined ? null : initialData, // null = ファイルがまだ無い
    version: 1,
    branchExists: true,
    requests: [],
    beforePut: null, // PUT が届く直前に1度だけ呼ばれる（他の端末の割り込み保存を再現する）
  };
  const sha = () => 'sha' + github.version;

  github.fetch = async (url, init = {}) => {
    const method = init.method || 'GET';
    github.requests.push({ method, url, headers: init.headers });

    if (url.startsWith(FILE_URL) && method === 'GET') {
      if (!github.branchExists || github.data === null) return response(404, {});
      const content = Buffer.from(TotkSave.serialize(github.data)).toString('base64');
      return response(200, { content, sha: sha() });
    }
    if (url === FILE_URL && method === 'PUT') {
      if (github.beforePut) { const hook = github.beforePut; github.beforePut = null; hook(); }
      const body = JSON.parse(init.body);
      if (!github.branchExists) return response(404, {});
      if (github.data !== null && !body.sha) return response(422, {});
      if (github.data !== null && body.sha !== sha()) return response(409, {});
      github.data = JSON.parse(Buffer.from(body.content, 'base64').toString());
      github.version++;
      return response(github.version === 2 ? 201 : 200, { content: { sha: sha() } });
    }
    if (url === 'https://api.github.com/repos/someone/site') return response(200, { default_branch: 'master' });
    if (url.endsWith('/git/ref/heads/master')) return response(200, { object: { sha: 'mastersha' } });
    if (url.endsWith('/git/refs') && method === 'POST') { github.branchExists = true; return response(201, {}); }
    throw new Error('unexpected request: ' + method + ' ' + url);
  };
  // 他の端末が保存したことにする
  github.saveFromOtherDevice = (data) => { github.data = data; github.version++; };
  github.count = (method) => github.requests.filter((r) => r.method === method).length;
  return github;
}

function createSync({ github, storage, token = 'token' }) {
  const statuses = [];
  let remoteApplied = 0;
  const sync = TotkSave.createSync({
    config: CONFIG,
    storage,
    fetch: github.fetch,
    getToken: () => token,
    onStatus: (state, httpStatus) => statuses.push(httpStatus ? state + ':' + httpStatus : state),
    onRemoteApplied: () => remoteApplied++,
    debounceMs: 0,
  });
  return { sync, statuses, lastStatus: () => statuses[statuses.length - 1], remoteApplied: () => remoteApplied };
}

const readChecks = (storage) => JSON.parse(storage.getItem(SAVE_KEY) || '{}');
// 地図ツールがチェックを書き込むのと同じ操作
function check(storage, sync, data) {
  if (Object.keys(data).length) storage.setItem(SAVE_KEY, JSON.stringify(data));
  else storage.removeItem(SAVE_KEY);
  sync.notifyChanged();
}

test('diff: 付けた id と外した id を出す', () => {
  assert.deepEqual(TotkSave.diff({ 1: true, 2: true }, { 2: true, 3: true }), { add: ['3'], remove: ['1'] });
});

test('applyDiff: 付けた分・外した分だけを重ねる', () => {
  const result = TotkSave.applyDiff({ 1: true, 2: true, 9: true }, { add: ['3'], remove: ['1'] });
  assert.deepEqual(result, { 2: true, 3: true, 9: true });
});

test('serialize: id の番号順に1行1件で書き出す', () => {
  assert.equal(TotkSave.serialize({ 3001: true, 1002: true, 24001: true }), '{\n "1002": true,\n "3001": true,\n "24001": true\n}\n');
  assert.equal(TotkSave.serialize({}), '{}\n');
});

test('読み込み: GitHub の内容がブラウザ内データになる', async () => {
  const github = createGitHub({ 3001: true });
  const storage = createStorage();
  const { sync, lastStatus } = createSync({ github, storage });

  await sync.load();

  assert.deepEqual(readChecks(storage), { 3001: true });
  assert.equal(lastStatus(), 'saved');
  assert.equal(github.count('PUT'), 0);
});

test('読み込み: 初めてのブラウザでは、元からあるブラウザ内データを引き継がない', async () => {
  const github = createGitHub({ 3001: true });
  const storage = createStorage({ [SAVE_KEY]: '{"9999":true}' });
  const { sync } = createSync({ github, storage });

  await sync.load();

  assert.deepEqual(readChecks(storage), { 3001: true });
  assert.deepEqual(github.data, { 3001: true });
});

test('読み込み: ファイルがまだ無い（404）ときは空として扱う', async () => {
  const github = createGitHub();
  const storage = createStorage();
  const { sync, lastStatus } = createSync({ github, storage });

  await sync.load();

  assert.deepEqual(readChecks(storage), {});
  assert.equal(lastStatus(), 'saved');
});

test('読み込み: 通信失敗ではブラウザ内データを残し、後のチェックも次の同期で送られる', async () => {
  const github = createGitHub({ 3001: true });
  const storage = createStorage({ [SAVE_KEY]: '{"9999":true}' });
  let offline = true;
  const fetch = (...args) => (offline ? Promise.reject(new TypeError('network')) : github.fetch(...args));
  const { sync, lastStatus } = createSync({ github: { fetch }, storage });

  await sync.load();
  assert.equal(lastStatus(), 'load-error');
  assert.deepEqual(readChecks(storage), { 9999: true });

  storage.setItem(SAVE_KEY, '{"9999":true,"3002":true}');
  offline = false;
  await sync.flush();

  assert.deepEqual(github.data, { 3001: true, 3002: true });
  assert.equal(lastStatus(), 'saved');
});

test('保存: チェックすると GitHub に送られ、続けて保存できる', async () => {
  const github = createGitHub({ 3001: true });
  const storage = createStorage();
  const { sync, lastStatus } = createSync({ github, storage });
  await sync.load();

  check(storage, sync, { 3001: true, 3002: true });
  await sync.flush();
  assert.deepEqual(github.data, { 3001: true, 3002: true });

  check(storage, sync, { 3002: true });
  await sync.flush();
  assert.deepEqual(github.data, { 3002: true });
  assert.equal(github.count('PUT'), 2);
  assert.equal(lastStatus(), 'saved');
});

test('保存: 連続でチェックしても、まとめて1回だけ送る', async () => {
  const github = createGitHub({});
  const storage = createStorage();
  const { sync } = createSync({ github, storage });
  await sync.load();

  check(storage, sync, { 1: true });
  check(storage, sync, { 1: true, 2: true });
  check(storage, sync, { 1: true, 2: true, 3: true });
  await sync.flush();

  assert.deepEqual(github.data, { 1: true, 2: true, 3: true });
  assert.equal(github.count('PUT'), 1);
});

test('保存: 変更が無ければ送らない', async () => {
  const github = createGitHub({ 3001: true });
  const { sync } = createSync({ github, storage: createStorage() });
  await sync.load();

  await sync.flush();

  assert.equal(github.count('PUT'), 0);
});

test('保存: トークンが無ければ送らず、その旨を知らせる', async () => {
  const github = createGitHub({});
  const storage = createStorage();
  const { sync, lastStatus } = createSync({ github, storage, token: '' });
  await sync.load();
  assert.equal(lastStatus(), 'no-token');

  check(storage, sync, { 3001: true });
  await sync.flush();

  assert.equal(github.count('PUT'), 0);
  assert.equal(lastStatus(), 'no-token');
  assert.equal(github.requests[0].headers.Authorization, undefined);
});

test('保存: すべてリセット（空）も保存される', async () => {
  const github = createGitHub({ 3001: true, 3002: true });
  const storage = createStorage();
  const { sync } = createSync({ github, storage });
  await sync.load();

  check(storage, sync, {});
  await sync.flush();

  assert.deepEqual(github.data, {});
});

test('保存: ファイルがまだ無いときは新しく作る', async () => {
  const github = createGitHub();
  const storage = createStorage();
  const { sync } = createSync({ github, storage });
  await sync.load();

  check(storage, sync, { 3001: true });
  await sync.flush();

  assert.deepEqual(github.data, { 3001: true });
});

test('保存: 保存用ブランチが無ければ作ってから保存する', async () => {
  const github = createGitHub();
  github.branchExists = false;
  const storage = createStorage();
  const { sync, lastStatus } = createSync({ github, storage });
  await sync.load();

  check(storage, sync, { 3001: true });
  await sync.flush();

  assert.equal(github.branchExists, true);
  assert.deepEqual(github.data, { 3001: true });
  assert.equal(lastStatus(), 'saved');
});

test('衝突: 他の端末が先に保存していても、相手のチェックを消さずに自分の変更を重ねる', async () => {
  const github = createGitHub({ 3001: true, 3002: true });
  const storage = createStorage();
  const { sync, remoteApplied } = createSync({ github, storage });
  await sync.load();
  const appliedOnLoad = remoteApplied();

  // 自分: 3002 を外して 3003 を付ける ／ 他の端末: その間に 1002 を付けて保存
  check(storage, sync, { 3001: true, 3003: true });
  github.beforePut = () => github.saveFromOtherDevice({ 3001: true, 3002: true, 1002: true });
  await sync.flush();

  assert.deepEqual(github.data, { 1002: true, 3001: true, 3003: true });
  assert.deepEqual(readChecks(storage), { 1002: true, 3001: true, 3003: true });
  assert.equal(remoteApplied() - appliedOnLoad, 1, '相手の変更を画面に反映するよう通知する');
});

test('再開: 送る前に閉じた変更は、次に開いたときに送られる', async () => {
  const github = createGitHub({ 3001: true });
  const storage = createStorage();
  const first = createSync({ github, storage });
  await first.sync.load();
  storage.setItem(SAVE_KEY, '{"3001":true,"3002":true}'); // 送る前にページを閉じた

  github.saveFromOtherDevice({ 3001: true, 1002: true });
  const second = createSync({ github, storage });
  await second.sync.load();

  assert.deepEqual(github.data, { 1002: true, 3001: true, 3002: true });
  assert.deepEqual(readChecks(storage), { 1002: true, 3001: true, 3002: true });
  assert.deepEqual(JSON.parse(storage.getItem(BASE_KEY)), { 1002: true, 3001: true, 3002: true });
});

test('エラー: トークンが無効なら保存失敗を理由つきで知らせ、次の保存でやり直せる', async () => {
  const github = createGitHub({});
  const storage = createStorage();
  let rejectPut = true;
  const fetch = (url, init = {}) =>
    (rejectPut && init.method === 'PUT' ? Promise.resolve(response(401, {})) : github.fetch(url, init));
  const { sync, lastStatus } = createSync({ github: { fetch }, storage });
  await sync.load();

  check(storage, sync, { 3001: true });
  await sync.flush();
  assert.equal(lastStatus(), 'save-error:401');
  assert.deepEqual(readChecks(storage), { 3001: true });

  rejectPut = false;
  await sync.flush();
  assert.deepEqual(github.data, { 3001: true });
  assert.equal(lastStatus(), 'saved');
});

test('設定が空なら何も通信しない', async () => {
  const github = createGitHub({});
  const statuses = [];
  const sync = TotkSave.createSync({
    config: {}, storage: createStorage(), fetch: github.fetch, onStatus: (state) => statuses.push(state),
  });

  await sync.load();
  sync.notifyChanged();
  await sync.flush();

  assert.deepEqual(statuses, ['no-config']);
  assert.equal(github.requests.length, 0);
});
