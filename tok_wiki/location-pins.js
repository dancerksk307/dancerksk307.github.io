// 地名チェック（完璧版の「地名の印」）。地図の地名ごとに小さな印を出し、タップ1回でチェックを付け外しする。
// 地図ツールにも同じ部品（.LocationPin）があるが使わない。ツールはこの部品用にチェック状態の控えをもう1つ持ち、
// 書き込むたびにその控えで localStorage を丸ごと上書きする。祠などを先にチェックしていると、そのチェックが消え、
// 消えた状態が GitHub にも保存されてしまう。ここでは毎回 localStorage を読み直し、1件だけ変えて書き戻す。
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TotkLocationPins = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SAVE_KEY = 'ZeldaTotkMap'; // 地図ツールの saveKeyName と同じにする
  // 下メニューの「地名」ボタン。種類 area（ピンは無い）をメニューに入れて、そのチェック欄を使っている
  var AREA_SWITCH = '#leaflet-side-switch-button-area';
  var GACHA_URL = 'https://img.gamewith.jp/article_tools/zelda-totk/gacha/';

  function parse(text) {
    try {
      var data = JSON.parse(text || '{}');
      return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    } catch (e) {
      return {};
    }
  }

  // 保存データの中で、id の1件だけを付け外しした結果を返す。他のチェックには触れない
  function toggle(text, id) {
    var data = parse(text);
    if (data[id] === true) delete data[id];
    else data[id] = true;
    return data;
  }

  function countChecked(text, pins) {
    var data = parse(text);
    return pins.filter(function (pin) { return data[pin.id] === true; }).length;
  }

  // ブラウザ用。地図ツールを起動する前に呼ぶ（ツールが作る地図をつかまえるため）。
  // 起動の後で draw() を呼ぶと印を出す
  function create(pins) {
    var map = null;
    var markers = [];
    // 地図ツールは作った地図を外へ出さないので、Leaflet の「地図が作られたとき」の入口でつかまえる
    L.Map.addInitHook(function () { map = this; });

    function readData() { return localStorage.getItem(SAVE_KEY); }

    function icon(pin) {
      var checked = parse(readData())[pin.id] === true;
      return L.divIcon({
        // 地図ツールの地名の印と同じクラス。いま開いている地図の印だけを出す指定は common.css。
        // totk-area-checked は「チェック済みを薄くする」ボタンで薄くするための目印（ツールの is-checked は、ツールの見た目の指定がかかるので使わない）
        className: 'location-pin leaflet-marker-map-' + pin.mapId + (checked ? ' totk-area-checked' : ''),
        html: '<img src="' + GACHA_URL + (checked ? 'pin_check.png' : 'pin_uncheck.png') + '">',
        iconSize: [16, 16],
      });
    }

    function showCounts() {
      $('.totk-area-count').text(countChecked(readData(), pins));
      $('.totk-area-total').text(pins.length);
    }

    function refresh() {
      markers.forEach(function (marker, i) { marker.setIcon(icon(pins[i])); });
      showCounts();
    }

    function showAreaIfOn() {
      $('#RenderMap').toggleClass('totk-show-area', $(AREA_SWITCH).prop('checked') === true);
    }

    function draw() {
      // 地図ツールの「localStorage を読み直す」入口。save.js が GitHub から読み込んだ後にも呼ぶので、印もそこで描き直す
      var reloadTool = window.loadLocalStrageByLeafletArticleMapTool || function () {};
      window.loadLocalStrageByLeafletArticleMapTool = function (key) {
        reloadTool(key);
        if (key === SAVE_KEY) refresh();
      };

      markers = pins.map(function (pin) {
        var marker = L.marker(pin.loc, { icon: icon(pin) });
        marker.on('click', function () {
          var data = toggle(readData(), pin.id);
          // 地図ツールは空のときキーごと消すので、それに合わせる
          if (Object.keys(data).length) localStorage.setItem(SAVE_KEY, JSON.stringify(data));
          else localStorage.removeItem(SAVE_KEY);
          // 地図ツールの控えも読み直させる。そうしないと、次に祠などをチェックしたとき古い控えで上書きされ、この地名のチェックが消える
          reloadTool(SAVE_KEY);
          marker.setIcon(icon(pin));
          showCounts();
        });
        return marker.addTo(map);
      });
      showCounts();

      // 「すべてのチェックを消す」は地図ツールが先に処理する（起動時に付けた処理が先に走る）ので、その後で描き直す
      $('.js-check-reset-all').on('click', refresh);
      // 「全てOFF」はチェック欄を外すだけで change が起きないので、押されたときも見直す。
      // メニューの中のクリックは Leaflet が外へ伝えないので、document ではなくボタンに直接付ける
      $(AREA_SWITCH).on('change', showAreaIfOn);
      $('._clear-btn').on('click', showAreaIfOn);
      showAreaIfOn();
    }

    return { draw: draw };
  }

  return { toggle: toggle, countChecked: countChecked, create: create };
});
