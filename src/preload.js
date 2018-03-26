// Globals might be on window or window.parent depending on if there's a context
// iframe wrapper.
const require = window.require || window.parent.require;
const process = window.process || window.parent.process;
const __dirname = window.__dirname || window.parent.__dirname;

const path = require("path");
const fs = require("fs");

/* eslint-disable */
// This is a slightly modified copy of the "resolve" package (and associated
// dependencies) bundled by rollup. We need it inline here because electron's
// normal require function doesn't look into node_modules directories outside
// of electron.
const resolve = (function() {
  "use strict";
  // This software is released under the MIT license:

  // Permission is hereby granted, free of charge, to any person obtaining a copy of
  // this software and associated documentation files (the "Software"), to deal in
  // the Software without restriction, including without limitation the rights to
  // use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  // the Software, and to permit persons to whom the Software is furnished to do so,
  // subject to the following conditions:

  // The above copyright notice and this permission notice shall be included in all
  // copies or substantial portions of the Software.

  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  // FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  // COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  // IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  // CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  function createCommonjsModule(fn, module) {
    return (
      (module = { exports: {} }), fn(module, module.exports), module.exports
    );
  }

  var coreData = {
    assert: true,
    async_hooks: ">= 8",
    buffer_ieee754: "< 0.9.7",
    buffer: true,
    child_process: true,
    cluster: true,
    console: true,
    constants: true,
    crypto: true,
    _debugger: "< 8",
    dgram: true,
    dns: true,
    domain: true,
    events: true,
    freelist: "< 6",
    fs: true,
    _http_agent: ">= 0.11.1",
    _http_client: ">= 0.11.1",
    _http_common: ">= 0.11.1",
    _http_incoming: ">= 0.11.1",
    _http_outgoing: ">= 0.11.1",
    _http_server: ">= 0.11.1",
    http: true,
    http2: ">= 8.8",
    https: true,
    inspector: ">= 8.0.0",
    _linklist: "< 8",
    module: true,
    net: true,
    "node-inspect/lib/_inspect": ">= 7.6.0",
    "node-inspect/lib/internal/inspect_client": ">= 7.6.0",
    "node-inspect/lib/internal/inspect_repl": ">= 7.6.0",
    os: true,
    path: true,
    perf_hooks: ">= 8.5",
    process: ">= 1",
    punycode: true,
    querystring: true,
    readline: true,
    repl: true,
    smalloc: ">= 0.11.5 && < 3",
    _stream_duplex: ">= 0.9.4",
    _stream_transform: ">= 0.9.4",
    _stream_wrap: ">= 1.4.1",
    _stream_passthrough: ">= 0.9.4",
    _stream_readable: ">= 0.9.4",
    _stream_writable: ">= 0.9.4",
    stream: true,
    string_decoder: true,
    sys: true,
    timers: true,
    _tls_common: ">= 0.11.13",
    _tls_legacy: ">= 0.11.3",
    _tls_wrap: ">= 0.11.3",
    tls: true,
    tty: true,
    url: true,
    util: true,
    "v8/tools/codemap": [">= 4.4.0 && < 5", ">= 5.2.0"],
    "v8/tools/consarray": [">= 4.4.0 && < 5", ">= 5.2.0"],
    "v8/tools/csvparser": [">= 4.4.0 && < 5", ">= 5.2.0"],
    "v8/tools/logreader": [">= 4.4.0 && < 5", ">= 5.2.0"],
    "v8/tools/profile_view": [">= 4.4.0 && < 5", ">= 5.2.0"],
    "v8/tools/splaytree": [">= 4.4.0 && < 5", ">= 5.2.0"],
    v8: ">= 1",
    vm: true,
    zlib: true
  };

  var current =
    (process.versions &&
      process.versions.node &&
      process.versions.node.split(".")) ||
    [];

  function specifierIncluded(specifier) {
    var parts = specifier.split(" ");
    var op = parts[0];
    var versionParts = parts[1].split(".");

    for (var i = 0; i < 3; ++i) {
      var cur = Number(current[i] || 0);
      var ver = Number(versionParts[i] || 0);
      if (cur === ver) {
        continue; // eslint-disable-line no-restricted-syntax, no-continue
      }
      if (op === "<") {
        return cur < ver;
      } else if (op === ">=") {
        return cur >= ver;
      } else {
        return false;
      }
    }
    return op === ">=";
  }

  function matchesRange(range) {
    var specifiers = range.split(/ ?&& ?/);
    if (specifiers.length === 0) {
      return false;
    }
    for (var i = 0; i < specifiers.length; ++i) {
      if (!specifierIncluded(specifiers[i])) {
        return false;
      }
    }
    return true;
  }

  function versionIncluded(specifierValue) {
    if (typeof specifierValue === "boolean") {
      return specifierValue;
    }
    if (specifierValue && typeof specifierValue === "object") {
      for (var i = 0; i < specifierValue.length; ++i) {
        if (matchesRange(specifierValue[i])) {
          return true;
        }
      }
      return false;
    }
    return matchesRange(specifierValue);
  }

  var core = {};
  for (var mod in coreData) {
    // eslint-disable-line no-restricted-syntax
    if (Object.prototype.hasOwnProperty.call(coreData, mod)) {
      core[mod] = versionIncluded(coreData[mod]);
    }
  }
  var core_1 = core;

  var caller = function() {
    // see https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    var origPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack) {
      return stack;
    };
    var stack = new Error().stack;
    Error.prepareStackTrace = origPrepareStackTrace;
    return stack[2].getFileName();
  };

  var pathParse = createCommonjsModule(function(module) {
    var isWindows = process.platform === "win32";

    // Regex to split a windows path into three parts: [*, device, slash,
    // tail] windows-only
    var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

    // Regex to split the tail part of the above into [*, dir, basename, ext]
    var splitTailRe = /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

    var win32 = {};

    // Function to split a filename into [root, dir, basename, ext]
    function win32SplitPath(filename) {
      // Separate device+slash from tail
      var result = splitDeviceRe.exec(filename),
        device = (result[1] || "") + (result[2] || ""),
        tail = result[3] || "";
      // Split the tail into dir, basename and extension
      var result2 = splitTailRe.exec(tail),
        dir = result2[1],
        basename = result2[2],
        ext = result2[3];
      return [device, dir, basename, ext];
    }

    win32.parse = function(pathString) {
      if (typeof pathString !== "string") {
        throw new TypeError(
          "Parameter 'pathString' must be a string, not " + typeof pathString
        );
      }
      var allParts = win32SplitPath(pathString);
      if (!allParts || allParts.length !== 4) {
        throw new TypeError("Invalid path '" + pathString + "'");
      }
      return {
        root: allParts[0],
        dir: allParts[0] + allParts[1].slice(0, -1),
        base: allParts[2],
        ext: allParts[3],
        name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
      };
    };

    // Split a filename into [root, dir, basename, ext], unix version
    // 'root' is just a slash, or nothing.
    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    var posix = {};

    function posixSplitPath(filename) {
      return splitPathRe.exec(filename).slice(1);
    }

    posix.parse = function(pathString) {
      if (typeof pathString !== "string") {
        throw new TypeError(
          "Parameter 'pathString' must be a string, not " + typeof pathString
        );
      }
      var allParts = posixSplitPath(pathString);
      if (!allParts || allParts.length !== 4) {
        throw new TypeError("Invalid path '" + pathString + "'");
      }
      allParts[1] = allParts[1] || "";
      allParts[2] = allParts[2] || "";
      allParts[3] = allParts[3] || "";

      return {
        root: allParts[0],
        dir: allParts[0] + allParts[1].slice(0, -1),
        base: allParts[2],
        ext: allParts[3],
        name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
      };
    };

    if (isWindows) module.exports = win32.parse; /* posix */
    else module.exports = posix.parse;

    module.exports.posix = posix.parse;
    module.exports.win32 = win32.parse;
  });
  var pathParse_1 = pathParse.posix;
  var pathParse_2 = pathParse.win32;

  var parse = path.parse || pathParse;

  var nodeModulesPaths = function nodeModulesPaths(start, opts) {
    var modules =
      opts && opts.moduleDirectory
        ? [].concat(opts.moduleDirectory)
        : ["node_modules"];

    // ensure that `start` is an absolute path at this point,
    // resolving against the process' current working directory
    var absoluteStart = path.resolve(start);

    if (opts && opts.preserveSymlinks === false) {
      try {
        absoluteStart = fs.realpathSync(absoluteStart);
      } catch (err) {
        if (err.code !== "ENOENT") {
          throw err;
        }
      }
    }

    var prefix = "/";
    if (/^([A-Za-z]:)/.test(absoluteStart)) {
      prefix = "";
    } else if (/^\\\\/.test(absoluteStart)) {
      prefix = "\\\\";
    }

    var paths = [absoluteStart];
    var parsed = parse(absoluteStart);
    while (parsed.dir !== paths[paths.length - 1]) {
      paths.push(parsed.dir);
      parsed = parse(parsed.dir);
    }

    var dirs = paths.reduce(function(dirs, aPath) {
      return dirs.concat(
        modules.map(function(moduleDir) {
          return path.join(prefix, aPath, moduleDir);
        })
      );
    }, []);

    return opts && opts.paths ? dirs.concat(opts.paths) : dirs;
  };

  var async = function resolve(x, options, callback) {
    var cb = callback;
    var opts = options || {};
    if (typeof opts === "function") {
      cb = opts;
      opts = {};
    }
    if (typeof x !== "string") {
      var err = new TypeError("Path must be a string.");
      return process.nextTick(function() {
        cb(err);
      });
    }

    var isFile =
      opts.isFile ||
      function(file, cb) {
        fs.stat(file, function(err, stat) {
          if (!err) {
            return cb(null, stat.isFile() || stat.isFIFO());
          }
          if (err.code === "ENOENT" || err.code === "ENOTDIR")
            return cb(null, false);
          return cb(err);
        });
      };
    var readFile = opts.readFile || fs.readFile;

    var extensions = opts.extensions || [".js"];
    var y = opts.basedir || path.dirname(caller());

    opts.paths = opts.paths || [];

    if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(x)) {
      var res = path.resolve(y, x);
      if (x === ".." || x.slice(-1) === "/") res += "/";
      if (/\/$/.test(x) && res === y) {
        loadAsDirectory(res, opts.package, onfile);
      } else loadAsFile(res, opts.package, onfile);
    } else
      loadNodeModules(x, y, function(err, n, pkg) {
        if (err) cb(err);
        else if (n) cb(null, n, pkg);
        else if (core_1[x]) return cb(null, x);
        else {
          var moduleError = new Error(
            "Cannot find module '" + x + "' from '" + y + "'"
          );
          moduleError.code = "MODULE_NOT_FOUND";
          cb(moduleError);
        }
      });

    function onfile(err, m, pkg) {
      if (err) cb(err);
      else if (m) cb(null, m, pkg);
      else
        loadAsDirectory(res, function(err, d, pkg) {
          if (err) cb(err);
          else if (d) cb(null, d, pkg);
          else {
            var moduleError = new Error(
              "Cannot find module '" + x + "' from '" + y + "'"
            );
            moduleError.code = "MODULE_NOT_FOUND";
            cb(moduleError);
          }
        });
    }

    function loadAsFile(x, thePackage, callback) {
      var loadAsFilePackage = thePackage;
      var cb = callback;
      if (typeof loadAsFilePackage === "function") {
        cb = loadAsFilePackage;
        loadAsFilePackage = undefined;
      }

      var exts = [""].concat(extensions);
      load(exts, x, loadAsFilePackage);

      function load(exts, x, loadPackage) {
        if (exts.length === 0) return cb(null, undefined, loadPackage);
        var file = x + exts[0];

        var pkg = loadPackage;
        if (pkg) onpkg(null, pkg);
        else loadpkg(path.dirname(file), onpkg);

        function onpkg(err, pkg_, dir) {
          pkg = pkg_;
          if (err) return cb(err);
          if (dir && pkg && opts.pathFilter) {
            var rfile = path.relative(dir, file);
            var rel = rfile.slice(0, rfile.length - exts[0].length);
            var r = opts.pathFilter(pkg, x, rel);
            if (r)
              return load(
                [""].concat(extensions.slice()),
                path.resolve(dir, r),
                pkg
              );
          }
          isFile(file, onex);
        }
        function onex(err, ex) {
          if (err) return cb(err);
          if (ex) return cb(null, file, pkg);
          load(exts.slice(1), x, pkg);
        }
      }
    }

    function loadpkg(dir, cb) {
      if (dir === "" || dir === "/") return cb(null);
      if (process.platform === "win32" && /^\w:[/\\]*$/.test(dir)) {
        return cb(null);
      }
      if (/[/\\]node_modules[/\\]*$/.test(dir)) return cb(null);

      var pkgfile = path.join(dir, "package.json");
      isFile(pkgfile, function(err, ex) {
        // on err, ex is false
        if (!ex) return loadpkg(path.dirname(dir), cb);

        readFile(pkgfile, function(err, body) {
          if (err) cb(err);
          try {
            var pkg = JSON.parse(body);
          } catch (jsonErr) {}

          if (pkg && opts.packageFilter) {
            pkg = opts.packageFilter(pkg, pkgfile);
          }
          cb(null, pkg, dir);
        });
      });
    }

    function loadAsDirectory(x, loadAsDirectoryPackage, callback) {
      var cb = callback;
      var fpkg = loadAsDirectoryPackage;
      if (typeof fpkg === "function") {
        cb = fpkg;
        fpkg = opts.package;
      }

      var pkgfile = path.join(x, "package.json");
      isFile(pkgfile, function(err, ex) {
        if (err) return cb(err);
        if (!ex) return loadAsFile(path.join(x, "index"), fpkg, cb);

        readFile(pkgfile, function(err, body) {
          if (err) return cb(err);
          try {
            var pkg = JSON.parse(body);
          } catch (jsonErr) {}

          if (opts.packageFilter) {
            pkg = opts.packageFilter(pkg, pkgfile);
          }

          if (pkg.main) {
            if (pkg.main === "." || pkg.main === "./") {
              pkg.main = "index";
            }
            loadAsFile(path.resolve(x, pkg.main), pkg, function(err, m, pkg) {
              if (err) return cb(err);
              if (m) return cb(null, m, pkg);
              if (!pkg) return loadAsFile(path.join(x, "index"), pkg, cb);

              var dir = path.resolve(x, pkg.main);
              loadAsDirectory(dir, pkg, function(err, n, pkg) {
                if (err) return cb(err);
                if (n) return cb(null, n, pkg);
                loadAsFile(path.join(x, "index"), pkg, cb);
              });
            });
            return;
          }

          loadAsFile(path.join(x, "/index"), pkg, cb);
        });
      });
    }

    function processDirs(cb, dirs) {
      if (dirs.length === 0) return cb(null, undefined);
      var dir = dirs[0];

      var file = path.join(dir, x);
      loadAsFile(file, undefined, onfile);

      function onfile(err, m, pkg) {
        if (err) return cb(err);
        if (m) return cb(null, m, pkg);
        loadAsDirectory(path.join(dir, x), undefined, ondir);
      }

      function ondir(err, n, pkg) {
        if (err) return cb(err);
        if (n) return cb(null, n, pkg);
        processDirs(cb, dirs.slice(1));
      }
    }
    function loadNodeModules(x, start, cb) {
      processDirs(cb, nodeModulesPaths(start, opts));
    }
  };

  var sync = function(x, options) {
    if (typeof x !== "string") {
      throw new TypeError("Path must be a string.");
    }
    var opts = options || {};
    var isFile =
      opts.isFile ||
      function(file) {
        try {
          var stat = fs.statSync(file);
        } catch (e) {
          if (e && (e.code === "ENOENT" || e.code === "ENOTDIR")) return false;
          throw e;
        }
        return stat.isFile() || stat.isFIFO();
      };
    var readFileSync = opts.readFileSync || fs.readFileSync;

    var extensions = opts.extensions || [".js"];
    var y = opts.basedir || path.dirname(caller());

    opts.paths = opts.paths || [];

    if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(x)) {
      var res = path.resolve(y, x);
      if (x === ".." || x.slice(-1) === "/") res += "/";
      var m = loadAsFileSync(res) || loadAsDirectorySync(res);
      if (m) return m;
    } else {
      var n = loadNodeModulesSync(x, y);
      if (n) return n;
    }

    if (core_1[x]) return x;

    var err = new Error("Cannot find module '" + x + "' from '" + y + "'");
    err.code = "MODULE_NOT_FOUND";
    throw err;

    function loadAsFileSync(x) {
      if (isFile(x)) {
        return x;
      }

      for (var i = 0; i < extensions.length; i++) {
        var file = x + extensions[i];
        if (isFile(file)) {
          return file;
        }
      }
    }

    function loadAsDirectorySync(x) {
      var pkgfile = path.join(x, "/package.json");
      if (isFile(pkgfile)) {
        try {
          var body = readFileSync(pkgfile, "UTF8");
          var pkg = JSON.parse(body);

          if (opts.packageFilter) {
            pkg = opts.packageFilter(pkg, x);
          }

          if (pkg.main) {
            if (pkg.main === "." || pkg.main === "./") {
              pkg.main = "index";
            }
            var m = loadAsFileSync(path.resolve(x, pkg.main));
            if (m) return m;
            var n = loadAsDirectorySync(path.resolve(x, pkg.main));
            if (n) return n;
          }
        } catch (e) {}
      }

      return loadAsFileSync(path.join(x, "/index"));
    }

    function loadNodeModulesSync(x, start) {
      var dirs = nodeModulesPaths(start, opts);
      for (var i = 0; i < dirs.length; i++) {
        var dir = dirs[i];
        var m = loadAsFileSync(path.join(dir, "/", x));
        if (m) return m;
        var n = loadAsDirectorySync(path.join(dir, "/", x));
        if (n) return n;
      }
    }
  };

  var resolve = createCommonjsModule(function(module, exports) {
    async.core = core_1;
    async.isCore = function isCore(x) {
      return core_1[x];
    };
    async.sync = sync;

    exports = async;
    module.exports = async;
  });

  var rollupBuild = resolve;

  return rollupBuild;
})();
// resolve package end
/* eslint-enable */

const requireNonBuiltin = source =>
  require(resolve.sync(source, { basedir: __dirname }));

const makeModuleEnv = requireNonBuiltin("make-module-env");
const expect = requireNonBuiltin("expect");

const electron = makeModuleEnv(
  path.join(
    process.cwd(),
    "this-file-is-fake-and-is-used-by-karmatic-nightmare-to-give-you-local-require.js"
  )
);

[window, window.parent].filter(Boolean).forEach(win => {
  Object.assign(win, {
    electron,
    expect,
    test: win.it
  });

  const originalOnError = win.onerror;
  win.onerror = function(error) {
    console.error(error); // To get it to the reporter
    originalOnError.call(this, error);
  };
});
