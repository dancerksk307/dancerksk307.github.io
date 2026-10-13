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

// 起動スクリプトの「var 名前 = [ ... ];」を取り出して実行する
function loadLaunchArray(name) {
  const source = new RegExp('var ' + name + ' = (\\[[\\s\\S]*?\\]);\\n').exec(html)[1];
  return new Function('return ' + source)();
}

const menuGroups = loadLaunchArray('MENU_GROUPS');
const menuTypes = menuGroups.flatMap((group) => group.typeNames);

const pins = loadPins();

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
    iwa_oct: 21,
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
  });
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

test('下メニューの種類と、データにある種類が一致する', () => {
  const typesInData = [...new Set(pins.map((pin) => pin.type))];

  assert.deepEqual(typesInData.sort(), [...menuTypes].sort());
});

test('下メニューに同じ種類が2回出てこない', () => {
  assert.equal(new Set(menuTypes).size, menuTypes.length);
});

// 地図ツールの下メニューが受け取れる形。これを超えると、はみ出したりボタンが描かれなかったりする
test('下メニューは、いつも見える段が5種類まで、開いて見える組が4つまで', () => {
  assert.ok(menuGroups[0].typeNames.length <= 5);
  assert.ok(menuGroups.length - 1 <= 4);
});

test('開いた直後にONの種類は、同時に表示できる数（MAX_SHOWN_TYPES）以内', () => {
  const defaultOn = loadLaunchArray('DEFAULT_ON_TYPES');
  const max = Number(/var MAX_SHOWN_TYPES = (\d+);/.exec(html)[1]);

  assert.ok(defaultOn.length <= max);
  defaultOn.forEach((type) => assert.ok(menuTypes.includes(type), type));
});

test('検索に出す種類のピンには、すべて名前がある（無いと一覧に空の行が出る）', () => {
  const searchTypes = loadLaunchArray('SEARCH_TYPES');
  const nameless = pins.filter((pin) => searchTypes.includes(pin.type) && !pin.name);

  assert.deepEqual(nameless.map((pin) => pin.id), []);
  searchTypes.forEach((type) => assert.ok(menuTypes.includes(type), type));
});
