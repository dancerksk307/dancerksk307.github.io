// チェックデータを GitHub 上の json と同期する。
// 地図ツール（外部の圧縮済みJS）は localStorage にしか読み書きしないため、ツールには手を入れず、
// 「起動前に GitHub → localStorage」「localStorage が書かれたら → GitHub」の橋渡しだけを行う。
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TotkSave = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var API = 'https://api.github.com';
  var SAVE_KEY = 'ZeldaTotkMap'; // 地図ツールの saveKeyName と同じにする
  var TOKEN_KEY = 'TotkGithubToken';
  var DEBOUNCE_MS = 3000;
  var MAX_CONFLICT_RETRY = 3;
  var COMMIT_MESSAGE = 'chore(save): update check data';

  // base から local にするために「付けた id」「外した id」を出す
  function diff(base, local) {
    return {
      add: Object.keys(local).filter(function (id) { return !(id in base); }),
      remove: Object.keys(base).filter(function (id) { return !(id in local); }),
    };
  }

  function isEmptyDiff(d) {
    return d.add.length === 0 && d.remove.length === 0;
  }

  function applyDiff(data, d) {
    var result = {};
    Object.keys(data).forEach(function (id) { result[id] = data[id]; });
    d.add.forEach(function (id) { result[id] = true; });
    d.remove.forEach(function (id) { delete result[id]; });
    return result;
  }

  function compareIds(a, b) {
    var na = Number(a), nb = Number(b);
    if (!isNaN(na) && !isNaN(nb) && na !== nb) return na - nb;
    return a < b ? -1 : a > b ? 1 : 0;
  }

  // git の差分が「付けた/外した id の行だけ」になるよう、id 順・1行1件で書き出す
  function serialize(data) {
    var lines = Object.keys(data).sort(compareIds).map(function (id) {
      return ' ' + JSON.stringify(id) + ': ' + JSON.stringify(data[id]);
    });
    return lines.length ? '{\n' + lines.join(',\n') + '\n}\n' : '{}\n';
  }

  function toBase64(text) {
    var bytes = new TextEncoder().encode(text), binary = '';
    for (var i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  function fromBase64(base64) {
    var binary = atob(base64.replace(/\s/g, ''));
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function httpError(status) {
    var error = new Error('HTTP ' + status);
    error.status = status;
    return error;
  }

  function parseObject(text) {
    try {
      var data = JSON.parse(text || '{}');
      return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    } catch (e) {
      return {};
    }
  }

  // options: { config, storage, fetch, getToken, onStatus, onRemoteApplied, debounceMs }
  // onStatus(state, httpStatus) の state:
  //   no-config / loading / saved / dirty / saving / no-token / load-error / save-error
  function createSync(options) {
    var config = options.config || {};
    var storage = options.storage;
    var fetchFn = options.fetch;
    var getToken = options.getToken || function () { return ''; };
    var onStatus = options.onStatus || function () {};
    var onRemoteApplied = options.onRemoteApplied || function () {};
    var debounceMs = options.debounceMs === undefined ? DEBOUNCE_MS : options.debounceMs;
    var baseKey = SAVE_KEY + '_base';

    var configured = !!(config.owner && config.repo && config.branch && config.path);
    var repoUrl = API + '/repos/' + config.owner + '/' + config.repo;
    var fileUrl = repoUrl + '/contents/' + config.path;

    var sha = null;      // GitHub 上のファイルの版。更新時に渡さないと上書きを拒否される
    var synced = false;  // sha と base が GitHub の最新を元にしているか
    var timer = null;
    var queue = Promise.resolve();

    function readLocal() { return parseObject(storage.getItem(SAVE_KEY)); }

    function writeLocal(data) {
      // 地図ツールは空のときキーごと消すので、それに合わせる
      if (Object.keys(data).length) storage.setItem(SAVE_KEY, JSON.stringify(data));
      else storage.removeItem(SAVE_KEY);
    }

    function readBase() {
      var text = storage.getItem(baseKey);
      return text === null ? null : parseObject(text);
    }

    function writeBase(data) { storage.setItem(baseKey, JSON.stringify(data)); }

    function request(url, init) {
      init = init || {};
      var headers = { Accept: 'application/vnd.github+json' };
      var token = getToken();
      if (token) headers.Authorization = 'Bearer ' + token;
      if (init.body) headers['Content-Type'] = 'application/json';
      init.headers = headers;
      // GitHub API は応答を60秒キャッシュさせるため、無効にしないと他端末の保存が見えない
      init.cache = 'no-store';
      return fetchFn(url, init);
    }

    function fetchRemote() {
      return request(fileUrl + '?ref=' + encodeURIComponent(config.branch)).then(function (res) {
        // ファイルもブランチもまだ無い初回は 404 になる
        if (res.status === 404) return { data: {}, sha: null };
        if (!res.ok) throw httpError(res.status);
        return res.json().then(function (json) {
          return { data: parseObject(fromBase64(json.content || '')), sha: json.sha };
        });
      });
    }

    // GitHub の最新を取り、まだ送れていない自分の変更（base との差）だけをその上に重ねる。
    // 丸ごと上書きすると、他の端末・タブで付けたチェックを消してしまうため。
    function pull() {
      return fetchRemote().then(function (remote) {
        var local = readLocal();
        var base = readBase();
        // base が無い＝このブラウザで初めて同期する。元からあるブラウザ内データは引き継がず GitHub 側を正とする
        var merged = base ? applyDiff(remote.data, diff(base, local)) : remote.data;
        var changed = !isEmptyDiff(diff(local, merged));
        writeLocal(merged);
        writeBase(remote.data);
        sha = remote.sha;
        synced = true;
        return changed;
      });
    }

    function putFile(data) {
      var body = { message: COMMIT_MESSAGE, content: toBase64(serialize(data)), branch: config.branch };
      if (sha) body.sha = sha;
      // keepalive: タブを閉じる瞬間の保存を、閉じた後も送り切らせる
      return request(fileUrl, { method: 'PUT', body: JSON.stringify(body), keepalive: true });
    }

    function createBranch() {
      return request(repoUrl).then(function (res) {
        if (!res.ok) throw httpError(res.status);
        return res.json();
      }).then(function (repo) {
        return request(repoUrl + '/git/ref/heads/' + encodeURIComponent(repo.default_branch));
      }).then(function (res) {
        if (!res.ok) throw httpError(res.status);
        return res.json();
      }).then(function (ref) {
        return request(repoUrl + '/git/refs', {
          method: 'POST',
          body: JSON.stringify({ ref: 'refs/heads/' + config.branch, sha: ref.object.sha }),
        });
      }).then(function (res) {
        // 422 は「すでにある」（他のタブが先に作った）なので成功扱い
        if (!res.ok && res.status !== 422) throw httpError(res.status);
      });
    }

    function settledState() { return getToken() ? 'saved' : 'no-token'; }

    function push() {
      var conflicts = 0;
      var branchCreated = false;

      function attempt() {
        if (!getToken()) { onStatus('no-token'); return Promise.resolve(); }
        var ready = synced ? Promise.resolve(false) : pull();
        return ready.then(function (changed) {
          if (changed) onRemoteApplied();
          var data = readLocal();
          if (isEmptyDiff(diff(readBase() || {}, data))) { onStatus('saved'); return; }
          onStatus('saving');
          return putFile(data).then(function (res) {
            if (res.ok) {
              return res.json().then(function (json) {
                sha = json.content.sha;
                writeBase(data);
                // 送信中に付いたチェックがあれば、続けて送る
                return attempt();
              });
            }
            // 409: 他の端末・タブが先に保存した / 422: ファイルがあるのに版を渡していない
            if ((res.status === 409 || res.status === 422) && conflicts < MAX_CONFLICT_RETRY) {
              conflicts++;
              synced = false;
              return attempt();
            }
            if (res.status === 404 && !branchCreated) {
              branchCreated = true;
              return createBranch().then(attempt);
            }
            throw httpError(res.status);
          });
        });
      }

      return attempt().catch(function (error) {
        synced = false;
        onStatus('save-error', error.status || 0);
      });
    }

    function load() {
      if (!configured) { onStatus('no-config'); return Promise.resolve(); }
      onStatus('loading');
      queue = queue.then(pull).then(function (changed) {
        if (changed) onRemoteApplied();
        if (isEmptyDiff(diff(readBase(), readLocal()))) onStatus(settledState());
        else return push();
      }, function (error) {
        // 初回から読めなかった場合、今のブラウザ内データを起点にしておく。
        // こうしないと、この後付けたチェックが次回の同期で「引き継がない古いデータ」と一緒に捨てられる
        if (readBase() === null) writeBase(readLocal());
        onStatus('load-error', error.status || 0);
      });
      return queue;
    }

    function flush() {
      if (!configured) return Promise.resolve();
      clearTimeout(timer);
      timer = null;
      queue = queue.then(push);
      return queue;
    }

    function notifyChanged() {
      if (!configured) return;
      onStatus(getToken() ? 'dirty' : 'no-token');
      clearTimeout(timer);
      timer = setTimeout(flush, debounceMs);
    }

    return { load: load, flush: flush, notifyChanged: notifyChanged };
  }

  // ブラウザ用の組み立て。localStorage への書き込みを見張り、同期を開始する
  function start(options) {
    var ls = window.localStorage;
    var proto = Object.getPrototypeOf(ls);
    var original = { getItem: proto.getItem, setItem: proto.setItem, removeItem: proto.removeItem };
    // 同期処理自身の書き込みで保存が再予約されないよう、見張りを通さない元の関数を使う
    var rawStorage = {
      getItem: function (key) { return original.getItem.call(ls, key); },
      setItem: function (key, value) { original.setItem.call(ls, key, value); },
      removeItem: function (key) { original.removeItem.call(ls, key); },
    };

    var sync = createSync({
      config: options.config,
      storage: rawStorage,
      fetch: window.fetch.bind(window),
      getToken: function () { return rawStorage.getItem(TOKEN_KEY) || ''; },
      onStatus: options.onStatus,
      onRemoteApplied: function () {
        // 地図ツールが用意している「localStorage を読み直してピンの表示を更新する」入口
        if (window.loadLocalStrageByLeafletArticleMapTool) window.loadLocalStrageByLeafletArticleMapTool(SAVE_KEY);
      },
    });

    proto.setItem = function (key) {
      original.setItem.apply(this, arguments);
      if (this === ls && key === SAVE_KEY) sync.notifyChanged();
    };
    proto.removeItem = function (key) {
      original.removeItem.apply(this, arguments);
      if (this === ls && key === SAVE_KEY) sync.notifyChanged();
    };

    // タブを閉じる・別ページへ移るときは、3秒待たずに送る
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') sync.flush();
    });

    api.ready = sync.load();
    return {
      reload: sync.load,
      hasToken: function () { return !!rawStorage.getItem(TOKEN_KEY); },
      setToken: function (token) {
        if (token) rawStorage.setItem(TOKEN_KEY, token);
        else rawStorage.removeItem(TOKEN_KEY);
      },
    };
  }

  var api = {
    diff: diff,
    applyDiff: applyDiff,
    serialize: serialize,
    createSync: createSync,
    start: start,
    // 各ページはこれを待ってから地図ツールを起動する。start() 前は即完了
    ready: Promise.resolve(),
  };
  return api;
});
