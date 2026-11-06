// 実行: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// index.html の中の「var data = [ ... ];」を取り出して実行し、ピンの配列を得る
function loadPins() {
  const start = html.indexOf('var data = [');
  const end = html.indexOf('window._pinDatas');
  return new Function(html.slice(start, end) + '; return data;')();
}

// 起動スクリプトの「var 名前 = [ ... ];」を取り出して実行する。
// 手元のファイルは git の設定（autocrlf）で改行が CRLF になることがあるので、どちらの改行でも読めるようにしている
function loadLaunchArray(name) {
  const source = new RegExp('var ' + name + ' = (\\[[\\s\\S]*?\\]);\\r?\\n').exec(html)[1];
  return new Function('return ' + source)();
}

const TotkMenuLayout = require('../menu-layout.js');

// 下メニューの初期配置（var DEFAULT_MENU_LAYOUT = { ... };）を取り出して実行する
function loadDefaultMenuLayout() {
  const source = /var DEFAULT_MENU_LAYOUT = (\{[\s\S]*?\r?\n\});\r?\n/.exec(html)[1];
  return new Function('return ' + source)();
}

const defaultMenuLayout = loadDefaultMenuLayout();
const menuItems = defaultMenuLayout.rows.flat().filter((item) => item && item !== TotkMenuLayout.FIXED);
const menuTypes = menuItems.filter((item) => item !== TotkMenuLayout.CLEAR);
// まとめてON/OFFする種類（var LINKED_TYPES = { 下メニューに置く種類: [一緒にON/OFFする種類] };）
const linkedTypes = new Function('return ' + /var LINKED_TYPES = (\{.*\});/.exec(html)[1])();
const linkedFollowerTypes = Object.values(linkedTypes).flat();

const pins = loadPins();

// 地名チェックの印（location-pins.js が描く）。種類のピンとは別の配列
function loadLocationPins() {
  const start = html.indexOf('window._locationPinDatas = [');
  const end = html.indexOf('</script>', start);
  return new Function(html.slice(start, end).replace('window._locationPinDatas =', 'return'))();
}
const locationPins = loadLocationPins();
// 「地名」はピンの無い種類（area）で、下メニューのボタンだけを地名チェックの表示切り替えに使っている
const PIN_LESS_MENU_TYPES = ['area'];

test('ピンの件数と種類ごとの内訳が README の記載どおり', () => {
  const counts = {};
  pins.forEach((pin) => { counts[pin.type] = (counts[pin.type] || 0) + 1; });

  assert.deepEqual(counts, {
    hokora: 152,
    hokorachallenge: 31,
    tower: 15,
    cave: 198,
    well: 58,
    korok: 900,
    village: 25,
    stables: 16,
    dungeon: 6,
    hinokkusu: 68,
    iwarokku: 63,
    ierokku: 24,
    iwa_oct: 22,
    block: 35,
    frox: 40,
    gurioku: 14,
    lynel: 34,
    morudora: 4,
    phantom: 49,
    koga: 4,
    boss_temple: 12,
    root: 120,
    hole: 72,
    // 完璧版から足した種類
    zonai: 30,
    fairy: 5,
    map: 31,
    sage: 20,
    tears: 11,
    blueprint: 46,
    demon_statue: 7,
    god_statue: 17,
    kanban: 81,
    mine: 10,
    seiren: 11,
    grove: 15,
    blacksmith: 1,
    battery: 2,
    ancienttablet: 12,
    // 影の像
    'shadow-sword': 23,
    'shadow-large': 29,
    'shadow-lance': 27,
  });
});

test('地名チェックの印は223か所で、空島・地上・地底のどれかにある', () => {
  assert.equal(locationPins.length, 223);
  assert.deepEqual(locationPins.filter((pin) => !['空', '地上', '地底'].includes(pin.mapId)).map((pin) => pin.id), []);
});

test('地名チェックの id が、ピンの id とも地名どうしでも重ならない（チェックの保存データを共有している）', () => {
  const ids = [...pins, ...locationPins].map((pin) => pin.id);

  assert.equal(new Set(ids).size, ids.length);
});

test('ピンの id が重ならない（チェックの保存データは id だけで区別している）', () => {
  const seen = new Set();
  const duplicated = pins.filter((pin) => {
    if (seen.has(pin.id)) return true;
    seen.add(pin.id);
    return false;
  });

  assert.deepEqual(duplicated.map((pin) => pin.id), []);
});

// チェックの保存データは id で記録しているので、id が変わると今までのチェックが外れる。
// 洞窟は名前でチェックをまとめる（下のテスト参照）ので、名前が変わってもチェックがずれる。
// fixtures/pins-v1.json は、完璧版を取り込む前（1,961ピン）の index.html から書き出したもの
test('取り込み前のピンが、同じ id・種類・名前のまま全部残っている（今までのチェックが外れない）', () => {
  const before = require('./fixtures/pins-v1.json');
  const byId = new Map(pins.map((pin) => [pin.id, pin]));
  const changed = before.filter((old) => {
    const pin = byId.get(old.id);
    return !pin || pin.type !== old.type || pin.name !== old.name;
  });

  assert.deepEqual(changed.map((old) => old.id), []);
});

// 地図ツールは「種類 cave のピンと同じ名前のピン」の id を、種類を問わず cave 側の id に書き換える。
// 同じ名前が2つあると、別々のピンが1つのチェックを共有してしまう
test('洞窟（cave）と同じ名前のピンが他に無い', () => {
  const caveNames = pins.filter((pin) => pin.type === 'cave').map((pin) => pin.name);
  const usedCount = {};
  pins.forEach((pin) => { usedCount[pin.name] = (usedCount[pin.name] || 0) + 1; });

  assert.deepEqual(caveNames.filter((name) => usedCount[name] > 1), []);
});

test('地図に無い場所（空島・地上・地底以外）のピンが無い', () => {
  // 元ページには mapId が「ダミー」のピンが混ざっていることがある。どの地図にも出ないのに検索の一覧には出てしまう
  const maps = ['空', '地上', '地底'];
  const hidden = pins.filter((pin) => !maps.includes(pin.mapId));

  assert.deepEqual(hidden.map((pin) => pin.id), []);
});

// 一緒にON/OFFする種類（影の像の片手剣・槍）は、下メニューには置かず、代表のボタン（両手剣）でON/OFFする
test('下メニューの種類（と、一緒にON/OFFする種類）と、データにある種類が一致する', () => {
  const typesInData = [...new Set(pins.map((pin) => pin.type))];

  assert.deepEqual([...typesInData, ...PIN_LESS_MENU_TYPES].sort(), [...menuTypes, ...linkedFollowerTypes].sort());
});

test('まとめてON/OFFする種類は、代表だけが下メニューにあり、一緒の種類は下メニューに無い', () => {
  assert.deepEqual(linkedTypes, { 'shadow-large': ['shadow-sword', 'shadow-lance'] });
  Object.keys(linkedTypes).forEach((main) => assert.ok(menuTypes.includes(main), main));
  linkedFollowerTypes.forEach((type) => assert.ok(!menuTypes.includes(type), type));
});

test('下メニューに同じ項目が2回出てこない', () => {
  assert.equal(new Set(menuItems).size, menuItems.length);
});

// 初期配置が並びの決まり（横7マス、1段目の左端は「表示設定」）を守っていれば、並べ直しで何も変わらない
test('下メニューの初期配置は、そのままで正しい並び（横7マス・左上は表示設定・全てOFFがある）', () => {
  const normalized = TotkMenuLayout.normalize(defaultMenuLayout, menuItems, defaultMenuLayout);

  assert.deepEqual(normalized, defaultMenuLayout);
  defaultMenuLayout.rows.forEach((row) => assert.equal(row.length, TotkMenuLayout.COLUMNS));
  assert.ok(menuItems.includes(TotkMenuLayout.CLEAR));
});

test('開いた直後にONの種類は、下メニューにある種類', () => {
  const defaultOn = loadLaunchArray('DEFAULT_ON_TYPES');

  defaultOn.forEach((type) => assert.ok(menuTypes.includes(type), type));
});

// 地図ツールは種類データに size が無ければピンを20pxで描く。チェック済みのピンの絵を縮める余白（common.css の padding: 3px）は、
// この大きさから決めているので、大きさを変える種類を足したら CSS も見直す
test('ピンのアイコンの大きさを変えている種類が無い（どのピンも20px）', () => {
  const start = html.indexOf('window._typeDatas = [');
  const typeDatas = new Function('return ' + html.slice(start + 'window._typeDatas = '.length, html.indexOf('];', start) + 1))();

  assert.deepEqual(typeDatas.filter((type) => type.size !== undefined).map((type) => type.name), []);
});

// 地図ツールは、検索の一覧に name を出し、無ければ label を出す
test('検索に出す種類のピンには、すべて名前がある（無いと一覧に空の行が出る）', () => {
  const searchTypes = loadLaunchArray('SEARCH_TYPES');
  const nameless = pins.filter((pin) => searchTypes.includes(pin.type) && !pin.name && !pin.label);

  assert.deepEqual(nameless.map((pin) => pin.id), []);
  searchTypes.forEach((type) => assert.ok(menuTypes.includes(type), type));
});
