// ゾナウギア製造機（ガチャ。種類 zonai）を、出てくるギアで絞り込む部品。検索欄の上に置き、ゾナウがONのときだけ出す。
// ギアは複数選べる。「すべて含む」は選んだギアがすべて出る製造機だけ、「どれか含む」は1つでも出る製造機を残す（利用者の要望。最初は「すべて含む」）。
// 製造機ごとに出るギアは、ピンの customData.items（カンマ区切り）に入っている。
// 影の像の武器名プルダウン（index.html の setupWeaponFilter）と同じく、当てはまらない製造機のピンだけを display:none で隠す
// （種類のON/OFF・地図の切り替えは地図ツールの CSS に任せる）。選んだギアはブラウザに覚えない（武器名プルダウンと同じ）
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TotkGearFilter = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var TYPE = 'zonai';
  var MAP_ORDER = ['空', '地上', '地底'];

  function itemsOf(pin) {
    return String((pin.customData && pin.customData.items) || '').split(',').filter(Boolean);
  }

  // 選べるギアの一覧（重なりを除き、名前順。かなの名前が先で、漢字の名前は読みの順にはならない）
  function gearList(pins) {
    var seen = {};
    pins.forEach(function (pin) { itemsOf(pin).forEach(function (item) { seen[item] = true; }); });
    return Object.keys(seen).sort(function (a, b) { return a.localeCompare(b, 'ja'); });
  }

  // mode は 'all'（すべて含む）か 'any'（どれか含む）。何も選んでいなければ、すべて残す
  function matches(items, selected, mode) {
    if (!selected.length) return true;
    function has(gear) { return items.indexOf(gear) !== -1; }
    return mode === 'any' ? selected.some(has) : selected.every(has);
  }

  // 当てはまる製造機の数を地図ごとに数える。0か所のときに、壊れていると思われないよう、どの地図にあるかを出すため
  function countByMap(pins, selected, mode) {
    var counts = {};
    MAP_ORDER.forEach(function (map) { counts[map] = 0; });
    pins.forEach(function (pin) {
      if (matches(itemsOf(pin), selected, mode)) counts[pin.mapId] = (counts[pin.mapId] || 0) + 1;
    });
    return counts;
  }

  // 絞り込みのボタンに出す文字
  function summary(selected, mode) {
    if (!selected.length) return 'ギアで絞り込み';
    return (mode === 'any' ? 'どれか: ' : 'すべて: ') + selected.join('・');
  }

  // 地図ツールの起動後に、index.html が呼ぶ。検索欄（.totk-search）を左下のマス目へ移した後であること
  function setup(allPins) {
    var $ = window.jQuery;
    var pins = allPins.filter(function (pin) { return pin.type === TYPE; });
    var gears = gearList(pins);
    var selected = [];
    var mode = 'all';
    var $switch = $('#leaflet-side-switch-button-' + TYPE);

    var ui = document.createElement('div');
    ui.className = 'totk-gear-filter';
    ui.innerHTML = '<button type="button" class="totk-gear-filter__button" aria-expanded="false"></button>';
    var button = ui.querySelector('.totk-gear-filter__button');

    // 選ぶ画面は、マス目の幅いっぱいに、部品の上へ出す（検索欄の幅では、ギアの名前が並びきらないため）
    var panel = document.createElement('div');
    panel.className = 'totk-gear-panel';
    panel.hidden = true;
    panel.innerHTML =
      '<div class="totk-gear-panel__modes">' +
        '<button type="button" data-mode="all">すべて含む</button>' +
        '<button type="button" data-mode="any">どれか含む</button>' +
      '</div>' +
      '<div class="totk-gear-panel__list"></div>' +
      '<p class="totk-gear-panel__count"></p>' +
      '<div class="totk-gear-panel__buttons">' +
        '<button type="button" class="totk-gear-panel__clear">選択を外す</button>' +
        '<button type="button" class="totk-gear-panel__close">閉じる</button>' +
      '</div>';
    var list = panel.querySelector('.totk-gear-panel__list');
    gears.forEach(function (gear) {
      var label = document.createElement('label');
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = gear;
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(gear));
      list.appendChild(label);
    });

    function filter() {
      pins.forEach(function (pin) {
        $('.leaflet-marker-' + TYPE + '[title="' + pin.id + '"]').css('display', matches(itemsOf(pin), selected, mode) ? '' : 'none');
      });
    }
    // ツールがピンを作り直すこと（ONにしたとき・地図を切り替えたとき）があるので、少し待ってから書き直す
    function filterLater() { setTimeout(filter, 10); }

    function render() {
      button.textContent = summary(selected, mode);
      button.classList.toggle('is-active', selected.length > 0);
      button.setAttribute('aria-expanded', String(!panel.hidden));
      Array.prototype.forEach.call(panel.querySelectorAll('[data-mode]'), function (modeButton) {
        modeButton.setAttribute('aria-pressed', String(modeButton.getAttribute('data-mode') === mode));
      });
      Array.prototype.forEach.call(list.querySelectorAll('input'), function (checkbox) {
        checkbox.checked = selected.indexOf(checkbox.value) !== -1;
      });
      var counts = countByMap(pins, selected, mode);
      panel.querySelector('.totk-gear-panel__count').textContent = '当てはまる製造機: ' +
        Object.keys(counts).map(function (map) { return map + ' ' + counts[map]; }).join('・');
    }

    function update() {
      render();
      filter();
    }

    function setPanelOpen(open) {
      panel.hidden = !open;
      render();
    }

    button.addEventListener('click', function () { setPanelOpen(panel.hidden); });
    list.addEventListener('change', function () {
      // 選んだ順ではなく、一覧の順にそろえる（ボタンの文字が選び方で変わらないように）
      selected = Array.prototype.filter.call(list.querySelectorAll('input'), function (checkbox) { return checkbox.checked; })
        .map(function (checkbox) { return checkbox.value; });
      update();
    });
    Array.prototype.forEach.call(panel.querySelectorAll('[data-mode]'), function (modeButton) {
      modeButton.addEventListener('click', function () {
        mode = modeButton.getAttribute('data-mode');
        update();
      });
    });
    panel.querySelector('.totk-gear-panel__clear').addEventListener('click', function () {
      selected = [];
      update();
    });
    panel.querySelector('.totk-gear-panel__close').addEventListener('click', function () { setPanelOpen(false); });

    // 検索欄のすぐ上（武器名のプルダウンがあれば、その上）に置く。選ぶ画面はマス目の入れ物に入れる
    var search = document.querySelector('.totk-search');
    search.insertBefore(ui, search.firstChild);
    search.parentNode.appendChild(panel);
    // マス目の入れ物はクリックを地図へ伝えない作り（index.html）。ホイールも伝えないようにして、一覧をスクロールしたときに地図が拡大縮小しないようにする
    window.L.DomEvent.disableScrollPropagation(panel);

    // ゾナウがONのときだけ出す。「全てOFF」は change が起きないので、押されたときも見直す
    function showIfOn() {
      var on = $switch.is(':checked');
      ui.hidden = !on;
      if (!on) setPanelOpen(false);
      filterLater();
    }
    $switch.on('change', showIfOn);
    $('._clear-btn.totk-in-grid').on('click', showIfOn);
    new MutationObserver(filterLater).observe(document.getElementById('RenderMap'), { attributes: true, attributeFilter: ['d-map'] });
    showIfOn();
    render();
  }

  return {
    gearList: gearList,
    matches: matches,
    countByMap: countByMap,
    summary: summary,
    setup: setup,
  };
});
